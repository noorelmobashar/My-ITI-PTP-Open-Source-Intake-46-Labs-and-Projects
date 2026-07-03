import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import CourseCard from '../../components/CourseCard/CourseCard';
import reactImage from '../../assets/images/react.png';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const firstTen = response.data.slice(0, 10);
      
      const mappedCourses = firstTen.map(post => ({
        id: post.id,
        title: post.title,
        description: post.body,
        duration: `${(post.id % 4) + 4} Weeks`,
        instructor: ["Dr. Jane Smith", "Prof. Alan Turing", "Grace Hopper", "Ada Lovelace", "John Doe"][post.id % 5],
        image: reactImage,
        isAvailable: post.id % 3 !== 0,
        seatsAvailable: (post.id * 3) % 15 + 2
      }));
      
      setCourses(mappedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try checking your internet connection or try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "All Courses | Course Platform";
    let active = true;
    
    Promise.resolve().then(() => {
      if (active) {
        fetchCourses();
      }
    });

    return () => {
      active = false;
    };
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status" className="mb-3" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted fw-semibold">Loading courses from server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5 text-center">
        <Alert variant="danger" className="d-inline-block text-start p-4 border shadow-sm" style={{ maxWidth: '600px' }}>
          <Alert.Heading className="h4 mb-3">⚠️ Connection Error</Alert.Heading>
          <p className="mb-3">{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={fetchCourses}>
              Retry Fetching
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 text-start">
        <h3 className="h4 fw-bold text-dark">Available Subscriptions ({courses.length})</h3>
        <p className="text-muted m-0 small">Showing courses loaded via Axios</p>
      </div>

      <Row className="g-4 justify-content-center">
        {courses.map(course => (
          <Col key={course.id} xs={12} sm={6} md={6} lg={4} className="d-flex justify-content-center">
            <CourseCard
              id={course.id}
              title={course.title}
              duration={course.duration}
              instructor={course.instructor}
              description={course.description}
              isAvailable={course.isAvailable}
              seatsAvailable={course.seatsAvailable}
              image={course.image}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
