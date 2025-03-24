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

    public List<ResponceTransportDto> getAllTransportTypes() {
        List<TransportTypes> transportTypes = transportTypesRepo.findAll();
        return transportTypes.stream().map(transport -> {
            ResponceTransportDto dto = new ResponceTransportDto();
            dto.setId(transport.getTransportTypeId());
            dto.setName(transport.getTypeName());
            dto.setDescription(transport.getDescription());
            dto.setPrice(transport.getPrice());
            String base64Image = transport.getImageAsBase64();
            if (base64Image != null) {
                dto.setImg("data:image/jpeg;base64," + base64Image);
            } else {
                dto.setImg(null);
            }
            return dto;
        }).collect(Collectors.toList());
    }
}