package com.logistics.server.controller;

import com.logistics.server.dto.ReqResUsers;
import com.logistics.server.service.UsersLogisticsService;
import com.logistics.server.types.ResTokenUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserLogisticsController {
    @Autowired
    private UsersLogisticsService userLogisticsService;

    @PostMapping("/api/auth/register")
    public ResponseEntity<ReqResUsers> regeister(@RequestBody ReqResUsers reg){
        return ResponseEntity.ok(userLogisticsService.register(reg));
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<ResTokenUser> login(@RequestBody ReqResUsers req){
        return ResponseEntity.ok(userLogisticsService.login(req));
    }

    @PostMapping("/api/auth/refresh")
    public ResponseEntity<ReqResUsers> refreshToken(@RequestBody ReqResUsers req){
        return ResponseEntity.ok(userLogisticsService.refreshToken(req));
    }

    @GetMapping("/api/admin/get-all-users")
    public ResponseEntity<ReqResUsers> getAllUsers(){
        return ResponseEntity.ok(userLogisticsService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqResUsers> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(userLogisticsService.getUsersById(userId));

    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqResUsers> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqResUsers response = userLogisticsService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqResUsers> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(userLogisticsService.deleteUser(userId));
    }

}
