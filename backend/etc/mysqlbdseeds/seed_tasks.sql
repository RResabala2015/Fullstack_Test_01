-- =============================================
-- SEED DATA: Tasks para Testing y Desarrollo
-- =============================================

-- Asegúrate de tener proyectos creados primero
-- Ajusta los projectId y assignedTo según tu base de datos

-- =============================================
-- PROYECTO 1: Desarrollo Web E-commerce
-- =============================================
INSERT INTO tasks (title, description, status, priority, projectId, assignedTo, createdAt, updatedAt) VALUES

-- Tareas Pending
('Diseñar mockups de landing page', 'Crear diseños en Figma para la página principal con hero section, features y testimonios', 'pending', 'high', 1, 1, NOW(), NOW()),
('Configurar pasarela de pagos', 'Integrar Stripe/PayPal para procesar pagos con tarjeta de crédito', 'pending', 'high', 1, 1, NOW(), NOW()),
('Implementar carrito de compras', 'Desarrollar funcionalidad de carrito con persistencia en localStorage', 'pending', 'mid', 1, 1, NOW(), NOW()),
('Crear sistema de cupones', 'Módulo para aplicar códigos de descuento en el checkout', 'pending', 'low', 1, 1, NOW(), NOW()),
('Optimizar imágenes de productos', 'Comprimir y convertir imágenes a WebP para mejor performance', 'pending', 'low', 1, 1, NOW(), NOW()),

-- Tareas In Progress
('Desarrollar API de productos', 'Endpoints CRUD para gestión de productos con filtros y paginación', 'inProgress', 'high', 1, 1, NOW(), NOW()),
('Implementar autenticación JWT', 'Sistema de login/registro con tokens y refresh tokens', 'inProgress', 'high', 1, 1, NOW(), NOW()),
('Crear dashboard de admin', 'Panel de administración para gestionar productos y pedidos', 'inProgress', 'mid', 1, 1, NOW(), NOW()),

-- Tareas Completed
('Configurar proyecto React + Vite', 'Setup inicial con TypeScript, ESLint y Prettier', 'completed', 'high', 1, 1, NOW(), NOW()),
('Diseñar esquema de base de datos', 'Modelado de entidades: usuarios, productos, pedidos, categorías', 'completed', 'high', 1, 1, NOW(), NOW()),
('Implementar registro de usuarios', 'Formulario de registro con validación y verificación de email', 'completed', 'mid', 1, 1, NOW(), NOW()),
('Configurar Docker para desarrollo', 'Dockerfiles y docker-compose para ambiente local', 'completed', 'mid', 1, 1, NOW(), NOW());

-- =============================================
-- PROYECTO 2: App Mobile de Fitness
-- =============================================
INSERT INTO tasks (title, description, status, priority, projectId, assignedTo, createdAt, updatedAt) VALUES

-- Tareas Pending
('Diseñar flujo de onboarding', 'Pantallas de bienvenida y configuración inicial del usuario', 'pending', 'high', 2, 1, NOW(), NOW()),
('Implementar tracking de ejercicios', 'Registro de series, repeticiones y peso por ejercicio', 'pending', 'high', 2, 1, NOW(), NOW()),
('Crear sistema de notificaciones push', 'Recordatorios de entrenamientos y logros alcanzados', 'pending', 'mid', 2, 1, NOW(), NOW()),
('Integrar Apple Health / Google Fit', 'Sincronización de datos de salud con APIs nativas', 'pending', 'mid', 2, 1, NOW(), NOW()),
('Diseñar sistema de gamificación', 'Badges, streaks y sistema de puntos por constancia', 'pending', 'low', 2, 1, NOW(), NOW()),

-- Tareas In Progress
('Desarrollar pantalla de workout', 'UI para seguir rutinas con temporizador y descansos', 'inProgress', 'high', 2, 1, NOW(), NOW()),
('Crear base de datos de ejercicios', 'Catálogo de +200 ejercicios con videos e instrucciones', 'inProgress', 'mid', 2, 1, NOW(), NOW()),
('Implementar gráficas de progreso', 'Charts para visualizar evolución de peso y medidas', 'inProgress', 'mid', 2, 1, NOW(), NOW()),

-- Tareas Completed
('Configurar proyecto React Native', 'Setup con Expo, navegación y estructura de carpetas', 'completed', 'high', 2, 1, NOW(), NOW()),
('Diseñar UI kit en Figma', 'Componentes base: botones, inputs, cards, colores', 'completed', 'high', 2, 1, NOW(), NOW()),
('Implementar login social', 'Autenticación con Google y Apple Sign-In', 'completed', 'mid', 2, 1, NOW(), NOW());

-- =============================================
-- PROYECTO 3: Sistema de Gestión Interna
-- =============================================
INSERT INTO tasks (title, description, status, priority, projectId, assignedTo, createdAt, updatedAt) VALUES

-- Tareas Pending
('Crear módulo de reportes PDF', 'Generación de informes exportables en formato PDF', 'pending', 'mid', 3, 1, NOW(), NOW()),
('Implementar búsqueda avanzada', 'Filtros combinados con Elasticsearch o Algolia', 'pending', 'low', 3, 1, NOW(), NOW()),
('Diseñar módulo de facturación', 'Gestión de facturas, notas de crédito y pagos', 'pending', 'high', 3, 1, NOW(), NOW()),
('Crear sistema de auditoría', 'Log de cambios y acciones de usuarios en el sistema', 'pending', 'mid', 3, 1, NOW(), NOW()),

-- Tareas In Progress  
('Desarrollar gestión de empleados', 'CRUD de empleados con roles y departamentos', 'inProgress', 'high', 3, 1, NOW(), NOW()),
('Implementar calendario de eventos', 'Agenda compartida con integración a Google Calendar', 'inProgress', 'mid', 3, 1, NOW(), NOW()),

-- Tareas Completed
('Configurar arquitectura backend', 'Node.js + Express + Sequelize con MySQL', 'completed', 'high', 3, 1, NOW(), NOW()),
('Implementar sistema de roles', 'RBAC con permisos granulares por módulo', 'completed', 'high', 3, 1, NOW(), NOW()),
('Crear módulo de clientes', 'Gestión completa de clientes y contactos', 'completed', 'mid', 3, 1, NOW(), NOW()),
('Diseñar dashboard principal', 'KPIs y métricas clave del negocio', 'completed', 'mid', 3, 1, NOW(), NOW());

-- =============================================
-- PROYECTO 4: Blog / CMS Personal
-- =============================================
INSERT INTO tasks (title, description, status, priority, projectId, assignedTo, createdAt, updatedAt) VALUES

-- Tareas Pending
('Implementar comentarios', 'Sistema de comentarios con moderación y respuestas anidadas', 'pending', 'mid', 4, 1, NOW(), NOW()),
('Crear newsletter', 'Suscripción a boletín con integración a Mailchimp', 'pending', 'low', 4, 1, NOW(), NOW()),
('Añadir modo oscuro', 'Toggle para cambiar entre tema claro y oscuro', 'pending', 'low', 4, 1, NOW(), NOW()),
('Optimizar SEO', 'Meta tags dinámicos, sitemap y structured data', 'pending', 'mid', 4, 1, NOW(), NOW()),

-- Tareas In Progress
('Crear editor de posts', 'Editor WYSIWYG con soporte para markdown e imágenes', 'inProgress', 'high', 4, 1, NOW(), NOW()),
('Implementar categorías y tags', 'Organización de contenido con taxonomías', 'inProgress', 'mid', 4, 1, NOW(), NOW()),

-- Tareas Completed
('Configurar Next.js con MDX', 'Setup de proyecto con renderizado estático', 'completed', 'high', 4, 1, NOW(), NOW()),
('Diseñar layout responsive', 'Plantilla base mobile-first con Tailwind CSS', 'completed', 'high', 4, 1, NOW(), NOW()),
('Implementar página de about', 'Sección con bio, skills y experiencia', 'completed', 'low', 4, 1, NOW(), NOW());

-- =============================================
-- PROYECTO 5: API de Microservicios
-- =============================================
INSERT INTO tasks (title, description, status, priority, projectId, assignedTo, createdAt, updatedAt) VALUES

-- Tareas Pending
('Implementar circuit breaker', 'Patrón de resiliencia con Hystrix o similar', 'pending', 'high', 5, 1, NOW(), NOW()),
('Configurar service mesh', 'Implementar Istio para gestión de tráfico', 'pending', 'mid', 5, 1, NOW(), NOW()),
('Crear servicio de emails', 'Microservicio para envío de correos transaccionales', 'pending', 'mid', 5, 1, NOW(), NOW()),
('Implementar rate limiting', 'Control de tasa de peticiones por cliente', 'pending', 'high', 5, 1, NOW(), NOW()),

-- Tareas In Progress
('Desarrollar API Gateway', 'Kong o AWS API Gateway para ruteo centralizado', 'inProgress', 'high', 5, 1, NOW(), NOW()),
('Configurar message queue', 'RabbitMQ o Redis para comunicación async', 'inProgress', 'high', 5, 1, NOW(), NOW()),
('Implementar tracing distribuido', 'Jaeger para seguimiento de requests', 'inProgress', 'mid', 5, 1, NOW(), NOW()),

-- Tareas Completed
('Definir contratos de API', 'OpenAPI specs para todos los servicios', 'completed', 'high', 5, 1, NOW(), NOW()),
('Configurar Kubernetes', 'Cluster K8s con namespaces y deployments', 'completed', 'high', 5, 1, NOW(), NOW()),
('Implementar health checks', 'Endpoints de salud y readiness probes', 'completed', 'mid', 5, 1, NOW(), NOW()),
('Configurar CI/CD', 'Pipelines con GitHub Actions para deploy automático', 'completed', 'high', 5, 1, NOW(), NOW());

-- =============================================
-- VERIFICAR DATOS INSERTADOS
-- =============================================
SELECT 
  status,
  priority,
  COUNT(*) as total
FROM tasks 
GROUP BY status, priority
ORDER BY status, priority;

-- Resumen por proyecto
SELECT 
  p.name as proyecto,
  COUNT(t.id) as total_tasks,
  SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN t.status = 'inProgress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed
FROM projects p
LEFT JOIN tasks t ON p.id = t.projectId
GROUP BY p.id, p.name;