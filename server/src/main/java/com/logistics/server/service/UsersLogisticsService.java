package com.logistics.server.service;

import com.logistics.server.dto.ReqResUsers;
import com.logistics.server.entity.Roles;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.RolesRepo;
import com.logistics.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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


    public ReqResUsers register(ReqResUsers registrationRequest){
        ReqResUsers resp = new ReqResUsers();

        try {
            Users user = new Users();
            user.setUserEmail(registrationRequest.getUser().getEmail());
            Optional<Roles> result = rolesRepo.findByRoleName("CLIENT");
            user.setRole(result.get());
            user.setUserName(registrationRequest.getUser().getName());
            user.setUserSurname(registrationRequest.getUser().getSurname());
            user.setUserContactNumber(registrationRequest.getTel());
            user.setUserAddress(registrationRequest.getAddress());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            Users usersResult = usersRepo.save(user);
            if (usersResult.getUserId()>0) {
                resp.setUsers((usersResult));
                resp.setStatusCode(200);
            }

        }
        catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqResUsers login(ReqResUsers loginRequest){
        ReqResUsers response = new ReqResUsers();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUser().getEmail(),
                            loginRequest.getPassword()));
            var user = usersRepo.findByUserEmail(loginRequest.getUser().getEmail()).orElseThrow();
            System.out.println(user);
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.getUser().setName(user.getUsername());
            response.getUser().setSurname(user.getUserSurname());
            response.getUser().setEmail(user.getUserEmail());
            response.getUser().setRole(user.getRole().getRoleName());
            response.getToken().setAccessToken(jwt);
            response.getToken().setRefreshToken(refreshToken);
            response.getToken().setExpirationTime(86400);
        }
        catch (Exception e){
            response.setStatusCode(401);
        }
        return response;
    }





    public ReqResUsers refreshToken(ReqResUsers refreshTokenReqiest){
        ReqResUsers response = new ReqResUsers();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken().getAccessToken());
            Users users = usersRepo.findByUserEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken().getAccessToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.getToken().setAccessToken(jwt);
                response.getToken().setRefreshToken(refreshTokenReqiest.getToken().getAccessToken());
                response.getToken().setExpirationTime(86400);
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
    }
}
