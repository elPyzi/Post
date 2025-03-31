package com.logistics.server.entity;

import java.io.Serializable;
import java.util.Objects;

public class SupplierId implements Serializable {
    private Integer user;
    private Integer transportType;

    public SupplierId() {}
    public SupplierId(Integer user, Integer transportType) {
        this.user = user;
        this.transportType = transportType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SupplierId that = (SupplierId) o;
        return Objects.equals(user, that.user) &&
                Objects.equals(transportType, that.transportType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, transportType);
    }
}