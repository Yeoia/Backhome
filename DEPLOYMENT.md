# 🚀 Guía de Despliegue - ¡Regresa!

## 📋 Pasos para Poner tu Aplicación en Producción

### 🏆 Método 1: Vercel (Recomendado + Gratuito)

#### Paso 1: Preparar Cuenta Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta GitHub
3. Conecta tu repositorio (si usas GitHub)

#### Paso 2: Despliegue Automático
```bash
# Opción A: Desde tu terminal
npm i -g vercel
vercel login
vercel

# Opción B: Subir a GitHub y conectar en Vercel
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Paso 3: Configurar Variables de Entorno en Vercel
1. En tu dashboard de Vercel → Project Settings
2. Ve a "Environment Variables"
3. Agrega estas variables:
   ```
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   NEXTAUTH_SECRET=tu-secreto-seguro-generado
   DATABASE_URL=tu-url-de-base-de-datos
   ```

#### Paso 4: Generar Secreto Seguro
```bash
# Generar un secreto seguro
openssl rand -base64 32
# O usar: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 🏆 Método 2: Railway (Alternativa Sencilla)

#### Paso 1: Preparar Railway
1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta GitHub
3. Crea nuevo proyecto desde tu repositorio

#### Paso 2: Configurar
```bash
# Railway automáticamente detecta Next.js
# Solo configura las variables de entorno en el dashboard
```

### 🏆 Método 3: Netlify (Opción Gratuita)

#### Paso 1: Preparar Build Estático
Modifica `next.config.js` para exportación estática:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

#### Paso 2: Build y Despliegue
```bash
npm run build
# Sube la carpeta 'out' a Netlify
```

### 🏆 Método 4: Render (Con Base de Datos)

#### Paso 1: Preparar Render
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio GitHub
3. Elige "Web Service"

#### Paso 2: Configuración
- Build Command: `npm run build`
- Start Command: `npm start`
- Agrega variables de entorno

## 🗄️ Configuración de Base de Datos

### Opción 1: Railway (PostgreSQL Gratuito)
```bash
# Railway te da una URL de PostgreSQL
# Solo copia la URL en DATABASE_URL
```

### Opción 2: Supabase (PostgreSQL Gratuito)
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. Copia la URL de conexión en DATABASE_URL

### Opción 3: PlanetScale (MySQL Gratuito)
1. Crea cuenta en [planetscale.com](https://planetscale.com)
2. Crea base de datos
3. Configura en tu proyecto

## 🧪 Testing Antes del Despliegue

### Testing Local
```bash
# 1. Revisa que todo funcione localmente
npm run dev

# 2. Corre tests si tienes
npm run test

# 3. Revisa el build
npm run build
npm start
```

### Testing de Producción
1. **Funcionalidad básica**: Navegación, reportes
2. **Upload de imágenes**: Prueba subir fotos
3. **Mapa interactivo**: Verifica que funcione
4. **Modo responsive**: Prueba en móvil
5. **Modo oscuro/claro**: Cambia temas

## 📊 Monitoreo Post-Despliegue

### Vercel Analytics
1. Activa Vercel Analytics en tu dashboard
2. Monitorea visitas y rendimiento

### Logs y Errores
```bash
# Ver logs en Vercel
vercel logs

# O en el dashboard de Vercel → Functions → Logs
```

## 🔧 Configuración Adicional

### Dominio Personalizado
1. En Vercel → Project Settings → Domains
2. Agrega tu dominio personalizado
3. Configura DNS según instrucciones

### SSL Certificates
- Vercel automáticamente configura SSL
- Gratis para todos los proyectos

### Backup de Base de Datos
- Railway: Backups automáticos
- Supabase: Backups diarios gratuitos
- Configura según tu proveedor

## 🆘 Problemas Comunes

### Error: "NEXTAUTH_SECRET missing"
```bash
# Genera un nuevo secreto
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Agrega a variables de entorno
```

### Error: "Database connection failed"
```bash
# Verifica DATABASE_URL
# Asegúrate que la base de datos esté activa
# Revisa credenciales
```

### Error: "Build failed"
```bash
# Limpia caché
rm -rf .next
npm install
npm run build
```

## 🎉 ¡Felicidades!

Tu aplicación "¡Regresa!" está ahora en producción. Comparte el enlace con tu comunidad y ayuda a encontrar mascotas perdidas.

### Próximos Pasos:
1. **Promoción**: Comparte en redes sociales
2. **Feedback**: Recoge comentarios de usuarios
3. **Mejoras**: Agrega nuevas funcionalidades
4. **Monitoreo**: Revisa analytics regularmente

### Soporte:
- 📧 Email: soporte@regresa.com
- 📱 WhatsApp: +52 1 234 567 8900
- 🐦 Twitter: @RegresaMascotas