
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user?.email) {
        setRoleLoading(false);
        return;
      }

      try {
        // Check if user is a trainer
        const { data: trainerProfile } = await supabase
          .from('trainer_profiles')
          .select('status')
          .eq('email', user.email)
          .single();

        if (trainerProfile) {
          setUserRole('trainer');
          setRoleLoading(false);
          return;
        }

        // Check if user is an admin
        const { data: adminProfile } = await supabase
          .from('admin_profiles')
          .select('status')
          .eq('email', user.email)
          .single();

        if (adminProfile) {
          setUserRole('admin');
          setRoleLoading(false);
          return;
        }

        // Check if user is a regular user
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (userProfile) {
          setUserRole('user');
          setRoleLoading(false);
          return;
        }

        // If no profile found, set as null
        setUserRole(null);
        setRoleLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
        setRoleLoading(false);
      }
    };

    if (user) {
      checkUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (userRole && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on user role
        if (userRole === 'trainer') {
          navigate('/dashboards/trainer');
        } else if (userRole === 'admin') {
          navigate('/dashboards/admin');
        } else if (userRole === 'user') {
          navigate('/dashboards/user');
        } else {
          navigate('/auth');
        }
      }
    }
  }, [user, userRole, loading, roleLoading, allowedRoles, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by useEffect
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
