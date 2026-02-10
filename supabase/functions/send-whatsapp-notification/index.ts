import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const ADMIN_PHONE = '8801711740643' // Platform admin WhatsApp number

async function sendWhatsAppMessage(phone: string, message: string) {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

  if (!accessToken || !phoneNumberId) {
    console.error('WhatsApp credentials not configured')
    return { success: false, error: 'WhatsApp credentials not configured' }
  }

  // Ensure phone has country code (Bangladesh: 880)
  let formattedPhone = phone.replace(/\D/g, '')
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '880' + formattedPhone.substring(1)
  }
  if (!formattedPhone.startsWith('880')) {
    formattedPhone = '880' + formattedPhone
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', JSON.stringify(data))
      return { success: false, error: data }
    }

    console.log('WhatsApp message sent to:', formattedPhone)
    return { success: true, data }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return { success: false, error: error.message }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, storeName, ownerName, ownerPhone, userName, userPhone, userRole } = await req.json()

    if (type === 'new_store_registration') {
      if (!storeName || !ownerName || !ownerPhone) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: storeName, ownerName, ownerPhone' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const timestamp = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })

      const ownerMessage = `🎉 স্বাগতম! আপনার স্টোর "${storeName}" সফলভাবে তৈরি হয়েছে।\n\n👤 মালিক: ${ownerName}\n📱 মোবাইল: ${ownerPhone}\n🕐 সময়: ${timestamp}\n\nDigital Dondu ব্যবহার করার জন্য ধন্যবাদ!`
      const adminMessage = `🆕 নতুন স্টোর রেজিস্ট্রেশন!\n\n🏪 স্টোর: ${storeName}\n👤 মালিক: ${ownerName}\n📱 মোবাইল: ${ownerPhone}\n🕐 সময়: ${timestamp}`

      const [ownerResult, adminResult] = await Promise.all([
        sendWhatsAppMessage(ownerPhone, ownerMessage),
        sendWhatsAppMessage(ADMIN_PHONE, adminMessage),
      ])

      return new Response(
        JSON.stringify({ success: true, ownerNotification: ownerResult, adminNotification: adminResult }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (type === 'user_login') {
      if (!userName || !userPhone) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: userName, userPhone' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const timestamp = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })
      const roleLabel = userRole === 'admin' ? '🛡️ অ্যাডমিন' : '🏪 স্টোর ওনার'
      const adminMessage = `🔐 লগইন নোটিফিকেশন\n\n${roleLabel}\n👤 নাম: ${userName}\n📱 মোবাইল: ${userPhone}\n🕐 সময়: ${timestamp}`

      const result = await sendWhatsAppMessage(ADMIN_PHONE, adminMessage)

      return new Response(
        JSON.stringify({ success: true, adminNotification: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unknown notification type' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
