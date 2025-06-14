
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const TrainerSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    governmentId: '',
    careerMotivation: '',
    experience: '',
  });
  const [certificationFiles, setCertificationFiles] = useState<FileList | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const uploadCertifications = async (userId: string, files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('trainer-documents')
        .upload(fileName, file);
      
      if (error) throw error;
      return {
        name: file.name,
        path: data.path,
        size: file.size,
        type: file.type
      };
    });

    return Promise.all(uploadPromises);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await signUp(
        formData.email,
        formData.password,
        { 
          full_name: formData.fullName,
          signup_type: 'trainer'
        }
      );

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User ID not found');

      // Upload certifications if provided
      let certifications = [];
      if (certificationFiles && certificationFiles.length > 0) {
        certifications = await uploadCertifications(userId, certificationFiles);
      }      // Create trainer profile with pending status
      console.log('Creating trainer profile for userId:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('trainer_profiles')
        .insert({
          user_id: userId,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          government_id: formData.governmentId,
          career_motivation: formData.careerMotivation,
          experience: formData.experience,
          certifications: certifications,
          status: 'pending'
        });

      if (profileError) {
        console.error('Trainer profile creation error:', profileError);
        throw profileError;
      }
      
      console.log('Trainer profile created successfully:', profileData);

      toast({
        title: "Registration Successful!",
        description: "Your profile has been submitted for review. You'll be notified once approved.",
      });

      navigate('/dashboards/pending-trainer');    } catch (error: any) {
      console.error('Signup error:', error);
      const errorDescription = error.message || "An error occurred during registration.";
      // Log more detailed error information to help with debugging
      if (error.details) {
        console.error('Error details:', error.details);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      
      toast({
        title: "Registration Failed",
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Join as a Trainer
              </CardTitle>
              <CardDescription className="text-center">
                Share your expertise and help others achieve their fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="governmentId">Government ID *</Label>
                  <Input
                    id="governmentId"
                    name="governmentId"
                    required
                    value={formData.governmentId}
                    onChange={handleInputChange}
                    placeholder="Driver's License / Passport Number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (Upload Files)</Label>
                  <Input
                    id="certifications"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setCertificationFiles(e.target.files)}
                  />
                  <p className="text-sm text-gray-500">
                    Upload your fitness certifications, licenses, or relevant qualifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience *</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your fitness/wellness experience, specializations, and qualifications..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerMotivation">Why do you want to be a trainer? *</Label>
                  <Textarea
                    id="careerMotivation"
                    name="careerMotivation"
                    required
                    value={formData.careerMotivation}
                    onChange={handleInputChange}
                    placeholder="Tell us about your passion for fitness and helping others achieve their goals..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Submitting Application...' : 'Submit Trainer Application'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => navigate('/auth')}
                >
                  ← Back to Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TrainerSignup;
