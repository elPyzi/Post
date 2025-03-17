package com.logistics.server.service;

import com.logistics.server.dto.GetRequestLoginUserDto;
import com.logistics.server.dto.GetRequestRegistrationUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponseLoginUserDto;
import com.logistics.server.entity.Roles;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.RolesRepo;
import com.logistics.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersLogisticsService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private RolesRepo rolesRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public ResponceErrorServerDto register(GetRequestRegistrationUserDto registrationRequest) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        Optional<Roles> result = rolesRepo.findByRoleName("CLIENT");

        Optional<Users> existingUser = usersRepo.findByUserEmail(registrationRequest.getEmail());
        if (existingUser.isPresent()) {
            response.setErrorCode(400);
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


    public ResponceErrorServerDto login(GetRequestLoginUserDto loginRequest, ResponseLoginUserDto responseLoginUser) {
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            Users user = usersRepo.findByUserEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            ResponseLoginUserDto.User userData = new ResponseLoginUserDto.User();
            userData.setName(user.getUsername());
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
            return response;
        }
        catch (AuthenticationException e) {
            response.setErrorCode(401);
            return response;
        }
        catch (Exception e) {
            response.setErrorCode(500);
            return response;
        }
    }

    public ResponseLoginUserDto checkAccessToken(String accessToken) {
        try {
            if (accessToken == null || accessToken.isBlank()) {
                return null;
            }

            if (jwtUtils.isTokenExpired(accessToken)) {
                return null;
            }

            String userEmail = jwtUtils.extractUsername(accessToken);
            if (userEmail == null) {
                return null;
            }

            Users user = usersRepo.findByUserEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!jwtUtils.isTokenValid(accessToken, user)) {
                return null;
            }

            ResponseLoginUserDto response = new ResponseLoginUserDto();
            ResponseLoginUserDto.User userData = new ResponseLoginUserDto.User();
            userData.setName(user.getUsername());
            userData.setSurname(user.getUserSurname());
            userData.setEmail(user.getUserEmail());
            userData.setTel(user.getUserContactNumber());
            userData.setAddress(user.getUserAddress());
            userData.setRole(user.getRole().getRoleName());
            response.setUser(userData);

            return response;
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseLoginUserDto refreshAccessToken(String refreshToken) {
        try {
            if (refreshToken == null || refreshToken.isBlank()) {
                return null;
            }
            if (jwtUtils.isTokenExpired(refreshToken)) {
                return null;
            }
            String userEmail = jwtUtils.extractUsername(refreshToken);
            if (userEmail == null) {
                return null;
            }
            Users user = usersRepo.findByUserEmail(userEmail)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            if (!jwtUtils.isTokenValid(refreshToken, user)) {
                return null;
            }

            String newAccessToken = jwtUtils.generateToken(user);

            ResponseLoginUserDto response = new ResponseLoginUserDto();
            ResponseLoginUserDto.Token tokenData = new ResponseLoginUserDto.Token();
            tokenData.setAccessToken(newAccessToken);
            tokenData.setRefreshToken(refreshToken);
            response.setToken(tokenData);

            return response;
        }
        catch (Exception e) {
            return null;
        }
    }


    /*public ReqResUsers refreshToken(ReqResUsers refreshTokenReqiest){
        ReqResUsers response = new ReqResUsers();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getAccessToken());
            Users users = usersRepo.findByUserEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getAccessToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setAccessToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getAccessToken());
                response.setExpirationTime(86400);
            }
            response.setStatusCode(200);
            return response;

        }
        catch (Exception e){
            response.setStatusCode(500);
            return response;
        }
    }


    public ReqResUsers getAllUsers() {
        ReqResUsers reqRes = new ReqResUsers();

        try {
            List<Users> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setUsersList(result);
                reqRes.setStatusCode(200);
            }
            else {
                reqRes.setStatusCode(404);
            }
            return reqRes;
        }
        catch (Exception e) {
            reqRes.setStatusCode(500);
            return reqRes;
        }
    }


    public ReqResUsers getUsersById(Integer id) {
        ReqResUsers reqRes = new ReqResUsers();
        try {
            Users usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setUsers(usersById);
            reqRes.setStatusCode(200);
        }
        catch (Exception e) {
            reqRes.setStatusCode(500);
        }
        return reqRes;
    }


    public ReqResUsers deleteUser(Integer userId) {
        ReqResUsers reqRes = new ReqResUsers();
        try {
            Optional<Users> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
            }
            else {
                reqRes.setStatusCode(404);
            }
        }
        catch (Exception e) {
            reqRes.setStatusCode(500);
        }
        return reqRes;
    }

    public ReqResUsers getMyInfo(String email){
        ReqResUsers reqRes = new ReqResUsers();
        try {
            Optional<Users> userOptional = usersRepo.findByUserEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setUsers(userOptional.get());
                reqRes.setStatusCode(200);
            }
            else {
                reqRes.setStatusCode(404);
            }

        }
        catch (Exception e){
            reqRes.setStatusCode(500);
        }
        return reqRes;
    }*/
}
