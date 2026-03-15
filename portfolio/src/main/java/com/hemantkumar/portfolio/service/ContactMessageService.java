package com.hemantkumar.portfolio.service;

import com.hemantkumar.portfolio.requestDto.ContactMessageRequest;
import com.hemantkumar.portfolio.responseDto.ContactMessageResponse;
import jakarta.servlet.http.HttpServletRequest;


public interface ContactMessageService {

    void processContactMessage(ContactMessageRequest contactMessageRequest, HttpServletRequest request);

}

