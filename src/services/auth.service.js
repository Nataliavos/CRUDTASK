import { usersService } from "./users.service.js";

/*
    Servicio de autenticación.
    Simula login y registro contra la API (JSON Server).
*/

export const authService = {
    // Simula un login buscando el usuario por email y rol
    async login(email, password) {
        const users = await usersService.list();

        // find busca usuario con credenciales válidas
        return users.find(
            (u) => u.email === email && u.password === password
        ) || null;
    },

    async register({ name, email, password }) {
        const users = await usersService.list();

        // some valida que el email no exista ya
        const exists = users.some((u) => u.email === email);
        if (exists) throw new Error("Email already exists");
    
        return usersService.create({
            name,
            email,
            password,
            role: "user"     // rol siempre es user al registrar (regla de negocio)
        });
    }
};