
-- Update the trainer-documents bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'trainer-documents';
