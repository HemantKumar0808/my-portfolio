package com.hemantkumar.portfolio.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageResponse {

    private boolean success;
    private String message;

}
