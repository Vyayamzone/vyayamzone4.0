
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';

interface Document {
  name: string;
  size: number;
  updated_at: string;
  metadata?: any;
}

interface DocumentsSectionProps {
  trainerId: string;
}

const DocumentsSection = ({ trainerId }: DocumentsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('trainer-documents')
        .list(user?.id, {
          limit: 100,
          offset: 0
        });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${user?.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from('trainer-documents')
          .upload(fileName, file);
        
        if (error) throw error;
        return fileName;
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: "Upload Successful",
        description: `${files.length} document(s) uploaded successfully.`,
      });

      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('trainer-documents')
        .download(`${user?.id}/${fileName}`);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteDocument = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('trainer-documents')
        .remove([`${user?.id}/${fileName}`]);

      if (error) throw error;

      toast({
        title: "Document Deleted",
        description: "The document has been removed.",
      });

      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
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

  if (loading) {
    return <div className="text-center p-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Share fitness materials, workout plans, or certification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documents">Select Files</Label>
              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={(e) => e.target.files && uploadDocument(e.target.files)}
                disabled={uploading}
              />
            </div>
            <p className="text-sm text-gray-600">
              Supported formats: PDF, JPG, PNG, DOC, DOCX, TXT (Max 10MB per file)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Manage your uploaded files and materials</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet.</p>
              <p className="text-sm">Upload your first document above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>
                          Uploaded {new Date(doc.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc.name)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteDocument(doc.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsSection;
