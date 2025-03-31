package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "suppliers")
@IdClass(SupplierId.class)
@Data
public class Supplier {
    @Id
    @ManyToOne
    @JoinColumn(name = "fk_user_id", referencedColumnName = "user_id")
    private Users user;

    @Id
    @ManyToOne
    @JoinColumn(name = "fk_transport_type_id", referencedColumnName = "transport_type_id")
    private TransportTypes transportType;
}
