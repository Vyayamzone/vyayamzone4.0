
import { supabase } from '@/integrations/supabase/client';

export const checkUserRole = async (userEmail: string) => {
  try {
    // Check if user is a trainer
    const { data: trainerProfile, error: trainerError } = await supabase
      .from('trainer_profiles')
      .select('status')
      .eq('email', userEmail)
      .single();

    if (trainerProfile && !trainerError) {
      return {
        role: 'trainer',
        status: trainerProfile.status,
        redirectPath: trainerProfile.status === 'approved' 
          ? '/dashboards/trainer' 
          : '/dashboards/pending-trainer'
      };
    }

    // Check if user is a regular user
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userProfile && !userError) {
      return {
        role: 'user',
        status: 'active',
        redirectPath: '/dashboards/user'
      };
    }

    // If no profile found, redirect to auth
    return {
      role: null,
      status: null,
      redirectPath: '/auth'
    };
  } catch (error) {
    console.error('Error checking user role:', error);
    return {
      role: null,
      status: null,
      redirectPath: '/auth'
    };
  }
};

export const redirectBasedOnRole = async (userEmail: string) => {
  const roleInfo = await checkUserRole(userEmail);
  window.location.href = roleInfo.redirectPath;
};
