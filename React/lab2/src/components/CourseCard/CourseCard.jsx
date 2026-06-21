import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({
  id,
  title,
  duration,
  description = "Learn React from scratch",
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
        alert("You have reserved all available seats for this course!");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentUserReservations, seatsAvailable]);

  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body text-start">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {isAvailable ? (
            <span className="badge bg-success">Available</span>
          ) : (
            <span className="badge bg-danger">Not Available</span>
          )}
          <Button
            variant={isFavorite ? "danger" : "outline-danger"}
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorite ? "Added ❤" : "Add ❤"}
          </Button>
        </div>
        <h5 className="card-title text-truncate" title={title}>{title}</h5>
        <p className="card-text text-truncate">{description}</p>
        <p className="card-text"><strong>Duration:</strong> {duration}</p>
        <p className="card-text"><strong>Seats Available:</strong> {seatsAvailable}</p>
        <p className="card-text"><strong>Your Reservations:</strong> {currentUserReservations}</p>
        
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={increaseCurrentUserReservations}
              disabled={!isAvailable || currentUserReservations >= seatsAvailable}
            >
              +
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={decreaseCurrentUserReservations}
              disabled={!isAvailable || currentUserReservations <= 0}
            >
              -
            </Button>
          </div>
          <Link to={`/courses/${id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
