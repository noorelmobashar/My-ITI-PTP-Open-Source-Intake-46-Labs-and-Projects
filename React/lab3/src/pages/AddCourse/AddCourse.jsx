import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import reactImage from '../../assets/images/react.png';

export default function AddCourse() {
  const [successData, setSuccessData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
      duration: '',
      instructor: '',
      description: ''
    }
  });

  useEffect(() => {
    document.title = "Add Course | Course Platform";
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg("");
    setSuccessData(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setSuccessMsg("🎉 Success! Your course has been registered in the system.");
      setSuccessData(data);
      
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-course-container my-4 text-start">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="shadow-sm border border-light-subtle rounded-3 p-4 mb-4 bg-white">
            <Card.Body>
              <div className="border-bottom pb-3 mb-4">
                <h3 className="h4 fw-bold text-dark m-0">➕ Register a New Course</h3>
                <p className="text-muted small m-0 mt-1">Please fill in the course details below. All fields are required.</p>
              </div>

              {successMsg && (
                <Alert variant="success" className="d-flex flex-column gap-2 shadow-sm border-success-subtle p-3 mb-4">
                  <span className="fw-semibold">{successMsg}</span>
                  {successData && (
                    <div className="small mt-2 p-2 rounded bg-success bg-opacity-10 border border-success-subtle">
                      <strong>Registered Title:</strong> {successData.title} <br />
                      <strong>Instructor:</strong> {successData.instructor} | <strong>Duration:</strong> {successData.duration}
                    </div>
                  )}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3" controlId="formCourseTitle">
                  <Form.Label className="fw-semibold text-secondary">Course Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Mastering Next.js"
                    className={`py-2 ${errors.title ? 'is-invalid' : ''}`}
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters long' }
                    })}
                  />
                  {errors.title && (
                    <Form.Control.Feedback type="invalid" className="fw-semibold">
                      {errors.title.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Row>
                  {/* Duration Field */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCourseDuration">
                      <Form.Label className="fw-semibold text-secondary">Duration</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. 8 Weeks"
                        className={`py-2 ${errors.duration ? 'is-invalid' : ''}`}
                        {...register('duration', {
                          required: 'Duration is required'
                        })}
                      />
                      {errors.duration && (
                        <Form.Control.Feedback type="invalid" className="fw-semibold">
                          {errors.duration.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCourseInstructor">
                      <Form.Label className="fw-semibold text-secondary">Instructor Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Noor Elmobashar"
                        className={`py-2 ${errors.instructor ? 'is-invalid' : ''}`}
                        {...register('instructor', {
                          required: 'Instructor is required',
                          minLength: { value: 3, message: 'Instructor name must be at least 3 characters long' }
                        })}
                      />
                      {errors.instructor && (
                        <Form.Control.Feedback type="invalid" className="fw-semibold">
                          {errors.instructor.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="formCourseDescription">
                  <Form.Label className="fw-semibold text-secondary">Course Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write a brief overview of the course curriculum and objectives (minimum 10 characters)..."
                    className={`py-2 ${errors.description ? 'is-invalid' : ''}`}
                    {...register('description', {
                      required: 'Description is required',
                      minLength: { value: 10, message: 'Description must be at least 10 characters long' }
                    })}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid" className="fw-semibold">
                      {errors.description.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  <Button 
                    variant="outline-secondary" 
                    type="button" 
                    onClick={() => { reset(); setSuccessMsg(""); setSuccessData(null); }}
                    className="px-4 py-2 rounded-pill"
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="px-5 py-2 rounded-pill fw-semibold shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Add Course'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {successData && (
          <Col lg={4} md={10} className="mb-4">
            <Card className="border border-success rounded-3 overflow-hidden shadow-sm h-100 bg-white">
              <div className="bg-success text-white px-3 py-2 small fw-bold text-center">
                LIVE PREVIEW: NEWLY REGISTERED COURSE
              </div>
              <img 
                src={reactImage} 
                className="card-img-top" 
                alt="New Course Cover" 
                style={{ height: '160px', objectFit: 'cover' }}
              />
              <Card.Body className="p-4 d-flex flex-column h-100">
                <Card.Title className="h5 fw-bold text-dark text-truncate-2 mb-2">
                  {successData.title}
                </Card.Title>
                <Card.Text className="text-muted small text-truncate-3 mb-3 flex-grow-1">
                  {successData.description}
                </Card.Text>
                
                <div className="border-top pt-2 small text-secondary">
                  <div className="d-flex justify-content-between mb-1">
                    <span>⏱️ <strong>Duration:</strong> {successData.duration}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>👤 <strong>Instructor:</strong> {successData.instructor}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
