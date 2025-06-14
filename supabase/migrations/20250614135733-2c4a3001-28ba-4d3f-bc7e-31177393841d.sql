
-- Drop all RLS policies from trainer_profiles table
DROP POLICY IF EXISTS "Users can insert their own trainer profile" ON public.trainer_profiles;
DROP POLICY IF EXISTS "Users can view their own trainer profile" ON public.trainer_profiles;
DROP POLICY IF EXISTS "Users can update their own trainer profile" ON public.trainer_profiles;
DROP POLICY IF EXISTS "Admins can view all trainer profiles" ON public.trainer_profiles;

-- Drop all RLS policies from user_profiles table
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON public.user_profiles;

-- Disable RLS on both tables
ALTER TABLE public.trainer_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Create user_roles table for RBAC
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Disable RLS on user_roles table
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_email TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(ur.role, 'user')
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE u.email = user_email
  LIMIT 1;
$$;

-- Insert admin role for testing (replace with your email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
