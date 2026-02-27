import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Get referral from URL
  const queryParams = new URLSearchParams(location.search);
  const refFromURL = queryParams.get("ref");

  // 🔥 Initialize form with referral auto-filled
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    referral_code: refFromURL || ""
  });

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          placeholder="Referral Code (Optional)"
          value={form.referral_code}
          onChange={(e) =>
            setForm({ ...form, referral_code: e.target.value })
          }
        />

        <button className="btn-primary" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;