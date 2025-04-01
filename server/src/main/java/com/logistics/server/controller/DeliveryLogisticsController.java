package com.logistics.server.controller;

import com.logistics.server.dto.OrdersDto;
import com.logistics.server.dto.RequestRouteDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponceOrdersDto;
import com.logistics.server.service.DeliveryLogisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryLogisticsController {
    @Autowired
    private DeliveryLogisticsService deliveryLogisticsService;

    @PostMapping("/start")
    public ResponseEntity<?> startRoute(@RequestBody RequestRouteDto req, Principal principal){
        String email = principal.getName();
        ResponceErrorServerDto errorResponse = deliveryLogisticsService.startRoute(req, email);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }

    @GetMapping("/get-orders")
    public ResponseEntity<?> getOrders(Principal principal){
        ResponceErrorServerDto errorResponse = new ResponceErrorServerDto();
        Authentication authentication = (Authentication) principal;
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String email = authentication.getName();
        ResponceOrdersDto ordersDto = new ResponceOrdersDto();
        if (role.equals("CARRIER")){
            errorResponse = deliveryLogisticsService.getOrdersCarrier(ordersDto, email);
            return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(ordersDto.getOrders());
        }
        else if (role.equals("CLIENT")) {
            errorResponse = deliveryLogisticsService.getOrdersClient(ordersDto, email);
            return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(ordersDto.getOrders());
        }
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }
}
