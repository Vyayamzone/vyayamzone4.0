
import { supabase } from '@/integrations/supabase/client';

export const checkTrainerStatus = async (userEmail: string) => {
  try {
    const { data: trainer, error } = await supabase
      .from('trainer_profiles')
      .select('status, id')
      .eq('email', userEmail)
      .maybeSingle();

    if (error) {
      console.error('Error checking trainer status:', error);
      return { status: null, trainerId: null };
    }

    return {
      status: trainer?.status || null,
      trainerId: trainer?.id || null
    };
  } catch (error) {
    console.error('Error in checkTrainerStatus:', error);
    return { status: null, trainerId: null };
  }
};

export const redirectBasedOnStatus = (status: string | null) => {
  if (!status) {
    return '/dashboards/trainer/signup';
  }
  
  switch (status) {
    case 'pending':
      return '/dashboards/pending-trainer';
    case 'approved':
      return '/dashboards/trainer';
    case 'rejected':
      return '/dashboards/trainer/signup';
    default:
      return '/dashboards/trainer/signup';
  }
};
