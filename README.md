# Dance Events

Plattform für Tänzer:innen, um Battles, Open Sessions und Workshops zu finden, zu posten und sich dafür anzumelden.

## Setup

```bash
npm install
npm run dev
```

## Projektstruktur

```
src/
  data/
    events.json          # Beispiel-Events (Platzhalter für spätere echte Datenbank)
    eventsService.js      # Datenschicht - hier später ggf. gegen Supabase/Firebase austauschen
  components/
    EventCard.jsx         # Einzelne Event-Karte
    EventList.jsx          # Liste + Filter nach Stadt & Eventtyp
  pages/                   # Für weitere Seiten (Event-Detail, Login, ...)
```

## Roadmap

- [x] Grundgerüst & Beispiel-Events
- [x] Filter nach Stadt & Eventtyp
- [ ] Event-Detailseite
- [ ] Fake-Login (Local Storage)
- [ ] "Event speichern" & "Anmelden"
- [ ] Optional: echte Datenbank (Supabase/Firebase) statt events.json
