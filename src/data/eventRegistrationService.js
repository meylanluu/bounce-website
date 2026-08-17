import { getEvents } from "./eventsService";
import { supabase } from "./supabaseClient";

export async function getRegisteredEventIds(userId) { {/* return -> Array */}
    const { data,error } = await supabase.from('registration').select('event_id').eq('user_id', userId);
    //data = [{ event_id: "123" }, { event_id: "124" }]
    if (error) throw error
    return data.map((row) => row.event_id)  
    // row = ein {event_id: "123"}- Objekt
    // result = Array von event IDs -> [ a123, b123]
}

export async function registerForEvent(userId, eventId) {
    const registeredEventIds = await getRegisteredEventIds(userId);
    if (registeredEventIds.includes(eventId)) {
        return;
    }
    const { error } = await supabase
        .from('registration')
        .insert({ user_id: userId, event_id: eventId});
    
    if (error) throw error; //Service-Funktionen sollen Fehler nur nach oben weitergeben, müssen sich nicht darum kümmern, wie sie dem Nutzer angezeigt werden  
}

export async function unregisterFromEvent(userId, eventId) {
    const registeredEventIds = await getRegisteredEventIds(userId); 

    if (!registeredEventIds.includes(eventId)){
        return
    }

    const { error } = await supabase
        .from('registration')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);
    
    if (error) throw error;
}

export async function getRegisteredEvents (userId){
    const allEvents = await getEvents();
    const registeredEventIds = await getRegisteredEventIds(userId); 
    return allEvents.filter((event) => registeredEventIds.includes(event.event_id)) 
    }




