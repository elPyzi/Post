package com.logistics.server.repository;

import com.logistics.server.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepo extends JpaRepository<OrderStatus, Integer> { }
