package com.hemantkumar.portfolio.controller;

import com.hemantkumar.portfolio.requestDto.ContactMessageRequest;
import com.hemantkumar.portfolio.responseDto.ContactMessageResponse;
import com.hemantkumar.portfolio.service.ContactMessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<ContactMessageResponse> sendMessage(
            @Valid @RequestBody ContactMessageRequest contactMessageRequest,
            HttpServletRequest request) {

        contactMessageService.processContactMessage(contactMessageRequest,request);

        return ResponseEntity.ok(new ContactMessageResponse(true, "Message sent successfully"));
    }

}