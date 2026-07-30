import EventList from "../components/EventList.jsx"

export default function Home() { //function App() {...} + separates export default App) –> in einer Zeile
  return ( //<> Fragment: lets you group elements without a wrapper node.
           // React-Komponenten dürfen nur ein Wurzelelement zurückgeben -> Header und EventList als ein Element zurückgeben
    <> 
      <header className="home-header">
          <h1>Bounce</h1>
          <p>Battles, Open Sessions & Workshops in deiner Stadt</p>
      </header>

        <EventList />
    </>
  );
}
