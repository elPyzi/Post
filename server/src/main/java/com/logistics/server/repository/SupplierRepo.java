package com.logistics.server.repository;

import com.logistics.server.entity.Supplier;
import com.logistics.server.entity.SupplierId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SupplierRepo extends JpaRepository<Supplier, SupplierId> {
    @Query("SELECT s FROM Supplier s WHERE s.user.userId = :userId")
    Optional<Supplier> findByUserId(@Param("userId") int userId);
}
