'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

function hasSequentialDigits(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    const char1 = parseInt(password[i]);
    const char2 = parseInt(password[i+1]);
    const char3 = parseInt(password[i+2]);
    if (!isNaN(char1) && !isNaN(char2) && !isNaN(char3)) {
      if (char2 === char1 + 1 && char3 === char2 + 1) return true;
      if (char2 === char1 - 1 && char3 === char2 - 1) return true;
    }
  }
  return false;
}

export async function validatePassword(password: string) {
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.'
  if (!/[\W_]/.test(password)) return 'Password must contain a special character.'
  if (hasSequentialDigits(password)) return 'Password cannot contain sequential digits (e.g., 123 or 321).'
  return null;
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/workspace')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const name = formData.get('name') as string

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const passwordError = await validatePassword(password);
  if (passwordError) {
    return { error: passwordError }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
