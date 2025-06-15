
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Edit2, Save, X, Upload, Camera } from 'lucide-react';

interface ProfileSectionProps {
  trainerProfile: any;
  onUpdate: () => void;
}

const ProfileSection = ({ trainerProfile, onUpdate }: ProfileSectionProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    full_name: trainerProfile?.full_name || '',
    phone_number: trainerProfile?.phone_number || '',
    bio: trainerProfile?.bio || '',
    hourly_rate: trainerProfile?.hourly_rate || '',
    specializations: trainerProfile?.specializations?.join(', ') || '',
    experience: trainerProfile?.experience || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${trainerProfile.user_id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('trainer-documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('trainer-documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('trainer_profiles')
        .update({ profile_image_url: data.publicUrl })
        .eq('id', trainerProfile.id);

      if (updateError) throw updateError;

      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been successfully updated.",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('trainer_profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          bio: formData.bio,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
          experience: formData.experience,
          updated_at: new Date().toISOString()
        })
        .eq('id', trainerProfile.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: trainerProfile?.full_name || '',
      phone_number: trainerProfile?.phone_number || '',
      bio: trainerProfile?.bio || '',
      hourly_rate: trainerProfile?.hourly_rate || '',
      specializations: trainerProfile?.specializations?.join(', ') || '',
      experience: trainerProfile?.experience || '',
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your trainer profile details</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={trainerProfile?.profile_image_url} />
            <AvatarFallback className="text-2xl">
              {trainerProfile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'T'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('profile-image')?.click()}
                disabled={uploadingImage}
                variant="outline"
                size="sm"
              >
                {uploadingImage ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            {isEditing ? (
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-700">{trainerProfile?.full_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-gray-700">{trainerProfile?.email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-700">{trainerProfile?.phone_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
            {isEditing ? (
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={handleInputChange}
              />
            ) : (
              <p className="text-gray-700">
                {trainerProfile?.hourly_rate ? `$${trainerProfile.hourly_rate}/hour` : 'Not set'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specializations">Specializations (comma-separated)</Label>
          {isEditing ? (
            <Input
              id="specializations"
              name="specializations"
              value={formData.specializations}
              onChange={handleInputChange}
              placeholder="e.g., Yoga, Weight Training, Cardio"
            />
          ) : (
            <p className="text-gray-700">
              {trainerProfile?.specializations?.length > 0 
                ? trainerProfile.specializations.join(', ') 
                : 'No specializations set'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell clients about yourself..."
            />
          ) : (
            <p className="text-gray-700">
              {trainerProfile?.bio || 'No bio added yet'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          {isEditing ? (
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={3}
            />
          ) : (
            <p className="text-gray-700">
              {trainerProfile?.experience || 'No experience details added'}
            </p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {trainerProfile?.status}
            </span>
            <span className="text-sm text-gray-600">
              Joined on {new Date(trainerProfile?.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
