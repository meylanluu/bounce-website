// Datenschicht für Events.
// Liest aktuell aus einer lokalen JSON-Datei.
// Wenn man später eine echte Datenbank (z.B. Supabase/Firebase) einbaut,
// muss man nur den Inhalt dieser Funktionen austauschen -
// der Rest der App bleibt unverändert, weil er immer nur diese Funktionen aufruft.

import eventsData from "./events.json";

//Gibt einfach die Event-Daten zurück, aber künstlich in ein Promise verpackt
export async function getEvents() {
  // Simuliert einen asynchronen Abruf, damit der Wechsel zu einer echten
  // Datenbank später (die auch async ist) keine Anpassungen im UI-Code braucht.
  return Promise.resolve(eventsData);
}

//für EventDetailPage
export async function getEventById(id) {
  const events = await getEvents();
  return events.find((event) => event.id === id);
}

// für Datenbank später: Filterungs sollte idealerweise nicht im frontend passieren
export async function filterEvents({ city, type }) {
  const events = await getEvents();
  return events.filter((event) => {
    const matchesCity = city ? event.city === city : true;
    const matchesType = type ? event.type === type : true;
    return matchesCity && matchesType;
  });
}

export function createSlug(eventTitle) {
  return eventTitle.trim().replace(/\W+/g," ").replace(/\s+/g,"-").toLowerCase();
}

export async function getEventBySlug(slug){
  const events = await getEvents(); 
  return events.find((event) => createSlug(event.title) === slug)
}