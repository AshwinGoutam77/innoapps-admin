"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import logoDark from '@/assets/images/logo-dark.svg';
import logo from '@/assets/images/logo.svg';
import { Card, Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token); // store token (or use cookie if preferred)
      router.push('/dashboard'); // redirect on successful login

    } catch (err) {
      setErrorMsg(err.message);
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
          <p className="fw-semibold mb-4 text-center text-muted fs-15">Welcome Back!</p>
          <Card className="overflow-hidden text-center p-xxl-4 p-3 mb-0">
            <h4 className="fw-semibold mb-3 fs-18">Log in to your account</h4>

            <form onSubmit={handleLogin} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-email">Email</label>
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
              <div className="mb-3">
                <div className='d-flex align-items-center justify-content-between'>
                  <label className="form-label" htmlFor="example-password">Password</label>
                  <a href="/auth/recover-password" className="text-muted border-bottom border-dashed">Forget Password</a>
                </div>
                <input
                  required
                  type="password"
                  id="example-password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMsg && (
                <p className="text-danger small">{errorMsg}</p>
              )}
              <div className="d-flex justify-content-end mb-3">
                {/* <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                  <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                </div> */}

              </div>
              <div className="d-grid">
                <button className="btn btn-primary fw-semibold" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
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
