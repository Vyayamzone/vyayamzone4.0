
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, Trash2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentsSectionProps {
  trainerId: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ trainerId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [trainerProfile, setTrainerProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrainerProfile();
  }, [trainerId]);

  const fetchTrainerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('id', trainerId)
        .single();

      if (error) throw error;
      setTrainerProfile(data);
      
      // Parse existing certifications/documents - handle the JSON type properly
      const existingDocs = Array.isArray(data.certifications) ? data.certifications as Document[] : [];
      setDocuments(existingDocs);
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trainer profile",
        variant: "destructive"
      });
    }
  };

  const updateTrainerCertifications = async (newDocuments: Document[]) => {
    try {
      const { error } = await supabase
        .from('trainer_profiles')
        .update({ certifications: newDocuments as any })
        .eq('id', trainerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating trainer certifications:', error);
      throw error;
    }
  };

  const uploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('trainer-documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('trainer-documents')
        .getPublicUrl(filePath);

      // Create document object
      const newDocument: Document = {
        id: fileName,
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString()
      };

      // Update documents array
      const updatedDocuments = [...documents, newDocument];
      
      // Update trainer profile certifications
      await updateTrainerCertifications(updatedDocuments);
      
      setDocuments(updatedDocuments);

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const documentToDelete = documents.find(doc => doc.id === documentId);
      if (!documentToDelete) return;

      // Extract file path from URL or use the document ID
      const filePath = `${user.id}/${documentId}`;

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('trainer-documents')
        .remove([filePath]);

      if (deleteError) {
        console.error('Storage deletion error:', deleteError);
        // Continue with removing from database even if storage deletion fails
      }

      // Update documents array
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      
      // Update trainer profile certifications
      await updateTrainerCertifications(updatedDocuments);
      
      setDocuments(updatedDocuments);

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents & Certifications</CardTitle>
        <CardDescription>
          Upload your fitness certifications, credentials, and professional documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <Label htmlFor="document-upload" className="cursor-pointer">
            <span className="text-sm font-medium text-gray-700">
              Click to upload documents
            </span>
            <Input
              id="document-upload"
              type="file"
              className="hidden"
              onChange={uploadDocument}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </Label>
          <p className="text-xs text-gray-500 mt-2">
            PDF, DOC, DOCX, JPG, PNG up to 10MB
          </p>
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading document...</p>
          )}
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <File className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload your certifications and credentials to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
