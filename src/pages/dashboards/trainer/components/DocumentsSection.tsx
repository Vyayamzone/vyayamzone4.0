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
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from('trainer-documents')
        .list(user.id, { limit: 100 });

      if (error) throw error;

      const documentsWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('trainer-documents')
            .getPublicUrl(`${user.id}/${file.name}`);

          return {
            id: file.id || file.name,
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || '',
            uploaded_at: file.created_at || new Date().toISOString()
          };
        })
      );

      setDocuments(documentsWithUrls);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
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
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from('trainer-documents')
        .upload(filePath, file);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });

      fetchDocuments();
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

  const deleteDocument = async (documentName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.storage
        .from('trainer-documents')
        .remove([`${user.id}/${documentName}`]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      fetchDocuments();
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
        <CardTitle>Documents & Materials</CardTitle>
        <CardDescription>
          Upload and manage your fitness materials, certifications, and documents
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
                  onClick={() => deleteDocument(doc.name)}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
