import React, { useContext, useState, useEffect } from "react";
import { EventContext } from "./EventContext";
import axios from "axios";

function Template() {
  const { addEvent, events } = useContext(EventContext);

  // Stări pentru câmpurile formularului
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [price, setPrice] = useState("");

  // Efect pentru resetarea câmpurilor formularului la adăugarea sau ștergerea evenimentelor
  useEffect(() => {
    setEventName("");
    setLocation("");
    setDate("");
    setHour("");
    setDescription("");
    setPhotos([]);
    setPrice("");
  }, [events]);

  // Efect pentru încărcarea ultimei imagini adăugate în funcție de numele evenimentului
  useEffect(() => {
    const recentImage = localStorage.getItem(`uploadedPhoto_${eventName}`);
    if (recentImage) {
      setPhotos([recentImage]);
    }
  }, [eventName]);

  // Funcții pentru gestionarea schimbării valorilor câmpurilor
  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleHourChange = (e) => {
    setHour(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Funcție pentru încărcarea unei fotografii
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const photoDataUrl = reader.result;
      convertToBlob(photoDataUrl);
    };

    reader.readAsDataURL(file);
  };

  // Funcție pentru convertirea datelor unei imagini într-un obiect blob
  const convertToBlob = (dataUrl) => {
    fetch(dataUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const photoUrl = reader.result;
          setPhotos([photoUrl]); // Înlocuim array-ul de fotografii existent cu noua fotografie
          // Salvăm URL-ul fotografiei actualizate în local storage
          localStorage.setItem(`uploadedPhoto_${eventName}`, photoUrl);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        console.error("Eroare la convertirea datelor URL în obiect blob:", error);
      });
  };

  // Funcție pentru gestionarea trimiterii formularului
  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      eventName,
      location,
      date,
      hour,
      description,
      photos,
      price,
    };

    axios
      .post("http://localhost:1433/createEvent", eventData)
      .then((response) => {
        console.log(response.data.message); // Mesajul de eveniment creat cu succes
        // Curățăm câmpurile formularului
        setEventName("");
        setLocation("");
        setDate("");
        setHour("");
        setDescription("");
        setPhotos([]);
        setPrice("");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Eroare la crearea evenimentului:", error);
      });

    // Adăugăm evenimentul în EventContext și actualizăm local storage
    addEvent(eventData);
    localStorage.setItem(`uploadedPhoto_${eventName}`, photos[0]);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="eventName">
            Event Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventName"
            type="text"
            value={eventName}
            onChange={handleEventNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            value={location}
            onChange={handleLocationChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="hour">
            Hour
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hour"
            type="time"
            value={hour}
            onChange={handleHourChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            rows="4"
            value={description}
            onChange={handleDescriptionChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
            value={price}
            onChange={handlePriceChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="photos">
            Photos
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="photos"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            required
          />
          {photos.length > 0 && (
            <div className="w-48 h-32 rounded-lg overflow-hidden mt-4">
              <img
                src={photos[0]}
                alt="Uploaded Event"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default Template;
