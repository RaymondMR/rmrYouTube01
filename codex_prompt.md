# PROYECTO: YOUTUBE CONTENT MANAGER


---

## OBJETIVO PRINCIPAL

Crear una aplicación web Laravel con las siguientes características:

---

## 1. ESTRUCTURA DE BASE DE DATOS

Necesito migraciones de PostgreSQL para las siguientes tablas (corrigiendo inconsistencias del SQL original),
falta crear las relaciones con la tabala users para tambien tomar en cuenta al usuario

### Tablas para Listas de Reproducción:

**Tabla: playlists**
- id (Primary Key)
- title (string, required)
- description (text, nullable)
- url (string, required, unique)
- created_at
- updated_at

**Tabla: playlist_categories**
- id (Primary Key)
- name (string, required, unique)
- created_at
- updated_at

**Tabla: playlist_category (Pivote)**
- playlist_id (Foreign Key → playlists.id)
- category_id (Foreign Key → playlist_categories.id)
- Primary Key compuesta (playlist_id, category_id)
- CASCADE en eliminación

### Tablas para Canales:

**Tabla: channels**
- id (Primary Key)
- name (string, required)
- description (text, nullable)
- url (string, required, unique)
- created_at
- updated_at

**Tabla: channel_categories**
- id (Primary Key)
- name (string, required, unique)
- created_at
- updated_at

**Tabla: channel_category (Pivote)**
- channel_id (Foreign Key → channels.id)
- category_id (Foreign Key → channel_categories.id)
- Primary Key compuesta (channel_id, category_id)
- CASCADE en eliminación

### Relaciones:
- Muchos a Muchos entre Playlists y Playlist_Categories
- Muchos a Muchos entre Channels y Channel_Categories
- Todas las relaciones con CASCADE en eliminación

---

## 2. ESTRUCTURA DE PÁGINAS Y FUNCIONALIDADES

### 2.1 Landing Page (Home) - Ruta: `/`

**Diseño:**
- Dos tarjetas principales con diseño moderno usando Tailwind
- Layout centrado y responsive

**Tarjetas:**
1. **"Categorías de Listas de Reproducción"**
   - Enlaza a `/playlist-categories`
   - Icono sugerido: 📺 o similar
   - Descripción breve

2. **"Categorías de Canales"**
   - Enlaza a `/channel-categories`
   - Icono sugerido: 📡 o similar
   - Descripción breve

---

### 2.2 Página de Categorías de Listas de Reproducción

**Ruta:** `/playlist-categories`

**Breadcrumbs:** `Home > Categorías de Listas de Reproducción`

**Funcionalidades:**
- Mostrar todas las categorías en formato grid de tarjetas
- Cada tarjeta muestra:
  - Nombre de la categoría
  - Contador de playlists asociadas
  - Fecha de creación
- Barra de búsqueda/filtro por nombre
- Botón "Nueva Categoría" que abre modal

**Acciones en Tarjetas:**
- Click en tarjeta → `/playlist-categories/{id}/playlists`
- Botón Editar → Abre modal de edición
- Botón Eliminar → Muestra confirmación antes de eliminar

**Modal de Agregar/Editar Categoría:**
- Campo: Nombre (requerido)
- Botones: Guardar / Cancelar
- Validación en tiempo real

---

### 2.3 Página de Listas de Reproducción por Categoría

**Ruta:** `/playlist-categories/{id}/playlists`

**Breadcrumbs:** `Home > Categorías de Listas > [Nombre Categoría]`

**Header:**
- Título: Nombre de la categoría actual
- Botón "Nueva Playlist"

**Funcionalidades:**
- Grid de tarjetas de playlists
- Cada tarjeta muestra:
  - Título de la playlist
  - Descripción (truncada si es larga)
  - Thumbnail de YouTube (si es posible extraerlo de la URL)
  - Icono/botón de enlace externo a YouTube
  - Tags de las categorías asignadas
- Barra de búsqueda/filtro por nombre
- Ordenamiento opcional (por fecha, nombre)

**Acciones en Tarjetas:**
- Click en título/imagen → Abre YouTube en nueva pestaña
- Botón Editar → Abre modal de edición
- Botón Eliminar → Muestra confirmación antes de eliminar

**Modal de Agregar/Editar Playlist:**
- Campo: Título (requerido)
- Campo: URL de YouTube (requerido, validar formato)
- Campo: Descripción (textarea, opcional)
- Campo: Categorías (select múltiple, mínimo 1 requerida)
- Vista previa de thumbnail si la URL es válida
- Botones: Guardar / Cancelar

---

### 2.4 Página de Categorías de Canales

**Ruta:** `/channel-categories`

**Breadcrumbs:** `Home > Categorías de Canales`

**Funcionalidades:**
- Mostrar todas las categorías en formato grid de tarjetas
- Cada tarjeta muestra:
  - Nombre de la categoría
  - Contador de canales asociados
  - Fecha de creación
- Barra de búsqueda/filtro por nombre
- Botón "Nueva Categoría" que abre modal

**Acciones en Tarjetas:**
- Click en tarjeta → `/channel-categories/{id}/channels`
- Botón Editar → Abre modal de edición
- Botón Eliminar → Muestra confirmación antes de eliminar

**Modal de Agregar/Editar Categoría:**
- Campo: Nombre (requerido)
- Botones: Guardar / Cancelar
- Validación en tiempo real

---

### 2.5 Página de Canales por Categoría

**Ruta:** `/channel-categories/{id}/channels`

**Breadcrumbs:** `Home > Categorías de Canales > [Nombre Categoría]`

**Header:**
- Título: Nombre de la categoría actual
- Botón "Nuevo Canal"

**Funcionalidades:**
- Grid de tarjetas de canales
- Cada tarjeta muestra:
  - Nombre del canal
  - Descripción (truncada si es larga)
  - Thumbnail de YouTube (si es posible extraerlo de la URL)
  - Icono/botón de enlace externo a YouTube
  - Tags de las categorías asignadas
- Barra de búsqueda/filtro por nombre
- Ordenamiento opcional (por fecha, nombre)

**Acciones en Tarjetas:**
- Click en título/imagen → Abre YouTube en nueva pestaña
- Botón Editar → Abre modal de edición
- Botón Eliminar → Muestra confirmación antes de eliminar

**Modal de Agregar/Editar Canal:**
- Campo: Nombre (requerido)
- Campo: URL de YouTube (requerido, validar formato)
- Campo: Descripción (textarea, opcional)
- Campo: Categorías (select múltiple, mínimo 1 requerida)
- Vista previa de thumbnail si la URL es válida
- Botones: Guardar / Cancelar

---

## 3. VALIDACIONES REQUERIDAS

### Validaciones de URLs de YouTube:

**Para Playlists:**
- Formato válido: `https://www.youtube.com/playlist?list=...`
- Regex sugerido: `/^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=[\w-]+$/`

**Para Canales:**
- Formatos válidos:
  - `https://www.youtube.com/@nombrecanal`
  - `https://www.youtube.com/channel/UC...`
  - `https://www.youtube.com/c/nombrecanal`
- Regex sugerido: `/^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|channel\/|@)[\w-]+$/`

### Validaciones de Formularios:

**Categorías:**
- Nombre: required, string, max:255, unique (en su tabla respectiva)

**Playlists:**
- title: required, string, max:255
- url: required, url, unique, validación personalizada de YouTube
- description: nullable, string, max:1000
- categories: required, array, min:1

**Canales:**
- name: required, string, max:255
- url: required, url, unique, validación personalizada de YouTube
- description: nullable, string, max:1000
- categories: required, array, min:1

---

## 4. REQUERIMIENTOS DE UI/UX

### Diseño General:
- **Framework CSS:** Tailwind CSS (ya configurado)
- **Tema:** Moderno, limpio y minimalista
- **Colores:** Paleta inspirada en YouTube (rojo, blanco, negro, grises)
- **Responsive:** Totalmente adaptable a móviles y tablets

### Componentes Específicos:

**Breadcrumbs:**
- Visible en todas las páginas excepto Home
- Formato: `Home > Sección > Subsección`
- Links funcionales para navegación rápida
- Usar iconos (→ o /) como separadores

**Tarjetas:**
- Sombra suave con hover effect (elevación)
- Bordes redondeados
- Padding generoso
- Transiciones suaves
- Botones de acción visibles en hover

**Modales:**
- Centrados en pantalla
- Fondo oscuro semi-transparente (backdrop)
- Animación de aparición (fade in + scale)
- Cerrar con X, ESC o click fuera del modal
- Formularios con validación en tiempo real

**Confirmaciones de Eliminación:**
- Modal con mensaje claro
- Botones: "Cancelar" (gris) y "Eliminar" (rojo)
- Mostrar nombre del elemento a eliminar

**Notificaciones:**
- Toast notifications o Alerts para:
  - ✅ Creación exitosa
  - ✅ Actualización exitosa
  - ✅ Eliminación exitosa
  - ❌ Errores de validación
- Posición: Top-right de la pantalla
- Auto-dismiss después de 3-5 segundos

**Búsqueda/Filtros:**
- Input con icono de lupa
- Búsqueda en tiempo real (debounced)
- Placeholder descriptivo

**Thumbnails de YouTube:**
- Intentar extraer usando:
  - Para playlists: `https://img.youtube.com/vi/[VIDEO_ID]/maxresdefault.jpg`
  - Para canales: Usar YouTube Data API o placeholder si no es posible
- Fallback: Imagen placeholder genérica
- Lazy loading para optimización

---

## 5. CONFIGURACIÓN INICIAL NECESARIA

### 5.1 Configuración de PostgreSQL:

```bash
# Crear base de datos
createdb youtube_manager
```

### 5.2 Actualizar archivo `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=youtube_manager
DB_USERNAME=[tu_usuario]
DB_PASSWORD=[tu_contraseña]
```

### 5.3 Comandos a ejecutar:

```bash
# Instalar dependencias
composer install
npm install

# Generar key
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Compilar assets
npm run dev

# Iniciar servidor
php artisan serve
```

---

## 6. PRIORIDAD DE IMPLEMENTACIÓN

### ✅ FASE 1: Fundación (Implementar primero)
1. Verificar y ajustar configuración de PostgreSQL
2. Crear todas las migraciones necesarias
3. Crear modelos Eloquent con relaciones:
   - `Playlist` con relación `belongsToMany` a `PlaylistCategory`
   - `PlaylistCategory` con relación `belongsToMany` a `Playlist`
   - `Channel` con relación `belongsToMany` a `ChannelCategory`
   - `ChannelCategory` con relación `belongsToMany` a `Channel`
4. Verificar sistema de autenticación existente
5. Crear layout base con navegación y breadcrumbs
6. Implementar Landing Page con las dos tarjetas principales

### ✅ FASE 2: Módulo de Playlists
7. Crear controladores:
   - `PlaylistCategoryController`
   - `PlaylistController`
8. Crear rutas correspondientes
9. Implementar vistas de Categorías de Playlists:
   - Index de categorías
   - Modales de crear/editar/eliminar categoría
10. Implementar vistas de Playlists:
    - Index de playlists por categoría
    - Modales de crear/editar/eliminar playlist
11. Implementar validaciones personalizadas para URLs de YouTube
12. Implementar búsqueda/filtrado

### ✅ FASE 3: Módulo de Canales
13. Crear controladores:
    - `ChannelCategoryController`
    - `ChannelController`
14. Crear rutas correspondientes
15. Implementar vistas de Categorías de Canales:
    - Index de categorías
    - Modales de crear/editar/eliminar categoría
16. Implementar vistas de Canales:
    - Index de canales por categoría
    - Modales de crear/editar/eliminar canal
17. Implementar validaciones personalizadas para URLs de YouTube
18. Implementar búsqueda/filtrado

### ✅ FASE 4: Pulido y Optimización
19. Implementar thumbnails de YouTube
20. Añadir notificaciones toast
21. Mejorar transiciones y animaciones
22. Optimizar búsquedas (considerar índices en BD)
23. Añadir seeders con datos de ejemplo para testing
24. Pruebas de usabilidad y corrección de bugs

---

## 7. ESTRUCTURA DE ARCHIVOS SUGERIDA

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── PlaylistCategoryController.php
│   │   ├── PlaylistController.php
│   │   ├── ChannelCategoryController.php
│   │   └── ChannelController.php
│   └── Requests/
│       ├── StorePlaylistRequest.php
│       ├── UpdatePlaylistRequest.php
│       ├── StoreChannelRequest.php
│       └── UpdateChannelRequest.php
├── Models/
│   ├── Playlist.php
│   ├── PlaylistCategory.php
│   ├── Channel.php
│   └── ChannelCategory.php
└── Rules/
    ├── YouTubePlaylistUrl.php
    └── YouTubeChannelUrl.php

database/
├── migrations/
│   ├── xxxx_create_playlists_table.php
│   ├── xxxx_create_playlist_categories_table.php
│   ├── xxxx_create_playlist_category_table.php
│   ├── xxxx_create_channels_table.php
│   ├── xxxx_create_channel_categories_table.php
│   └── xxxx_create_channel_category_table.php
└── seeders/
    └── DemoDataSeeder.php

resources/
├── views/
│   ├── layouts/
│   │   ├── app.blade.php
│   │   └── components/
│   │       ├── breadcrumbs.blade.php
│   │       └── modal.blade.php
│   ├── home.blade.php
│   ├── playlist-categories/
│   │   └── index.blade.php
│   ├── playlists/
│   │   └── index.blade.php
│   ├── channel-categories/
│   │   └── index.blade.php
│   └── channels/
│       └── index.blade.php
└── js/
    └── components/
        ├── modal.js
        ├── toast.js
        └── search.js

routes/
└── web.php
```

---

## 8. NOTAS IMPORTANTES PARA EL DESARROLLO

### Para el Desarrollador (yo):
- ⚠️ Soy principiante en Laravel
- 📝 Por favor incluir **comentarios explicativos** en el código
- 🎓 Explicar conceptos de Laravel cuando sea necesario
- ✅ Seguir las convenciones y mejores prácticas de Laravel

### Mejores Prácticas a Seguir:
- Usar **Form Requests** para validaciones complejas
- Usar **Resource Controllers** para operaciones CRUD
- Implementar **Soft Deletes** si es necesario en el futuro
- Usar **Eloquent Relationships** correctamente
- Nomenclatura consistente (español o inglés, no mezclar)
- Separar lógica de negocio del controlador (usar Services si es necesario)

### Seguridad:
- Validar TODAS las entradas de usuario
- Usar protección CSRF en formularios (ya incluido en Laravel)
- Sanitizar URLs antes de mostrar
- Prevenir Mass Assignment usando `$fillable` en modelos

---

## 9. EJEMPLOS DE DATOS PARA TESTING

### Categorías de Playlists (Ejemplo):
- "Programación"
- "Música"
- "Tutoriales"
- "Entretenimiento"
- "Educación"

### Playlists (Ejemplo):
```
Título: "Laravel desde Cero"
URL: https://www.youtube.com/playlist?list=PLZ2ovOgdI-kWWS9aq8mfUDkJRfYib-SvF
Descripción: "Curso completo de Laravel para principiantes"
Categorías: ["Programación", "Tutoriales", "Educación"]
```

### Categorías de Canales (Ejemplo):
- "Tech Reviews"
- "Educativo"
- "Entretenimiento"
- "Noticias"
- "Gaming"

### Canales (Ejemplo):
```
Nombre: "Traversy Media"
URL: https://www.youtube.com/@TraversyMedia
Descripción: "Canal de desarrollo web y programación"
Categorías: ["Programación", "Educativo", "Tutoriales"]
```

---

## 10. ENTREGABLES ESPERADOS

Al finalizar cada fase, deberías tener:

### Fase 1:
- ✅ Base de datos configurada y migraciones ejecutadas
- ✅ Modelos creados con relaciones funcionales
- ✅ Autenticación verificada y funcional
- ✅ Landing page con navegación básica

### Fase 2:
- ✅ CRUD completo de Categorías de Playlists
- ✅ CRUD completo de Playlists con asignación múltiple de categorías
- ✅ Búsqueda y filtrado funcional
- ✅ Validación de URLs de YouTube

### Fase 3:
- ✅ CRUD completo de Categorías de Canales
- ✅ CRUD completo de Canales con asignación múltiple de categorías
- ✅ Búsqueda y filtrado funcional
- ✅ Validación de URLs de YouTube

### Fase 4:
- ✅ Thumbnails de YouTube funcionando
- ✅ Notificaciones implementadas
- ✅ UI/UX pulida y responsive
- ✅ Aplicación completamente funcional y lista para usar

---



---

**¡Listo para comenzar el desarrollo! 🚀**