package com.logistics.server.service;

import com.logistics.server.dto.ResponceTransportDto;
import com.logistics.server.entity.TransportTypes;
import com.logistics.server.repository.TransportTypesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransportLogisticsService {
    @Autowired
    private TransportTypesRepo transportTypesRepo;
}