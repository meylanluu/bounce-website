import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../data/authContext'

import { getEventBySlug } from '../data/eventsService';
import { getProfileById } from '../data/profileService';
import { getRegisteredEventIds, registerForEvent, unregisterFromEvent } from '../data/eventRegistrationService';

import white_star from "../assets/white_star.webp"
import "./EventDetailPage.css"

export default function EventDetailPage(){

    const params = useParams();
    const slug =  params.slug;
    const { user, loading } = useAuth(); 
    const navigate = useNavigate(); 
    const [profile, setProfile] = useState(); 

    {/*Hooks dürfen in React nie in if/else-Blöcken stehen */}
    const [event,setEvent] = useState(null); 

    {/* Event wird per slug geladen & für Detail Page festgelegt ----------------------------------------------*/}
   
    useEffect (() => {
        
        getEventBySlug(slug).then((e) => { 
        console.log("Fetched event:", event?.title);
        setEvent(e); // wählt das erste Element im Fetch aus (event-Objekt)
         });  
    } ,[slug]); {/* useEffect achtet auf Änderungen des slugs */}

    {/* GET PROFILE */}
      useEffect(() => {
            if (!user) return; 
    
            getProfileById(user.id)
            .then((data) => setProfile(data))
            .catch((error) => {
                console.log("Profile couldn't be loaded: ", error);
                setError("Profile couldn't be loaded.")
            })
        },[user])


    {/* IDs der Registered Events werden abgerufen ----------------------------------------------*/}
    
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

    useEffect(() => {
        if (!user) return;
        getRegisteredEventIds(user.id).then(setRegisteredEventIds)
    }, [user]); //Alle Hooks müssen in jeder Komponente bei jedem Render in exakt derselben Reihenfolge aufgerufen werden


    if (loading || event === null){
        return <h4>Content is loading...</h4>;
    } else if (event === undefined) {
        return <h4>Could not find Event. </h4>;
    } 

    {/*Ist User bereits für Event registriert?*/}
    const isRegistered = registeredEventIds.includes(event.event_id) //boolean für Button
    const buttonContent = !user ? "Log in to Sign Up" : (user.id === event.organizer_id ? "Edit" : (isRegistered ? "Unregister" : "Sign Up"));

    async function handleButton(){
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.id === event.organizer_id) {
            navigate(`/edit-event/${event.event_id}`);
            return;
        }

        if (isRegistered){
            await unregisterFromEvent(user.id, event.event_id);
            setRegisteredEventIds(registeredEventIds.filter( (eventId) => eventId !== event.event_id));
        } else {
            await registerForEvent(user.id, event.event_id)
            setRegisteredEventIds([...registeredEventIds, event.event_id]);
        } 
    }


    function getCategoryTags(eventCategories){
        if(!eventCategories) return null;

        const categoriesArray = eventCategories.split(',');
        return categoriesArray.map((category) => 
        <span className='category-tag'>{category.toUpperCase()}</span>)
    }

     function getItemsFromArray(itemsString){
        if(!itemsString) return null;

        const itemsArray = itemsString.split(',');
        return itemsArray.map((item) => 
        <p className='info-item'>{item}</p>)
    }

    return (
        <main>

            {/* HEADER ------------------------------------------------------- */}
            <div className="edp-header-container">
                <div className='title-container'>
                    <h1>{event.title.toUpperCase()}</h1>
                    <img src={white_star} alt="white star"/>
                </div>
                <div className='edp-info'>
                    <p className='time-and-place'>📍{event.location}, {event.city}  |  {event.time.slice(0,5)} Uhr | {event.date} </p>
                    <button onClick={handleButton}>{buttonContent}</button>
                </div>
            </div>
             {/* IMAGE ------------------------------------------------------- */}
            <div className="image-wrapper">
                <img className="title-image" src={event.image_url} alt={event.title}/>
            </div>

            {/* EVENT TAG CONTAINER*/}
            <div className='event-tag_container'>
                {event.categories && getCategoryTags(event.categories)}
            </div>

             {/* DESCRIPTION CONTAINER */}
            <div className='info_long-container'>
                <h2>DESCRIPTION</h2>
                <div className='text-output paragraph' id='event-description' >{event.description}</div>
                <div className="text-output paragraph" id='additional-info'>{event.info}</div>
            </div>
            
            <div className='optional-info_container'>
                {/* JUDGES CONTAINER*/}
                {event.judges &&
                    <div className='info_container' id='judges'>
                        <h2>JUDGES</h2>
                        <p className="text-output">{getItemsFromArray(event.judges)}</p>
                    </div>
                }

                {/* HOSTS CONTAINER*/}
                {event.hosts &&
                    <div className='info_container' id='hosts'>
                        <h2>HOSTS</h2>
                        <p className="text-output">{getItemsFromArray(event.hosts)}</p>
                    </div>
                }

                {/* DJS CONTAINER*/}
                {event.djs &&
                    <div className='info_container' id='djs'>
                        <h2>DJS</h2>
                        <p className="text-output">{getItemsFromArray(event.djs)}</p>
                    </div>
                }

            </div>

            {/* RULES CONTAINER*/}
                {event.rules &&
                    <div className='info_container' id='rules'>
                        <h2>RULES</h2>
                        <p className="text-output">{event.rules}</p>
                    </div>
                }
            
            <p id='organizer_username'>organized by @{profile?.username}</p>
        </main>
    );
}

