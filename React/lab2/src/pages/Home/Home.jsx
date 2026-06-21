import Hero from '../../components/Hero/Hero'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Home() {
  // Bonus: Change document.title based on the current page using useEffect
  useEffect(() => {
    document.title = "Home | Course Platform";
  }, []);

  return (
    <>
        <Hero />
        <Container className='text-center mt-5 mb-5'>
          <h2>Start Your Learning Journey</h2>
          <p className="lead mb-4">
            Discover a wide range of courses tailored to help you master new skills and advance your career.
          </p>
          <Link to="/courses">
            <Button variant="primary" size="lg">
              Explore Courses
            </Button>
          </Link>
        </Container>
    </>
  )
}
