import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/loginForm.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Temporary users
    if (username === "admin1" && password === "adminpassword") {
      navigate("/Admin");
    }

    if (username === "user1" && password === "userpassword") {
      navigate("/User");
    } else {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="formContainer">
      <form className="login" onSubmit={handleSubmit}>
        <h3> Log in </h3>

        <label>Username: </label>
        <input
          type="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />

        <label>Password: </label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button>Log in</button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
