import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice";

export default function Header() {
    const { token } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Navbar bg={mode === "dark" ? "dark" : "light"} variant={mode} expand="lg" className="border-bottom sticky-top">
            <Container>
                <Navbar.Brand as={NavLink} to={token ? "/dashboard" : "/"} className="fw-bold">
                    📝 Smart Notes
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar" className="justify-content-end">
                    <Nav className="align-items-center gap-2">
                        <Button
                            variant={mode === "dark" ? "outline-light" : "outline-dark"}
                            size="sm"
                            onClick={() => dispatch(toggleTheme())}
                        >
                            {mode === "dark" ? "☀️" : "🌙"}
                        </Button>
                        {token ? (
                            <>
                                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                                <NavLink className="nav-link" to="/notes">Notes</NavLink>
                                <NavLink className="nav-link" to="/profile">Profile</NavLink>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                                <NavLink className="nav-link" to="/register">Register</NavLink>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
