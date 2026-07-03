import { useParams, Link } from 'react-router-dom';
import { Container, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import reactImage from '../../assets/images/react.png';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const post = response.data;
      
      // Document title based on course title
      document.title = `${post.title} | Course Platform`;

      // Map API post to course details object with matching mocks
      setCourse({
        id: post.id,
        title: post.title,
        description: post.body,
        duration: `${(post.id % 4) + 4} Weeks`,
        instructor: ["Dr. Jane Smith", "Prof. Alan Turing", "Grace Hopper", "Ada Lovelace", "John Doe"][post.id % 5],
        image: reactImage,
        isAvailable: post.id % 3 !== 0,
        seatsAvailable: (post.id * 3) % 15 + 2
      });
    } catch (err) {
      console.error("Error fetching course details:", err);
      document.title = "Course Details | Course Platform";
      setError("Failed to load course details. The course might not exist or there is a server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchCourseDetails();
  }, []);

  // useEffect(() => {
  //   let active = true;
    
  //   // Call asynchronously in a microtask to prevent react-hooks/set-state-in-effect
  //   Promise.resolve().then(() => {
  //     if (active) {
  //       fetchCourseDetails();
  //     }
  //   });

  //   return () => {
  //     active = false;
  //   };
  // }, [fetchCourseDetails]);

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status" className="mb-3" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading details...</span>
        </Spinner>
        <p className="text-muted fw-semibold">Loading course details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5 mb-5">
        <Alert variant="danger" className="d-inline-block text-start p-4 border shadow-sm" style={{ maxWidth: '600px' }}>
          <Alert.Heading className="h4 mb-3">⚠️ Details Not Found</Alert.Heading>
          <p className="mb-3">{error}</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/courses">
              <Button variant="outline-danger">Back to Courses</Button>
            </Link>
            <Button variant="danger" onClick={fetchCourseDetails}>Retry</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5 text-start">
      <div className="mb-4">
        <Link to="/courses" className="text-decoration-none">
          <Button variant="outline-secondary" className="px-3 py-1.5 rounded-pill shadow-sm small fw-semibold">
            ← Back to All Courses
          </Button>
        </Link>
      </div>

      <Card className="mx-auto border border-light-subtle rounded-3 overflow-hidden shadow-sm" style={{ maxWidth: '800px' }}>
        <Card.Img 
          variant="top" 
          src={course.image} 
          alt={course.title} 
          style={{ height: '320px', objectFit: 'cover' }}
        />
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {course.isAvailable ? (
              <span className="badge bg-success px-3 py-2 rounded-pill">Available</span>
            ) : (
              <span className="badge bg-danger px-3 py-2 rounded-pill">Not Available</span>
            )}
            <span className="text-muted font-monospace bg-light border px-2.5 py-1 rounded small">Course ID: {id}</span>
          </div>

          <Card.Title className="h2 fw-bold text-dark mb-3">{course.title}</Card.Title>
          
          <div className="course-detail-meta d-flex flex-wrap gap-4 border-top border-bottom py-3 my-3">
            <div>
              <span className="text-muted block small">⏱️ DURATION</span>
              <div className="fw-semibold text-dark">{course.duration}</div>
            </div>
            <div>
              <span className="text-muted block small">👤 INSTRUCTOR</span>
              <div className="fw-semibold text-dark">{course.instructor}</div>
            </div>
            <div>
              <span className="text-muted block small">🪑 SEATS AVAILABLE</span>
              <div className="fw-semibold text-dark">{course.seatsAvailable}</div>
            </div>
          </div>

          <div className="mb-4 mt-4">
            <h5 className="fw-bold text-secondary mb-2.5">Course Overview</h5>
            <Card.Text className="lead text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {course.description}
            </Card.Text>
          </div>
          
        </Card.Body>
      </Card>
    </Container>
  );
}
