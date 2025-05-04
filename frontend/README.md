# BNPL Dashboard Frontend

This README provides information on how to set up and run the frontend of the BNPL Dashboard application.

## Project Structure

The frontend is built using React and consists of the following main components:

- **public/index.html**: The main HTML file for the application.
- **src/components**: Contains React components for the application:
  - **MerchantDashboard.jsx**: Allows merchants to create and view payment plans.
  - **UserDashboard.jsx**: Allows users to view and manage their installments.
  - **Login.jsx**: Handles user authentication.
- **src/services/api.js**: Contains functions for making API calls to the backend.
- **src/App.js**: The main entry point for the React application, setting up routes and rendering components.

## Getting Started

To get started with the frontend, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd bnpl-dashboard/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js and npm installed. Then run:
   ```
   npm install
   ```

3. **Run the application**:
   Start the development server with:
   ```
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Authentication

The application has separate login flows for merchants and users. Ensure you have the backend running to authenticate users and manage payment plans.

## Security Considerations

- Ensure that API endpoints are secured and that users cannot access other users' plans.
- Implement proper error handling for API calls to enhance user experience.

## Trade-offs

- The date validation for installments is simplified for this implementation due to time constraints.
- The application currently does not include advanced state management; consider using a state management library for larger applications.

## Future Improvements

- Implement overdue calculations to automatically mark installments as "Late".
- Add email notifications for payment reminders using a task queue like Celery.
- Create an analytics dashboard for merchants to view total revenue and overdue plans.

For any issues or contributions, please refer to the main project repository.