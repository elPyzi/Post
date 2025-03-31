package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "routes")
@Data
public class Routes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private int routeId;

    @Column(name = "routes_name", nullable = false)
    private String routeName;

    @ManyToOne
    @JoinColumn(name = "fk_transport_type_id", referencedColumnName = "transport_type_id")
    private TransportTypes transportType;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "cities_order", columnDefinition = "integer[]")
    private Integer[] citiesOrder;
}
