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
    private String name;
    private String surname;
    private String email;
    private String address;
    private String tel;
    private String role;
    private String accessToken;
    private String refreshToken;
    private int expirationTime;
    private String password;
    private Users users;
    private List<Users> usersList;
}