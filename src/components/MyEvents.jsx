import { useEffect, useState } from "react";
import { getEvents } from "../data/eventsService";
import { getRegisteredEventIds, getRegisteredEvents } from "../data/registrationService";
import { getOrganizedEventIds, getOrganizedEvents } from "../data/organizationService";

import MyEventCard from "./MyEventCard";  
import "./MyEvents.css";

export default function MyEvents() {

    const [allMyEvents, setAllMyEvents] = useState([]);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [organizedEventIds, setOrganizedEventIds] = useState([]);

    useEffect(() => {
    async function loadMyEvents(){
            const [registeredEvents, organizedEvents, registeredIds, organizedIds] = await Promise.all([
            getRegisteredEvents(),
            getOrganizedEvents(),
            getRegisteredEventIds(), 
            getOrganizedEventIds()
        ]);
        setAllMyEvents([...registeredEvents, ...organizedEvents]);
        setRegisteredEventIds(registeredIds);
        setOrganizedEventIds(organizedIds);
    } 
    loadMyEvents();}, []);

    function decideStatus(event){
        return registeredEventIds.includes(event.id) ? "REGISTERED" : organizedEventIds.includes(event.id) ? "ORGANIZING" : " "
    }

     return (
        <section className="my-events-section">
            <p>MY EVENTS</p>
            
            <div className="my-events-column"> {/* myEvents = registeredEvents + organizedEvents */}
                {allMyEvents.map((event) => 
                (<MyEventCard key={event.id} myEvent={event} status={decideStatus(event)} />)
                )}      
            </div> 
        </section>
     )
}
