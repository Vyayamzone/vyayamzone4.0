
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Star, TrendingUp } from 'lucide-react';

interface AnalyticsSectionProps {
  trainerId: string;
}

const AnalyticsSection = ({ trainerId }: AnalyticsSectionProps) => {
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    currentMonthEarnings: 0,
    averageRating: 0,
    totalEarnings: 0,
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trainerId) {
      fetchAnalytics();
    }
  }, [trainerId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch all sessions for this trainer
      const { data: sessions, error } = await supabase
        .from('trainer_sessions')
        .select('*')
        .eq('trainer_id', trainerId);

      if (error) throw error;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Calculate analytics
      const totalSessions = sessions?.length || 0;
      const currentMonthSessions = sessions?.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
      }) || [];

      const currentMonthEarnings = currentMonthSessions.reduce((sum, session) => 
        sum + (session.earnings || 0), 0
      );

      const totalEarnings = sessions?.reduce((sum, session) => 
        sum + (session.earnings || 0), 0
      ) || 0;

      const ratingsData = sessions?.filter(session => session.rating) || [];
      const averageRating = ratingsData.length > 0 
        ? ratingsData.reduce((sum, session) => sum + session.rating, 0) / ratingsData.length 
        : 0;

      // Generate monthly data for chart (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthSessions = sessions?.filter(session => {
          const sessionDate = new Date(session.session_date);
          return sessionDate.getMonth() === date.getMonth() && 
                 sessionDate.getFullYear() === date.getFullYear();
        }) || [];

        const earnings = monthSessions.reduce((sum, session) => sum + (session.earnings || 0), 0);
        
        monthlyData.push({
          month,
          earnings: earnings,
          sessions: monthSessions.length
        });
      }

      setAnalytics({
        totalSessions,
        currentMonthEarnings,
        averageRating,
        totalEarnings,
        monthlyData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">All time sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.currentMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Your earnings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Sessions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Your training performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Sessions This Month</span>
              <span className="text-2xl font-bold text-blue-600">
                {analytics.monthlyData[analytics.monthlyData.length - 1]?.sessions || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Average per Session</span>
              <span className="text-2xl font-bold text-green-600">
                ${analytics.totalSessions > 0 
                  ? (analytics.totalEarnings / analytics.totalSessions).toFixed(2) 
                  : '0.00'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
