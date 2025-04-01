package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "orders")
@Data
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;

    @Column(name = "order_name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "fk_city_from", referencedColumnName = "city_id")
    private Cities cityFrom;

    @ManyToOne
    @JoinColumn(name = "fk_city_goingto", referencedColumnName = "city_id")
    private Cities cityGoingTo;

    @ManyToOne
    @JoinColumn(name = "fk_client_id", referencedColumnName = "user_id", nullable = false)
    private Users client;

    @ManyToOne
    @JoinColumn(name = "fk_status_id", referencedColumnName = "status_id")
    private OrderStatus status;
}
