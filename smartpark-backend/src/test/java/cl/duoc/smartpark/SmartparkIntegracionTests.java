package cl.duoc.smartpark;

import cl.duoc.smartpark.service.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SmartparkIntegracionTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TokenService tokenService;

    @Test
    void listarEstacionamientos() throws Exception {

        mockMvc.perform(get("/api/estacionamientos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void rechazarAccesoSinToken() throws Exception {

        mockMvc.perform(delete("/api/estacionamientos/999999"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rechazarTokenInvalido() throws Exception {

        mockMvc.perform(delete("/api/estacionamientos/999999")
                .header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void impedirEliminacionComoCliente() throws Exception {

        String token = tokenService.generarToken(
                "cliente.prueba@gmail.com");

        mockMvc.perform(delete("/api/estacionamientos/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void permitirAccesoComoAdministrador() throws Exception {

        String token = tokenService.generarToken(
                "admin.smartpark@gmail.com");

        mockMvc.perform(delete("/api/estacionamientos/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void rechazarTokenRevocado() throws Exception {

        String token = tokenService.generarToken(
                "cliente.prueba@gmail.com");

        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/estacionamientos/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }
}