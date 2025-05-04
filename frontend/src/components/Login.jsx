import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, login: authLogin } = useAuth();

    if (isAuthenticated) {
        navigate('/dashboard');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Trim email and password
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        
        console.log('Attempting login with:', { email: trimmedEmail });
        
        try {
            const response = await login(trimmedEmail, trimmedPassword);
            console.log('Login response:', response);
            
            if (response.token) {
                authLogin(response.token, response.is_merchant);
                console.log('Stored token and merchant status');
                console.log('Redirecting to dashboard...');
                navigate(response.is_merchant ? '/merchant-dashboard' : '/dashboard');
            } else {
                throw new Error('No token received in response');
            }
        } catch (err) {
            console.error('Login error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data?.error || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <h2 className="text-primary">Welcome Back</h2>
                                    <p className="text-muted">Sign in to your account to continue</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="d-flex align-items-center">
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email address</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-envelope"></i>
                                            </span>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="current-password"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mb-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Don't have an account?{' '}
                                            <a href="#" className="text-primary text-decoration-none">
                                                Contact support
                                            </a>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;