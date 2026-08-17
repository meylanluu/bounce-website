import "./EventCard.css"
import { createSlug } from "../data/eventsService"
import { Link } from "react-router-dom" 

{/* import des dazugehörigen bildes */}

function limitWords(text, maxWords) {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
}


export default function EventCard({ event }) {
  return (
      <Link to= {`/event/${createSlug(event.title)}`} className="event-card-link">
      <div className="event-card">
        <div className="event-card__image-wrapper">
          <img src={event.image_url} alt={event.title} className="event-card__image"/>
          <span className={`event-card__badge event-card_type--${event.type.replace(/\s+/g, "-").toLowerCase()}`}>
              {event.type}
          </span>
        </div>

        <div className="event-card__content">
          <h3 className="event-card_title">{event.title.toUpperCase()}</h3>
          <p className="event-card_date">{event.city} · {new Date(event.date).toLocaleDateString("de-DE")}</p>
          <p className="event-card__description">{limitWords(event.description, 15)}</p>
        </div>
      </div>
    </Link>
  );
}
