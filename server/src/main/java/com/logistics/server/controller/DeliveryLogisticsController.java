package com.logistics.server.controller;

import com.logistics.server.dto.RequestRouteDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.service.DeliveryLogisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/delivery/")
public class DeliveryLogisticsController {
    @Autowired
    private DeliveryLogisticsService deliveryLogisticsService;

    @PostMapping()
    public ResponseEntity<?> startRoute(@RequestBody RequestRouteDto req){
        ResponceErrorServerDto errorResponse = deliveryLogisticsService.startRoute(req);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }
}
