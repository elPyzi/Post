package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery")
@Data
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long deliveryId;

    @Column(name = "delivery_name", nullable = false)
    private String deliveryName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "fk_route_id", referencedColumnName = "route_id")
    private Routes route;

    @ManyToOne
    @JoinColumn(name = "fk_courier_id", referencedColumnName = "user_id")
    private Users courier;

    @ManyToOne
    @JoinColumn(name = "fk_status_id", referencedColumnName = "status_id")
    private OrderStatus status;
}
