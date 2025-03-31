package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Base64;

@Entity
@Table(name = "transport_types")
@Data
public class TransportTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transport_type_id")
    private int transportTypeId;

    @Column(name = "type_name", length = 50)
    private String typeName;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private double price;

    @Column(name = "image")
    private String image;
}