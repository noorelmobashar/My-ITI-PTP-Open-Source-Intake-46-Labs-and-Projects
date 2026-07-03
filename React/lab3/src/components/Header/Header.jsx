import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header shadow-sm border-bottom bg-white sticky-top">
      <Navbar bg="white" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold text-primary fs-4 d-flex align-items-center gap-2">
            🎓 <span className="logo-text text-dark">CoursePlatform</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="gap-2 align-items-center">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 py-2 rounded-pill fw-semibold transition ${isActive ? 'active-link' : ''}`}
                to="/" 
                end
              >
                Home
              </NavLink>
              <NavLink 
                className={({ isActive }) => `nav-link px-3 py-2 rounded-pill fw-semibold transition ${isActive ? 'active-link' : ''}`}
                to="/courses"
              >
                Courses
              </NavLink>
              <NavLink 
                className={({ isActive }) => `nav-link px-3 py-2 rounded-pill fw-semibold transition ${isActive ? 'active-link' : ''}`}
                to="/about"
              >
                About
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
