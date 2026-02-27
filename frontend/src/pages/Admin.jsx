import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get("/admin/stats");
      const usersRes = await API.get("/admin/users");
      const leaderboardRes = await API.get("/admin/leaderboard");
      const eventsRes = await API.get("/admin/events");

      setStats(statsRes.data);
      setUsers(usersRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
      setEvents(eventsRes.data.data);

    } catch (error) {
      navigate("/");
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="card">
        <h3>Statistics</h3>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Referrals: {stats.totalReferrals}</p>
      </div>

      <h3>Referral Leaderboard</h3>
      {leaderboard.map((item, index) => (
        <div key={index} className="card">
          <p>Name: {item.Referrer?.name}</p>
          <p>Email: {item.Referrer?.email}</p>
          <p>Referrals: {item.referral_count}</p>
        </div>
      ))}

      <h3>All Users</h3>
      {users.map(user => (
        <div key={user.id} className="card">
          <p>{user.name} ({user.email}) - {user.role}</p>
        </div>
      ))}

      <h3>All Events</h3>
      {events.map(event => (
        <div key={event.id} className="card">
          <p>{event.title} - Created by {event.User?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Admin;