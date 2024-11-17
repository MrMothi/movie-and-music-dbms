import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "admin1" && password === "adminpassword") {
      navigate("/AdminHome");
    }

    if (username === "user1" && password === "userpassword") {
      navigate("/UserHome");
    } else {
      setError("Invalid creds");
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

        <div className="linkToSignup">
          <label>Don't have an account?</label>
          <Link to="/signup">Sign up!</Link>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
