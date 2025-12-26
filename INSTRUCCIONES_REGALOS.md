# Instrucciones para los Regalos

## Cómo agregar las imágenes de los regalos

1. Prepara 20 imágenes de tus regalos (pueden ser fotos de los productos, capturas de pantalla, etc.)

2. Guarda cada imagen con el nombre correspondiente:
   - `regalo-1.jpg` para el regalo #1
   - `regalo-2.jpg` para el regalo #2
   - ... y así hasta `regalo-20.jpg`

3. Coloca todas las imágenes en la carpeta:
   ```
   public/images/regalos/
   ```

## Cómo personalizar cada regalo

Abre el archivo `app/regalos/page.tsx` y busca el array `gifts`. Ahí puedes cambiar:

- **name**: El nombre del regalo (ej: "Perfume Especial")
- **description**: Una descripción romántica del regalo (ej: "Este perfume me recuerda a ti cada día")

Ejemplo:
```javascript
{ 
  id: 1, 
  name: 'Perfume Carolina Herrera', 
  description: 'Tu aroma favorito que siempre llevas contigo 💕', 
  image: '/images/regalos/regalo-1.jpg' 
},
```

## Formatos de imagen recomendados

- **Formato**: JPG, PNG o WebP
- **Tamaño**: Preferiblemente cuadradas (1:1) para que se vean mejor
- **Resolución**: 800x800 píxeles o superior

## ¡Listo! 🎁

Una vez que subas las imágenes y personalices las descripciones, tu novia podrá:
- Elegir un número del 1 al 20
- Ver el sobre abrirse con animación
- Descubrir la imagen del regalo
- Leer tu mensaje especial

💗 ¡Cada regalo será una sorpresa especial para ella!
