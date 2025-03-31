package com.logistics.server.repository;

import com.logistics.server.entity.Cities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CitiesRepo extends JpaRepository<Cities, Integer> {
    @Query("SELECT c.id FROM Cities c WHERE c.name = :cityName")
    Optional<Integer> findIdByCityName(@Param("cityName") String cityName);
}
