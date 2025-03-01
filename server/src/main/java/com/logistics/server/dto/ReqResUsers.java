package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.logistics.server.entity.Users;
import lombok.Data;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ReqResUsers {

    private int statusCode;
    private String error;
    private User user;
    private String password;
    private String tel;
    private String address;
    private Token token;
    private Users users;
    private List<Users> usersList;

    @Data
    public static class User {
        private String name;
        private String surname;
        private String email;
        private String role;
    }

    @Data
    public static class Token {
        private String accessToken;
        private String refreshToken;
        private int expirationTime;
    }
}