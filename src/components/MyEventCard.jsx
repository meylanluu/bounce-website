import clockIcon from "../assets/clock-icon.svg";

import { createSlug } from "../data/eventsService"
import { Link, useNavigate } from "react-router-dom"

import "./MyEventCard.css";


export default function MyEventCard({ myEvent, status }) {

    const navigate = useNavigate(); 

    return (
        <Link to={`/event/${createSlug(myEvent.title)}`} className="my-event-card-link">
            <article className="my-event-card">
                <div className="month-and-date">
                    <p className="mec-month">{new Date(`${myEvent.date}`).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</p>
                    <p className="mec-date">{new Date(`${myEvent.date}`).getDate()}</p>
                </div>

                <div className="mec-info">
                    <h4 className="mec-title">{myEvent.title.toUpperCase()}</h4>
                    <div className="mec-details">
                        <img className="mec-clock" src={clockIcon} alt="clock icon" />
                        <p className="mec-time">{myEvent.time.slice(0,5)}</p>
                        <p className="mec-dot">•</p>
                        <p className="mec-location"> {myEvent.location}, {myEvent.city}</p>
                    </div>
                    <div className="mec_status-and-edit">
                        <p className={`mec-status mec-status__${status.toLowerCase()}`}>{status}</p>
                        {/* EDIT BUTTON ####################
                        {status === "ORGANIZING" && 
                            <button id="mec-edit-button" onClick={(e) => {
                                e.preventDefault();   // Link-Default verhindern
                                e.stopPropagation();  
                                navigate(`/edit-event/${myEvent.event_id}`)
                            }}>Edit</button>
                        }
                        */}
                    </div>
                </div>

            </article>
        </Link>
    )
}