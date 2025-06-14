
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const createUserRole = async (userId: string, email: string, role: string = 'user') => {
  const { error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role: role
    }, {
      onConflict: 'user_id,role'
    });
  
  if (error) {
    console.error('Error creating user role:', error);
  }
  return { error };
};

export const getUserRole = async (email: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_role', { user_email: email });
    
    if (error) {
      console.error('Error getting user role:', error);
      return 'user'; // Default role
    }
    
    return data || 'user';
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return 'user';
  }
};
