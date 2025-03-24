package com.logistics.server.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminLogisticsController {

    @GetMapping("/test")
    public String testAdminAccess() {
        return "Welcome to the Admin Logistics Area!";
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestBody String orderDetails) {
        return "Order created by admin: " + orderDetails;
    }

    @GetMapping("/status")
    public String getStatus() {
        return "Admin status: All systems operational";
    }
}