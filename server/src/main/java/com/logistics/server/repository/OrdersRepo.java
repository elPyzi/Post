package com.logistics.server.repository;

import com.logistics.server.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepo extends JpaRepository<Orders, Integer> {
    List<Orders> findByClientUserId(int userId);
}
