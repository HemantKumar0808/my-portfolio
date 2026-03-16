package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.service.EmailService;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${app.owner-email}")
    private String ownerEmail;

    @Override
    public void sendContactMail(String name, String email, String subject, String message) {
        try {
            SendGrid sg = new SendGrid(apiKey);

            String displayName = (name != null && !name.trim().isEmpty()) ? name : "Someone";
            String displaySubject = (subject != null && !subject.trim().isEmpty()) ? subject : "New Contact Message";

            String body = String.format(
                    "Hi Hemant,\n\n" +
                            "New contact message from your portfolio:\n\n" +
                            "Name: %s\n" +
                            "Email: %s\n" +
                            "Subject: %s\n\n" +
                            "Message:\n%s\n\n" +
                            "Reply directly: %s",
                    displayName, email, displaySubject, message != null ? message : "(empty)", email
            );

            Email from = new Email(fromEmail, "Hemant Kumar Portfolio");
            Email to = new Email(ownerEmail);

            Mail mail = new Mail(from, "New Portfolio Contact: " + displayName, to, new Content("text/plain", body));

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() != 202) {
                throw new RuntimeException("SendGrid failed: " + response.getBody());
            }

        } catch (Exception e) {
            throw new RuntimeException("SendGrid API failed", e);
        }
    }

    @Override
    public void sendAutoReply(String name, String email) {
        try {
            SendGrid sg = new SendGrid(apiKey);

            String body = String.format(
                    "Hi %s,\n\n" +
                            "Thank you for reaching out! 🙌\n\n" +
                            "I've received your message and will reply within 24-48 hours.\n\n" +
                            "Best,\nHemant Kumar",
                    (name != null && !name.trim().isEmpty()) ? name : "there"
            );

            Email from = new Email(fromEmail, "Hemant Kumar Portfolio");
            Email to = new Email(email);

            Mail mail = new Mail(from, "Thank You for Reaching Out!", to, new Content("text/plain", body));

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            sg.api(request);

        } catch (Exception e) {
            throw new RuntimeException("Auto-reply failed", e);
        }
    }
}