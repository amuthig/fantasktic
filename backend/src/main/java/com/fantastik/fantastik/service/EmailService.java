package com.fantastik.fantastik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails using JavaMailSender.
 * This service provides a simple abstraction to send basic emails.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender; // Injects JavaMailSender for email sending functionality.

    /**
     * Sends an email with the provided details.
     *
     * @param from    The sender's email address.
     * @param to      The recipient's email address.
     * @param subject The subject of the email.
     * @param text    The body of the email.
     */
    public void sendEmail(String from, String to, String subject, String text) {
        // Create a new email message.
        SimpleMailMessage message = new SimpleMailMessage();

        // Set the sender's email address.
        message.setFrom(from);

        // Set the recipient's email address.
        message.setTo(to);

        // Set the email subject.
        message.setSubject(subject);

        // Set the email body text.
        message.setText(text);

        // Send the email using the mailSender.
        mailSender.send(message);
    }
}
