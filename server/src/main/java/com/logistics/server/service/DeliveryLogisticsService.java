package com.logistics.server.service;

import com.logistics.server.dto.*;
import com.logistics.server.entity.*;
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
    private SupplierRepo supplierRepo;
    @Autowired
    private OrderStatusRepo orderStatusRepo;
    @Autowired
    private TransportTypesRepo transportTypesRepo;

    public ResponceErrorServerDto startRoute(RequestRouteDto requestRouteDto, String email) {
        Users courier = usersRepo.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Курьер не найден"));

        Supplier supplier = supplierRepo.findByUserId(courier.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("Транспорт не найден"));;

        OrderStatus orderStatus = orderStatusRepo.findById(4)
                .orElseThrow(() -> new RuntimeException("Статус заказа с ID не найден"));

        Routes routes = new Routes();
        routes.setRouteName("Маршрут " + courier.getUserName());
        routes.setTransportType(supplier.getTransportType());
        routes.setCitiesOrder(requestRouteDto.getRoute().toArray(new Integer[requestRouteDto.getRoute().size()]));
        routesRepo.save(routes);

        Delivery delivery = new Delivery();
        delivery.setDeliveryName("Заказ " + courier.getUserName());
        delivery.setRoute(routes);
        delivery.setCourier(courier);
        delivery.setStatus(orderStatus);
        deliveryRepo.save(delivery);
        return new ResponceErrorServerDto(200);
    }

    public ResponceErrorServerDto getOrders(ResponceOrdersDto responceOrdersDto, String email, String role) {
        try {
            Users user = usersRepo.findByUserEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

            List<Orders> orders = new ArrayList<>();

            if(role.equals("CARRIER")){
                orders = ordersRepo.findByCurrierUserId(user.getUserId());
            }
            else if (role.equals("CLIENT")) {
                orders = ordersRepo.findByClientUserId(user.getUserId());
            }

            if (orders.isEmpty()) {
                return new ResponceErrorServerDto(401);
            }

            List<OrdersDto> ordersDto = new ArrayList<>();

            for (Orders o : orders) {
                try {
                    OrdersDto ordersWhileDto = new OrdersDto();
                    ordersWhileDto.setStatus(new OrdersDto.Status());
                    ordersWhileDto.setLocationInfo(new OrdersDto.LocationInfo());

                    ordersWhileDto.setId(o.getId());
                    ordersWhileDto.setName(o.getName());
                    ordersWhileDto.getStatus().setType(o.getStatus().getStatusName());
                    ordersWhileDto.getStatus().setDescription(o.getStatus().getDescription());
                    ordersWhileDto.getLocationInfo().setFrom(o.getCityFrom().getName());
                    ordersWhileDto.getLocationInfo().setGoingTo(o.getCityGoingTo().getName());
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

    public ResponceErrorServerDto deleteOrder(int orderId){
        try {
            Orders order = ordersRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Заказ не найден"));
            ordersRepo.delete(order);
            return new ResponceErrorServerDto(200);
        }
        catch(UsernameNotFoundException e) {
            return new ResponceErrorServerDto(401);
        }
        catch(Exception e) {
            return new ResponceErrorServerDto(401);
        }
    }

    public ResponceErrorServerDto getDeliveryTypes(ResponceDeliveryDto responceDeliveryDto){
        List<TransportTypes> transportTypes = transportTypesRepo.findAll();
        List<DeliveryDto> deliveryDto = new ArrayList<>();

        for(TransportTypes transportType : transportTypes){
            DeliveryDto dto = new DeliveryDto();
            dto.setId(transportType.getTransportTypeId());
            dto.setName(transportType.getTypeName());
            dto.setDescription(transportType.getDescription());
            dto.setPrice(transportType.getPrice());
            dto.setImg(transportType.getImage());
            deliveryDto.add(dto);
        }
        responceDeliveryDto.setDelivery(deliveryDto);
        return new ResponceErrorServerDto(200);
    }
}
