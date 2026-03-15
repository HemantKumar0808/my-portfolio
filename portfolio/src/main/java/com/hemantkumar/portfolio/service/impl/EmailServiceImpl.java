package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public void sendContactMail(String name, String email, String subject, String message) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(sender);


        String displaySubject = (subject != null && !subject.trim().isEmpty()) ? subject : "(No subject provided)";
        String displayName = (name != null && !name.trim().isEmpty()) ? name : "Someone";

        mail.setSubject("New Portfolio Contact: " + displayName + " - " + displaySubject);

        StringBuilder text = new StringBuilder();
        text.append("Hi Hemant,\n\n");

        text.append("You have a new contact message from your portfolio website:\n\n");

        text.append("Name: ").append(displayName).append("\n");
        text.append("Email: ").append(email).append("\n");
        text.append("Subject: ").append(displaySubject).append("\n\n");
        text.append("Message:\n").append(message != null ? message : "(No message provided)").append("\n\n");

        text.append("Reply directly to: ").append(email).append("\n\n");

        text.append("Best,\n");
        text.append("Your Portfolio System");

        mail.setText(text.toString());

        mailSender.send(mail);
    }

    @Override
    public void sendAutoReply(String name, String email) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(email);
        mail.setSubject("Thank You for Reaching Out, " + name + "!");

        StringBuilder text = new StringBuilder();
        text.append("Hi ").append(name != null && !name.trim().isEmpty() ? name : "there").append(",\n\n");

        text.append("Thank you so much for connecting with me. 🙌\n");

        text.append("I've received your message and really appreciate you taking the time to reach out.\n\n");

        text.append("I'll personally go through it and get back to you as soon as possible – usually within 24–48 hours. 😊\n\n");

        text.append("In the meantime, feel free to check out more of my work or connect with me on my social handles:\n");
        text.append("- LinkedIn: https://www.linkedin.com/in/hemant-kumar-ht101/\n");
        text.append("- X: https://x.com/Hemusharma01\n\n");
        text.append("- Instagram: https://www.instagram.com/hemu_sharma_01\n\n");


        text.append("Warm regards,\n");
        text.append("Hemant Kumar\n");

        mail.setText(text.toString());

        mail.setFrom(sender);

        mailSender.send(mail);
    }
}