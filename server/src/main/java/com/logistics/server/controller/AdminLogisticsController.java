package com.logistics.server.controller;

import com.logistics.server.dto.ResponceAdminUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.service.AdminLogisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminLogisticsController {
    @Autowired
    private AdminLogisticsService adminLogisticsService;

    @GetMapping("/{action}/{id}")
    public ResponseEntity<?>status(@PathVariable String action, @PathVariable int id) {
        ResponceErrorServerDto errorResponse = new ResponceErrorServerDto();
        if(action.equals("ban") || action.equals("unban")) {
            errorResponse = adminLogisticsService.setStatusUser(action, id);
        }
        else if (action.equals("deleteAdmin") || action.equals("setAdmin")) {
            errorResponse = adminLogisticsService.setRoleUser(action, id);
        }
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }

    @GetMapping("/getUsers/{qUser}")
    public ResponseEntity<?> getUserId(@PathVariable String qUser) {
        ResponceAdminUserDto response = new ResponceAdminUserDto();
        ResponceErrorServerDto errorResponse = adminLogisticsService.getUserId(response, qUser);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(response);
    }

    @GetMapping("/getUsers")
    public ResponseEntity<?> getUsers() {
        Map<String, ResponceAdminUserDto> users = adminLogisticsService.getUsersList();
        return ResponseEntity.ok(users);
    }
}