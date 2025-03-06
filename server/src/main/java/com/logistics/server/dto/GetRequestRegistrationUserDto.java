package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class GetRequestRegistrationUserDto {
    String name;
    String surname;
    String address;
    String tel;
    String email;
    String password;
}
