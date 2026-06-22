# treecatdesign | UX Portfolio

## Estructura

```
index.html
css/
  styles.css
js/
  main.js
assets/
  imágenes del sitio
```

## Cambios aplicados

- Se movieron los estilos inline a `css/styles.css`.
- Se movió el JavaScript inline a `js/main.js`.
- Se actualizó `index.html` para cargar los archivos externos.
- En la sección **Funciones clave**, las tarjetas de imagen y descripción ahora no tienen fondo, borde ni sombra, para integrarse con el fondo general y verse más limpias.
- Se conservaron las imágenes y el contenido original.

## Cambios de carrusel en Finanzas

- En **Vista inteligente de tus gastos** se retiró el punto 01 / Estadísticas.
- Los puntos 02 a 06 ahora se muestran en un carrusel horizontal automático y lento.
- El texto principal queda arriba y el carrusel con imagen + explicación queda abajo.
- Las imágenes nuevas están en `assets/finance-feature-*.png`.

## Rediseño aplicado en Vista inteligente de tus gastos

- Se reemplazaron los bloques estáticos por una demo visual tipo producto.
- La sección ahora tiene un teléfono principal con captura dinámica, tarjetas selectoras y métricas de valor.
- Las funciones cambian automáticamente y también al pasar el cursor o hacer clic.
- El modal de imagen completa se conserva: al hacer clic sobre el teléfono se abre la captura activa.
- Se añadieron animaciones suaves, estados de foco accesibles y soporte para `prefers-reduced-motion`.

## Cambios aplicados en esta versión

- Se añadió una escena final debajo de **Vista inteligente de tus gastos** con la mascota observando hormigas y un botón **Mostrar menos** para cerrar todo el proyecto de finanzas.
- La escena final ocupa el ancho completo en escritorio y cambia a la mascota parada en celular.
- La mascota principal de finanzas también cambia a la versión parada únicamente en celular.
- En **Funciones clave**, las tarjetas se revelan progresivamente al hacer scroll.
- Se actualizó el texto principal de **Vista inteligente de tus gastos** para comunicar la intención de una experiencia financiera tipo videojuego, ligera y motivadora.
- Se eliminó el texto auxiliar sobre el cambio automático de pantalla.
