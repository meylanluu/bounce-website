// Datenschicht für Events.
// Liest aktuell aus einer lokalen JSON-Datei.
// Wenn ihr später eine echte Datenbank (z.B. Supabase/Firebase) einbaut,
// müsst ihr nur den Inhalt dieser Funktionen austauschen -
// der Rest der App bleibt unverändert, weil er immer nur diese Funktionen aufruft.

import eventsData from "./events.json";

export async function getEvents() {
  // Simuliert einen asynchronen Abruf, damit der Wechsel zu einer echten
  // Datenbank später (die auch async ist) keine Anpassungen im UI-Code braucht.
  return Promise.resolve(eventsData);
}

export async function getEventById(id) {
  const events = await getEvents();
  return events.find((event) => event.id === id);
}

export async function filterEvents({ city, type }) {
  const events = await getEvents();
  return events.filter((event) => {
    const matchesCity = city ? event.city === city : true;
    const matchesType = type ? event.type === type : true;
    return matchesCity && matchesType;
  });
}
