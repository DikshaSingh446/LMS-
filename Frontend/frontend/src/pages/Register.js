import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleRegister = async () => {

    try {

      if (!form.name || !form.email || !form.password) {
        alert("Please fill all fields");
        return;
      }

      await API.post("/auth/register", form);

      alert("Registered Successfully");

      navigate("/");

    } catch (err) {

      console.log(err);
      alert("Registration Failed");

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card p-4">

            <h3 className="mb-3 text-center">
              Register
            </h3>

            <input
              className="form-control mb-2"
              placeholder="Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="form-control mb-3"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >

              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>

            </select>

            <button
              className="btn btn-primary w-100"
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="mt-3 text-center">

              Already have an account?

              <Link to="/"> Login</Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;