import {supabase} from "./supabaseClient.js";

export async function signUp(email, password){
    const { data, error } = await supabase.auth.signUp({email, password}) // signUp gibt entweder User-/Session-Infos oder error zurück 
                                                                         // wenn Registrierung erfolgreich: error = null 
    if (error) throw error
    return data
}

export async function signIn(email, password){
    const { data, error } = await supabase.auth.signInWithPassword({email, password}) 
    if (error) throw error
    return data
    
}

export async function signOut(){
    const { data, error } = await supabase.auth.signOut() 
    if (error) throw error
    return data
}