package com.logistics.server.controller;

import com.logistics.server.dto.ResponceTransportDto;
import com.logistics.server.service.TransportLogisticsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TransportLogisticsController {
    @Autowired
    TransportLogisticsService transportLogisticsService;
}