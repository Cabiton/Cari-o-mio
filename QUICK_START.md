# 🚀 Guía de Inicio Rápido

## Pasos para ejecutar tu proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Agregar archivos de música

Crea la carpeta `public/Music/` y agrega tus archivos MP3:
- feel it.mp3
- Neo roneo.mp3
- Blue.mp3
- Electric love.mp3
- Siento que merezco mas.mp3
- Yo siempre contesto.mp3
- Do you think.mp3
- Always love.mp3
- Cuál será.mp3

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:3000
```

## Credenciales de acceso

- **Login principal:** Yazmin Monserrat Carreon
- **Archivo confidencial:** todo
- **Regalo secreto:** bobux

## Estructura básica

```
mi-novia-project/
├── app/                    # Todas las páginas
│   ├── page.tsx           # Login
│   ├── main/              # Página principal
│   ├── especial/          # Contador regresivo
│   └── ...                # Otras secciones
├── public/
│   ├── music/             # ⚠️ Agrega tus MP3 aquí
│   ├── images/            # Fotos (opcional)
│   └── mi_niña.pdf        # ✅ Ya incluido
└── package.json
```

## Personalización rápida

### Cambiar contraseñas
Edita `app/utils/constants.ts`:
```typescript
export const PASSWORD = "Tu nueva contraseña";
export const CONFIDENTIAL_PASSWORD = "nueva";
export const GIFT_PASSWORD = "nueva";
```

### Cambiar fechas
En el mismo archivo:
```typescript
export const SPECIAL_DATE = new Date("2025-10-13T23:00:00-05:00");
export const START_DATE = new Date("2025-04-16T00:00:00");
```

## Mejoras que puedes hacer

1. **Agregar fotos/videos** en la sección Recuerdos
2. **Cambiar colores** en `tailwind.config.ts`
3. **Agregar más canciones** en `constants.ts`
4. **Personalizar mensajes** en cada página

## Deploy en Vercel (Gratis)

1. Sube tu proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Import tu repositorio
4. ¡Listo! Tendrás una URL pública

## ¿Problemas?

- **Música no suena:** Verifica que los archivos estén en `public/Music/`
- **Página en blanco:** Ejecuta `npm install` de nuevo
- **Errores de TypeScript:** Ejecuta `npm run dev` y revisa la consola

---

💕 **¡Disfruta tu proyecto especial!**
