import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 🔥 Get role

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};

  return (
    <div className="navbar">
      <div>
        <Link to="/">Events</Link>

        {token && <Link to="/dashboard">Dashboard</Link>}

        {token && <Link to="/create-event">Create Event</Link>}

        {/* 🔥 Show Admin only if role is admin */}
        {token && role === "admin" && <Link to="/admin">Admin</Link>}
      </div>

      <div>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;