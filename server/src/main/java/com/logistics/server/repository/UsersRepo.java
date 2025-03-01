package com.logistics.server.repository;

import com.logistics.server.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users, Integer> {
    Optional<Users> findByUserEmail(String userEmail);
}