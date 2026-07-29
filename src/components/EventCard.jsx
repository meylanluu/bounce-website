export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <span className={`event-card__type event-card__type--${event.type.replace(/\s+/g, "-").toLowerCase()}`}>
        {event.type}
      </span>
      <h3 className="event-card__title">{event.title}</h3>
      <p className="event-card__meta">
        {event.city} · {new Date(event.date).toLocaleDateString("de-DE")}
      </p>
      <p className="event-card__description">{event.description}</p>
    </article>
  );
}
