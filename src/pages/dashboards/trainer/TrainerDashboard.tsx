
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, BarChart3, Upload, Bell, LogOut } from 'lucide-react';
import Layout from '@/components/Layout';
import ProfileSection from './components/ProfileSection';
import TimeSlotSection from './components/TimeSlotSection';
import AnalyticsSection from './components/AnalyticsSection';
import DocumentsSection from './components/DocumentsSection';
import NotificationsSection from './components/NotificationsSection';

const TrainerDashboard = () => {
  const { user, signOut } = useAuth();
  const [trainerProfile, setTrainerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrainerProfile();
    }
  }, [user]);

  const fetchTrainerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setTrainerProfile(data);
    } catch (error) {
      console.error('Error fetching trainer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {trainerProfile?.full_name}!
                </h1>
                <p className="text-gray-600">Manage your training sessions and profile</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSection trainerProfile={trainerProfile} onUpdate={fetchTrainerProfile} />
            </TabsContent>

            <TabsContent value="schedule">
              <TimeSlotSection trainerId={trainerProfile?.id} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection trainerId={trainerProfile?.id} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsSection trainerId={trainerProfile?.id} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default TrainerDashboard;
