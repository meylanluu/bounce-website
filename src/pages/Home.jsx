import EventList from "../components/EventList.jsx"
import MyEventCard from "../components/MyEventCard.jsx";
import MyEvents from "../components/MyEvents.jsx"
import "./Home.css"

export default function Home() { //function App() {...} + separates export default App) –> in einer Zeile
  
  const date = new Date(); 
  const todaysDate = date.toLocaleDateString('no-no');

  return ( //<> Fragment: lets you group elements without a wrapper node.
           // React-Komponenten dürfen nur ein Wurzelelement zurückgeben -> Header und EventList als ein Element zurückgeben
    <> 
      <header className="home-header">
        <div id="header-container">
          <h1>LET'S BOUNCE</h1>
          <p>{todaysDate}</p>
        </div>
      </header>
      <main className="home-main">
        <div className="event-list_container">
          <EventList/>
        </div>
        <div className="my-events_container">
          <p id="my-events_header">MY EVENTS</p>
          <MyEvents CardComponent={MyEventCard}/>
        </div>
        
      </main>

      
    </>
  );
}
