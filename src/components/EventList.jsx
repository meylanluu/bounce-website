import { useEffect, useState } from "react";
import { getEvents } from "../data/eventsService";

import EventCard from "./EventCard";
import "./EventList.css"

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  {/*useState = aktueller Wert + Funktion, Wert zu ändern*/}

  useEffect(() => {getEvents().then(setEvents);},  []);
  {/*useEffect: erlaubt das asynchrone Laden von Daten?*/}
  {/*events-Array ist nun mit den vers. Events gefüllt/}

  {/* Städte und Eventtypes extrahieren und in eigenes Array packen*/}
  const cities = [...new Set(events.map((e) => e.city))]; {/* [...new Set] = Spread-Operator -> wandelt Set wieder in normales Array um*/}
  const types = [...new Set(events.map((e) => e.type))];

  {/* Filtern: City & Type müssen beide übereinstimmen */}
  const filteredEvents = events.filter((event) => {
    const matchesCity = city ? event.city === city : true;
    {/*Wenn city einen Wert hat -> Überprüfen ob event.city mit city-Filter übereinstimmt
       Wenn city leer ist -> true zurück geben (alle Events)*/}
    const matchesType = type ? event.type === type : true;
    return matchesCity && matchesType;
  });

  return (
    <section className="all-events-section">
      <p>ALL EVENTS</p>
      <div className="filters">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Alle Städte</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Alle Eventtypen</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/*PRÜFEN: ist das nötig, wenn sowieso nur Städte angezeigt werden, die auch in den Cards enthalten sind?*/}
      {filteredEvents.length === 0 ? 
      ( <p className="empty-state">Keine Events gefunden. Versuch andere Filter.</p>) 
      : 
      (<div className="event-grid"> 
          {filteredEvents.map((event) => ( 
            <EventCard key={event.id} event={event} />  
          ))} {/*key => für React-Buchhaltung, jede EventCard kriegt key */}
              {/*event -> React Prop */}
        </div>
      )}
    </section>
  );
}
