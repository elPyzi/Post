package com.logistics.server.controller;

import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponceRoutesDto;
import com.logistics.server.service.CarrierLogisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/carrier")
public class СarrierLogisticsController {
    @Autowired
    private CarrierLogisticsService carrierLogisticsService;

    @GetMapping("/get-routes")
    public ResponseEntity<?> getRoutes(Principal principal) {
        Authentication authentication = (Authentication) principal;
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String email = principal.getName();
        ResponceRoutesDto responceRoutesDto = new ResponceRoutesDto();
        ResponceErrorServerDto errorResponse = carrierLogisticsService.getRoutes(responceRoutesDto, email, role);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(responceRoutesDto.getRoutes());
    }

    @PutMapping("/delete-route/{qIdRoute}")
    public ResponseEntity<?> deleteRoute(@PathVariable int qIdRoute) {
        ResponceErrorServerDto errorResponse = carrierLogisticsService.deleteRoute(qIdRoute);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }
}
