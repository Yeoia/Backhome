# ¡Regresa! - Sistema de Mascotas Perdidas

Una aplicación web para ayudar a encontrar mascotas perdidas y reunirlas con sus familias.

## 🚀 Características

- **Reporte de Mascotas Perdidas**: Registra mascotas que se han extraviado
- **Reporte de Avistamientos**: Comparte información sobre mascotas vistas
- **Mapa Interactivo**: Visualiza ubicaciones de mascotas perdidas y avistamientos
- **Sistema de Autenticación**: Registro e inicio de sesión con Firebase
- **Diseño Responsivo**: Funciona en dispositivos móviles y de escritorio
- **Interfaz Moderna**: Construida con Next.js 15, Tailwind CSS y shadcn/ui

## 🛠️ Tecnología

- **Frontend**: Next.js 15 con App Router
- **Estilos**: Tailwind CSS 4 + shadcn/ui
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Lenguaje**: TypeScript

## 📋 Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── page.tsx           # Página principal
│   ├── report-lost/       # Formulario para reportar mascotas perdidas
│   ├── report-sighting/   # Formulario para reportar avistamientos
│   └── map/               # Mapa interactivo
├── components/            # Componentes de UI
│   ├── ui/               # Componentes shadcn/ui
│   └── auth/             # Componentes de autenticación
├── contexts/             # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación
├── lib/                  # Utilidades y configuración
│   ├── firebase.ts       # Configuración de Firebase
│   └── firestore.ts      # Servicios de Firestore
└── types/                # Definiciones de tipos TypeScript
```

## 📱 Funcionalidades

### Página Principal
- Estadísticas de mascotas perdidas/encontradas
- Botones de acción principales
- Lista de mascotas perdidas recientes
- Lista de avistamientos recientes

### Reporte de Mascotas Perdidas
- Formulario completo con información de la mascota
- Subida de fotos
- Ubicación geográfica
- Información de contacto

### Reporte de Avistamientos
- Descripción del avistamiento
- Ubicación precisa
- Foto opcional
- Tipo de mascota

### Mapa Interactivo
- Visualización de mascotas perdidas
- Filtros por tipo y estado
- Información detallada al hacer clic

## 🔧 Desarrollo

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta ESLint para revisar el código
- `npm run type-check` - Verifica los tipos TypeScript

### Construcción para Producción

La aplicación está configurada para construirse correctamente para producción:

```bash
npm run build
```

Esto generará una versión optimizada lista para desplegar en plataformas como Vercel, Netlify o cualquier servicio de hosting estático.

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de Firebase**: Asegúrate de que las variables de entorno estén configuradas correctamente
2. **Error de construcción**: Verifica que todos los imports sean correctos y los tipos TypeScript sean válidos
3. **Problemas de estilos**: Asegúrate de que Tailwind CSS esté configurado correctamente

### Modo Demo

Si Firebase no está configurado, la aplicación mostrará datos de demostración para que puedas ver cómo funciona la interfaz.

## 🚀 Despliegue

### Despliegue en Vercel

La aplicación está configurada para desplegarse automáticamente en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno de Firebase
3. Haz push a la rama principal para activar el deploy automático
4. La aplicación estará disponible en una URL de Vercel

### Variables de Entorno Requeridas

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para cualquier mejora o corrección.

---

**Última actualización**: Deploy completo con código fuente en Vercel 🚀

**Deploy Status**: Todo el código fuente listo para producción 🌐

**Último push**: Forzando deploy automático en Vercel 🔄
