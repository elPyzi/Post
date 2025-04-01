package com.logistics.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OrdersDto {
    private int id;
    private String name;
    private Status status;
    private LocationInfo locationInfo;

    @Data
    public static class Status {
        private String type;
        private String description;
    }

    @Data
    public static class LocationInfo {
        private String from;
        private String goingTo;
    }
}
