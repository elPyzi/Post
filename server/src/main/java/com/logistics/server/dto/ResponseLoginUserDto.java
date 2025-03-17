package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ResponseLoginUserDto {
    private User user;
    @Data
    public static class User {
        private String name;
        private String surname;
        private String email;
        private String tel;
        private String address;
        private String role;
    }

    @JsonIgnore
    private Token token;
    @Data
    public static class Token {
        private String accessToken;
        private String refreshToken;
    }
}
