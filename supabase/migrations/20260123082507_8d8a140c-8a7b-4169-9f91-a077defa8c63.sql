-- Add platform_admin role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'platform_admin';

-- Create support conversations table
CREATE TABLE public.support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support messages table
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.support_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('store_owner', 'platform_admin')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform admins table (separate from store memberships)
CREATE TABLE public.platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  whatsapp_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_support_conversations_store ON public.support_conversations(store_id);
CREATE INDEX idx_support_conversations_status ON public.support_conversations(status);
CREATE INDEX idx_support_messages_conversation ON public.support_messages(conversation_id);
CREATE INDEX idx_support_messages_created ON public.support_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = _user_id AND is_active = true
  )
$$;

-- RLS Policies for support_conversations
CREATE POLICY "Store owners can view their conversations"
ON public.support_conversations FOR SELECT
USING (is_store_member(store_id) OR is_platform_admin());

CREATE POLICY "Store owners can create conversations"
ON public.support_conversations FOR INSERT
WITH CHECK (is_store_member(store_id));

CREATE POLICY "Participants can update conversations"
ON public.support_conversations FOR UPDATE
USING (is_store_member(store_id) OR is_platform_admin());

-- RLS Policies for support_messages
CREATE POLICY "Participants can view messages"
ON public.support_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_conversations sc
    WHERE sc.id = conversation_id
    AND (is_store_member(sc.store_id) OR is_platform_admin())
  )
);

CREATE POLICY "Participants can send messages"
ON public.support_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_conversations sc
    WHERE sc.id = conversation_id
    AND (is_store_member(sc.store_id) OR is_platform_admin())
  )
);

CREATE POLICY "Users can update their own messages"
ON public.support_messages FOR UPDATE
USING (sender_id = auth.uid());

-- RLS Policies for platform_admins
CREATE POLICY "Platform admins can view admin list"
ON public.platform_admins FOR SELECT
USING (is_platform_admin() OR user_id = auth.uid());

CREATE POLICY "Only platform admins can manage admins"
ON public.platform_admins FOR ALL
USING (is_platform_admin());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_conversations;

-- Trigger for updating conversation updated_at
CREATE TRIGGER update_support_conversations_updated_at
BEFORE UPDATE ON public.support_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();