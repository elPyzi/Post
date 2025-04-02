package com.logistics.server.service;

import com.logistics.server.dto.ResponceErrorServerDto;
import com.logistics.server.dto.ResponceRoutesDto;
import com.logistics.server.dto.RoutesDto;
import com.logistics.server.entity.Cities;
import com.logistics.server.entity.Delivery;
import com.logistics.server.entity.Routes;
import com.logistics.server.entity.Users;
import com.logistics.server.repository.CitiesRepo;
import com.logistics.server.repository.DeliveryRepo;
import com.logistics.server.repository.RoutesRepo;
import com.logistics.server.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarrierLogisticsService {
    @Autowired
    private RoutesRepo routesRepo;
    @Autowired
    private DeliveryRepo deliveryRepo;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private CitiesRepo citiesRepo;

    public ResponceErrorServerDto getRoutes(ResponceRoutesDto responceRoutesDto, String email, String role) {
        try {
            List<RoutesDto> routesDto = new ArrayList<>();
            List<Cities> cities = citiesRepo.findAll();
            if(role.equals("ADMIN")) {
                List<Routes> routes = routesRepo.findAll();

                for(Routes route : routes){
                    Delivery delivery = deliveryRepo.findByRoute_RouteId(route.getRouteId())
                            .orElseThrow(() -> new UsernameNotFoundException("Заказ не найден"));

                    Users user = usersRepo.findById(delivery.getCourier().getUserId())
                            .orElseThrow(() -> new UsernameNotFoundException("Курьер не найден"));

                    RoutesDto routesDtoFor = new RoutesDto();
                    routesDtoFor.setId(route.getRouteId());
                    routesDtoFor.setName(route.getRouteName());
                    routesDtoFor.setCarrier(new RoutesDto.Сarrier());
                    routesDtoFor.getCarrier().setName(user.getUserName());
                    routesDtoFor.getCarrier().setSurname(user.getUserSurname());
                    List<String> cityNames = new ArrayList<>();
                    for (int cityId : route.getCitiesOrder()) {
                        for (Cities city : cities) {
                            if (city.getId() == cityId) {
                                cityNames.add(city.getName());
                                break;
                            }
                        }
                    }
                    routesDtoFor.setRoute(cityNames);
                    routesDto.add(routesDtoFor);
                }
                responceRoutesDto.setRoutes(routesDto);
            }
            else if (role.equals("CARRIER")) {
                Users courier = usersRepo.findByUserEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("Курьер не найден"));

                List<Delivery> deliveries = deliveryRepo.findByCourierUserId(courier.getUserId());
                for(Delivery delivery : deliveries){
                    Routes routes = routesRepo.findById(delivery.getRoute().getRouteId())
                            .orElseThrow(() -> new UsernameNotFoundException("Маршрут не найден"));

                    RoutesDto routesDtoFor = new RoutesDto();
                    routesDtoFor.setId(routes.getRouteId());
                    routesDtoFor.setName(routes.getRouteName());
                    routesDtoFor.setCarrier(new RoutesDto.Сarrier());
                    routesDtoFor.getCarrier().setName(courier.getUserName());
                    routesDtoFor.getCarrier().setSurname(courier.getUserSurname());
                    List<String> cityNames = new ArrayList<>();
                    for (int cityId : routes.getCitiesOrder()) {
                        for (Cities city : cities) {
                            if (city.getId() == cityId) {
                                cityNames.add(city.getName());
                                break;
                            }
                        }
                    }
                    routesDtoFor.setRoute(cityNames);
                    routesDto.add(routesDtoFor);
                }
            }
            responceRoutesDto.setRoutes(routesDto);
            return new ResponceErrorServerDto(200);
        }
        catch (UsernameNotFoundException e) {
            return new ResponceErrorServerDto(401);
        }
        catch (Exception e) {
            return new ResponceErrorServerDto(401);
        }
    }

    public ResponceErrorServerDto deleteRoute(int idRoute){
        try {
            Routes routes = routesRepo.findById(idRoute)
                    .orElseThrow(() -> new UsernameNotFoundException("Маршрут не найден"));

            Delivery delivery = deliveryRepo.findByRoute_RouteId(routes.getRouteId())
                    .orElseThrow(() -> new UsernameNotFoundException("Заказ не найден"));

            deliveryRepo.delete(delivery);
            routesRepo.delete(routes);
            return new ResponceErrorServerDto(200);
        }
        catch (Exception e) {
            return new ResponceErrorServerDto(401);
        }
    }
}
