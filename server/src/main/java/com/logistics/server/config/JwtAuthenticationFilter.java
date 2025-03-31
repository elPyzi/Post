package com.logistics.server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponseLoginUserDto;
import com.logistics.server.service.JWTUtils;
import com.logistics.server.service.UsersLogisticsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UsersLogisticsService userLogisticsService;
    private final JWTUtils jwtUtils;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(UsersLogisticsService userLogisticsService, JWTUtils jwtUtils, ObjectMapper objectMapper) {
        this.userLogisticsService = userLogisticsService;
        this.jwtUtils = jwtUtils;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        String requestUri = request.getRequestURI();
        String authorizationHeader = request.getHeader("Authorization");
        String getToken = null;

        if(authorizationHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }
        else if (authorizationHeader.length() > 6) {
            getToken = authorizationHeader.substring(7);
        }
        else if (authorizationHeader.length() == 6) {
            sendResponse(response, HttpStatus.UNAUTHORIZED.value(), new ResponceErrorServerDto(401));
            return;
        }
        String token = jwtUtils.extractTokenType(getToken);

        if(token.equals("accessToken") && requestUri.equals("/api/auth/check")){
            ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
            ResponceErrorServerDto errorResponse = userLogisticsService.checkAccessToken(getToken, responseLoginUser);

            if (errorResponse.getErrorCode() == 401) {
                sendResponse(response, HttpStatus.UNAUTHORIZED.value(), errorResponse);
                return;
            }
            sendResponse(response, HttpStatus.OK.value(), responseLoginUser);
            return;
        }
        else if (token.equals("refreshToken") && requestUri.equals("/api/auth/refresh")) {
            ResponseLoginUserDto responseLoginUser = new ResponseLoginUserDto();
            ResponceErrorServerDto errorResponse = userLogisticsService.refreshAccessToken(getToken, responseLoginUser);
            if (errorResponse.getErrorCode() == 401) {
                sendResponse(response, HttpStatus.UNAUTHORIZED.value(), errorResponse);
                return;
            }
            Cookie accessTokenCookie = new Cookie("accessToken", responseLoginUser.getToken().getAccessToken());
            accessTokenCookie.setPath("/");
            accessTokenCookie.setMaxAge(60);
            response.addCookie(accessTokenCookie);

            Cookie refreshTokenCookie = new Cookie("refreshToken", responseLoginUser.getToken().getRefreshToken());
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(604800);
            response.addCookie(refreshTokenCookie);

            errorResponse.setErrorCode(0);
            sendResponse(response, HttpStatus.OK.value(), errorResponse);
            return;
        }
        String role = jwtUtils.extractRole(getToken);
        String email = jwtUtils.extractUsername(getToken);
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(role)
        );
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }

    private void sendResponse(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
