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
| ORM | Sequelize | [Puesto que elejimos mysql y sequelize es un orm maduro, es flexible para consultas de tipo raw, soporta querys avanzados, cuaja bien con este proyecto y sus analiticas, Modelos, Migraciones, Relaciones, Validaciones] |
| Validación | Zod | [Validaciones robustas, Tipado fuerte, Reutilización de esquemas, Código limpio, Nativo de typescript] |
| Testing | Jest/Mocha | [Razón] |

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

[Describe brevemente tus tablas/colecciones principales]

**Decisiones importantes:**
- **Normalización** (si usas MySQL): [Explica cómo normalizaste]
- **Índices**: [Qué índices agregaste y por qué]
- **Relaciones**: [Cómo manejaste las relaciones entre entidades]

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

**Razón**: [Por motivos de tiempo de desarrollo ya que cuenta con plantillas y componentes que se pueden solo usar]

### Patrones de Diseño

- **Responsive Design**: [¿Cómo lo abordaste? Mobile-first?]
- **Loading States**: [Lazy loading]
- **Error Handling**: [Por medio de alertas]
- **Feedback Visual**: [Modales]

### Decisiones de UX

[Explica algunas decisiones importantes de experiencia de usuario que tomaste]

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
- [Elegiste Alpine como base, para manejar un mismo tipo de SO, en todos los ambientes, consistencia de erroes en diferentes ambientes]
- [Para reducir el tamaño de las imagenes solo exponer lo necesario de mis servicios]
- [Construyendo la aplicacion con todas las librerias necesarias y luego sirviendola en el directorio final]

---

## ⚡ Optimizaciones

### Backend

- [Optimización 1 y por qué la implementaste]
- [Optimización 2]
- [etc.]

### Frontend

- [Optimización 1]
- [Optimización 2]
- [etc.]

---

## 🚧 Desafíos y Soluciones

### Desafío 1: [Nombre del desafío]

**Problema:**
[Describe el problema que enfrentaste]

**Solución:**
[Cómo lo resolviste]

**Aprendizaje:**
[Qué aprendiste de esto]

### Desafío 2: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

### Desafío 3: [Nombre del desafío]

**Problema:**
[Descripción]

**Solución:**
[Tu solución]

**Aprendizaje:**
[Qué aprendiste]

---

## 🎯 Trade-offs

### Trade-off 1: [Decisión]

**Opciones consideradas:**
- Opción A: [Descripción]
- Opción B: [Descripción]

**Elegí**: [Opción X]

**Razón:**
[Por qué elegiste esta opción sobre la otra. ¿Qué sacrificaste y qué ganaste?]

### Trade-off 2: [Decisión]

**Opciones consideradas:**
- [...]

**Elegí**: [...]

**Razón:**
[...]

---

## 🔮 Mejoras Futuras

Si tuviera más tiempo, implementaría:

1. **[Logging]**
   - Descripción: [Verificacion de posibles probleas o si la app esta funcionando de forma correcta]
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

[Reflexiona sobre qué aspectos del proyecto consideras que hiciste particularmente bien]

### ¿Qué mejorarías?

[Con más tiempo o conocimiento, ¿qué harías diferente?]

### ¿Qué aprendiste?

[¿Qué nuevas habilidades o conocimientos adquiriste durante este proyecto?]

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
