import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

async function sendWhatsAppMessage(phone: string, message: string) {
  const apiKey = Deno.env.get('WACLOUD_API_KEY')
  const instanceId = Deno.env.get('WACLOUD_INSTANCE_ID')

  if (!apiKey || !instanceId) {
    return { success: false, error: 'WACloud credentials not configured' }
  }

  let formattedPhone = phone.replace(/\D/g, '')
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '880' + formattedPhone.substring(1)
  }
  if (!formattedPhone.startsWith('880')) {
    formattedPhone = '880' + formattedPhone
  }

  try {
    const response = await fetch('https://api.wacloud.app/send-message', {
      method: 'POST',
      headers: { 'API-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: formattedPhone,
        content: message,
        media_url: '',
        instance_id: instanceId,
        message_type: 'text',
      }),
    })

    const data = await response.json()
    if (!data.success) {
      return { success: false, error: data.message || 'Send failed' }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No auth' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { type, store_id, customer_phone, customer_name, store_name, data: notifData } = await req.json()

    if (!store_id || !type) {
      return new Response(JSON.stringify({ error: 'Missing store_id or type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if SMS is active for this store
    const { data: smsSub } = await supabase
      .from('sms_subscriptions')
      .select('is_active')
      .eq('store_id', store_id)
      .single()

    if (!smsSub?.is_active) {
      return new Response(JSON.stringify({ error: 'SMS not active for this store', code: 'SMS_INACTIVE' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check notification settings
    const { data: settings } = await supabase
      .from('store_notification_settings')
      .select('*')
      .eq('store_id', store_id)
      .single()

    let message = ''
    let shouldSend = true

    if (type === 'sale_receipt') {
      if (settings && !settings.sale_notification) shouldSend = false
      const total = notifData?.total || 0
      const invoiceNo = notifData?.invoice_number || ''
      const paid = notifData?.paid_amount || 0
      const due = notifData?.due_amount || 0
      
      message = `🧾 ${store_name}\n\nপ্রিয় ${customer_name},\nআপনার কেনাকাটার বিবরণ:\n\n📋 ইনভয়েস: ${invoiceNo}\n💰 মোট: ৳${total}\n✅ পরিশোধিত: ৳${paid}`
      if (due > 0) {
        message += `\n⚠️ বাকি: ৳${due}`
      }
      message += `\n\nধন্যবাদ! 🙏`
    } else if (type === 'installment_due') {
      if (settings && !settings.installment_reminder) shouldSend = false
      const amount = notifData?.amount || 0
      const dueDate = notifData?.due_date || ''
      const installmentNo = notifData?.installment_number || ''
      
      message = `📢 ${store_name}\n\nপ্রিয় ${customer_name},\nআপনার কিস্তির রিমাইন্ডার:\n\n📅 কিস্তি নং: ${installmentNo}\n💰 পরিমাণ: ৳${amount}\n📆 তারিখ: ${dueDate}\n\nসময়মতো পরিশোধ করুন। ধন্যবাদ!`
    } else if (type === 'due_reminder') {
      if (settings && !settings.due_reminder) shouldSend = false
      const dueAmount = notifData?.due_amount || 0
      
      message = `💳 ${store_name}\n\nপ্রিয় ${customer_name},\nআপনার বাকি টাকার রিমাইন্ডার:\n\n⚠️ বাকি পরিমাণ: ৳${dueAmount}\n\nদ্রুত পরিশোধ করুন। ধন্যবাদ!`
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!shouldSend) {
      return new Response(JSON.stringify({ success: false, code: 'NOTIFICATION_DISABLED' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!customer_phone) {
      return new Response(JSON.stringify({ error: 'No customer phone' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Send the message
    const result = await sendWhatsAppMessage(customer_phone, message)

    // Log it using service role to bypass RLS
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const adminClient = createClient(supabaseUrl, serviceKey)
    
    await adminClient.from('sms_logs').insert({
      store_id,
      phone: customer_phone,
      message,
      notification_type: type,
      reference_id: notifData?.reference_id || null,
      status: result.success ? 'sent' : 'failed',
      error_message: result.success ? null : JSON.stringify(result.error),
    })

    return new Response(JSON.stringify({ success: result.success, error: result.error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Customer notification error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
