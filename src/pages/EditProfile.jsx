import { signIn } from '../data/authService';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile, getProfileById, uploadProfilePicture } from '../data/profileService'
import { useAuth } from '../data/authContext'

import './EditProfile.css'

export default function CompleteProfile(){

    // Daten
    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [profilePicUrl, setProfilePicUrl] = useState('')
    const [styles, setStyles] = useState('')
    const [city, setCity] = useState('')
    //für style selection 
    const [selectedStyles, setSelectedStyles] = useState([]);
    //für profile pic
    const [selectedFile, setSelectedFile] = useState(null);


    const [error, setError] = useState(null)
    const { user } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() =>{
        if (!user) return; 
        
        // bereits gespeicherte Daten holen 
        getProfileById(user.id)
        .then((profile) => {
            setUsername(profile.username);
            setDisplayName(profile.display_name);
            setProfilePicUrl(profile.profile_pic);
            setSelectedStyles(Array.isArray(profile.styles) ? profile.styles : []);
            // ist profile.styles sicher ein Array? -> für .includes()
            // wenn profile.styles = null -> []
            setCity(profile.city);
            })
        .catch((error) => { //try statt try-catch, weil useEffect nicht async sein darf
            //console.log("Error loading profile:", error);
            setError("Profile couldn't be loaded.");
        });
    }, [user]);
    


    async function handleStyleButton(style){
        if (selectedStyles.includes(style)){
            setSelectedStyles(selectedStyles.filter((s) => s !== style)); 
            console.log(selectedStyles)
        } else {
            setSelectedStyles([...selectedStyles,style]); //Spread Operator, neues Array aus [selectedStyles] + style
        }
    }

    async function handleSubmit(e){ //e = Event-Objekt, das React beim Absenden des Formulars weitergibt
        console.log("handleSubmit called");
        
        e.preventDefault(); 
        
        try{
            let newProfilePicUrl = profilePicUrl; //bestehendes Bild als Fallback

            if (selectedFile) { //prüfen ob user eine neue datei ausgewählt hat
                newProfilePicUrl = await uploadProfilePicture(user.id, selectedFile);
            }

            const profileData = {
                username: username, 
                display_name: displayName,
                profile_pic: newProfilePicUrl,
                styles: selectedStyles,
                city: city,
            };
            await updateProfile(user.id, profileData);
            navigate('/profile');
            
        } catch (error) {
            console.log("Submit error:", error);
            setError("Profile couldn't be updated. Try again.")
        }
    }

    return(
        <div className='profile-setup_page'>
            <div className='setup_content-container'>
                <h1 className='setup-header'>Let's get to know you!</h1>
                    <form onSubmit={handleSubmit}>

                        <div className='info-field'>
                            <p>Username</p>
                            <input 
                            type = "text"
                            placeholder = "What's your @?"
                            onChange={(e) => setUsername(e.target.value.trim())}
                            />
                        </div>

                        <div className='info-field'>
                            <p>Display Name</p>
                            <input 
                            type = "text" 
                            placeholder = "What's your name?"
                            onChange = {(e) => setDisplayName(e.target.value)}
                            />
                        </div>

                        <div className='info-field'>
                            <p>Your City</p>
                            <input 
                            type = "text" 
                            placeholder = "Where is your base?"
                            onChange = {(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className='info-field'>
                            <p>What styles do you dance?</p>
                            <div className='style-btn_container'>
                                <button type="button" className={selectedStyles.includes("Hip Hop") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Hip Hop')}>Hip Hop</button> {/*()=> bei onClick wichtig, sonst wird handleStyleButton sofort anstatt erst beim Klick ausgeführt */}
                                <button type="button" className={selectedStyles.includes("Freestyle") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Freestyle')}>Freestyle</button>
                                <button type="button" className={selectedStyles.includes("Commercial") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Commercial')}>Commercial</button>
                                <button type="button" className={selectedStyles.includes("Popping") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Popping')}>Popping</button>
                                <button type="button" className={selectedStyles.includes("Breaking") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Breaking')}>Breaking</button>
                                <button type="button" className={selectedStyles.includes("Krump") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Krump')}>Krump</button>
                                <button type="button" className={selectedStyles.includes("House") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('House')}>House</button>
                                <button type="button" className={selectedStyles.includes("Litefeet") ? "style-btn selected" : "style-btn"} onClick={() => handleStyleButton('Litefeet')}>Litefeet</button>
                            </div>
                        </div>

                        <div className='info-field'>
                            <p>Choose Profilepic</p>
                            <input 
                            type = 'file' 
                            placeholder = 'Your Picture'
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </div>

                        <button className='enter-button' type='submit'>Enter</button>
                    </form>
                    {error && <p className="error-message">{error}</p>} {/* Bedingte Anzeige der Fehlermeldung */}
                    {/* Falls error ein Wert ist, der nicht false/null/undefined ist (echter Fehlertext), dann wird das gerendert, 
                    was rechts steht. Falls error = null -> nichts wird gerendert.*/}
        
            </div>
        </div>
    )
}
