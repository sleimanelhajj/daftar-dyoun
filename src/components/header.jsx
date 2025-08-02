import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" sticky="top"> 
      <Container fluid className="px-2">
        <Navbar.Brand href="#home">Daftar Dyoun</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/dyoun">Dyoun</Nav.Link>
            <Nav.Link as={NavLink} to="/msarif">Msarif</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
    }

export default Header;