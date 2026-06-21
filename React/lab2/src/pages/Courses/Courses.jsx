import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CourseCard from '../../components/CourseCard/CourseCard';
import { coursesData } from '../../data/coursesData';

export default function Courses() {

  useEffect(() => {
    console.log('Courses Page Mounted');
    document.title = "Courses | Course Platform";
    return () => {
      console.log('Courses Page Unmounted');
    };
  }, []);



  return (
    <Container className="mt-5 mb-5 text-center">
      <h2 className="mb-4">Available Courses</h2>


      <Row className="g-4 justify-content-center">
        {coursesData.map(course => (
          <Col key={course.id} xs={12} sm={6} md={4} className="d-flex justify-content-center">
            <CourseCard
              id={course.id}
              title={course.title}
                duration={course.duration}
                description={course.description}
                isAvailable={course.isAvailable}
                seatsAvailable={course.seatsAvailable}
                image={course.image}
              />
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}
