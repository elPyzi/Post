package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ResponceErrorServerDto {
    private int errorCode;

    @JsonIgnore
    public ResponceErrorServerDto(){
        errorCode = 0;
    }
    @JsonIgnore
    public ResponceErrorServerDto(int errorCode) {
        this.errorCode = errorCode;
    }
}
