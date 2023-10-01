import React, { createContext, useState, useEffect } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  // Se extrag evenimentele stocate din localStorage
  const storedEvents = JSON.parse(window.localStorage.getItem("events"));
  const [events, setEvents] = useState(storedEvents || []);

  // Efectul se activează atunci când evenimentele se modifică și salvează evenimentele în localStorage
  useEffect(() => {
    window.localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Funcția pentru adăugarea unui eveniment
  const addEvent = (eventData) => {
    // Se serializează datele evenimentului, transformând url-urile imaginilor
    const serializedEventData = {
      ...eventData,
      photos: eventData.photos.map((photo) => photo.url)
    };

    setEvents((prevEvents) => {
      // Se actualizează lista evenimentelor cu evenimentul nou adăugat
      const updatedEvents = [...prevEvents, serializedEventData];
      window.localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  // Funcția pentru eliminarea unui eveniment
  const removeEvent = (eventName) => {
    setEvents((prevEvents) => {
      // Se filtrează lista de evenimente pentru a elimina evenimentul cu numele specificat
      const updatedEvents = prevEvents.filter(
        (event) => event.eventName !== eventName
      );
      window.localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  // Efectul se activează o singură dată, la încărcarea componentei
  useEffect(() => {
    const storedPhotos = JSON.parse(window.localStorage.getItem("photos"));
    if (storedPhotos) {
      setEvents((prevEvents) =>
        // Se actualizează lista evenimentelor cu imaginile stocate corespunzătoare
        prevEvents.map((event) => ({
          ...event,
          photos: storedPhotos[event.eventName] || []
        }))
      );
    }
  }, []);

  // Efectul se activează atunci când lista de evenimente se modifică și salvează imaginile în localStorage
  useEffect(() => {
    const photoMap = events.reduce((map, event) => {
      map[event.eventName] = event.photos;
      return map;
    }, {});

    window.localStorage.setItem("photos", JSON.stringify(photoMap));
  }, [events]);

  // Se furnizează contextul și funcțiile specifice în copiii componentei
  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </EventContext.Provider>
  );
};
