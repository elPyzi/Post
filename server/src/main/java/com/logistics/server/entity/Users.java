package com.logistics.server.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_surname")
    private String userSurname;

    @Column(name = "user_address")
    private String userAddress;

    @Column(name = "user_contact_number")
    private String userContactNumber;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_password")
    private String password;

    @Column(name = "isban")
    private boolean isbn = false;

    @ManyToOne
    @JoinColumn(name = "fk_user_role_id", referencedColumnName = "role_id")
    private Roles role;
}
