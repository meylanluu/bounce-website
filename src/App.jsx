import EventList from "./components/EventList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Dance Events</h1>
        <p>Battles, Open Sessions & Workshops in deiner Stadt</p>
      </header>

      <main>
        <EventList />
      </main>
    </div>
  );
}

export default App;
