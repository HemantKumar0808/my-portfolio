# Portfolio Project

This is a Spring Boot-based portfolio application that includes a contact form and resume download functionality.

## Features

- Contact form: Allows users to send messages, which are stored in the database.
- Resume download: Provides a downloadable PDF resume.
- Rate limiting: Prevents abuse with IP-based rate limiting.
- Email validation: Ensures valid email addresses.

## Deployment

The application is deployed on Railway (https://my-portfolio-production-01.up.railway.app).

## Contact Form Email Issue

**Important Note:** The contact form currently does not send emails due to Railway's network restrictions.

### Reason:
Railway, by default, blocks outbound SMTP connections for security reasons. This prevents the application from connecting to external email servers like Gmail or SendGrid to send emails. Even after enabling IPv6 egress on the Railway service, the email functionality may still fail if:
- SMTP credentials are incorrect.
- Two-factor authentication (2FA) is not properly configured (e.g., using an App Password for Gmail).
- The email service provider has additional restrictions.

### Current Behavior:
- The contact form validates the input and saves the message to the database.
- No emails are sent to the site owner or the sender.
- This ensures the form works without timeouts or failures.

### Future Plans:
When resources allow, integrate a reliable email service (e.g., SendGrid, Mailgun, or AWS SES) that works within Railway's constraints or consider migrating to a platform with better SMTP support.

## Technologies Used

- Java 17
- Spring Boot
- Spring Data JPA
- H2 Database (for development)
- Maven
- Bucket4j (for rate limiting)

## API Endpoints

- `POST /api/contact`: Submit a contact message.
- `GET /api/resume/download`: Download the resume PDF.</content>
