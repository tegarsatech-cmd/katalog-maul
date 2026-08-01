// storage.js
// Firebase Storage → Supabase Storage
// Wrapper API yang kompatibel dengan Firebase Storage API

import supabase from "./lib/supabase.js";

// ref(storage, path) → membuat reference path
// Bisa dipanggil dengan 1 parameter: ref('bucket/file')
// atau 2 parameter: ref(storage, 'bucket/file')
export function ref(storageInstance, path) {
    if (arguments.length === 1) {
        return storageInstance; // ref('bucket/file')
    }
    return path; // ref(storage, 'bucket/file')
}

// uploadBytes(storageRef, file) → upload file ke Supabase Storage
export async function uploadBytes(storageRef, file) {
    // Ekstrak bucket dari path (format: "bucketName/path/to/file")
    const pathParts = storageRef.split('/');
    const bucketName = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw error;
    return { ref: storageRef, data };
}

// getDownloadURL(storageRef) → dapatkan public URL
export function getDownloadURL(storageRef) {
    // Ekstrak bucket dari path
    const pathParts = storageRef.split('/');
    const bucketName = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

const storage = {};
export default storage;
