import { useState, useEffect } from 'react'
import { useAuth } from '../data/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { organizeEvent } from '../data/organizationService';
import { uploadEventPicture, updateEvent, getEventById, createSlug } from '../data/eventsService';

import './EditEvent.css'

export default function EditEvent(){

    const [title, setTitle] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [style, setStyle] = useState('');
    const [type, setType] = useState('');
    const [categories, setCategories] = useState(''); 
    const [judges, setJudges] = useState('');
    const [hosts, setHosts] = useState('');
    const [djs, setDjs] = useState('');
    const [rules, setRules] = useState('');
    const [info, setInfo] = useState('');

    const [selectedFile, setSelectedFile] = useState(null); 

    const [error, setError] = useState(null);
    const { user, loading } = useAuth() //LOADING STATUS MIT EXTRAHIEREN
    const navigate = useNavigate(); 
    const params = useParams();

    const eventId = params.eventId;
    const [event, setEvent] = useState(null);

    const placeholderDate = new Date();
    let placeholderTime = (new Date()).getHours;
  
  
    useEffect(() => {

        //WENN EVENT VORHANDEN--------------------------------------------------------------
        if(!eventId) return; 
        if(!user) return; 

        //Event fetchen
        getEventById(eventId)
        .then((eventData) => {

            //Event setten
            setEvent(eventData);
            console.log("Fetched Event:", eventData.title);

            //Bestehende Daten laden und Formular vorbefüllen 
            setTitle(eventData.title);
            setOrganizerId(user.id);
            setCity(eventData.city);
            setDate(eventData.date);
            setTime(eventData.time);
            setLocation(eventData.location); 
            setDescription(eventData.description);
            setImageUrl(eventData.image_url);
            setStyle(eventData.style);
            setType(eventData.type);
            setCategories(eventData.categories);
            setJudges(eventData.judges);
            setHosts(eventData.hosts); 
            setDjs(eventData.djs);
            setRules(eventData.rules); 
            setInfo(eventData.info); 
        })
        .catch((error) => { // .catch() anstatt if (error), weil Fehler in getEventById() sonst nicht abgefangen wird, error würde geprüft werden bevor der Fetch durch ist 
            console.log("Event couldn't be loaded: ", error); 
            setError("Event couldn't be loaded");
        });

    },[eventId, user]); // Abhängigkeiten des Effects

    async function handleSubmit (e) {
        e.preventDefault(); //Verhindert kompletten Seiten-Reload (typisches Browser Verhalten) beim Formular-Absenden 

        try{
            const eventData = {
                title, //Shorthand Syntax: Abkürzung für title: title
                city,
                date,
                time,
                location,
                description,
                image_url: imageUrl, 
                style: style || null,
                type,
                categories:categories || null, 
                judges: judges || null,
                hosts: hosts || null,
                djs: djs || null,
                rules: rules || null,
                info: info || null,
            };

            let currentEvent = event; // lokale Variable nötig || setEvent() asynchron, kann event nicht innerhalb Funktion updaten
            let currentSlug;

            // EVENT WIRD NUR GEUPDATET
            if(eventId){
                currentSlug = createSlug(eventData.title);
                await updateEvent(eventId, { ...eventData, slug: currentSlug });
                currentEvent = { event_id: eventId, slug: currentSlug}; //für navigate später
                console.log('currentSlug: ', currentSlug);
            // EVENT WIRD ERSTELLT + organization-Tabelle
            } else {
                currentEvent = await organizeEvent(user.id, eventData); //erstellt das Event UND fügt es in organization-Tabelle ein
                currentSlug = currentEvent.slug;
            }

            // Bild hochladen: erst nach erstellen des Events, weil event.id gebraucht wird
            if (selectedFile) {
                console.log("Uploading file:", selectedFile);
                const imageUrl = await uploadEventPicture(currentEvent.event_id, selectedFile);
                console.log("Got imageUrl:", imageUrl);
                await updateEvent(currentEvent.event_id, {image_url: imageUrl});
                currentSlug = `${currentEvent.slug}`; 
                console.log("Update called");
            }

            navigate(`/event/${currentSlug}`)
            
        } catch (error) {
            console.log("Event couldn't be created/updated.", error);
            setError("Event couldn't be created/updated.");
        }
        
        
    }

    if(loading || (eventId && event === null && !error)){ // Ladeanzeige soll nur erscheinen, wenn wirklich auf Laden eines bestehenden Events gewartet wird (Edit-Modus),
            return <h4>Content is loading...</h4>
    }

    if (error) {
    return <h4>{error}</h4>;
    }

    console.log('Event Type: ' ,type)

    return(
        <div className='edit-event_container'>
            <div className='edit-event_content'>
                <form onSubmit={handleSubmit}>

                    {/*TITLE INFO*/}
                        <div className='info-field'>
                            <h2>Title</h2>
                            <input 
                                type = "text"
                                aria-label="Event title"
                                id='title_input'
                                placeholder = {eventId && event ? event.title : "Your Event Title"} //falls event = null
                                onChange={(e) => {
                                    setTitle(e.target.value.trim());
                                    e.target.style.width = `${e.target.value.length + 1}ch`; //ch = css Längeeinheit (Breite eines Zeichens)
                                }}
                            />
                        </div>

                    <div id='initial-info_container'>
                        {/*DATE INFO*/}
                        <div className='info-field'>
                            <h2>Date</h2>
                            <input 
                                type = "date" 
                                aria-label="Event date"
                                className='medium_input'
                                onChange = {(e) => setDate(e.target.value)}
                                />
                        </div>
                    
                        {/*TIME INFO*/}
                            <div className='info-field'>
                                <h2>Time</h2>
                                <input 
                                    type = "time" 
                                    aria-label="Event time"
                                    className='medium_input'
                                  
                                    onChange = {(e) => setTime(e.target.value)}
                                    />
                            </div>

                        {/*CITY INFO*/}
                            <div className='info-field city'>
                                <h2>City</h2>
                                <input 
                                    type = "text" 
                                    aria-label="Event city"
                                    className='medium_input'
                                    placeholder = {eventId && event ? event.city : "City"}
                                    onChange = {(e) => setCity(e.target.value)}
                                />
                            </div>

                        {/*LOCATION INFO*/}
                            <div className='info-field'>
                                <h2>Location</h2>
                                <input 
                                    type = "text" 
                                    aria-label="Event location"
                                    className='long_input'
                                    placeholder = {eventId && event ? event.location : "Location"}
                                    onChange = {(e) => setLocation(e.target.value)}
                                />
                            </div>
                    </div>

                    
                    <div className='type-and-image_container'>            
                    {/*EVENT TYPE INFO*/}
                        <div className='info-field'>
                            <h2>Event Type</h2>
                            <div className='event-type-selector_container'>
                                <label className={ type === "Workshop" ? "selected" : ""}>
                                    <input 
                                        type='radio'
                                        name="eventType" 
                                        className='event-type'
                                        value='Workshop'
                                        onChange = {(e) => setType(e.target.value)}
                                    /> Workshop   
                                </label>

                                <label className={ type === "Battle" ? "selected" : ""}>
                                    <input
                                        type='radio'
                                        name="eventType" 
                                        className='event-type'
                                        value='Battle'
                                        onClick={(e) => setType(e.target.value)}
                                    /> Battle 
                                </label>
                                <label className={ type === "Open Session" ? "selected" : ""}>
                                    <input
                                        type='radio'
                                        name="eventType" 
                                        className='event-type'
                                        value='Open Session'
                                        onClick={(e) => setType(e.target.value)}
                                    />Free Session 
                                </label>
                            </div>
                        </div>

                        <div className='info-field'>
                            <h2>Choose an image</h2>
                            <input 
                                type = 'file' 
                                aria-label="Event Image"
                                id='image_input'
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                        </div>
                    </div>
                        <div className='info-field'>
                            <h2>Description</h2>
                            <textarea 
                                type = "text" 
                                aria-label="Event description"
                                className='textarea'
                                placeholder = {eventId && event ? event.description : "Tell us about your event."}
                                onChange = {(e) => setDescription(e.target.value)}
                            />
                        </div>

                        

                         



                    {/* Additional Info ------------------------------------------------------ */}
                        
                    {/*DANCE STYLE INFO*/}
                        <div className='info-field'>
                            <h2>Dance Style (optional)</h2>
                            <input 
                                type = "text" 
                                aria-label="Dance style"
                                placeholder = {eventId && event && event.style ? event.style : "What's the style?"}
                                onChange = {(e) => setStyle(e.target.value)}
                                />
                        </div>

                    {/*CATEGORIES INFO*/}
                        <div className='info-field'>
                            <h2>Categories (optional)</h2>
                            <input 
                                type = "text" 
                                aria-label="Event categories"
                                placeholder = {eventId && event && event.categories ? event.categories : "Format: 1vs1,2vs2"}
                                onChange = {(e) => setCategories(e.target.value)}
                                />
                        </div>

                    {/*JUDGES INFO*/}
                        <div className='info-field'>
                            <h2>Judges (optional)</h2>
                            <input 
                                type = "text" 
                                aria-label="Event judges"
                                placeholder = {eventId && event && event.judges ? event.judges : "Format: Ruth Prim,Slunch"}
                                onChange = {(e) => setJudges(e.target.value)}
                                />
                        </div>

                    {/*HOSTS INFO*/}
                        <div className='info-field'>
                            <h2>Hosts (optional)</h2>
                            <input 
                                type = "text" 
                                aria-label="Event hosts"
                                placeholder = {eventId && event && event.hosts ? event.hosts : "Format: Redchild,MCGarro"}
                                onChange = {(e) => setHosts(e.target.value)}
                                />
                        </div>

                    {/*DJS INFO*/}
                        <div className='info-field'>
                            <h2>DJs (optional)</h2>
                            <input 
                                type = "text" 
                                aria-label="Event deejays"
                                placeholder = {eventId && event && event.djs ? event.djs : "Format: DJ Boogie G,DJ Passive"}
                                onChange = {(e) => setDjs(e.target.value)}
                                />
                        </div>

                    {/*RULES INFO*/}
                        <div className='info-field'>
                            <h2>Rules (optional)</h2>
                            <textarea 
                                type = "text" 
                                aria-label="Event rules"
                                className='textarea'
                                placeholder = {eventId && event && event.rules ? event.rules : "What are the rules?"}
                                onChange = {(e) => setRules(e.target.value)}
                                />
                        </div>

                    {/*ADDITIONAL INFO*/}
                        <div className='info-field'>
                            <h2>Additional Info (optional)</h2>
                            <textarea 
                                type = "text" 
                                aria-label="Additional information"
                                className='textarea'
                                placeholder = {eventId && event && event.info ? event.info : "Anything else?"}
                                onChange = {(e) => setInfo(e.target.value)}
                                />
                        </div>



                        <button className='enter-button' type='submit'>Enter</button>
                        </form>
                        {error && <p className="error-message">Something went wrong. Try again.</p>} {/* Bedingte Anzeige der Fehlermeldung */}
                        {/* Falls error ein Wert ist, der nicht false/null/undefined ist (echter Fehlertext), dann wird das gerendert, 
                        was rechts steht. Falls error = null -> nichts wird gerendert.*/}
            
                </div>
        </div>
        
    )

}