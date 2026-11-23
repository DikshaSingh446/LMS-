import Navbar from "../components/Navbar";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <h3 className="text-center mt-5">Please login first</h3>;
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card p-4 mb-4">

          <h2>Welcome, {user.name} 👋</h2>

          <p className="text-muted">
            Role: <strong>{user.role}</strong>
          </p>

        </div>

        {user.role === "admin" && (

          <div className="card p-4 mb-3">

            <h4>Admin Panel</h4>

            <p>
              You can manage users and courses.
            </p>

          </div>

        )}

        {user.role === "teacher" && (

          <div className="card p-4 mb-3">

            <h4>Teacher Panel</h4>

            <p>
              You can create assignments and manage courses.
            </p>

          </div>

        )}

        {user.role === "student" && (

          <div className="card p-4 mb-3">

            <h4>Student Panel</h4>

            <p>
              You can view courses and submit assignments.
            </p>

          </div>

        )}

      </div>
    </>
  );
}

export default Dashboard;