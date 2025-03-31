package com.logistics.server.service;

import com.logistics.server.dto.*;
import com.logistics.server.entity.Cities;
import com.logistics.server.entity.Roles;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.CitiesRepo;
import com.logistics.server.repository.RolesRepo;
import com.logistics.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsersLogisticsService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private RolesRepo rolesRepo;
    @Autowired
    private CitiesRepo citiesRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public ResponceErrorServerDto register(RequestRegistrationUserDto registrationRequest) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        Optional<Roles> result = rolesRepo.findByRoleName("CLIENT");

        Optional<Users> existingUser = usersRepo.findByUserEmail(registrationRequest.getEmail());
        if (existingUser.isPresent()) {
            response.setErrorCode(409);
            return response;
        }

        Users user = new Users();
        user.setUserEmail(registrationRequest.getEmail());
        user.setRole(result.get());
        user.setUserName(registrationRequest.getName());
        user.setUserSurname(registrationRequest.getSurname());
        user.setUserContactNumber(registrationRequest.getTel());
        user.setUserAddress(registrationRequest.getAddress());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

        try {
            usersRepo.save(user);
            response.setErrorCode(0);
            return response;
        }
        catch (DataIntegrityViolationException e) {
            response.setErrorCode(400);
            return response;
        }
        catch (Exception e) {
            response.setErrorCode(500);
            return response;
        }
    }


    public ResponceErrorServerDto login(RequestLoginUserDto loginRequest, ResponseLoginUserDto responseLoginUser) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        try {
            Users user = usersRepo.findByUserEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String jwt = jwtUtils.generateToken(user);
                String refreshToken = jwtUtils.generateRefreshToken(user);

                ResponseLoginUserDto.User userData = new ResponseLoginUserDto.User();
                userData.setName(user.getUserName());
                userData.setSurname(user.getUserSurname());
                userData.setEmail(user.getUserEmail());
                userData.setTel(user.getUserContactNumber());
                userData.setAddress(user.getUserAddress());
                userData.setRole(user.getRole().getRoleName());

                ResponseLoginUserDto.Token tokenData = new ResponseLoginUserDto.Token();
                tokenData.setAccessToken(jwt);
                tokenData.setRefreshToken(refreshToken);

                responseLoginUser.setUser(userData);
                responseLoginUser.setToken(tokenData);
                response.setErrorCode(0);
            }
            else {
                response.setErrorCode(401); // Неверный пароль
            }
            return response;
        }
        catch (UsernameNotFoundException e) {
            response.setErrorCode(401);
            return response;
        }
        catch (Exception e) {
            response.setErrorCode(500);
            return response;
        }
    }

    public ResponceErrorServerDto checkAccessToken(String accessToken, ResponseLoginUserDto responseLoginUser) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        try {
            if (accessToken == null || accessToken.isBlank()) {
                response.setErrorCode(401);
                return response;
            }

            if (jwtUtils.isTokenExpired(accessToken)) {
                response.setErrorCode(401);
                return response;
            }

            String userEmail = jwtUtils.extractUsername(accessToken);
            if (userEmail == null) {
                response.setErrorCode(401);
                return response;
            }

            Users user = usersRepo.findByUserEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!jwtUtils.isTokenValid(accessToken, user)) {
                response.setErrorCode(401);
                return response;
            }

            ResponseLoginUserDto.User userData = new ResponseLoginUserDto.User();
            userData.setName(user.getUserName());
            userData.setSurname(user.getUserSurname());
            userData.setEmail(user.getUserEmail());
            userData.setTel(user.getUserContactNumber());
            userData.setAddress(user.getUserAddress());
            userData.setRole(user.getRole().getRoleName());

            responseLoginUser.setUser(userData);
            response.setErrorCode(0);
            return response;
        }
        catch (Exception e) {
            response.setErrorCode(500);
            return response;
        }
    }

    public ResponceErrorServerDto refreshAccessToken(String refreshToken, ResponseLoginUserDto responseLoginUser) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        try {
            if (refreshToken == null || refreshToken.isBlank()) {
                response.setErrorCode(401);
                return response;
            }
            if (jwtUtils.isTokenExpired(refreshToken)) {
                response.setErrorCode(401);
                return response;
            }
            String userEmail = jwtUtils.extractUsername(refreshToken);
            if (userEmail == null) {
                response.setErrorCode(401);
                return response;
            }
            Users user = usersRepo.findByUserEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            if (!jwtUtils.isTokenValid(refreshToken, user)) {
                response.setErrorCode(401);
                return response;
            }

            String newAccessToken = jwtUtils.generateToken(user);
            ResponseLoginUserDto.Token tokenData = new ResponseLoginUserDto.Token();
            tokenData.setAccessToken(newAccessToken);
            tokenData.setRefreshToken(refreshToken);
            responseLoginUser.setToken(tokenData);

            response.setErrorCode(0);
            return response;
        }
        catch (Exception e) {
            return null;
        }
    }

    public ResponceErrorServerDto getCities(ResponceCitiesDto responceCitiesDto) {
        List<Cities> cities = citiesRepo.findAll();
        List<CityDto> cityDTO = new ArrayList<>();

        for (Cities city : cities) {
            CityDto dto = new CityDto();
            dto.setId(city.getId());
            dto.setName(city.getName());
            cityDTO.add(dto);
        }
        responceCitiesDto.setCities(cityDTO);
        return new ResponceErrorServerDto(200);
    }
}
