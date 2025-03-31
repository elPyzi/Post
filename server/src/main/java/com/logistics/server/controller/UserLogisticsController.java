package com.logistics.server.controller;

import com.logistics.server.dto.*;
import com.logistics.server.service.UsersLogisticsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserLogisticsController {
    @Autowired
    private UsersLogisticsService userLogisticsService;

    @PostMapping("/api/auth/register")
    public ResponseEntity<ResponceErrorServerDto> register(@RequestBody RequestRegistrationUserDto reg) {
        ResponceErrorServerDto response = userLogisticsService.register(reg);
        if (response.getErrorCode() == 0) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        else {
            return ResponseEntity.status(HttpStatus.valueOf(response.getErrorCode())).body(response);
        }
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@RequestBody RequestLoginUserDto req, HttpServletResponse httpResponse) {
        ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
        ResponceErrorServerDto errorResponse = userLogisticsService.login(req, responseLoginUser);

        if (errorResponse.getErrorCode() == 0) {
            Cookie accessTokenCookie = new Cookie("accessToken", responseLoginUser.getToken().getAccessToken());
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(900);

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

    @GetMapping("/api/cities")
    public ResponseEntity<?> getCities() {
        ResponceCitiesDto responceCities = new ResponceCitiesDto();
        ResponceErrorServerDto errorResponse = userLogisticsService.getCities(responceCities);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(responceCities.getCities());
    }
}
