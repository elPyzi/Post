package com.logistics.server.repository;

import com.logistics.server.entity.TransportTypes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransportTypesRepo extends JpaRepository<TransportTypes, Integer> {
    Optional<TransportTypes> findByTypeName(String typeName);
}
