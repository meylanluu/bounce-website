import { getRegisteredEventIds } from "../data/registrationService";
import clockIcon from "../assets/clock-icon.svg";

import { createSlug } from "../data/eventsService"
import { Link } from "react-router-dom"

import "./MyEventCard.css";


export default function MyEventCard({ myEvent, status }) {

    return (
        <Link to={`/event/${createSlug(myEvent.title)}`} className="my-event-card-link">
            <article className="my-event-card">
                <div className="month-and-date">
                    <p className="mec-month">{new Date(`${myEvent.date}`).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</p>
                    <p className="mec-date">{new Date(`${myEvent.date}`).getDate()}</p>
                </div>

                <div className="mec-info">
                    <h4 className="mec-title">{myEvent.title}</h4>
                    <div className="mec-details">
                        <img className="mec-clock" src={clockIcon} alt="clock icon" />
                        <p className="mec-time">{myEvent.time}</p>
                        <p className="mec-dot">•</p>
                        <p className="mec-location"> {myEvent.location}, {myEvent.city}</p>
                    </div>
                    <p className="mec-status">
                    {status}
                    </p>
                </div>

            </article>
        </Link>
    )
}