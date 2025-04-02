package com.logistics.server.repository;

import com.logistics.server.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepo extends JpaRepository<Delivery, Integer> {
    List<Delivery> findByCourierUserId(int userId);
    Optional<Delivery> findByRoute_RouteId(int routeId);
    @Modifying
    @Query("DELETE FROM Delivery d WHERE d.route.routeId = :routeId")
    void deleteByRouteId(@Param("routeId") int routeId);
}
