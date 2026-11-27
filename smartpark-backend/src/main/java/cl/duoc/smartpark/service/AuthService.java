package cl.duoc.smartpark.service;

import cl.duoc.smartpark.dto.LoginRequest;
import cl.duoc.smartpark.dto.LoginResponse;
import cl.duoc.smartpark.model.Usuario;
import cl.duoc.smartpark.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.Locale;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            TokenService tokenService) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public LoginResponse iniciarSesion(LoginRequest datos) {

        String email = datos.email().trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Correo o contraseña incorrectos"));

        if (!passwordEncoder.matches(
                datos.password(), usuario.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Correo o contraseña incorrectos");
        }

        String token = tokenService.generarToken(
                usuario.getEmail());

        return new LoginResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                token
        );
    }
}