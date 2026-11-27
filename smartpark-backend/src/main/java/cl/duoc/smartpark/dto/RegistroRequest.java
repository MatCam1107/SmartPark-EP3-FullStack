package cl.duoc.smartpark.dto;

import jakarta.validation.constraints.*;

public record RegistroRequest(

        @NotBlank
        @Pattern(regexp = "[0-9]{6,8}[0-9Kk]")
        String run,

        @NotBlank
        @Size(max = 50)
        String nombre,

        @NotBlank
        @Size(max = 49)
        String apellidos,

        @NotBlank
        @Email
        @Size(max = 100)
        @Pattern(
            regexp = "^[^@\\s]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$",
            flags = Pattern.Flag.CASE_INSENSITIVE
        )
        String email,

        @NotBlank
        @Size(min = 8, max = 18)
        String password,

        @NotBlank
        @Size(max = 100)
        String region,

        @NotBlank
        @Size(max = 100)
        String comuna,

        @NotBlank
        @Size(max = 200)
        String direccion

) {
}

