import { supabase } from "./supabaseClient";

export async function getEvents() {
  const {data, error} = await supabase.from('events').select();
  return data;
}

//für EventDetailPage
export async function getEventById(id) {
  const {data,error} = await supabase.from('events').select().eq('id', id);
  return data
}

export async function createEvent(userId, eventData){
  const { data, error } = await supabase
      .from('events')
      .insert({ 
        title: eventData.title,
        organizer_id: userId,
        city: eventData.city,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description,
        image_url: eventData.image_url,
        slug: createSlug(eventTitle),
        style: eventData.style,
        type: eventData.type
      })
      .select() //gibt die neu erstelle Zeile zurück, anstatt nur zu bestätigen, dass es geklappt hat
      .single(); // nur ein Object als Rückgabe

  if (error) throw error; 
  return data; // gibt neu erstelltes Event-Objekt zurück (inkl. user_id)

} 

//Filtern
export async function filterEvents({ city, type }) {
  const {data, error} = await supabase.from('events').select().eq('city', city).eq('type',type);
  return data; 
  };

//Slug
export function createSlug(eventTitle) {
  return eventTitle.trim().replace(/\W+/g," ").replace(/\s+/g,"-").toLowerCase();
}

export async function getEventBySlug(slug){
  const {data,error} = await supabase.from('events').select().eq('slug', slug);
  return data
}