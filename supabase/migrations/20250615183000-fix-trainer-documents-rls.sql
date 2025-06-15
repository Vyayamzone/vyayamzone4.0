
-- Drop existing policies
DROP POLICY IF EXISTS "Trainers can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Trainers can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Trainers can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Trainers can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view trainer documents" ON storage.objects;

-- Create better RLS policies for the trainer-documents bucket
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
