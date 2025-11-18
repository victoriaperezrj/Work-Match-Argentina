import { getSupabaseClient } from './client';
import { UserProfile } from '@/lib/stores/auth-store';

// Auth error types
export interface AuthError {
  message: string;
  code?: string;
}

// Sign up result
export interface SignUpResult {
  success: boolean;
  error?: AuthError;
  needsVerification?: boolean;
}

// Sign in result
export interface SignInResult {
  success: boolean;
  user?: UserProfile;
  error?: AuthError;
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  isDemandante: boolean,
  isProveedor: boolean,
  locationId?: string,
  services?: string[]
): Promise<SignUpResult> {
  const supabase = getSupabaseClient();

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          is_demandante: isDemandante,
          is_proveedor: isProveedor,
        },
      },
    });

    if (authError) {
      return {
        success: false,
        error: {
          message: getErrorMessage(authError.message),
          code: authError.code,
        },
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: { message: 'No se pudo crear el usuario' },
      };
    }

    // Create user profile in database
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      is_demandante: isDemandante,
      is_proveedor: isProveedor,
      location_id: locationId,
      services: services || [],
      radius_km: isProveedor ? 15 : null,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // User was created but profile failed - they can update profile later
    }

    // Check if email confirmation is required
    const needsVerification = !authData.session;

    return {
      success: true,
      needsVerification,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: { message: 'Error al registrar usuario' },
    };
  }
}

// Sign in with email and password
export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  const supabase = getSupabaseClient();

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        error: {
          message: getErrorMessage(authError.message),
          code: authError.code,
        },
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: { message: 'No se pudo iniciar sesión' },
      };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      // Return basic user info if profile doesn't exist
      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email || email,
          full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
          is_demandante: true,
          is_proveedor: false,
          created_at: authData.user.created_at || new Date().toISOString(),
        },
      };
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        is_demandante: profile.is_demandante,
        is_proveedor: profile.is_proveedor,
        services: profile.services,
        location_id: profile.location_id,
        radius_km: profile.radius_km,
        created_at: profile.created_at,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: { message: 'Error al iniciar sesión' },
    };
  }
}

// Sign out
export async function signOut(): Promise<{ success: boolean; error?: AuthError }> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: getErrorMessage(error.message),
          code: error.code,
        },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: { message: 'Error al cerrar sesión' },
    };
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || '',
        is_demandante: true,
        is_proveedor: false,
        created_at: authUser.created_at || new Date().toISOString(),
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      is_demandante: profile.is_demandante,
      is_proveedor: profile.is_proveedor,
      services: profile.services,
      location_id: profile.location_id,
      radius_km: profile.radius_km,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Update user profile
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
): Promise<{ success: boolean; error?: AuthError }> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return {
        success: false,
        error: { message: error.message },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: { message: 'Error al actualizar perfil' },
    };
  }
}

// Reset password
export async function resetPassword(email: string): Promise<{ success: boolean; error?: AuthError }> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: getErrorMessage(error.message),
          code: error.code,
        },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: { message: 'Error al enviar email de recuperación' },
    };
  }
}

// Helper to translate error messages to Spanish
function getErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos',
    'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
    'User already registered': 'Este email ya está registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Email rate limit exceeded': 'Demasiados intentos. Por favor espera unos minutos',
  };

  return errorMap[message] || message;
}

// Listen to auth state changes
export function onAuthStateChange(
  callback: (user: UserProfile | null) => void
) {
  const supabase = getSupabaseClient();

  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}
