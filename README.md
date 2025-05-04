# BNPL Dashboard

A Buy Now, Pay Later (BNPL) dashboard where merchants can create payment plans and users can manage their installments.

## Features

### Core Features
- **Merchant Dashboard**
  - Create payment plans with total amount and number of installments
  - View analytics (total revenue, active plans, success rate)
  - Monitor overdue installments
  - Track payment status in real-time

- **User Dashboard**
  - View payment plans and installments
  - Make payments for pending installments
  - Track payment status with color-coded indicators
  - Receive email notifications for upcoming and overdue payments

### User Management
- **Django Admin Interface**
  - Create and manage users through the admin panel
  - Set user type using the `is_merchant` boolean flag:
    - `is_merchant = True`: User can access merchant dashboard and create payment plans
    - `is_merchant = False`: User can access user dashboard and manage installments
  - Manage user permissions and access levels
  - View and edit user details, including email and password

### Technical Features
- JWT-based authentication with separate merchant/user flows
- Role-based access control (Merchant/User)
- Automated installment generation with equal monthly payments
- Overdue installment tracking and automatic status updates
- Real-time status updates using Django signals
- Email notifications using Celery for:
  - Payment reminders (3 days before due date)
  - Overdue payment notifications
  - Automatic status updates

## Security Considerations

### API Security
1. **Authentication & Authorization**
   - JWT-based authentication with refresh tokens
   - Role-based access control (RBAC) for merchants and users
   - Custom permission classes to ensure users can only access their own plans
   - Token expiration and refresh mechanisms

2. **Data Protection**
   - Input validation and sanitization for all API endpoints
   - SQL injection prevention through Django ORM
   - XSS protection through Django's built-in security features
   - CSRF protection for all forms and API endpoints

3. **Payment Security**
   - All payment operations are simulated for demonstration
   - In production, would implement:
     - PCI DSS compliance
     - Payment gateway integration (e.g., Stripe, PayPal)
     - Tokenization for sensitive payment data
     - Encryption for data in transit (HTTPS) and at rest
     - Regular security audits and penetration testing

4. **Rate Limiting & DDoS Protection**
   - API rate limiting to prevent abuse
   - IP-based access restrictions
   - Request throttling for sensitive endpoints
   - DDoS protection through cloud services

5. **Monitoring & Logging**
   - Comprehensive logging of all API requests
   - Audit trails for payment operations
   - Real-time monitoring of suspicious activities
   - Automated alerts for security incidents

## Production Security Checklist

1. **Environment Configuration**
   ```python
   # settings.py
   DEBUG = False
   ALLOWED_HOSTS = ['your-domain.com']
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   SECURE_BROWSER_XSS_FILTER = True
   SECURE_CONTENT_TYPE_NOSNIFF = True
   X_FRAME_OPTIONS = 'DENY'
   ```

2. **Payment Gateway Integration**
   - Use official SDKs for payment gateways
   - Implement proper error handling
   - Store only necessary payment information
   - Regular security updates

3. **Database Security**
   - Use production-grade database (PostgreSQL)
   - Regular backups
   - Encryption at rest
   - Access control and monitoring

4. **API Security**
   - Implement API versioning
   - Use API keys for third-party access
   - Rate limiting and throttling
   - Request validation and sanitization

## Trade-offs and Limitations

1. **Date Validation**
   - Simplified date handling for demonstration
   - In production, would implement:
     - Timezone handling
     - Business day calculations
     - Holiday calendars
     - Grace period management

2. **Payment Processing**
   - Simulated payments for demonstration
   - Production would require:
     - Payment gateway integration
     - Refund handling
     - Dispute resolution
     - Payment verification
     - Transaction history

3. **Analytics**
   - Basic analytics implemented
   - Could be enhanced with:
     - Custom date ranges
     - Export functionality
     - Advanced filtering
     - Real-time updates
     - Custom reports

4. **Scalability**
   - Current implementation suitable for small to medium scale
   - Production would require:
     - Caching layer
     - Database optimization
     - Load balancing
     - Microservices architecture for payment processing

## Setup Instructions

### Backend Setup
1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configure email settings in `settings.py`:
   ```python
   EMAIL_HOST_USER = 'your-email@gmail.com'
   EMAIL_HOST_PASSWORD = 'your-app-password'
   DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
   ```

4. Set up Redis for Celery:
   ```bash
   sudo apt-get install redis-server
   sudo systemctl start redis
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Access Django Admin:
   - Start the development server: `python manage.py runserver`
   - Visit `http://127.0.0.1:8000/admin/`
   - Log in with your superuser credentials
   - Navigate to "Users" section to:
     - Create new users
     - Set `is_merchant` flag for merchant access
     - Manage user permissions

8. Start Celery worker and beat (in separate terminals):
   ```bash
   celery -A bnpl_dashboard worker -l info
   celery -A bnpl_dashboard beat -l info
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# BNPL-Dashboard
