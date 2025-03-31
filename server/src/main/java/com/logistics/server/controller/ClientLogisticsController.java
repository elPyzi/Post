package com.logistics.server.controller;

import com.logistics.server.dto.RequestOrderDto;
import com.logistics.server.dto.RequestRegistrationUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponseLoginUserDto;
import com.logistics.server.service.ClientLogisticsService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/client")
public class ClientLogisticsController {
    @Autowired
    ClientLogisticsService clientLogisticsService;

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody RequestRegistrationUserDto loginUserDto,
                                    Principal principal,
                                    HttpServletResponse httpResponse) {
        String email = principal.getName();
        ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
        ResponceErrorServerDto errorResponse = clientLogisticsService.updateUserProfile(loginUserDto, email, responseLoginUser);

        switch (errorResponse.getErrorCode()) {
            case 1:{
                Cookie accessTokenCookie = new Cookie("accessToken", responseLoginUser.getToken().getAccessToken());
                accessTokenCookie.setPath("/");
                accessTokenCookie.setMaxAge(900);

                Cookie refreshTokenCookie = new Cookie("refreshToken", responseLoginUser.getToken().getRefreshToken());
                refreshTokenCookie.setPath("/");
                refreshTokenCookie.setMaxAge(604800);

                httpResponse.addCookie(accessTokenCookie);
                httpResponse.addCookie(refreshTokenCookie);
                return ResponseEntity.ok(errorResponse);
            }
            case 0:{
                return ResponseEntity.ok(errorResponse);
            }
            default:{
                return ResponseEntity.badRequest().body(errorResponse);
            }
        }
    }

    @PostMapping("/make-order")
    public ResponseEntity<?> makeOrder(@RequestBody RequestOrderDto reqOrder, Principal principal){
        System.out.println("dsadsadas");
        String email = principal.getName();
        ResponceErrorServerDto errorResponse = clientLogisticsService.setOrder(reqOrder, email);
        return ResponseEntity.status(HttpStatus.valueOf(errorResponse.getErrorCode())).body(errorResponse);
    }
}
