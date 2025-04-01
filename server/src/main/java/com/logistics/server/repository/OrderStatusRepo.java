package com.logistics.server.repository;

import com.logistics.server.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderStatusRepo extends JpaRepository<OrderStatus, Integer> {
    Optional<OrderStatus> findByStatusId(int statusId);
}
