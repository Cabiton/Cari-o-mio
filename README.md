# 💕 Proyecto Especial para Mi Novia

Un proyecto web Next.js con TypeScript creado con amor, que incluye múltiples secciones interactivas y personalizadas.

## 🌟 Características

- ✨ **Diseño moderno** con Tailwind CSS
- 🎵 **Reproductor de música** integrado
- ⏱️ **Contadores** de tiempo (regresivo y progresivo)
- 🔐 **Secciones protegidas** con contraseñas
- 💌 **Selector de emociones** interactivo
- 🎨 **Animaciones** suaves y efectos visuales
- 📱 **Responsive** - se ve bien en todos los dispositivos

## 📦 Instalación

### Requisitos previos

- Node.js 18.x o superior
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias:**
```bash
cd mi-novia-project
npm install
```

2. **Agregar archivos multimedia:**

   Necesitas agregar los siguientes archivos:

   **Música** (carpeta `public/Music/`):
   - feel it.mp3
   - Neo roneo.mp3
   - Blue.mp3
   - Electric love.mp3
   - Siento que merezco mas.mp3
   - Yo siempre contesto.mp3
   - Do you think.mp3
   - Always love.mp3
   - Cuál será.mp3

   **PDF** (carpeta `public/`):
   - mi_niña.pdf

   **Imágenes** (carpeta `public/images/`) - Opcional:
   - Fotos y videos para la sección de recuerdos

3. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:3000
```

## 🔑 Contraseñas

Las contraseñas configuradas son:

- **Entrada principal:** `Yazmin Monserrat Carreon`
- **Archivo confidencial:** `todo`
- **Regalo secreto:** `bobux`

Para cambiarlas, edita el archivo `app/utils/constants.ts`.

## 📂 Estructura del Proyecto

```
mi-novia-project/
├── app/
│   ├── components/         # Componentes reutilizables
│   │   ├── FloatingPetals.tsx
│   │   └── MusicPlayer.tsx
│   ├── utils/              # Utilidades y constantes
│   │   └── constants.ts
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── main/               # Página principal
│   ├── especial/           # Contador regresivo
│   ├── tiempo-juntos/      # Contador de tiempo juntos
│   ├── como-estas/         # Selector de emociones
│   ├── confidencial/       # Archivo secreto con PDF
│   ├── regalo-secreto/     # Regalo con código
│   ├── carta-voladora/     # Enlace a Notion
│   ├── recuerdos/          # Galería de recuerdos
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de login
├── public/
│   ├── music/              # Archivos de música
│   ├── images/             # Imágenes
│   └── mi_niña.pdf         # PDF confidencial
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Personalización

### Cambiar fechas importantes

Edita `app/utils/constants.ts`:

```typescript
export const SPECIAL_DATE = new Date("2025-10-13T23:00:00-05:00"); // Fecha especial
export const START_DATE = new Date("2025-04-16T00:00:00");         // Fecha de inicio de la relación
```

### Agregar más canciones

En `app/utils/constants.ts`, agrega canciones al array `SONGS`:

```typescript
{
  id: '10',
  title: 'Nombre de la canción',
  description: 'Descripción',
  file: 'nombre-archivo.mp3',
}
```

### Modificar colores

Los colores principales se pueden cambiar en `tailwind.config.ts` en la sección `theme.extend.colors`.

## 🚀 Deployment

### Vercel (Recomendado)

1. Sube el proyecto a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Asegúrate de subir los archivos de música y PDF
4. Deploy automático

### Build para producción

```bash
npm run build
npm start
```

## 📱 Secciones

1. **Página de Login** - Acceso protegido con contraseña
2. **Main** - Página principal con todas las secciones
3. **Especial** - Contador regresivo hasta una fecha especial
4. **Tiempo Juntos** - Contador del tiempo que llevan juntos
5. **¿Cómo estás hoy?** - Selector de emociones y mensaje
6. **Archivo Confidencial** - Carta especial en PDF
7. **Regalo Secreto** - Regalo con código de acceso
8. **Carta Voladora** - Enlace a colección de cartas en Notion
9. **Recuerdos** - Galería de fotos y videos (en desarrollo)

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones (listo para usar)
- **Lucide React** - Iconos

## 💡 Tips

- Los efectos de pétalos flotantes se ajustan automáticamente según la sección
- El reproductor de música guarda la última canción reproducida
- Todas las páginas son responsive
- Los contadores funcionan en tiempo real

## 🐛 Solución de Problemas

**La música no se reproduce:**
- Verifica que los archivos MP3 estén en `public/Music/`
- Los navegadores requieren interacción del usuario antes de reproducir audio

**El PDF no se descarga:**
- Asegúrate de que `mi_niña.pdf` esté en la carpeta `public/`

**Las animaciones no funcionan:**
- Verifica que Tailwind CSS esté correctamente instalado
- Revisa la consola del navegador para errores

## 📝 Notas

- Este proyecto fue creado con mucho amor 💕
- Personaliza todo lo que quieras para hacerlo único
- Recuerda actualizar las contraseñas si vas a publicarlo

## 💖 Hecho con amor

Un regalo especial hecho con dedicación y cariño.

---

**¿Necesitas ayuda?** Revisa la documentación de Next.js en [nextjs.org](https://nextjs.org/docs)
