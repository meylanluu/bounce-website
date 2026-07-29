import { useEffect, useState } from "react";
import { getEvents } from "../data/eventsService";
import EventCard from "./EventCard";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const cities = [...new Set(events.map((e) => e.city))];
  const types = [...new Set(events.map((e) => e.type))];

  const filteredEvents = events.filter((event) => {
    const matchesCity = city ? event.city === city : true;
    const matchesType = type ? event.type === type : true;
    return matchesCity && matchesType;
  });

  return (
    <section>
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

      {filteredEvents.length === 0 ? (
        <p className="empty-state">Keine Events gefunden. Versuch andere Filter.</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
