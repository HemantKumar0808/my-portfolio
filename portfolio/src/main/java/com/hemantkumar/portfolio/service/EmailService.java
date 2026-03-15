package com.hemantkumar.portfolio.service;

public interface EmailService {
    void sendContactMail(String name, String email, String subject, String message);
    void sendAutoReply(String name, String email);

}
