package com.logistics.server.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ResTokenUser {
    private User user;
    private Token token;
    private int statusCode;

    @Data
    public static class Token {
        private String accessToken;
        private String refreshToken;
        private int expiresIn;
    }

    @Data
    public static class User {
        private String name;
        private String surname;
        private String email;
        private String tel;
        private String address;
        private String role;
    }
}
