"use client";
import Image from "next/image";
import React, { useState } from "react";
import logoDark from "@/assets/images/logo-dark.svg";
import logo from "@/assets/images/logo.svg";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("login-token", data.token);
      document.cookie = `login-token=${data.token}; path=/; max-age=604800`; // 7 days

      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex min-vh-100 align-items-center">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xxl={3} lg={5} md={6}>
          <a href="/" className="auth-brand d-flex justify-content-center mb-2">
            <Image src={logoDark} alt="dark logo" height={26} className="logo-dark" />
            <Image src={logo} alt="logo light" height={26} className="logo-light" />
          </a>

          <p className="fw-semibold mb-4 text-center text-muted fs-15">
            Welcome Back!
          </p>

          <Card className="overflow-hidden text-center p-xxl-4 p-3 mb-0">
            <h4 className="fw-semibold mb-3 fs-18">Log in to your account</h4>

            <form onSubmit={handleLogin} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-email">
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="example-email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3 position-relative">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label" htmlFor="example-password">
                    Password
                  </label>
                  <a
                    href="/auth/recover-password"
                    className="text-muted border-bottom border-dashed"
                  >
                    Forget Password
                  </a>
                </div>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  id="example-password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="position-absolute end-0 translate-middle-y me-1"
                  style={{ top: "48px", cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IconifyIcon
                    icon={showPassword ? "clarity:eye-line" : "clarity:eye-hide-solid"}
                    width="20"
                    height="20"
                  />
                </span>
              </div>

              {errorMsg && <p className="text-danger small">{errorMsg}</p>}

              <div className="d-grid">
                <button
                  className="btn btn-primary fw-semibold"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
