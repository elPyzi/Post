package com.logistics.server.service;

import com.logistics.server.dto.RequestOrderDto;
import com.logistics.server.dto.RequestRegistrationUserDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponseLoginUserDto;
import com.logistics.server.entity.*;
import com.logistics.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ClientLogisticsService {
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private OrderStatusRepo orderStatusRepo;
    @Autowired
    private RoutesRepo routesRepo;
    @Autowired
    private DeliveryRepo deliveryRepo;
    @Autowired
    private OrdersRepo ordersRepo;
    @Autowired
    private CitiesRepo citiesRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private SupplierRepo supplierRepo;

    public ResponceErrorServerDto updateUserProfile(RequestRegistrationUserDto updateUserDto, String email, ResponseLoginUserDto responseLoginUser){
        boolean check = false;
        ResponceErrorServerDto response = new ResponceErrorServerDto();
        Users user = usersRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updateUserDto.getName() != null && !updateUserDto.getName().equals(user.getUserName())) {
            user.setUserName(updateUserDto.getName());
        }
        if (updateUserDto.getSurname() != null && !updateUserDto.getSurname().equals(user.getUserSurname())) {
            user.setUserSurname(updateUserDto.getSurname());
        }
        if (updateUserDto.getEmail() != null && !updateUserDto.getEmail().equals(user.getUserEmail())) {
            user.setUserEmail(updateUserDto.getEmail());
            check = true;
        }
        if (updateUserDto.getTel() != null && !updateUserDto.getTel().equals(user.getUserContactNumber())) {
            user.setUserContactNumber(updateUserDto.getTel());
        }
        if (updateUserDto.getAddress() != null && !updateUserDto.getAddress().equals(user.getUserAddress())) {
            user.setUserAddress(updateUserDto.getAddress());
        }
        usersRepo.save(user);
        if (check) {
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(user);
            ResponseLoginUserDto.Token tokenData = new ResponseLoginUserDto.Token();
            tokenData.setAccessToken(jwt);
            tokenData.setRefreshToken(refreshToken);
            responseLoginUser.setToken(tokenData);
            response.setErrorCode(1);
        }
        else {
            response.setErrorCode(0);
        }
        return response;
    }

    public ResponceErrorServerDto setOrder(RequestOrderDto requestOrderDto, String email) {
        Users user = usersRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        Users courirer = usersRepo.findById(requestOrderDto.getCarrierId())
                .orElseThrow(() -> new UsernameNotFoundException("Курьер не найден"));

        OrderStatus orderStatus = orderStatusRepo.findById(1)
                .orElseThrow(() -> new RuntimeException("Статус заказа с ID не найден"));

        int transportTypeId = supplierRepo.findTransportTypeIdByUserId(requestOrderDto.getCarrierId())
                .orElseThrow(() -> new RuntimeException("Тип транспорта не найденa"));

        int cityFromId = citiesRepo.findIdByCityName(requestOrderDto.getCityFrom())
                .orElseThrow(() -> new RuntimeException("Город отправления не найден"));

        int goingToCityId = citiesRepo.findIdByCityName(requestOrderDto.getGoingToCity())
                .orElseThrow(() -> new RuntimeException("Город назначения не найден"));

        Routes routes = new Routes();
        TransportTypes transportTypes = new TransportTypes();
        transportTypes.setTransportTypeId(transportTypeId);
        routes.setRouteName("Маршрут № " + requestOrderDto.getCarrierId());
        routes.setTransportType(transportTypes);
        routes.setCitiesOrder(new Integer[0]);
        routesRepo.save(routes);

        Delivery delivery = new Delivery();
        delivery.setDeliveryName("Заказ № " + user.getUserId());
        delivery.setRoute(routes);
        delivery.setCourier(courirer);
        delivery.setStatus(orderStatus);
        deliveryRepo.save(delivery);

        Orders orders = new Orders();
        Cities citiesFrom = new Cities();
        Cities citiesTo = new Cities();
        orders.setName(user.getUserName());
        citiesFrom.setId(cityFromId);
        citiesTo.setId(goingToCityId);
        orders.setCityFrom(citiesFrom);
        orders.setCityGoingTo(citiesTo);
        orders.setClient(user);
        orders.setStatus(orderStatus);
        ordersRepo.save(orders);
        return new ResponceErrorServerDto(200);
    }
}
