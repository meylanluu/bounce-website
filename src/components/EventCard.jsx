import "./EventCard.css"
import { createSlug } from "../data/eventsService"
import { Link } from "react-router-dom"

export default function EventCard({ event }) {
  return (
      <Link to= {`/event/${createSlug(event.title)}`} className="event-card-link">
      <article className="event-card">
        <span className={`event-card__type event-card_type--${event.event_type.replace(/\s+/g, "-").toLowerCase()}`}>
        {event.event_type}
        </span>
        <h3 className="event-card_title">{event.title}</h3>
        <p className="event-card_date">
          {event.city} · {new Date(event.date).toLocaleDateString("de-DE")}
        </p>
        <p className="event-card__description">{event.description}</p>
      </article>
    </Link>
  );
}
