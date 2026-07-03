import { Outlet, NavLink } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';
import { useEffect } from 'react';

export default function CoursesLayout() {
  useEffect(() => {
    document.title = "Courses | Course Platform";
  }, []);

  return (
    <Container className="my-4">
      <div className="courses-layout-header p-4 mb-4 rounded-3 text-start bg-body-tertiary border shadow-sm">
        <h2 className="display-6 fw-bold mb-2">📚 Course Area</h2>
        <p className="lead text-muted mb-3">
          Explore our dynamic, high-quality courses or create and register a custom course below.
        </p>
        <Nav variant="pills" className="gap-2">
          <Nav.Item>
            <NavLink
              to="/courses"
              end
              className={({ isActive }) => 
                `nav-link px-4 py-2 fw-semibold rounded-pill transition ${
                  isActive 
                    ? 'active-pill bg-primary text-white' 
                    : 'text-secondary hover-bg-light'
                }`
              }
            >
              All Courses
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink
              to="/courses/add"
              className={({ isActive }) => 
                `nav-link px-4 py-2 fw-semibold rounded-pill transition ${
                  isActive 
                    ? 'active-pill bg-primary text-white' 
                    : 'text-secondary hover-bg-light'
                }`
              }
            >
              Add Course
            </NavLink>
          </Nav.Item>
        </Nav>
      </div>
      
      <div className="courses-content py-2">
        <Outlet />
      </div>
    </Container>
  );
}
