import { getEvents } from "./eventsService";

const STORAGE_KEY = "organizedEventIds"; 

export function getOrganizedEventIds() {
    const storedIds = localStorage.getItem(STORAGE_KEY); 
    return storedIds ? JSON.parse(storedIds) : [];
}

export async function stopOrganizingEvent(eventId) {
    const storedIds = await getOrganizedEventIds(); 
    const updatedIds = storedIds.filter((id) => id !==eventId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
}

export async function getOrganizedEvents (){
    const allEvents = await getEvents(); 
    const organizedEventIds = await getOrganizedEventIds(); 
    return allEvents.filter((event) => organizedEventIds.includes(event.id))
}