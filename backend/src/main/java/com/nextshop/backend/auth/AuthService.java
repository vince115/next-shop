package com.nextshop.backend.auth;

import com.nextshop.backend.auth.dto.AuthRequest;
import com.nextshop.backend.auth.dto.AuthResponse;
import com.nextshop.backend.auth.dto.AuthUserResponse;
import com.nextshop.backend.auth.dto.RegisterRequest;
import com.nextshop.backend.role.Role;
import com.nextshop.backend.role.RoleRepository;
import com.nextshop.backend.user.User;
import com.nextshop.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        });

        Role role = roleRepository.findByName("customer")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found: customer"));

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setRole(role);

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), saved.getRole().getName());

        return new AuthResponse(
                token,
                new AuthUserResponse(saved.getId(), saved.getEmail(), saved.getName(), saved.getRole().getName())
        );
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        boolean ok = passwordEncoder.matches(request.password(), user.getPassword());
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().getName());

        return new AuthResponse(
                token,
                new AuthUserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().getName())
        );
    }
}
