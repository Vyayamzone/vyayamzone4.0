
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
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';

const UserSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    healthConditions: '',
    experienceLevel: '',
  });
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<string[]>([]);

  const fitnessGoalOptions = [
    'Weight Loss',
    'Muscle Gain',
    'Endurance',
    'Flexibility',
    'Strength Training',
    'General Fitness'
  ];

  const workoutTypeOptions = [
    'Cardio',
    'Weight Training',
    'Yoga',
    'Pilates',
    'HIIT',
    'Swimming',
    'Running',
    'Cycling'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setFitnessGoals([...fitnessGoals, goal]);
    } else {
      setFitnessGoals(fitnessGoals.filter(g => g !== goal));
    }
  };

  const handleWorkoutTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setWorkoutTypes([...workoutTypes, type]);
    } else {
      setWorkoutTypes(workoutTypes.filter(t => t !== type));
    }
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
          signup_type: 'user'
        }
      );

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User ID not found');      // Create user profile
      console.log('Creating user profile for userId:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: formData.email,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          fitness_goals: fitnessGoals,
          health_conditions: formData.healthConditions,
          preferred_workout_types: workoutTypes,
          experience_level: formData.experienceLevel
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
      
      console.log('User profile created successfully:', profileData);

      toast({
        title: "Account Created Successfully!",
        description: "Welcome to VyayamZone! Please check your email for verification.",
      });

      navigate('/dashboards/user');    } catch (error: any) {
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
                Create Your User Account
              </CardTitle>
              <CardDescription className="text-center">
                Find the perfect trainer for your fitness journey
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
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Fitness Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fitnessGoalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={fitnessGoals.includes(goal)}
                          onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                        />
                        <Label htmlFor={`goal-${goal}`} className="text-sm font-normal">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Workout Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {workoutTypeOptions.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`workout-${type}`}
                          checked={workoutTypes.includes(type)}
                          onCheckedChange={(checked) => handleWorkoutTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={`workout-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthConditions">Health Conditions</Label>
                  <Textarea
                    id="healthConditions"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleInputChange}
                    placeholder="Any health conditions or injuries we should know about..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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

export default UserSignup;
