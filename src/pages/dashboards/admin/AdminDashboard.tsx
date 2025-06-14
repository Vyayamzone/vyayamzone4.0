
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Users, UserCheck, Settings, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  activeTrainers: number;
  pendingApprovals: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTrainers: 0,
    pendingApprovals: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Get total users count
        const { count: usersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        // Get active trainers count
        const { count: activeTrainersCount } = await supabase
          .from('trainer_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        // Get pending trainer approvals count
        const { count: pendingCount } = await supabase
          .from('trainer_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Calculate total revenue (sum of all trainer session earnings)
        const { data: revenueData } = await supabase
          .from('trainer_sessions')
          .select('earnings')
          .not('earnings', 'is', null);

        const totalRevenue = revenueData?.reduce((sum, session) => sum + (session.earnings || 0), 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          activeTrainers: activeTrainersCount || 0,
          pendingApprovals: pendingCount || 0,
          totalRevenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, Administrator</p>
              <p className="text-sm text-gray-500">Logged in as: {user?.email}</p>
            </div>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trainers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.activeTrainers}
                </div>
                <p className="text-xs text-muted-foreground">Approved trainers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.pendingApprovals}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${loading ? '...' : stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Admin functionality for managing users will be implemented here.</p>
                <Button variant="outline" disabled>
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trainer Approvals</CardTitle>
                <CardDescription>Review and approve trainer applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Admin functionality for approving trainers will be implemented here.</p>
                <Button variant="outline" disabled>
                  Review Applications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
