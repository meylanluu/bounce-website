import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../data/authContext'

import { getEventBySlug } from '../data/eventsService';
import { getRegisteredEventIds, registerForEvent, unregisterFromEvent } from '../data/eventRegistrationService';

import white_star from "../assets/white_star.webp"
import "./EventDetailPage.css"

export default function EventDetailPage(){

    const params = useParams();
    const slug =  params.slug;
    const { user, loading } = useAuth(); 
    const navigate = useNavigate(); 

    {/*Hooks dürfen in React nie in if/else-Blöcken stehen */}
    const [event,setEvent] = useState(null); 

    {/* Event wird per slug geladen & für Detail Page festgelegt ----------------------------------------------*/}
   
    useEffect (() => {
        getEventBySlug(slug).then((event_data) => { 
        console.log("Fetched event:", event_data);
        setEvent(event_data[0]); // wählt das erste Element im Fetch aus (event-Objekt)
         });  
    } ,[slug]); {/* useEffect achtet auf Änderungen des slugs */}

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
    const buttonContent = !user ? "Log in to Sign Up" : (isRegistered ? "Unregister" : "Sign Up");

    async function handleButton(){
        if (!user) {
            navigate('/login');
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

    return (
        <main>
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

            <div className="image-wrapper">
                <img className="title-image" src={event.image_url} alt={event.title}/>
            </div>

            {/* PROVISORISCH */}
            <div className='event-tag-container'>
                <p className='event-tag'>2VS2 All Style</p>
                <p className='event-tag'>2VS2 Breaking</p>
                <p className='event-tag'>2VS2 Hip Hop</p>
            </div>

            <div className='entry-and-start_container'>
                <div className='eas-container'>
                    <p className='bold'>ENTRY</p>
                    <p className='entry-and-start_time'>{event.time.slice(0,5)}</p>
                </div>
                <div className='eas-container'>
                    <p className='bold'>START</p>
                    <p className='entry-and-start_time'>{event.time.slice(0,5)}</p>
                </div>
            </div>

            <div className='description-text'>{event.description}</div>


            
        </main>
    );
}

