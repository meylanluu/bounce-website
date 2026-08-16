import { useAuth } from '../data/authContext'
import { supabase } from '../data/supabaseClient'
import { useState, useEffect } from 'react'

export default function Profile(){

    const { user } = useAuth();
    const [displayName, setDisplayName] = useState('');

    useEffect(() => { {/* supabase.(...).single() gibt am Ende so eine Obj. zurück:  { data: { display_name: "Max" }, error: null } 
                        -> kann dann destrukturiert werden*/} 
                        {/* ?. Optional Chaining -> bei data = null -> setDisplayName(undefined)*/} 
        if (!user) return
        supabase.from('profiles') 
        .select('display_name')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
            if (error) {
                console.error('Fehler beim Laden des Profils:', error.message)
                return
            }
            setDisplayName(data.display_name)
        })
    }, [user])

    return (
        <>
        <main>
            <h1>{displayName}</h1>
        </main>
        </>
    );
}