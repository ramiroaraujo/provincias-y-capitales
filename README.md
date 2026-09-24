# Provincias y Capitales

Juego para practicar las 23 provincias argentinas, contra reloj. Dos modos:

- **Nombre**: muestra la provincia en el mapa y hay que elegir su capital.
- **Mapa**: dice el nombre de una provincia y hay que tocarla en el mapa (la dificultad solo cambia el tiempo).

| Nivel   | Opciones | Tiempo |
| ------- | -------- | ------ |
| Fácil   | 3        | 15 s   |
| Medio   | 4        | 7 s    |
| Difícil | 5        | 4 s    |

```bash
npm install
npm run dev   # http://localhost:3000
npm test      # chequeo de la lógica y los datos del mapa
```

## Datos

- `src/lib/provinces.ts`: capital y 4 ciudades reales de cada provincia, que se usan como opciones incorrectas.
- `src/lib/map.ts`: paths SVG generados una sola vez desde el [GeoJSON oficial de georef-ar](https://infra.datos.gob.ar/georef/provincias.geojson) (recortado sin Antártida, simplificado, proyección Mercator). Las coordenadas de las capitales salen de la API de localidades de georef-ar.
