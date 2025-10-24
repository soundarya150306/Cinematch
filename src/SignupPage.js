import React, { useState } from "react";

function SignupPage({ onSignup, onLoginClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    onSignup(email);  // Simulate signup success with email as user
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
          required
        />
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            backgroundColor: "#0078d4",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Sign Up
        </button>
      </form>
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#b5f6fd",
          fontSize: 15,
          opacity: 0.93,
        }}
      >
        Already have an account?{" "}
        <button
          type="button"
          style={{
            color: "#69a6ff",
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "inherit",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={onLoginClick}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
