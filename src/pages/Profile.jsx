import { useAuth } from '../data/authContext'
import { getRegisteredEventIds } from '../data/eventRegistrationService';
import { getProfileById } from '../data/profileService';
import { useState, useEffect } from 'react'

export default function Profile(){

    const { user } = useAuth();
    const [profile, setProfile] = useState('');
    const [error, setError] = useState(null);
    

    useEffect(() => {
        if (!user) return; 
        
        getProfileById(user.id)
        .then((data) => setProfile(data))
        .catch((error) => {
            console.log("Error loading profile: ", error);
            setError("Profile couldn't be loaded.")}
        )
    }, [user])

    return (
        <>
        <main>
            <h1>{profile && <h2>{profile.display_name}</h2>} </h1> {/*Verhindert, dass profile.display_name gelesen wird, bevor profile überhaupt geladen ist*/}
            <div></div>
            
        </main>
        </>
    );
}