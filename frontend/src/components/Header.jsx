import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { isMerchant, logout } = useAuth();

    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand>
                    {isMerchant ? 'Merchant Dashboard' : 'User Dashboard'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Button 
                        variant="outline-danger" 
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header; 