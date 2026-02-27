import { useEffect, useState } from "react";
import API from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await API.get("/events");
      setEvents(res.data.data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="container">
      <h2>All Events</h2>

      {events.map((event) => (
        <div key={event.id} className="card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>By:</strong> {event.User?.name}</p>

          {event.Images?.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${img.image_url}`}
              width="200"
              style={{ marginRight: "10px", borderRadius: "6px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Events;