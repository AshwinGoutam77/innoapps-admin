"use client";
import Image from "next/image";
import React, { useState } from "react";
import logoDark from "@/assets/images/logo-dark.svg";
import logo from "@/assets/images/logo.svg";
import { Card, Col, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Add this state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex min-vh-100">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xxl={3} lg={5} md={6}>
          <a href="/" className="auth-brand d-flex justify-content-center mb-2">
            <Image
              src={logoDark}
              alt="dark logo"
              height={26}
              className="logo-dark"
            />
            <Image
              src={logo}
              alt="logo light"
              height={26}
              className="logo-light"
            />
          </a>
          <p className="fw-semibold mb-4 text-center text-muted fs-15">
            Welcome to InnoApps Admin Panel
          </p>
          <Card className="overflow-hidden text-center p-xxl-4 p-3 mb-0">
            <h4 className="fw-semibold mb-3 fs-18">Sign Up to your account</h4>

            <form onSubmit={handleSubmit} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-name">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  id="example-name"
                  name="example-name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="example-email">
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="example-email"
                  name="example-email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label" htmlFor="example-password">
                  Password
                </label>
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
                    icon={
                      showPassword
                        ? "clarity:eye-line"
                        : "clarity:eye-hide-solid"
                    } // Toggle icon
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
                  {loading ? "Registering..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="text-nuted fs-14 mb-0">
              Already have an account?{" "}
              <a href="/auth/login" className="fw-semibold text-danger ms-1">
                Login !
              </a>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
