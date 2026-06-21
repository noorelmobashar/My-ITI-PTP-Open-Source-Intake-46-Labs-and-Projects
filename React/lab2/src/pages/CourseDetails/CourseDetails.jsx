import { useParams, Link } from 'react-router-dom';
import { Container, Button, Card } from 'react-bootstrap';
import { useEffect } from 'react';
import { coursesData } from '../../data/coursesData';

export default function CourseDetails() {
  const { id } = useParams();
  const course = coursesData.find(c => c.id === parseInt(id));

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | Course Platform`;
    } else {
      document.title = "Course Details | Course Platform";
    }
  }, [course]);

  if (!course) {
    return (
      <Container className="text-center mt-5 mb-5">
        <h2>Course Not Found</h2>
        <p className="lead">The course with ID {id} does not exist.</p>
        <Link to="/courses">
          <Button variant="primary">Back to Courses</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5 text-center">
      <Card className="mx-auto text-start" style={{ maxWidth: '600px' }}>
        <Card.Img variant="top" src={course.image} alt={course.title} />
        <Card.Body>
          <Card.Title className="h2 mb-3">{course.title}</Card.Title>
          <Card.Text className="text-muted"><strong>Duration:</strong> {course.duration}</Card.Text>
          <Card.Text className="lead mb-4">{course.description}</Card.Text>
          <Card.Text>
            <strong>Status: </strong>
            {course.isAvailable ? (
              <span className="badge bg-success">Available</span>
            ) : (
              <span className="badge bg-danger">Not Available</span>
            )}
          </Card.Text>
          <Card.Text>
            <strong>Seats Available: </strong> {course.seatsAvailable}
          </Card.Text>
          
          <hr />
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link to="/courses">
              <Button variant="secondary">Back to Courses</Button>
            </Link>
            <span className="text-muted font-monospace">Course ID: {id}</span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
