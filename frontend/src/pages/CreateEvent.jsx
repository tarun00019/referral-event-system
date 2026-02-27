import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    meta_title: "",
    meta_description: ""
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      await API.post("/events", data);
      alert("Event created successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Event</h2>

        <input
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Meta Title"
          onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
        />

        <input
          placeholder="Meta Description"
          onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Create Event
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;