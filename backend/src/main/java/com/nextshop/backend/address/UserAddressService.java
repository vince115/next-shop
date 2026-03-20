package com.nextshop.backend.address;

import com.nextshop.backend.user.User;
import com.nextshop.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAddressService {

    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;

    public List<UserAddressResponse> getMyAddresses(Long userId) {
        return userAddressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
            .stream()
            .map(UserAddressResponse::from)
            .toList();
    }

    @Transactional
    public UserAddressResponse createAddress(Long userId, UserAddressRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.isDefault()) {
            handleNewDefault(userId);
        }

        UserAddress address = new UserAddress();
        mapRequestToEntity(request, address);
        address.setUser(user);

        return UserAddressResponse.from(userAddressRepository.save(address));
    }

    @Transactional
    public UserAddressResponse updateAddress(Long id, Long userId, UserAddressRequest request) {
        UserAddress address = userAddressRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Change not allowed");
        }

        if (request.isDefault() && !address.isDefault()) {
            handleNewDefault(userId);
        }

        mapRequestToEntity(request, address);
        return UserAddressResponse.from(userAddressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long id, Long userId) {
        UserAddress address = userAddressRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Delete not allowed");
        }

        boolean wasDefault = address.isDefault();
        userAddressRepository.delete(address);

        // If default deleted, pick another to be default (most recent)
        if (wasDefault) {
            List<UserAddress> remain = userAddressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            if (!remain.isEmpty()) {
                UserAddress next = remain.get(0);
                next.setDefault(true);
                userAddressRepository.save(next);
            }
        }
    }

    private void handleNewDefault(Long userId) {
        userAddressRepository.findByUserIdAndIsDefaultTrue(userId)
            .ifPresent(oldDefault -> {
                oldDefault.setDefault(false);
                userAddressRepository.save(oldDefault);
            });
    }

    private void mapRequestToEntity(UserAddressRequest req, UserAddress entity) {
        entity.setName(req.name());
        entity.setPhone(req.phone());
        entity.setAddressLine1(req.addressLine1());
        entity.setAddressLine2(req.addressLine2());
        entity.setCity(req.city());
        entity.setPostalCode(req.postalCode());
        entity.setCountry(req.country());
        entity.setDefault(req.isDefault());
    }
}
