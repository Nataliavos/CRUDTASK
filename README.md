# CRUDTASK

CRUDTASK (Español)

Sistema de gestión de tareas académicas construido con:

    -Vanilla JavaScript (sin frameworks)
    -SPA con Hash Routing
    -JSON Server como API simulada
    -Vite como servidor de desarrollo


ARQUITECTURA

src/
├── main.js
├── router/
│   ├── index.js
│   ├── routes.js
│   └── guards.js
├── services/
│   ├── http.js
│   ├── storage.service.js
│   ├── users.service.js
│   ├── auth.service.js
│   └── tasks.service.js
├── state/
│   └── store.js
├── templates/
│   ├── layout.template.js
│   └── components/
│       ├── statusTag.template.js
│       └── taskRow.template.js
├── utils/
│   ├── dom.js
│   ├── format.js
│   └── safe.js
└── views/
    ├── LoginView.js
    ├── RegisterView.js
    ├── MyTasksView.js
    ├── TaskFormView.js
    ├── AdminDashboardView.js
    ├── ProfileView.js
    └── NotFoundView.js



ROLES

    user: registrarse, iniciar sesión, gestionar sus tareas y su perfil.
    admin: gestionar tareas y supervisar la actividad del sistema.


FLUJO DE USO

1. Ejecuta Vite (servidor web)

    -Instalar librería:
        npm i -D vite

    -Levantar el servidor:
        npm run dev

2. Ejecuta API (JSON Server)

    -Instalar librería json-server:
        npm i json-server

    -Levantar json-server:
        npm run api
    

3. Entra por login eligiendo rol:
        admin@crudtask.com (admin)
        alex@university.edu (user)


TECNOLOGÍAS USADAS
    -HTML5
    -CSS3
    -JavaScript (Vanilla, sin frameworks)
    -JSON Server (API falsa)
    -LocalStorage o SessionStorage (manejo de sesión)


MÓDULO USUARIO

1. Registro:
    a. Crear cuenta nueva
    b. Rol asignado automáticamente: user

2. Login
    a. Validar credenciales contra JSON Server
    b. Guardar sesión

3. Gestión de tareas
    a. Listar tareas
    b. Crear tareas
    c. Editar tareas
    d. Eliminar tareas

4. Mis tareas
    a. Ver solo sus tareas
    b. Cambiar estado (pending, in progress, completed)

5. Perfil del usuario
    a. Visualizar información personal
    b. cerrar sesión


MÓDULO ADMINISTRADOR

1. Login
    a. Detectar rol admin
    b. Redirigir a dashboard

2. Dashboard
    Debe mostrar:
    -Total de tareas registradas
    -Tareas pendientes
    -Tareas completadas
    -Métricas generales del sistema

3. Gestión de tareas
    a. Ver todas las tareas
    b. Tareas pendientes
    c. Tareas completadas
    d Métricas generales del sistema