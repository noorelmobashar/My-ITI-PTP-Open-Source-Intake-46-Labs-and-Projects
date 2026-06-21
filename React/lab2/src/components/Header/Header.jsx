import { Navbar, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
export default function Header() {
  return (
    <>
        <header className='header'>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Logo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink className="nav-link" to={"/"} end>Home</NavLink>
                        <NavLink className="nav-link" to={"/courses"}>Courses</NavLink>
                        <NavLink className="nav-link" to={"/about"}>About</NavLink>
                        <NavLink className="nav-link" to={"/settings"}>Settings</NavLink>
                        <NavLink className="nav-link" to={"/contact"}>Contact</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    </>
  )
}

