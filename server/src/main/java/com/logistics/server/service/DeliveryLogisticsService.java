package com.logistics.server.service;

import com.logistics.server.dto.RequestRouteDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.repository.DeliveryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryLogisticsService {
    @Autowired
    private DeliveryRepo deliveryRepo;

    public ResponceErrorServerDto startRoute(RequestRouteDto requestRouteDto) {
        return new ResponceErrorServerDto(200);
    }
}
