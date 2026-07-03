import { Button, Card, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({
  id,
  title,
  duration,
  instructor = "John Doe",
  description = "Learn modern web technologies from scratch.",
  isAvailable = true,
  seatsAvailable = 10,
  image
}) {
  let [currentUserReservations, setCurrentUserReservations] = useState(0);
  let [isFavorite, setIsFavorite] = useState(false);
  
  const increaseCurrentUserReservations = () => {
    if (currentUserReservations < seatsAvailable) {
      setCurrentUserReservations(currentUserReservations + 1);
    }
  };

  const decreaseCurrentUserReservations = () => {
    if (currentUserReservations > 0) {
      setCurrentUserReservations(currentUserReservations - 1);
    }
  };

  useEffect(() => {
    if (currentUserReservations > 0 && currentUserReservations === seatsAvailable) {
      const timer = setTimeout(() => {
        alert(`You have reserved all available seats for "${title}"!`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentUserReservations, seatsAvailable, title]);

  return (
    <Card className="course-card h-100 shadow-sm border border-light-subtle rounded-3 overflow-hidden text-start transition-transform">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={image} 
          alt={title} 
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          {isAvailable ? (
            <Badge bg="success" className="px-2 py-1.5 rounded-pill shadow-sm">Available</Badge>
          ) : (
            <Badge bg="danger" className="px-2 py-1.5 rounded-pill shadow-sm">Full / Closed</Badge>
          )}
        </div>
        <div className="position-absolute top-0 end-0 m-2">
          <Button
            variant={isFavorite ? "danger" : "light"}
            size="sm"
            className="rounded-circle shadow-sm p-1.5 d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setIsFavorite(!isFavorite)}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </Button>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-4">
        <Card.Title className="h5 fw-bold text-dark text-truncate-2 mb-2" style={{ minHeight: '48px', lineHeight: '1.3' }} title={title}>
          {title}
        </Card.Title>
        
        <Card.Text className="text-muted small text-truncate-3 mb-3 flex-grow-1" style={{ minHeight: '60px' }}>
          {description}
        </Card.Text>
        
        <div className="course-details-info border-top border-bottom py-2 my-2 small text-secondary">
          <div className="d-flex justify-content-between mb-1">
            <span>⏱️ <strong>Duration:</strong> {duration}</span>
            <span>👤 <strong>Instructor:</strong> {instructor}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>🪑 <strong>Total Seats:</strong> {seatsAvailable}</span>
            <span>🎟️ <strong>Reserved:</strong> {currentUserReservations}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
          <div className="d-flex gap-1 align-items-center">
            <Button
              variant="outline-primary"
              size="sm"
              className="fw-bold px-3 py-1 rounded-pill"
              onClick={increaseCurrentUserReservations}
              disabled={!isAvailable || currentUserReservations >= seatsAvailable}
            >
              +
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="fw-bold px-3 py-1 rounded-pill"
              onClick={decreaseCurrentUserReservations}
              disabled={!isAvailable || currentUserReservations <= 0}
            >
              -
            </Button>
          </div>
          
          <Link to={`/courses/${id}`}>
            <Button variant="primary" size="sm" className="px-3 py-1.5 rounded-pill fw-semibold shadow-sm">
              View Details →
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
