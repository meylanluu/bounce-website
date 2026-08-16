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

// für Datenbank später: Filterungs sollte idealerweise nicht im frontend passieren
export async function filterEvents({ city, type }) {
  const {data, error} = await supabase.from('events').select().eq('city', city).eq('type',type);
  return data; 
  };

export function createSlug(eventTitle) {
  return eventTitle.trim().replace(/\W+/g," ").replace(/\s+/g,"-").toLowerCase();
}

export async function getEventBySlug(slug){
  const {data,error} = await supabase.from('events').select().eq('slug', slug);
  return data
}