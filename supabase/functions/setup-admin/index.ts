import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const phone = '01711740643'
    const email = `${phone}@digitaldondu.store`
    const password = 'abed@8795'

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
      // Update password
      await supabaseAdmin.auth.admin.updateUserById(userId, { password })
    } else {
      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Super Admin', phone }
      })

      if (createError) throw createError
      userId = newUser.user.id
    }

    // Check if already platform admin
    const { data: existingAdmin } = await supabaseAdmin
      .from('platform_admins')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!existingAdmin) {
      const { error: adminError } = await supabaseAdmin
        .from('platform_admins')
        .insert({
          user_id: userId,
          name: 'Super Admin',
          whatsapp_number: phone,
          is_active: true
        })

      if (adminError) throw adminError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin setup complete', userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
