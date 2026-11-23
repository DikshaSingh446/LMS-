import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

      <div className="container">

        <Link className="navbar-brand" to="/dashboard">
          LMS System
        </Link>

        <div className="navbar-nav">

          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link" to="/courses">
            Courses
          </Link>

          <Link className="nav-link" to="/assignments">
            Assignments
          </Link>

        </div>

        <div className="d-flex align-items-center">

          <span className="text-warning me-3">
            {user?.role}
          </span>

          <button
            className="btn btn-danger btn-sm"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>

  );
}

export default Navbar;