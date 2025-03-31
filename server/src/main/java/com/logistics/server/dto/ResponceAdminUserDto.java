package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ResponceAdminUserDto {
    private int id;
    private String name;
    private String surname;
    private String email;
    private String role;

    @JsonProperty("isBan")
    private boolean ban;

    @JsonProperty("isAdmin")
    private boolean admin;
}