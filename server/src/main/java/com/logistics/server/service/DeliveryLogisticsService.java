package com.logistics.server.service;

import com.logistics.server.dto.OrdersDto;
import com.logistics.server.dto.RequestRouteDto;
import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponceOrdersDto;
import com.logistics.server.entity.Delivery;
import com.logistics.server.entity.OrderStatus;
import com.logistics.server.entity.Orders;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DeliveryLogisticsService {
    @Autowired
    private RoutesRepo routesRepo;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private DeliveryRepo deliveryRepo;
    @Autowired
    private OrdersRepo ordersRepo;
    @Autowired
    private OrderStatusRepo orderStatusRepo;

    public ResponceErrorServerDto startRoute(RequestRouteDto requestRouteDto, String email) {
        Users user = usersRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        //Delivery delivery = deliveryRepo;
        System.out.println(requestRouteDto.getRoute());
        return new ResponceErrorServerDto(200);
    }

    public ResponceErrorServerDto getOrdersCarrier(ResponceOrdersDto responceOrdersDto, String email) {
        try {
            Users user = usersRepo.findByUserEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

            List<Delivery> delivery = deliveryRepo.findByCourierUserId(user.getUserId());
            if (delivery.isEmpty()) {
                return new ResponceErrorServerDto(401);
            }

            List<OrdersDto> ordersDto = new ArrayList<>();

            for (Delivery d : delivery) {
                try {
                    OrdersDto ordersWhileDto = new OrdersDto();
                    ordersWhileDto.setId(d.getDeliveryId());
                    ordersWhileDto.setName(d.getDeliveryName());
                    ordersWhileDto.setStatus(new OrdersDto.Status());
                    ordersWhileDto.getStatus().setType(d.getStatus().getStatusName());
                    ordersWhileDto.getStatus().setDescription(d.getStatus().getDescription());

                    String input = d.getDeliveryName();
                    String lastPart = input.substring(input.lastIndexOf('№') + 1).trim();
                    int idOrder = Integer.parseInt(lastPart);
                    Orders orders = ordersRepo.findById(idOrder)
                            .orElseThrow(() -> new UsernameNotFoundException("Заказ не найден"));

                    ordersWhileDto.setLocationInfo(new OrdersDto.LocationInfo());
                    ordersWhileDto.getLocationInfo().setFrom(orders.getCityFrom().getName());
                    ordersWhileDto.getLocationInfo().setGoingTo(orders.getCityGoingTo().getName());
                    ordersDto.add(ordersWhileDto);
                }
                catch (Exception e) {
                    return new ResponceErrorServerDto(401);
                }
            }

            responceOrdersDto.setOrders(ordersDto);
            return new ResponceErrorServerDto(200);
        }
        catch(UsernameNotFoundException e) {
            return new ResponceErrorServerDto(401);
        }
        catch(Exception e) {
            return new ResponceErrorServerDto(401);
        }
    }

    public ResponceErrorServerDto getOrdersClient(ResponceOrdersDto responceOrdersDto, String email) {
        try {
            Users user = usersRepo.findByUserEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

            List<Orders> orders = ordersRepo.findByClientUserId(user.getUserId());
            if (orders.isEmpty()) {
                return new ResponceErrorServerDto(401);
            }

            List<OrdersDto> ordersDto = new ArrayList<>();
            for (Orders o : orders) {
                try {
                    OrdersDto ordersWhileDto = new OrdersDto();
                    Delivery delivery = deliveryRepo.findById(o.getId())
                            .orElseThrow(() -> new UsernameNotFoundException("Доставка не найдена"));

                    ordersWhileDto.setStatus(new OrdersDto.Status());
                    ordersWhileDto.setLocationInfo(new OrdersDto.LocationInfo());
                    ordersWhileDto.setId(o.getId());
                    ordersWhileDto.setName(delivery.getDeliveryName());
                    ordersWhileDto.getStatus().setType(delivery.getStatus().getStatusName());
                    ordersWhileDto.getStatus().setDescription(delivery.getStatus().getDescription());
                    ordersWhileDto.getLocationInfo().setGoingTo(o.getCityGoingTo().getName());
                    ordersWhileDto.getLocationInfo().setFrom(o.getCityFrom().getName());
                    ordersDto.add(ordersWhileDto);
                }
                catch (Exception e) {
                    return new ResponceErrorServerDto(401);
                }
            }

            responceOrdersDto.setOrders(ordersDto);
            return new ResponceErrorServerDto(200);
        }
        catch(UsernameNotFoundException e) {
            return new ResponceErrorServerDto(401);
        }
        catch(Exception e) {
            return new ResponceErrorServerDto(401);
        }
    }
}
