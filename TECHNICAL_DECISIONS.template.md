# Decisiones Técnicas
## [Renato Simon Resabala Vera]

> **Nota**: Este es un archivo opcional pero recomendado. Documentar tus decisiones técnicas demuestra pensamiento crítico y puede sumar puntos extra en la evaluación.

---

## 📋 Información General

- **Nombre del Candidato**: [Renato Simon Resabala Vera]
- **Fecha de Inicio**: [17/11/2025]
- **Fecha de Entrega**: [DD/MM/YYYY]
- **Tiempo Dedicado**: [Ej: ~20 horas]

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
├── src/
│   ├── [tu estructura]
│   └── ...
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

### Estructura del Frontend

```
frontend/
├── src/
│   ├── [tu estructura]
│   └── ...
```

**Razón de esta estructura:**
[Explica por qué organizaste tu código de esta manera]

---

## 🗄️ Diseño de Base de Datos

### Elección: MySQL / MongoDB

**Razones:**
- [Razón 1]
- [Razón 2]
- [Razón 3]

### Schema/Modelos

[Describe brevemente tus tablas/colecciones principales]

**Decisiones importantes:**
- **Normalización** (si usas MySQL): [Explica cómo normalizaste]
- **Índices**: [Qué índices agregaste y por qué]
- **Relaciones**: [Cómo manejaste las relaciones entre entidades]

---

## 🔐 Seguridad

### Implementaciones de Seguridad

- [ ] **Hash de contraseñas**: [bcrypt, argon2, etc. - ¿Por qué elegiste este?]
- [ ] **JWT**: [¿Cómo configuraste la expiración? ¿Por qué?]
- [ ] **Validación de inputs**: [¿Qué estrategia usaste?]
- [ ] **CORS**: [¿Cómo lo configuraste?]
- [ ] **Headers de seguridad**: [¿Usaste helmet? ¿Otras medidas?]
- [ ] **Rate limiting**: [Si lo implementaste, ¿cómo?]

### Consideraciones Adicionales

[¿Qué otras medidas de seguridad tomaste? ¿Qué vulnerabilidades consideraste?]

---

## 🎨 Decisiones de UI/UX

### Framework/Librería de UI

**Elegí**: [Ninguna / Material-UI / Ant Design / TailwindCSS / etc.]

**Razón**: [¿Por qué elegiste esto sobre otras opciones?]

### Patrones de Diseño

- **Responsive Design**: [¿Cómo lo abordaste? Mobile-first?]
- **Loading States**: [¿Cómo manejaste los estados de carga?]
- **Error Handling**: [¿Cómo muestras errores al usuario?]
- **Feedback Visual**: [Toasts, modales, etc.]

### Decisiones de UX

[Explica algunas decisiones importantes de experiencia de usuario que tomaste]

---

## 🧪 Testing

### Estrategia de Testing

**Backend:**
- [Tipo de tests que escribiste]
- [¿Por qué elegiste probar estos endpoints/funciones específicamente?]
- [Herramientas usadas]

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

- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [ ] docker-compose.yml

**Decisiones:**
- [¿Por qué elegiste Alpine/Debian como base?]
- [¿Usaste multi-stage builds? ¿Por qué?]
- [¿Cómo optimizaste el tamaño de las imágenes?]

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

1. **[Mejora 1]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

2. **[Mejora 2]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

3. **[Mejora 3]**
   - Descripción: [...]
   - Beneficio: [...]
   - Tiempo estimado: [...]

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
