import { Col, Row } from 'react-bootstrap';
import InvoicesCard from './components/InvoicesCard';
export const metadata = {
  title: 'Invoices'
};
const InvoicesPage = () => {
  return <>
      <Row>
        <Col xs={12}>
          <InvoicesCard />
        </Col>
      </Row>
    </>;
};
export default InvoicesPage;