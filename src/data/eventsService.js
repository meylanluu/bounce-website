import { supabase } from "./supabaseClient";

export async function getEvents() {
  const {data, error} = await supabase.from('events').select();
  return data;
}

//für EventDetailPage
export async function getEventById(id) {
  const {data,error} = await supabase
  .from('events')
  .select()
  .eq('event_id', id)
  .single(); // einzelnes Objekt soll geholt werden-> Event-Objekt

  return data //return = eventObjekt
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
        slug: createSlug(eventData.title),
        style: eventData.style,
        type: eventData.type,
        categories: eventData.categories,
        judges: eventData.judges,
        hosts: eventData.hosts,
        djs: eventData.djs,
        rules: eventData.rules,
        info: eventData.info
      })
      .select() //gibt die neu erstelle Zeile zurück, anstatt nur zu bestätigen, dass es geklappt hat
      .single(); // nur ein Object als Rückgabe

  if (error) throw error; 
  return data; // gibt neu erstelltes Event-Objekt zurück (inkl. user_id)

} 

export async function updateEvent(eventId, newData){

  const {error} = await supabase
    .from('events')
    .update(newData)
    .eq('event_id', eventId);

  if (error) throw error; 

}

//Filtern
export async function filterEvents({ city, type }) {
  const {data, error} = await supabase.from('events').select().eq('city', city).eq('type',type);
  return data; 
  };

// Event Image hochladen
export async function uploadEventPicture(eventId,file){
  
  const filePath = `${eventId}_event-image.jpg`
  const { error: uploadError } = await supabase.storage //in der oberen Komponente gibt es ja auch eine error Variable, deswegen Umbenennung
    .from('event_images')
    .upload(filePath, file, {upsert: true});

  if (uploadError) throw uploadError;
  
  const{ data } = supabase.storage
    .from('event_images')
    .getPublicUrl(filePath); // getPublicUrl(...) nicht asynchron -> kein await nötig

  if (data) {console.log("Image was uploaded into Storage.")}

  return data.publicUrl;
}


//Slug
export function createSlug(eventTitle) {
  return eventTitle.trim().replace(/\W+/g," ").replace(/\s+/g,"-").toLowerCase();
}

export async function getEventBySlug(slug){
  const {data,error} = await supabase
  .from('events')
  .select()
  .eq('slug', slug)
  .single();

  return data
}