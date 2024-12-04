package com.fantastik.fantastik.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fantastik.fantastik.service.EmailService;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // Autoriser les requêtes depuis Angular
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Endpoint pour envoyer un email avec des données JSON envoyées dans le corps
    // de la requête
    @PostMapping("/send-email")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        // Appeler le service d'email pour envoyer l'email avec les informations reçues
        emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getText());
        return "Email sent successfully!";
    }

    // Classe pour représenter la requête email
    public static class EmailRequest {
        private String to;
        private String subject;
        private String text;

        // Getters et Setters
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
}
