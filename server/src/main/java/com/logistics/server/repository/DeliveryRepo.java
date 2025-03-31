package com.logistics.server.repository;

import com.logistics.server.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepo extends JpaRepository<Delivery, Integer> {}
