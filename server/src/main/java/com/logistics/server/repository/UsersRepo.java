package com.logistics.server.repository;

import com.logistics.server.entity.Roles;
import com.logistics.server.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users, Integer> {
    Optional<Users> findByUserEmail(String userEmail);

    @Modifying
    @Transactional
    @Query("UPDATE Users u SET u.isbn = :isBanned WHERE u.userId = :userId")
    int setUserBanStatus(@Param("userId") int userId, @Param("isBanned") boolean isBanned);

    @Modifying
    @Transactional
    @Query("UPDATE Users u SET u.role = :role WHERE u.userId = :userId")
    int setUserRole(@Param("userId") int userId, @Param("role") Roles role);
}