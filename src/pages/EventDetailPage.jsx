import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventBySlug } from '../data/eventsService';
import { getRegisteredEventIds, registerForEvent, unregisterFromEvent } from '../data/registrationService';
import "./EventDetailPage.css"
export default function EventDetailPage(){

    const params = useParams();
    const slug =  params.slug;

    {/*Hooks dürfen in React nie in if/else-Blöcken stehen */}
    const [event,setEvent] = useState(null); 
    useEffect (() => {
        getEventBySlug(slug).then((event_data) => {
        console.log("Fetched event:", event_data);
        setEvent(event_data[0]); 
         });  // wählt das erste Element im Fetch aus (event-Objekt)
    } ,[slug]);

    const [registeredEvents, setRegisteredEvents] = useState([]);
        useEffect(() => {getRegisteredEventIds().then(setRegisteredEvents)
        }, []);

    if (event === null){
        return <h4>Content ist loading...</h4>
    } else if (event === undefined) {
        return <h4>Could not find Event. </h4>
    } else {

        const isRegistered = registeredEvents.includes(event.id)
        const buttonContent = isRegistered ? "Unregister" : "Sign Up";

        function handleButton(){
            if (isRegistered == true){
                unregisterFromEvent(event.id);
                setRegisteredEvents(registeredEvents.filter( (eventId) => eventId !== event.id));
            } else if (isRegistered ==false) {
                registerForEvent(event.id)
                setRegisteredEvents([...registeredEvents, event.id]);
            } 
        }

        return (
        
            <main>
                <div className="edp-header">
                <h1>{event.title.toUpperCase()}</h1>
                <p>{event.date}</p>
                </div>
                <p className='time-and-place'>📍{event.location}, {event.city}  |  {event.time} </p>
                <button onClick={handleButton}>{buttonContent}</button>
            </main>
        );
    }
}
