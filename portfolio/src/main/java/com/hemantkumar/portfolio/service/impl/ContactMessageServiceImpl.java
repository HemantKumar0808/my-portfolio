package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.entity.ContactMessage;
import com.hemantkumar.portfolio.exception.InvalidEmailException;
import com.hemantkumar.portfolio.exception.RateLimitException;
import com.hemantkumar.portfolio.repository.ContactMessageRepository;
import com.hemantkumar.portfolio.requestDto.ContactMessageRequest;
import com.hemantkumar.portfolio.service.ContactMessageService;
import com.hemantkumar.portfolio.service.EmailService;
import com.hemantkumar.portfolio.service.EmailValidationService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository repository;
    private final EmailService emailService;
    private final EmailValidationService emailValidationService;
    private final RateLimitServiceImpl rateLimitService;

    private static final Logger logger =
            LoggerFactory.getLogger(ContactMessageServiceImpl.class);

    @Override
    @Transactional
    public void processContactMessage(ContactMessageRequest contactMessageRequest, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        Bucket bucket = rateLimitService.resolveBucket(ip);

        if (!bucket.tryConsume(1)) {
            throw new RateLimitException("Too many requests. Please try again later.");
        }

        if (!emailValidationService.isValidEmail(contactMessageRequest.getEmail())) {
            throw new InvalidEmailException("Invalid email address");
        }

        try {
            // Send email to site owner
            emailService.sendContactMail(
                    contactMessageRequest.getName(),
                    contactMessageRequest.getEmail(),
                    contactMessageRequest.getSubject(),
                    contactMessageRequest.getMessage()
            );

            // Send auto-reply to sender
//            emailService.sendAutoReply(
//                    contactMessageRequest.getName(),
//                    contactMessageRequest.getEmail()
//            );

            ContactMessage message = new ContactMessage();
            message.setName(contactMessageRequest.getName());
            message.setEmail(contactMessageRequest.getEmail());
            message.setSubject(contactMessageRequest.getSubject());
            message.setMessage(contactMessageRequest.getMessage());
            repository.save(message);

            logger.info("Message saved and emails sent for: {}", contactMessageRequest.getEmail());

        } catch (Exception e) {

            logger.error("Email sending failed", e);
            throw new RuntimeException("Failed to process message. Please try again later.");
        }
    }

}
