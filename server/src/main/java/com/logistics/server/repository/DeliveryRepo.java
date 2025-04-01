package com.logistics.server.repository;

import com.logistics.server.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepo extends JpaRepository<Delivery, Integer> {
    List<Delivery> findByCourierUserId(int userId);
}
