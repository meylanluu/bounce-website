import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext(); 

export function AuthProvider({ children }) { {/* AuthProvider groß geschrieben, weil es eine Komponente ist */}
                                            {/* children: alles, was später innerhalb der Komponente eingewickelt wird -> <BrowserRouter></BrowserRouter> */}
    const [user, setUser] = useState(null); {/* null = niemand eingeloggt */}
    const [loading, setLoading] = useState(true); {/* true, weil beim ersten Rendern noch nicht klar ist ob jmd. eingeloggt ist */}

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {     {/*session = 
                                                                           -> falls gültige Session existiert: Obj. mit Infos zur aktl. Sitzung (inkl. user darin)
                                                                           -> falls niemand eingeloggt ist/keine Session gefunden wurde: null*/}
            setUser(session?.user ?? null); {/* Falls session existiert, wird session.user genommen.
                                                Falls session nicht existiert (oder session.user undefined ist), wird stattdessen null genommen*/} 
            setLoading(false) 
        })

        {/* Listener einrichten */}
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); 
            {/* (_event, session) => {...} -> Funktion, die Supabase bei jeder Änderung ausführt
                _event: Text, der beschreibt, was passiert ist  |  Unterstrich vor event: Konvention, die besagtm dass Parameter absichtlich nicht benutzt wird (?)
                session: neue, aktl. Session nach Änderung oder null wenn ausgeloggt */}
        })

        return () => listener.subscription.unsubscribe()
    },[])

    {/* Return: JSX Struktur, die alles anzeigt , was in {children} liegt. 
        Zusätzlich werden noch user und loading über den Context bereitgestellt, damit jede Komponenten darin diese Werte per useAuth abfragen kann */}
    return (
        <AuthContext.Provider value={{ user, loading }}> {/* value-Prop: legt fest, welche Daten über den Context verfügbar gemacht werden.*/}
            {children}
        </AuthContext.Provider>
    )
}

{/* Funktion, mit der andere Komponente später schenll herausfinden können ob und welcher user eingeloggt ist */}
export function useAuth() {
    return useContext(AuthContext)
}

