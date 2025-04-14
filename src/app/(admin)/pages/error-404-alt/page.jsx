import Error404Alt from '@/assets/images/error/error-404.png';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Error 404'
};
const Error404AltPage = () => {
  return <>
      <Row className="justify-content-center">
        <Col lg={4}>
          <div className="text-center">
            <Image src={Error404Alt} height={230} alt="File not found Image" />
            <h4 className="text-uppercase text-danger mt-3">Page Not Found</h4>
            <p className="text-muted mt-3">It's looking like you may have taken a wrong turn. Don't worry...
              it
              happens to the best of us. Here's a
              little tip that might help you get back on track.</p>
            <a className="btn btn-info mt-3" href="/"><IconifyIcon icon='tabler:home' className="me-1" /> Return
              Home</a>
          </div>
        </Col>
      </Row>
    </>;
};
export default Error404AltPage;