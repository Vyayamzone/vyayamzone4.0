
-- First, create the trainer-documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('trainer-documents', 'trainer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users own folder" ON storage.objects;
DROP POLICY IF EXISTS "Enable select for users own documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for users own documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for users own documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable select for admins" ON storage.objects;

-- Create RLS policies for the trainer-documents bucket
CREATE POLICY "Enable insert for authenticated users own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'trainer-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Enable select for users own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trainer-documents' 
  AND (
    auth.role() = 'authenticated' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
);

CREATE POLICY "Enable update for users own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'trainer-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Enable delete for users own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'trainer-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to view all trainer documents
CREATE POLICY "Enable select for admins"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'trainer-documents'
  AND EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = auth.uid()
  )
);
