import { useEffect, useState } from "react";
import { useAuth } from '../data/authContext'

import { getEvents } from "../data/eventsService";
import { getRegisteredEventIds, getRegisteredEvents } from "../data/eventRegistrationService";
import { getOrganizedEventIds, getOrganizedEvents } from "../data/organizationService";

import "./MyEvents.css";

export default function MyEvents({CardComponent}) {
    console.log("MyEvents loaded");


    const { user } = useAuth()
    const [allMyEvents, setAllMyEvents] = useState([]);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [organizedEventIds, setOrganizedEventIds] = useState([]);

    useEffect(() => {
        if (!user) return; 
        
        async function loadMyEvents(){
            const [registeredEvents, organizedEvents, registeredIds, organizedIds] = await Promise.all([
            getRegisteredEvents(user.id),
            getOrganizedEvents(user.id),
            getRegisteredEventIds(user.id), 
            getOrganizedEventIds(user.id)
        ]);
        console.log("registeredEvents", registeredEvents);
        console.log("organizedEvents", organizedEvents);

        setAllMyEvents([...registeredEvents, ...organizedEvents]);
        setRegisteredEventIds(registeredIds);
        setOrganizedEventIds(organizedIds);
    } 
    loadMyEvents();
    }, [user]); // useEffect reagiert auf Änderungen von user

    function decideStatus(event){
        return registeredEventIds.includes(event.event_id) ? "REGISTERED" : (organizedEventIds.includes(event.event_id) ? "ORGANIZING" : " ")
    }

    console.log(organizedEventIds)

     return (
        <section className="my-events-section">
            <div className="my-events-column"> {/* myEvents = registeredEvents + organizedEvents */}
                {allMyEvents.map((event) => 
                (<CardComponent key={event.event_id} myEvent={event} status={decideStatus(event)} />)
                )}      
            </div> 
        </section>
     )
}
