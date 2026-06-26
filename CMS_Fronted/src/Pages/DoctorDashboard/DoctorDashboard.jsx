import "./DoctorDashboard.css";

function DoctorDashboard() {
  return (
    <div className="dashboard">
      <h1>Doctor Dashboard</h1>

      <div className="card-grid">
        <div className="card">My Profile</div>
        <div className="card">Available Slots</div>
        <div className="card">Appointments</div>
        <div className="card">Prescriptions</div>
      </div>
    </div>
  );
}

export default DoctorDashboard;