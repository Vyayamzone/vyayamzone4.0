
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const TrainerSignup = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
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
        { full_name: formData.fullName }
      );

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User ID not found');

      // Upload certifications if provided
      let certifications = [];
      if (certificationFiles && certificationFiles.length > 0) {
        certifications = await uploadCertifications(userId, certificationFiles);
      }

      // Create trainer profile
      const { error: profileError } = await supabase
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

      if (profileError) throw profileError;

      toast({
        title: "Registration Successful!",
        description: "Your profile has been submitted for review.",
      });

      navigate('/dashboards/pending-trainer');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      // Check trainer status and redirect accordingly
      const { data: trainer } = await supabase
        .from('trainer_profiles')
        .select('status')
        .eq('email', formData.email)
        .maybeSingle();

      if (trainer) {
        if (trainer.status === 'pending') {
          navigate('/dashboards/pending-trainer');
        } else if (trainer.status === 'approved') {
          navigate('/dashboards/trainer');
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? 'Trainer Login' : 'Join as a Trainer'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin ? 'Access your trainer dashboard' : 'Start your journey with VyayamZone'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
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

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
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
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+1234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="governmentId">Government ID</Label>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Describe your fitness/wellness experience..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="careerMotivation">Career Motivation</Label>
                      <Textarea
                        id="careerMotivation"
                        name="careerMotivation"
                        value={formData.careerMotivation}
                        onChange={handleInputChange}
                        placeholder="Why do you want to be a trainer?"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isLogin ? 'Login' : 'Submit Application')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
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
