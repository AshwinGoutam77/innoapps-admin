import React from 'react';
import State from './components/State';
import State2 from './components/State2';
import State3 from './components/State3';
import Count from './components/Count';
import Team from './components/Team';
import Profile from './components/Profile';
import Progress from './components/Progress';
import Reminders from './components/Reminders';
import { Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Wallet'
};
const WalletPage = () => {
  return <>
      <State />
      <State2 />
      <State3 />
      <Count />
      <Row>
        <Col xl={3} md={6}>
          <Team />
        </Col>
        <Col xl={3} md={6}>
          <Profile />
        </Col>
        <Col xl={3} md={6}>
          <Progress />
        </Col>
        <Col xl={3} md={6}>
          <Reminders />
        </Col>
      </Row>
    </>;
};
export default WalletPage;