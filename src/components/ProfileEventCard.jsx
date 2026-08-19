import { createSlug } from "../data/eventsService"
import { Link, useNavigate } from "react-router-dom"
import clockIcon from "../assets/clock-icon.svg";
import { useAuth } from "../data/authContext"
 
import "./ProfileEventCard.css";
import { unregisterFromEvent } from "../data/eventRegistrationService";

export default function ProfileEventCard({myEvent, status}){ // direkt Destrukturierung im Parameter: ohne {} müsste Zugriff z.B. über props.myEvent geregelt werden
    
    const navigate = useNavigate(); 
    const { user } = useAuth(); 

    function limitWords(text, maxWords) {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    }

    return (
          <Link to= {`/event/${createSlug(myEvent.title)}`} className="event-card-link">
          <div className="profile-event-card_container">
            <div className="pec-image_wrapper">
              <img src={myEvent.image_url} alt={myEvent.title} className="pec_image"/>
              <span className={`pec__badge event-card_type--${myEvent.type.replace(/\s+/g, "-").toLowerCase()}`}>
                  {myEvent.type}
              </span>
            </div>
    
            <div className="pec-content_container">
                <h3 className="pec-title">{myEvent.title.toUpperCase()}</h3>
                <p className="pec-info">
                    <span>📍  </span>
                    <span>{myEvent.location}, {myEvent.city} · </span>
                    <span id="pec-date">{new Date(myEvent.date).toLocaleDateString("de-DE")} · </span> 
                    <span><img id="pec-clock" src={clockIcon} alt="clock icon" /> 
                        {myEvent.time.slice(0,5)} 
                    </span>

                </p>

                
                <p className="pec-description">{limitWords(myEvent.description, 20)}</p>
                <div className="status-and-edit">
                    <span className={`pec-status ${status.toLowerCase()}`}>{status}</span>
                    {status === "ORGANIZING" && 
                        <button id="edit-button" onClick={(e) => {
                            e.preventDefault();   // Link-Default verhindern
                            e.stopPropagation();  
                            navigate(`/edit-event/${myEvent.event_id}`)
                        }}>Edit</button>
                    }
                </div>
                
            </div>
          </div>
        </Link>
      );
}