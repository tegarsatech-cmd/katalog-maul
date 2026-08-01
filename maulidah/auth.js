// auth.js
// Firebase Auth → Supabase Auth
// Mempertahankan API yang sama: signInWithEmailAndPassword, signOut, onAuthStateChanged

import supabase from "./lib/supabase.js";

// Sign In
export async function signInWithEmailAndPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

// Sign Out
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// On Auth State Changed
export function onAuthStateChanged(callback) {
    // Dapatkan session saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
        callback(session?.user || null);
    });

    // Subscribe ke perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });

    return subscription;
}

// Create User (untuk seed.html)
export async function createUserWithEmailAndPassword(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    if (error) throw error;
    return data;
}

// Get current user
export function getCurrentUser() {
    return supabase.auth.getUser();
}

export default supabase.auth;
