import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  
  useEffect(() => {
    document.title = "404 Not Found | Course Platform";
  }, []);

  return (
    <Container className="text-center mt-5 mb-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p className="lead mb-4">The page you are looking for does not exist or has been moved.</p>
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </Container>
  );
}
