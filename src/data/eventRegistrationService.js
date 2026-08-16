// registrationService.js
import { getEvents } from "./eventsService";

const STORAGE_KEY = "registeredEventIds"; 
{/* localStorage -> '["1","3","5"]'  String, der die JSON-Syntax eines Arrays enthält */}

export async function getRegisteredEventIds() { {/* return -> Array */}
    const storedIds =  localStorage.getItem(STORAGE_KEY);
    return storedIds ? JSON.parse(storedIds) : [];
}

export async function registerForEvent(eventId) {
    const storedIds = await getRegisteredEventIds(); // anfangs: []
    if (!storedIds.includes(eventId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...storedIds, eventId])); // torage wird gefüllt: localStorage["registeredEventIds"] = '["3"]'
  }
}

export async function unregisterFromEvent(eventId) {
    const storedIds = await getRegisteredEventIds(); // anfangs: []
    const updatedIds = storedIds.filter((id) => id !==eventId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds)); // torage wird gefüllt: localStorage["registeredEventIds"] = '["3"]'
}

export async function getRegisteredEvents (){
    const allEvents = await getEvents();
    const registeredEventIds = await getRegisteredEventIds(); 
    return allEvents.filter((event) => registeredEventIds.includes(event.id)) 
    }




{/*
    
    export async function getRegisteredEventIds() { 
    const stored = localStorage.getItem(STORAGE_KEY);
   return stored ? JSON.parse(stored) : [];
 } // bleibt bestehen

export async function getRegisteredEvents() {
  const [ids, allEvents] = await Promise.all([getRegisteredEventIds(), getEvents()]);
  return allEvents.filter((event) => ids.includes(event.id));
}



export function registerForEvent(eventId){
    const ids = getRegisteredEventIds(); 
    if(!ids.includes(eventId)){
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids,eventId]));
    }
}

export function unregisterFromEvent(eventId){
    const ids = getRegisteredEventIds(); 
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ids.filter((id) => id !== eventId))
    );
}
    */}