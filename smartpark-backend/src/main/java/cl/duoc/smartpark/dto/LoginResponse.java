package cl.duoc.smartpark.dto;

public record LoginResponse(

        Long id,
        String nombre,
        String email,
        String rol,
        String token

) {
}