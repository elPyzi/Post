package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class RoutesDto {
    private int id;
    private String name;
    private String transportType;
    private List<String> route;
    private Сarrier carrier;

    @Data
    public static class Сarrier {
        private String name;
        private String surname;
    }
}
