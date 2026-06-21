import {Container, Row, Col} from 'react-bootstrap'
export default function Hero() {
  return <>
    <Container>
      <Row>
        <Col>
          <div className="p-5 mb-4 bg-light rounded-3">
            <h1 className="display-4">Welcome to Our Website</h1>
            <p className="lead">This is a simple hero unit, a simple component for calling extra attention to featured content or information.</p>
          </div>
        </Col>
      </Row>
    </Container>
  </>
}
