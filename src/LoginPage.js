import React, { useState } from "react";

function LoginPage({ onLogin, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setErr("Please enter both email and password.");
      return;
    }
    setErr("");
    if (onLogin) onLogin(email);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background:
          "linear-gradient(120deg, #101a2c 0%, #1c274e 75%, #263e7d 100%)",
      }}
    >
      <div
        style={{
          background: "rgba(24,26,36,0.96)",
          padding: 36,
          borderRadius: 20,
          boxShadow: "0 8px 40px #1b284888",
          width: 370,
          maxWidth: "98vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#73b3ff",
            textAlign: "center",
            marginBottom: 26,
            letterSpacing: 2,
            textShadow: "2px 4px 16px #27498655",
          }}
        >
          CineMatch+ 
        </div>
        <form onSubmit={handleSubmit}>
          <label
            style={{
              color: "#aedefc",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 7,
            }}
          >
            Email
          </label>
          <input
            type="email"
            autoComplete="username"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "#161b26",
              border: "1.5px solid #38477c",
              borderRadius: 10,
              padding: "12px 13px",
              marginBottom: 18,
              width: "100%",
              fontSize: 16,
              color: "#e6f6ff",
              outline: "none",
              transition: "border-color .18s",
            }}
            required
          />
          <label
            style={{
              color: "#aedefc",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 7,
            }}
          >
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "#161b26",
              border: "1.5px solid #38477c",
              borderRadius: 10,
              padding: "12px 13px",
              marginBottom: 14,
              width: "100%",
              fontSize: 16,
              color: "#e6f6ff",
              outline: "none",
            }}
            required
          />
          <div
            style={{
              color: "#f55",
              fontWeight: 500,
              fontSize: 15,
              textAlign: "center",
              marginBottom: err ? 12 : 4,
              minHeight: 22,
            }}
          >
            {err}
          </div>
          <button
            type="submit"
            style={{
              marginTop: 10,
              width: "100%",
              padding: "12px 0",
              background:
                "linear-gradient(90deg, #297cff 50%, #17c2be 100%)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 17,
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 2.5px 20px #1b284822",
              transition: "background 0.18s",
            }}
          >
            Log In
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
          New to CineMatch+?{" "}
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
            onClick={onSignupClick}
          >
            Sign up here!
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
