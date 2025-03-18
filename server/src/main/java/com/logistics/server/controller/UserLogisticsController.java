package com.logistics.server.controller;

import com.logistics.server.dto.GetRequestLoginUserDto;
import com.logistics.server.dto.GetRequestRegistrationUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponseLoginUserDto;
import com.logistics.server.service.UsersLogisticsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserLogisticsController {
    @Autowired
    private UsersLogisticsService userLogisticsService;

    @PostMapping("/api/auth/register")
    public ResponseEntity<ResponceErrorServerDto> register(@RequestBody GetRequestRegistrationUserDto reg) {
        ResponceErrorServerDto response = userLogisticsService.register(reg);
        if (response.getErrorCode() == 0) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        else {
            return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
        }
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody GetRequestLoginUserDto req, HttpServletResponse httpResponse) {
        ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
        ResponceErrorServerDto errorResponse = userLogisticsService.login(req, responseLoginUser);

        if (errorResponse.getErrorCode() == 0) {
            Cookie accessTokenCookie = new Cookie("accessToken", responseLoginUser.getToken().getAccessToken());
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(60);

            Cookie refreshTokenCookie = new Cookie("refreshToken", responseLoginUser.getToken().getRefreshToken());
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(604800);

            httpResponse.addCookie(accessTokenCookie);
            httpResponse.addCookie(refreshTokenCookie);

            return ResponseEntity.ok(responseLoginUser);
        }
        else {
            return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
        }
    }

    @GetMapping("/api/auth/check")
    public ResponseEntity<?> checkToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        String accessToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            accessToken = authorizationHeader.substring(7);
        }
        ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
        ResponceErrorServerDto errorResponse = userLogisticsService.checkAccessToken(accessToken, responseLoginUser);

        if (errorResponse.getErrorCode() == 401) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        return ResponseEntity.ok(responseLoginUser);
    }

    @GetMapping("/api/auth/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse httpResponse) {
        String authorizationHeader = request.getHeader("Authorization");
        String refreshToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            refreshToken = authorizationHeader.substring(7);
        }

        ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
        ResponceErrorServerDto errorResponse = userLogisticsService.refreshAccessToken(refreshToken, responseLoginUser);

        if (errorResponse.getErrorCode() == 401) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        }

        Cookie accessTokenCookie = new Cookie("accessToken", responseLoginUser.getToken().getAccessToken());
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(60);
        httpResponse.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", responseLoginUser.getToken().getRefreshToken());
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(604800);
        httpResponse.addCookie(refreshTokenCookie);

        errorResponse.setErrorCode(0);
        return ResponseEntity.ok(errorResponse);
    }

    /*

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
    }*/

}
