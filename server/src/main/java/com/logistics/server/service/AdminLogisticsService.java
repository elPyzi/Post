package com.logistics.server.service;

import com.logistics.server.dto.ResponceAdminUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.entity.Roles;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.RolesRepo;
import com.logistics.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminLogisticsService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private RolesRepo rolesRepo;

    public ResponceErrorServerDto setStatusUser(String actionUser,int idSetStatusUser){
        boolean isBanUser = actionUser.equals("ban") ? true : false;
        usersRepo.setUserBanStatus(idSetStatusUser, isBanUser);
        return new ResponceErrorServerDto(200);
    }

    public ResponceErrorServerDto setRoleUser(String actionUser,int idSetRoleUser){
        int roleId = actionUser.equals("setAdmin") ? 1 : 2;
        Optional<Roles> role = rolesRepo.findById(roleId);
        usersRepo.setUserRole(idSetRoleUser, role.get());
        return new ResponceErrorServerDto(200);
    }

    public ResponceErrorServerDto getUserId(ResponceAdminUserDto responceAdminUserDto, String emailUser){
        Users user = usersRepo.findByUserEmail(emailUser)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        responceAdminUserDto.setId(user.getUserId());
        responceAdminUserDto.setName(user.getUserName());
        responceAdminUserDto.setSurname(user.getUserSurname());
        responceAdminUserDto.setEmail(user.getUserEmail());
        responceAdminUserDto.setRole(user.getRole().getRoleName());
        responceAdminUserDto.setBan(user.isIsbn());
        if(responceAdminUserDto.getRole().equals("ADMIN")){
            responceAdminUserDto.setAdmin(true);
        }
        else {
            responceAdminUserDto.setAdmin(false);
        }
        return new ResponceErrorServerDto(200);
    }

    public Map<String, ResponceAdminUserDto> getUsersList() {
        List<Users> users = usersRepo.findAll();
        Map<String, ResponceAdminUserDto> response = new LinkedHashMap<>();

        for (int i = 0; i < users.size(); i++) {
            Users user = users.get(i);
            ResponceAdminUserDto dto = new ResponceAdminUserDto();

            dto.setId(user.getUserId());
            dto.setName(user.getUserName());
            dto.setSurname(user.getUserSurname());
            dto.setEmail(user.getUserEmail());
            dto.setRole(user.getRole().getRoleName());
            dto.setBan(user.isIsbn());
            if(dto.getRole().equals("ADMIN")){
                dto.setAdmin(true);
            }
            else {
                dto.setAdmin(false);
            }
            response.put(String.valueOf(i), dto);
        }
        return response;
    }
}
