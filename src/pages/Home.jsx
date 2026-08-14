import EventList from "../components/EventList.jsx"
import MyEvents from "../components/MyEvents.jsx"
import "./Home.css"

export default function Home() { //function App() {...} + separates export default App) –> in einer Zeile
  return ( //<> Fragment: lets you group elements without a wrapper node.
           // React-Komponenten dürfen nur ein Wurzelelement zurückgeben -> Header und EventList als ein Element zurückgeben
    <> 
      <header className="home-header">
        <div id="header-container">
          <h1>LET'S GO</h1>
          <p>Date: Thursday, July 7</p>
        </div>
      </header>
      <main className="home-main">
        <EventList/>
        <MyEvents />
        
      </main>

      
    </>
  );
}
