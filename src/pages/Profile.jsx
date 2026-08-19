import { useAuth } from '../data/authContext'
import { getRegisteredEventIds } from '../data/eventRegistrationService';
import { getProfileById } from '../data/profileService';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import default_profile_pic from '../assets/default_profile_pic.jpg'

import './Profile.css'
import MyEvents from '../components/MyEvents.jsx';
import ProfileEventCard from "../components/ProfileEventCard.jsx";

export default function Profile(){

    const { user } = useAuth();
    const [profile, setProfile] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    

    useEffect(() => {
        if (!user) return; 
        
        getProfileById(user.id)
        .then((data) => setProfile(data))
        .catch((error) => {
            console.log("Error loading profile: ", error);
            setError("Profile couldn't be loaded.")}
        )
    }, [user])

    function getStyleTags(profileStyles){
        const stylesArray = profileStyles; 
        return (
            stylesArray.map((style) => <span key={style} className='style-tag'>{style}</span>)
        )
    }

    return (
        <>
        <main>
            <div className='profile-header_container'>
                <div className='img-wrapper'>
                    <img src={profile?.profile_pic || default_profile_pic} alt={profile?.username} />
                </div>

                <div className='profile-info_container'>
                    <p id='profile'>Profile</p>
                    <div className='name-and-styles_container'>
                        <span className='name'>{profile?.display_name}</span> {/* profile && {<h1>...</h1>} Verhindert, dass profile.display_name gelesen wird, bevor profile überhaupt geladen ist*/}
                        <span className='style-tag_container'>
                            {profile && getStyleTags(profile.styles)}
                        </span>
                    </div>
                    <div className='username-and-city_container'>
                        <p>@{profile.username} • {profile.city}</p>
                        <button onClick={()=> navigate('/edit-profile')} id='edit-profile_button'>Edit</button>
                    </div>
                </div>
            </div>

            <div className='main-content_container'>
                <div className='my-events_container'>
                    <p className='main-content_header'>MY EVENTS</p>
                    <MyEvents CardComponent={ProfileEventCard} />
                </div>

                <div className='liked-events_container'>
                    <p className='main-content_header'>LIKED EVENTS</p>
                </div>
            </div>
        
            
        </main>
        </>
    );
}