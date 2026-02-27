import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState({
    ReferralsGiven: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/dashboard/profile");
        setProfile(res.data.data);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {/* Profile Card */}
      <div className="card">
        <h3>Profile</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Your Referral Code:</strong> {profile.referral_code}</p>
        <p><strong>Total Referrals:</strong> {profile.ReferralsGiven?.length || 0}</p>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `http://localhost:5173/register?ref=${profile.referral_code}`
            )
          }
        >
          Copy Link
        </button>
      </div>

      {/* Users I Referred */}
      <h3>Users I Referred</h3>

      {profile.ReferralsGiven.length === 0 ? (
        <p>No referrals yet.</p>
      ) : (
        profile.ReferralsGiven.map((ref) => (
          <div key={ref.id} className="card">
            <p><strong>Name:</strong> {ref.ReferredUser?.name}</p>
            <p><strong>Email:</strong> {ref.ReferredUser?.email}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;