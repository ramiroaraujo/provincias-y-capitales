# Provincias y Capitales

Juego para practicar las capitales de las 23 provincias argentinas. Muestra la provincia en el mapa y hay que elegir su capital antes de que se acabe el tiempo.

| Nivel   | Opciones | Tiempo |
| ------- | -------- | ------ |
| Fácil   | 3        | 15 s   |
| Medio   | 4        | 6 s    |
| Difícil | 5        | 3 s    |

```bash
npm install
npm run dev   # http://localhost:3000
npm test      # chequeo de la lógica y los datos del mapa
```

## Datos

- `src/lib/provinces.ts`: capital y opciones incorrectas por provincia, con dificultad por opción.
- `src/lib/map.ts`: paths SVG generados una sola vez desde el [GeoJSON oficial de georef-ar](https://infra.datos.gob.ar/georef/provincias.geojson) (recortado sin Antártida, simplificado, proyección Mercator). Las coordenadas de las capitales salen de la API de localidades de georef-ar.
