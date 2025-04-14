import { Row } from 'react-bootstrap';
import CalendarPage from './components/CalendarPage';
export const metadata = {
  title: 'Calender'
};
const Schedule = () => {
  return <>
      <Row>
        <CalendarPage />
      </Row>
    </>;
};
export default Schedule;