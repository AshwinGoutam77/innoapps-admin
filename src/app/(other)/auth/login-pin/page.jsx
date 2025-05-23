import logoDark from '@/assets/images/logo-dark.png';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import { Card, Col, Row } from 'react-bootstrap';
const LoginPinPage = () => {
  return <div className="auth-bg d-flex min-vh-100">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xxl={3} lg={5} md={6}>
          <a href="/" className="auth-brand d-flex justify-content-center mb-2">
            <Image src={logoDark} alt="dark logo" height={26} className="logo-dark" />
            <Image src={logo} alt="logo light" height={26} className="logo-light" />
          </a>
          <p className="fw-semibold mb-4 text-center text-muted fs-15">Admin Panel Design by Coderthemes</p>
          <Card className="overflow-hidden text-center p-xxl-4 p-3 mb-0">
            <h4 className="fw-semibold mb-2 fs-20">Login with PIN</h4>
            <p className="text-muted mb-4">We sent you a code, please enter it below to verify <br />your number
              <span className="link-dark fs-13 fw-medium">&nbsp;+ (12) 345-678-912</span>
            </p>
            <form action="/" className="text-start mb-3">
              <label className="form-label" htmlFor="code">Enter 6 Digit Code</label>
              <div className="d-flex gap-2 mt-1 mb-3">
                <input type="text" maxLength={1} className="form-control text-center" />
                <input type="text" maxLength={1} className="form-control text-center" />
                <input type="text" maxLength={1} className="form-control text-center" />
                <input type="text" maxLength={1} className="form-control text-center" />
                <input type="text" maxLength={1} className="form-control text-center" />
                <input type="text" maxLength={1} className="form-control text-center" />
              </div>
              <div className="mb-3 d-grid">
                <button className="btn btn-primary fw-semibold" type="submit">Continue</button>
              </div>
              <p className="mb-0 text-center">Don't received code yet? <a href="#!" className="link-primary fw-semibold text-decoration-underline">Send again</a></p>
            </form>
            <p className="text-muted fs-14 mb-0">Back To <a href="/" className="fw-semibold text-danger ms-1">Home!</a></p>
          </Card>
          <p className="mt-4 text-center mb-0">
            © Adminto - By <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">Coderthemes</span>
          </p>
        </Col>
      </Row>
    </div>;
};
export default LoginPinPage;