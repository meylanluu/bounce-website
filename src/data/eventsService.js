import { supabase } from "./supabaseClient";

export async function getEvents() {
  const {data, error} = await supabase.from('events').select();

  if (error) throw error

  return data;
}

//für EventDetailPage
export async function getEventById(id) {
  if (id===null) {
    throw new Error('Event ID is required.')
  }

  const {data, error} = await supabase
  .from('events')
  .select()
  .eq('event_id', id)
  .single(); // einzelnes Objekt soll geholt werden-> Event-Objekt

  if (error) throw error

  return data //return = eventObjekt
}

export async function createEvent(userId, eventData){

  if (!userId) {
    throw new Error("Organizer ID is required.");
  }

  if (!eventData) {
    throw new Error("Event data is required.");
  }

  if (!eventData.title || eventData.title.trim() === "") {
    throw new Error("Title is required.");
  }

  if (!eventData.time) {
    throw new Error("Time is required.");
  }

  if (!eventData.date) {
    throw new Error("Date is required.");
  }

  if (!eventData.city || eventData.city.trim() === "") {
    throw new Error("City is required.");
  }

  if (!eventData.location || eventData.city.trim() === "") {
    throw new Error("Location is required.");
  }

  if (!eventData.type) {
    throw new Error("Type is required.");
  }

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
export async function filterEvents({ city, type }) { //übergebener Parameter: Objekt, aus dem obj.city und obj.type extrahiert werden 
  const {data, error} = await supabase
                        .from('events')
                        .select()
                        .eq('city', city)
                        .eq('type',type);

  if (data === null){
    throw new Error ("No events found.");
  }
  
  if (error) throw error
  
  return data; //array von events
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
  if (!eventTitle) {
    throw new Error("Title is required.");
  };

  if (eventTitle.trim() === "") {
  throw new Error("Title cannot be empty or whitespaces only.");
  }

  const umlautMap = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss"
  };

  let slug = eventTitle  
    .replace(/[äöüÄÖÜß]/g, m => umlautMap[m]) //[äöüÄÖÜß] -> matcht genau eines der zeichen darin
    .trim()
    .replace(/\W+/g," ")
    .replace(/\s+/g,"-")
    .replace(/-$/, "") // $ -> nur am Ende des Strings
    .toLowerCase();

    return slug; 
}

export async function getEventBySlug(slug){

  if (!slug) {
    throw new Error("Slug is required.");
  };

  const {data,error} = await supabase
  .from('events')
  .select()
  .eq('slug', slug)
  .single();

  if (error) throw error
  
  return data
}