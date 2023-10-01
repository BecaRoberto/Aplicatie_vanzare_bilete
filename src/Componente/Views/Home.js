import React, { useContext, useEffect, useState, useCallback } from "react";
import { EventContext } from "./EventContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { events, removeEvent } = useContext(EventContext);
  const [counters, setCounters] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const navigate = useNavigate();

  const applyFiltersAndSort = useCallback((searchTerm, filters) => {
    let filteredEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.length > 0) {
      if (filters.includes("price-asc")) {
        filteredEvents = filteredEvents.sort((a, b) => a.price - b.price);
      }
      if (filters.includes("price-desc")) {
        filteredEvents = filteredEvents.sort((a, b) => b.price - a.price);
      }
      if (filters.includes("date-asc")) {
        filteredEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      if (filters.includes("date-desc")) {
        filteredEvents = filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      if (filters.includes("name-asc")) {
        filteredEvents = filteredEvents.sort((a, b) => a.eventName.localeCompare(b.eventName));
      }
      if (filters.includes("name-desc")) {
        filteredEvents = filteredEvents.sort((a, b) => b.eventName.localeCompare(a.eventName));
      }
    }

    setSearchResults(filteredEvents);
  }, [events]);

  useEffect(() => {
    const currentDate = new Date();
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate || isSameDay(eventDate, currentDate);
    });

    if (filteredEvents.length !== events.length) {
      const eventNamesToRemove = events
        .filter((event) => !filteredEvents.includes(event))
        .map((event) => event.eventName);
      eventNamesToRemove.forEach((eventName) => removeEvent(eventName));
    }
  }, [events, removeEvent]);

  useEffect(() => {
    const initialCounters = {};
    events.forEach((event) => {
      initialCounters[event.eventName] = 1;
    });
    setCounters(initialCounters);
  }, [events]);

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleIncrement = (eventName) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [eventName]: (prevCounters[eventName] || 0) + 1,
    }));
  };

  const handleDecrement = (eventName) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [eventName]: Math.max((prevCounters[eventName] || 1) - 1, 1),
    }));
  };

  const handleBuyTicket = (eventName) => {
    const event = events.find((event) => event.eventName === eventName);
    const price = event.price;
    navigate(`/payment?eventName=${eventName}&price=${price}&counter=${counters[eventName]}`);
  };

  const handleExpandDescription = (eventName) => {
    setExpandedDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [eventName]: true,
    }));
  };

  const handleCollapseDescription = (eventName) => {
    setExpandedDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [eventName]: false,
    }));
  };

  const handleSearch = useCallback((searchTerm) => {
    const filteredEvents = events.filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredEvents);
  }, [events]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
  };

  const toggleFilter = (filterName) => {
    setSelectedFilters((prevFilters) => {
      // Get the category of the selected filter (price, date, name, etc.)
      const selectedCategory = filterName.split('-')[0];
  
      // Check if the selected filter is already present in the selected filters
      const isSelected = prevFilters.includes(filterName);
  
      if (isSelected) {
        // If the selected filter is already present, remove it to deselect
        return prevFilters.filter((filter) => filter !== filterName);
      } else {
        // If the selected filter is not present, add it
        // and remove any other filters from the same category
        const filtersInSameCategory = prevFilters.filter((filter) => filter.split('-')[0] === selectedCategory);
        return filtersInSameCategory.length > 0
          ? prevFilters.filter((filter) => filter.split('-')[0] !== selectedCategory).concat(filterName)
          : [...prevFilters, filterName];
      }
    });
  };

  useEffect(() => {
    handleSearch(searchTerm);
    applyFiltersAndSort(searchTerm, selectedFilters);
  }, [searchTerm, selectedFilters, events, handleSearch, applyFiltersAndSort]);


  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search event"
          value={searchTerm}
          onChange={handleInputChange}
          className="border border-gray-300 rounded py-2 px-4 w-full"
        />
      </div>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("price-asc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("price-asc")}
        >
          Sort by Price (Low to High)
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("price-desc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("price-desc")}
        >
          Sort by Price (High to Low)
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("date-asc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("date-asc")}
        >
          Sort by Date ↑
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("date-desc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("date-desc")}
        >
          Sort by Date ↓
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("name-asc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("name-asc")}
        >
          Sort by Name (A → Z)
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded focus:outline-none ${selectedFilters.includes("name-desc") ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
          onClick={() => toggleFilter("name-desc")}
        >
          Sort by Name (Z → A)
        </button>
      </div>
      <ul className="space-y-8">
        {searchResults.map((event, index) => (
          <li key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="bg-blue-500 py-4 px-6 text-white">
              <h2 className="text-2xl font-bold">{event.eventName}</h2>
            </div>
            <div className="py-6 px-6">
              <div className="flex items-center mb-4">
                <div className="w-48 h-32 rounded-lg overflow-hidden mr-4">
                  {/* Se afișează imaginea evenimentului */}
                  <img
                    src={localStorage.getItem(`uploadedPhoto_${event.eventName}`)}
                    alt={`Event ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-gray-700">
                    <p className="font-bold">Location: {event.location}</p>
                    <p className="font-bold">Date: {event.date}</p>
                    <p className="font-bold">Hour: {event.hour}</p>
                    <p className="font-bold">Price: {event.price} RON</p>
                    <p className="font-bold">Number of Tickets: {counters[event.eventName] || 1}</p>
                    {/* Butonul pentru incrementarea contorului */}
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      onClick={() => handleIncrement(event.eventName)}
                    >
                      +
                    </button>
                    {/* Butonul pentru decrementarea contorului */}
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                      onClick={() => handleDecrement(event.eventName)}
                    >
                      -
                    </button>
                    {/* Butonul pentru achiziționarea biletului */}
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                      onClick={() => handleBuyTicket(event.eventName)}
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
              </div>
              {/* Se afișează descrierea evenimentului */}
              {event.description.split(" ").length > 50 ? (
                <>
                  {expandedDescriptions[event.eventName] ? (
                    <>
                      <p className="text-gray-700">{event.description}</p>
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleCollapseDescription(event.eventName)}
                      >
                        Read less
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700">
                        {event.description
                          .split(" ")
                          .slice(0, 50)
                          .join(" ")}
                        ...{" "}
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleExpandDescription(event.eventName)}
                        >
                          Read more
                        </span>
                      </p>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-700">{event.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;