import react_image from '../assets/images/react.png'
import { Button, Container, Row, Col } from 'react-bootstrap'
export default function CourseCard() {

  const title = "React Course"; 
  const description = "Learn React from scratch";
  const duration = "4 weeks";
  const isAvailable = true;

  return <>
    <Container>
      <Row>
        <Col>
          <div className="card" style={{ width: "18rem" }}>
            <img src={react_image} className="card-img-top" alt="React" />
            <div className="card-body">
              {isAvailable ? <span className="badge bg-success">Available</span> : <span className="badge bg-danger">Not Available</span>}
              <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <p className="card-text">Duration: {duration}</p>
            <Button variant="primary" className='mt-2'>Enroll Now</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </>
}
