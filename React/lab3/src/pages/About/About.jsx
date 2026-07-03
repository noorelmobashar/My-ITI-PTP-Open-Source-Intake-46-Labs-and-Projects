import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function About() {
  useEffect(() => {
    document.title = "About | Course Platform";
  }, []);

  return (
    <Container className="my-5 text-start">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border border-light-subtle">
        <h1 className="display-5 fw-bold text-dark mb-3">About Our Course Platform</h1>
        <p className="lead text-muted col-md-10 fs-5 mb-0">
          We are dedicated to providing high-quality, accessible, and structured educational resources for students worldwide. Our platform uses state-of-the-art APIs and modern UI components to deliver a seamless learning experience.
        </p>
      </div>

      <Row className="g-4 mt-2">
        <Col md={4}>
          <Card className="h-100 border border-light-subtle shadow-sm p-3">
            <Card.Body>
              <div className="fs-1 mb-2">🚀</div>
              <Card.Title className="fw-bold text-dark">Our Mission</Card.Title>
              <Card.Text className="text-muted">
                To empower learners by providing structured, industry-relevant courses that build real-world software engineering and design skills.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border border-light-subtle shadow-sm p-3">
            <Card.Body>
              <div className="fs-1 mb-2">🎯</div>
              <Card.Title className="fw-bold text-dark">Our Method</Card.Title>
              <Card.Text className="text-muted">
                Applying modular learning systems, code examples, interactive tools, and live projects that fit easily into any schedule.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 border border-light-subtle shadow-sm p-3">
            <Card.Body>
              <div className="fs-1 mb-2">✨</div>
              <Card.Title className="fw-bold text-dark">Our Stack</Card.Title>
              <Card.Text className="text-muted">
                Built with modern React, React Router nested routing, React Hook Form validation, Axios API integration, and Bootstrap styling.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
