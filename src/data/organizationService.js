import { getEvents } from "./eventsService";
import { supabase } from "./supabaseClient";
import { createEvent } from "./eventsService";

export async function getOrganizedEventIds(userId) {
    const { data, error } = await supabase
        .from('organization')
        .select('event_id')
        .eq('organizer_id',userId);
    if (error) throw error;
    return data.map((row) => row.event_id)
}

export async function organizeEvent(userId, eventData) {
    const newEvent = await createEvent(userId, eventData);
    const organizedEventIds = getOrganizedEventIds(userId);
    
    const { error } = await supabase
        .from('organization')
        .insert({organizer_id: userId, event_id: newEvent.event_id});

    if (error) throw error; 

    return newEvent; 
}

export async function deleteOrganizedEvent(userId, eventId) {
    const organizedEventIds = await getOrganizedEventIds(userId); 
    if(!organizedEventIds.includes(eventId)){
        return;
    }

    const {error} = await supabase
        .from('organization')
        .delete()
        .eq('organizer_id', userId)
        .eq('event_id', eventId);
    
    if (error) throw error; 
}

export async function getOrganizedEvents (userId){
    const allEvents = await getEvents(); 
    const organizedEventIds = await getOrganizedEventIds(userId); 
    return allEvents.filter((event) => organizedEventIds.includes(event.event_id))
}