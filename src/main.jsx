//main.jsx: Brücke zwischen HTML und React
import { StrictMode } from 'react' //Hilfe: gibt beim Entwickeln zusätzliche Warnungen aus
import { createRoot } from 'react-dom/client' // react-dom: stellt React-Komponenten im Browser wirklich als HTML dar
import './main.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render( //createRoot(...): Stelle, an der die Komponenten eingefügt werden? 
  <StrictMode>
    <App />
  </StrictMode>,
)
