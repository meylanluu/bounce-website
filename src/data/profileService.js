import { supabase } from "./supabaseClient";

export async function updateProfile(userId, profileData){
    
    const { error } = await supabase
        .from('profiles')
        .update({
            username: profileData.username, 
            display_name: profileData.display_name,
            profile_pic: profileData.profile_pic,
            styles: profileData.styles})
        .eq('user_id', userId)
    if (error) throw error; 
}

export async function getProfileById(userId){

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error) throw error;
    return data; 
} 

export async function uploadProfilePicture(userId, file){
    const filePath = `${userId}_profile-pic.jpg`;

    const { error: uploadError } = await supabase.storage //error: uploadError -> Umbenennung bei der Destrukturierung, weil es bereits ein error variable gibt
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true}); //upsert: Pfad wird immer geupdatet anstatt dupliziert
    
        if (uploadError) throw uploadError;

    const { data } = supabase.storage  
        .from('profile_pictures')
        .getPublicUrl(filePath); // return: { data: { publicUrl: "..." } }
        //getPublicUrl ist nicht asynchron -> es kann nichts fehlschlagen
        
    return data.publicUrl; 
}
