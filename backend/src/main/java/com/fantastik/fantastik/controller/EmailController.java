package com.fantastik.fantastik.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fantastik.fantastik.service.EmailService;

/**
 * Controller for handling email-related requests.
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200") // Allow requests from the Angular frontend
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint to send an email based on JSON data in the request body.
     *
     * @param emailRequest The email details provided in the request body.
     * @return A response indicating whether the email was sent successfully.
     */
    @PostMapping("/send-email")
    public EmailResponse sendEmail(@RequestBody EmailRequest emailRequest) {
        // Call the email service to send the email with the provided details
        emailService.sendEmail(
                emailRequest.getFrom(),
                emailRequest.getTo(),
                emailRequest.getSubject(),
                emailRequest.getText());

        // Return a JSON response with a success message
        return new EmailResponse("Email sent successfully!");
    }

    /**
     * Class to represent the email request structure.
     */
    public static class EmailRequest {
        private String to;
        private String subject;
        private String text;
        private String from;

        // Getters and Setters

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    /**
     * Class to represent the email response structure.
     */
    public static class EmailResponse {
        private String message;

        public EmailResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
