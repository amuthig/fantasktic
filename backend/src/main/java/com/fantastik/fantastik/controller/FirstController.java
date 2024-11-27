package com.fantastik.fantastik.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FirstController {

    @GetMapping("/test")
    public String testEndpoint() {
        return "Backend is working!";
    }
}