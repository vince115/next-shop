package com.nextshop.backend.address;

import com.nextshop.backend.user.User;
import com.nextshop.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/user-addresses")
@RequiredArgsConstructor
@Slf4j
public class UserAddressController {

    private final UserAddressService userAddressService;
    private final UserRepository userRepository;

    @GetMapping
    public List<UserAddressResponse> getMyAddresses(Authentication auth) {
        Long userId = getUserId(auth);
        return userAddressService.getMyAddresses(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserAddressResponse createAddress(Authentication auth, @Valid @RequestBody UserAddressRequest request) {
        Long userId = getUserId(auth);
        return userAddressService.createAddress(userId, request);
    }

    @PutMapping("/{id}")
    public UserAddressResponse updateAddress(Authentication auth, @PathVariable Long id, @Valid @RequestBody UserAddressRequest request) {
        Long userId = getUserId(auth);
        return userAddressService.updateAddress(id, userId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAddress(Authentication auth, @PathVariable Long id) {
        Long userId = getUserId(auth);
        userAddressService.deleteAddress(id, userId);
    }

    private Long getUserId(Authentication auth) {
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        String email = auth.getName();
        log.info("EMAIL={}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.error("USER_NOT_FOUND for EMAIL={}", email);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            });
        log.info("USER_ID={}", user.getId());
        return user.getId();
    }
}
