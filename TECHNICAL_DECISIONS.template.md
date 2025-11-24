# Decisiones Técnicas
## [Renato Simon Resabala Vera]

> **Nota**: Este es un archivo opcional pero recomendado. Documentar tus decisiones técnicas demuestra pensamiento crítico y puede sumar puntos extra en la evaluación.

---

## 📋 Información General

- **Nombre del Candidato**: [Renato Simon Resabala Vera]
- **Fecha de Inicio**: [17/11/2025]
- **Fecha de Entrega**: [DD/MM/YYYY]
- **Tiempo Dedicado**: [35 horas]

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
|------------|---------|-------------------|
| Node.js | V20.19.5 | [Es la version LTS(long term support), recibira actualizaciones hasta abril 2026, tiene errores corregidos, es la version a fecha de hoy recomendada para proyectos empresariales de larga vida] |
| Express | 4.21.2 | [Mejor compatibilidad con node 18 o mayor, zod y sus validaciones] |
| Base de Datos | MySQL 8  | [Relaciones fuertes entre entidades, por medio de foreign keys, joins y filtros complejos, integridad de datos, menor ezfuerso de diseño] |
| ORM | Sequelize | [Puesto que eleji mysql y sequelize es un orm maduro, es flexible para consultas de tipo raw, soporta querys avanzados, cuaja bien con este proyecto y sus analiticas, modelos, migraciones, relaciones, validaciones] |
| Validación | Zod | [Validaciones robustas, Tipado fuerte, Reutilización de esquemas, Código limpio, Nativo de typescript] |
| Testing | Jest | [Me gusta la facilidad de escritura de jest, ya que es todo en uno (ejecutores, aserciones, falseo de data integrado, covertura, modo observacion de desarrollo. Ya funciona con typescript. Mocha es lo contrario, deberiamos instalar mas dependencias para lograr realizar los test (chai, sinon, nyc, ts-node/register para que sea compatible con typescript))] |

### Frontend

| Tecnología        | Versión                            | Razón de Elección                                                                                                              |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **React**         | 18.x + TS                          | Es la versión estable, compatible con Node 20, soporta Server Components, concurrent rendering y excelente ecosistema. |
| **Build Tool**    | **Vite**                           | Es más rápido que CRA, compatible con TS + SWC, permite HMR instantáneo y requiere menos configuración. |
| **Estado Global** | **Redux Toolkit + Redux DevTools** | Estandariza el manejo de estado, reduce boilerplate, soporta persistencia y debugging avanzado. |
| **Estilos**       | **Material UI (v7.x)**             | Componenteado limpio, accesible, productivo, ideal para dashboards, CRUDs. |
| **Formularios**   | **react-hook-form**                | Mejor performance vs Formik, integración directa con MUI, validación flexible con Zod/Yup. |


---

## 🏗️ Arquitectura

### Estructura del Backend

```
backend/
├───etc
│   └───mysqlbdseeds
├───src
│   ├───config
│   ├───controllers
│   ├───middlewares
│   ├───models
│   ├───routes
│   └───validations
└───tests
```

**Razón de esta estructura:**
[Estructura intuitiva para facil navegacion, con el patron MVC adaptado (Request → Routes → Middlewares → Controllers → Models → Response ↓ Validations). Separacion de responsabilidades de clases por capas. Facil de escalar y testear. Convencion estandar de Express/Node]

### Estructura del Frontend

```
frontend/
├───public
└───src
    ├───@types
    ├───api
    ├───assets
    ├───components
    │   ├───projects
    │   └───tasks
    ├───layout
    ├───pages
    ├───router
    ├───store
    │   └───slices
    └───validation
```

**Razón de esta estructura:**
[Para separar la responsabilidades de las clases, escalar horizontalmente los componentes, este proyecto es pequeño/mediano siguiendo YAGNI, no quiero usar una estructura compleja que no necesito en este momento]

---

## 🗄️ Diseño de Base de Datos

### Elección: MySQL

**Razones:**
- Objetos relacionales, asignaciones.
- Consistencia de datos estructurados.
- En Mongo, tendria que a pesar de ser mas flexibles sus colecciones,
  fallos en consistencia de relaciones, consultas complejas para realizar joins.

### Schema/Modelos

[users; usuarios del sistema, autenticacion y responsables.
projects; projectos que los usuarios gestionan como dueños o como colaboradores.
project_user; tabla privote/intermedia entre users y projects para romper relacion de muchos a muchos, evita duplicar colaboradores.
tasks; tareas que forman parte de un proyecto y que las gestionara un determinado usuario.
]

**Decisiones importantes:**
- **Normalización**: [El diseño de la base de datos se realizó siguiendo los principios de 3FN (Tercera Forma Normal) para evitar redundancia, mejorar la consistencia y facilitar mantenibilidad, cada tabla representa una entidad logica unica. Enums para evitar registros repetidos de estados y criticidad. Campos derivados no se almacenan para evitar inconsistencias, ejemplo: numero de tareas completadas, porcentajes]
- **Índices**: [ - tasks.projectId: Permite filtrar todas las tareas asignadas a un determinado
proyecto. - tasks.userId: Permite obtener las tareas asignadas a un usuario rapidamente. - tasks.status: Permite obtimizar calculos de tareas por estados. - tasks.priority: Util para filtros comunes y ordenamiento. - tasks.ownerId: Creado para obtener proyectos del usuario creador. - asks. - users.email (unique) evita duplicidad y acelera el login]
- **Relaciones**: [user 1 → N project (un usuario puede crear varios proyectos), project 1 → N task (un proyecto tiene muchas tareas), user 1 → N task (un usuario asignado a muchas tareas), project 1 → N users (En un proyecto colaboran muchos usuarios)]

---

## 🔐 Seguridad

### Implementaciones de Seguridad

- [x] **Hash de contraseñas**: [bcrypt - mas maduro y facilidad de implementacion en backend]
- [x] **JWT**: [En el back end ya tiene expiracion, si no tiene un hash valido, no puede realizar nigun tipo de interaccion, protegiendo todas las rutas despues de logearse]
- [x] **Validación de inputs**: [Definir el esquema de validación con Zod, especificando los tipos y reglas de los datos del formulario o modelos/schemas]
- [x] **CORS**: [ Implemente un proxi inverso del mismo frontend para que alcance al backend, por medio de nginx]
- [ ] **Headers de seguridad**: [¿Usaste helmet? ¿Otras medidas?]
- [ ] **Rate limiting**: [Si lo implementaste, ¿cómo?]

### Consideraciones Adicionales

[¿Qué otras medidas de seguridad tomaste? ¿Qué vulnerabilidades consideraste?]

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

**Elegí**: [Material-UI]

**Razón**: [Por motivos de tiempo de desarrollo ya que cuenta con plantillas y componentes que se pueden solo usar.
Elegí Material UI porque permite acelerar enormemente el desarrollo al contar con una amplia colección de componentes preconstruidos, plantillas listas para producción, sistema de temas altamente configurable y una comunidad muy activa. Esto permite mantener consistencia visual sin invertir demasiado tiempo en diseño UI desde cero.
]

### Patrones de Diseño

- **Responsive Design**: [Implementado bajo un enfoque **mobile-first**.
  Se aprovechan los *breakpoints* de MUI (`xs`, `sm`, `md`, `lg`, `xl`) y componentes adaptables como `Grid`, `Box` y `useMediaQuery` para asegurar que todas las vistas funcionen correctamente en dispositivos pequeños y se expandan progresivamente en pantallas más grandes.
]
- **Loading States**: [Uso de **lazy loading** y **code splitting** con `React.lazy()` y  `Suspense`. Para feedback visual se utilizan componentes como `CircularProgress` y `Skeleton` de MUI, mostrando estados de carga claros mientras llegan los datos o módulos.]
- **Error Handling**: [Manejo de errores mediante un sistema global de notificaciones utilizando **Alert** y **Snackbar** de MUI. Los errores provenientes de la API se capturan en interceptores de Axios y se muestran mensajes claros e inmediatos al usuario.
]
- **Feedback Visual**: [Se utilizan **modales** (MUI `Dialog`) y `Backdrops` para confirmar acciones críticas, mostrar formularios emergentes y ofrecer retroalimentación cuando el usuario realiza operaciones importantes como guardar, eliminar o actualizar información.
]

### Decisiones de UX

[  Los flujos fueron diseñados para requerir la menor cantidad de clics:
  - Creación rápida de tareas
  - Gestión ágil de colaboradores
  - Cambios inmediatos en prioridades y estados
  - Esto permite que el usuario opere el sistema sin interrupciones ni pasos innecesarios.
  - Se estructuró el menú y las rutas para que el usuario pueda anticipar dónde encontrar cada función.
  - Las rutas fueron nombradas de forma semántica y se mantuvo coherencia entre frontend y backend.
]

---

## 🧪 Testing

### Estrategia de Testing

**Backend:**
- [Test de integracion entre controlador, modelos, validaciones]
- [Porque a futuro con las mejoras son los mas faciles de romperse]
- [Jest Supertest]

**Frontend:**
- [Tipo de tests que escribiste]
- [¿Qué componentes decidiste probar y por qué?]
- [Herramientas usadas]

### Cobertura

- **Backend**: [X%]
- **Frontend**: [X%]

[¿Por qué decidiste este nivel de cobertura dado el tiempo disponible?]

---

## 🐳 Docker

### Implementación

- [x] Dockerfile backend
- [x] Dockerfile frontend
- [x] compose.yml

**Decisiones:**
- [Elejí Alpine como base, para manejar un mismo tipo de SO, en todos los ambientes, consistencia de erroes en diferentes ambientes]
- [Para reducir el tamaño de las imagenes solo exponer lo necesario de mis servicios, creando fases de construccion]
- [Construyendo la aplicacion con todas las librerias necesarias y luego sirviendola en el directorio final]

---

## ⚡ Optimizaciones

### Backend

- [- Uso de índices en tablas críticas (users, projects, tasks, project_user)]
- [- Relaciones Sequelize completamente tipadas y lazy loading reducido]
- [- Validación de datos a nivel API con Zod + Middleware de Validación]
- [- Control de errores centralizado (Error Middleware)]
- [- SQLite in-memory para testing, evitando corrupcion de datos]

### Frontend

- [- React + MUI con carga diferida (Lazy/Suspense) en views grandes]
- [- Minimización de renders con useMemo y useCallback en listas grandes]
- [- Skeleton loaders y feedback rápido]
- [- Validaciones en el Front antes de enviar requests]

---

## 🚧 Desafíos y Soluciones

### Desafío 1: [Gestión correcta de relaciones Many-to-Many (Project – User)]

**Problema:**
[Al definir @BelongsToMany en User, Sequelize comenzó a generar columnas incorrectas como collaboratingProjects en la tabla project_user. Esto rompía las relaciones y generaba errores al obtener colaboradores.]

**Solución:**
[Se refactorizó completamente el modelo User y el pivote ProjectUser, definiendo únicamente: userId, projectId]

**Aprendizaje:**
[No hacer shortcuts desde una tabla en sequalice, preferir hacer los joins en el servicio que se consuma o hacer relaciones cascada]

### Desafío 2: [Optimización de estadísticas por fecha (MySQL no permite DATE_FORMAT en GROUP BY)]

**Problema:**
[MySQL no permitía agrupar por DATE_FORMAT(createdAt, '%Y-%m'), lo que generaba errores y consultas lentas cuando intentábamos generar la curva de tareas por mes.]

**Solución:**
[Llamar directamente a los alias de los selects]

**Aprendizaje:**
[Se reemplazó por agrupación basada en funciones nativas]

### Desafío 3: [Pruebas automatizadas fallaban por controladores simples sin manejo de errores]

**Problema:**
[El controlador de Tasks fallaba en las pruebas porque:
- No validaba errores con try/catch.
- Respondía 200 incluso en fallos de creación.
- No retornaba 201 en creación.
- No cumplía con la estructura usada en el controlador de Projects (que sí pasaba tests).]

**Solución:**
[Se reescribió el controlador con:
- Try/catch
- Respuestas consistentes
- Códigos HTTP correctos
- Mensajes unificados]

**Aprendizaje:**
[El código real de producción debe alinearse con lo que esperan las pruebas. Consistencia = menos errores y más mantenibilidad.]

---

## 🎯 Trade-offs

### Trade-off 1: [Uso de Sequelize vs Prisma]

**Opciones consideradas:**
- Opción A: [Prisma ORM]
- Opción B: [Sequelize ORM]

**Elegí**: [Sequelize]

**Razón:**
[Por qué elegiste esta opción sobre la otra. ¿Qué sacrificaste y qué ganaste?]

### Trade-off 2: [Uso de MUI en vez de Tailwind o diseño custom]

**Opciones consideradas:**
- Opción A: [MUI]
- Opción B: [Tailwind]

**Elegí**: [MUI]

**Razón:**
[El objetivo era reducir tiempo de desarrollo y aprovechar componentes como tables, dialogs, grids, cards y formularios ya optimizados.]

### Trade-off 3: [Usar SQLite in-memory en Testing en vez de MySQL real]

**Opciones consideradas:**
- Opción A: [SQLite in-memory Rapidísimo, ideal para CI.]
- Opción B: [MySQL dockerizado Mayor fidelidad a producción, pero más lento y requiere infraestructura.]

**Elegí**: [MUI]

**Razón:**
[Permite ejecutar todos los tests en segundos, sin depender de contenedores ni configuraciones complejas.]
---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. **[Logging]**
   - Descripción: [Verificacion de posibles problemas o si la app esta funcionando de forma correcta]
   - Beneficio: [Poder conectar con servicios que me permitan conocer la salud de mi app]
   - Tiempo estimado: [2 horas]

2. **[Sistema de notificaciones]**
   - Descripción: [Implementar toast]
   - Beneficio: [Para que el usuario final, sepa que esta pasando]
   - Tiempo estimado: [2 Horas]

3. **[Testing coverage]**
   - Descripción: [ Conocer el porcentaje de covertura que cubren mis pruebas]
   - Beneficio: [ Verificar si la mayoria de mi codigo escrito se usa]
   - Tiempo estimado: [8 horas]

4. **[Impelentar capa de servicios y repositorios en backend]**
   - Descripción: [ Los servicios contendrán la lógica de negocio compleja (reglas de negocio, operaciones, transformación de datos), mientras los repositorios abstraerá el acceso a datos encapsulando las consultas a Sequelize. ]
   - Beneficio: [Mejora significativa en la mantenibilidad y testabilidad del código al aplicar el principio de responsabilidad única (SRP) y facilitar la inyección de dependencias.]
   - Tiempo estimado: [8 horas]

---

## 📚 Recursos Consultados

Lista de recursos que consultaste durante el desarrollo:

- [Documentación oficial de X]
- [Artículo sobre Y]
- [Stack Overflow thread sobre Z]
- [etc.]

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

El proyecto tuvo varios aspectos sólidos:
- Arquitectura clara y escalable en el backend, con separación adecuada entre controladores, modelos, rutas, middlewares y validaciones.
- Uso eficiente de Sequelize, aprovechando relaciones complejas (1:N, N:M, pivotes) sin perder claridad.
- Sistema de autenticación robusto basado en JWT con roles implícitos (owner/colaborador).
- API documentada con Swagger, lo que facilita el consumo por cualquier frontend.
- Test automatizados que garantizan estabilidad y evitan regresiones.
- Manejo adecuado de estadísticas, corrigiendo consultas complejas y optimizándolas para MySQL.
- Frontend con MUI, permitiendo construir rápidamente interfaces limpias, responsivas y consistentes.
- Mejora continua, ya que varias partes se refactorizaron conforme avanzó el proyecto (tasks, stats, relaciones, controladores).
- En resumen: el proyecto terminó siendo ordenado, coherente, mantenible y escalable.

### ¿Qué mejorarías?

Con más tiempo o recursos, podrías:
- Agregar control de roles más granular (por ejemplo: permisos por colaborador, límites por proyecto, logs de acciones).
- Implementar un sistema de colas para tareas pesadas (como envío de correos o generación de reportes grandes).
- Mejorar la cobertura de pruebas, incluyendo pruebas unitarias puras para servicios y utilidades.
- Optimizar aún más las consultas del módulo de estadísticas, cacheando resultados frecuentes.
- Agregar un diseño más personalizado en el frontend si se requiere una identidad visual propia.
- Incorporar WebSockets para actualizaciones en tiempo real (tareas, asignaciones, progreso).
- Internacionalización (i18n) si el proyecto se usa en múltiples países.

### ¿Qué aprendiste?
Este proyecto dejó aprendizajes valiosos:
- Diseñar un backend completo desde cero con Express, Sequelize pero con typescript como cabecera, incluyendo autenticación, relaciones, middlewares y validaciones.
- Cómo manejar correctamente relaciones complejas con BelongsToMany, pivot tables y propiedades personalizadas.
- La importancia de pruebas automáticas, especialmente al implementar cambios grandes en modelos o controladores.
- Optimización de consultas en MySQL, especialmente evitando DATE_FORMAT en agrupaciones para no romper índices.
- Buenas prácticas de REST API y documentación Swagger, permitiendo a cualquier cliente interactuar con la API sin ambigüedades.
- Uso profesional de Material-UI, incluyendo patrones de diseño responsivo, interacción, feedback visual y manejo de errores.
- Cómo enfrentar y resolver problemas reales, incluyendo migraciones, fallos de consultas, relaciones equivocadas y consistencia en el API.
- En general, el proyecto permitió crecer tanto en arquitectura, como en optimización, automatización, pruebas, modelado de datos y experiencia de usuario.

---

## 📸 Capturas de Pantalla

[Opcional: Agrega capturas de pantalla de tu aplicación]

### Login
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Lista de Proyectos
![Projects](./screenshots/projects.png)

### Detalle de Tareas
![Tasks](./screenshots/tasks.png)

---

**Fecha de última actualización**: [DD/MM/YYYY]
