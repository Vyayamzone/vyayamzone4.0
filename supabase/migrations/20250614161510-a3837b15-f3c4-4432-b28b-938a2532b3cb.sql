
-- Create a table for admin profiles
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_profiles
CREATE POLICY "Admins can view all admin profiles" 
  ON public.admin_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles ap 
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their own profile" 
  ON public.admin_profiles 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create an index on email for faster lookups
CREATE INDEX idx_admin_profiles_email ON public.admin_profiles(email);

-- Insert a default admin (you can change the email to your preferred admin email)
-- Note: This will only work after you create a user with this email through the auth system
-- INSERT INTO public.admin_profiles (user_id, email, full_name) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@vyayamzone.com', 'System Administrator');
