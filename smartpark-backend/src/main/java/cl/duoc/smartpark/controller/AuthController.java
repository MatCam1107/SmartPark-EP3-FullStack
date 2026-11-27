package cl.duoc.smartpark.controller;

import cl.duoc.smartpark.dto.RegistroRequest;
import cl.duoc.smartpark.dto.LoginRequest;
import cl.duoc.smartpark.dto.LoginResponse;
import cl.duoc.smartpark.service.UsuarioService;
import cl.duoc.smartpark.service.AuthService;
import cl.duoc.smartpark.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacion",
        description = "Registro e inicio y cierre de sesion")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final TokenService tokenService;

    public AuthController(
            UsuarioService usuarioService,
            AuthService authService,
            TokenService tokenService) {

        this.usuarioService = usuarioService;
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrar nuevo usuario")
    public ResponseEntity<Map<String, String>> registrar(
            @Valid @RequestBody RegistroRequest datos) {

        usuarioService.registrar(datos);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "mensaje",
                        "Registro realizado correctamente"
                ));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion",
            description = "Devuelve los datos del usuario y su token")
    public ResponseEntity<LoginResponse> iniciarSesion(
            @Valid @RequestBody LoginRequest datos) {

        return ResponseEntity.ok(
                authService.iniciarSesion(datos));
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesion",
            description = "Invalida el token de autenticacion")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> cerrarSesion(
            @Parameter(hidden = true)
            @RequestHeader("Authorization") String encabezado) {

        if (encabezado.startsWith("Bearer ")) {
            tokenService.eliminarToken(
                    encabezado.substring(7));
        }

        return ResponseEntity.noContent().build();
    }
}