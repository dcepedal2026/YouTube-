# Imperio de Papel — Piloto 01 (Remotion)

Proyecto inicial original de documental animado 2D sobre WeWork, 60 s, 1920×1080, 30 fps. Incluye seis escenas, personajes SVG reutilizables, gráficos animados y textos editables.

## Ejecutar en computadora

Requisitos: Node.js 20+ y npm. Desde esta carpeta:

```bash
npm install
npm run studio
```

Para exportar MP4:

```bash
npm run render
```

Salida: `out/wework-piloto.mp4`. Para miniatura: `npm run still`.

## Editar

- `src/pilot.tsx`: guion visual, colores, escenas, personaje y animaciones.
- `src/root.tsx`: resolución, FPS y duración.
- `src/index.ts`: punto de entrada.

## Importante

Este es un **piloto visual sin narración ni música**. El audio no se ha generado ni sincronizado; las frases en pantalla son un borrador narrativo, no una locución terminada. Antes de publicar: verificar datos con fuentes fiables, escribir narración definitiva, grabarla, sincronizar escenas, añadir efectos y comprobar derechos de uso. La valoración de 47.000 millones de dólares es una cifra histórica aproximada asociada a WeWork en 2019, no una valoración actual.

Para usar una locución final, agregar el archivo a `public/voice.mp3`, importar `Audio` y `staticFile` de `remotion` y colocar `<Audio src={staticFile('voice.mp3')}/>` dentro de `Pilot`; ajustar los tiempos a la grabación real.

Este proyecto no usa Muse AI, Google Flow, servicios externos ni recursos protegidos del canal de referencia.

## Narración de los rayos

`npm run render:rayos` exporta la composición **Rayos** a `out/rayos.mp4`.
Incluye una muestra de Brian CM (ElevenLabs V4) de 8,44 segundos.

Para generar otra toma, carga `OPENRADIO_API_KEY` como secreto en el entorno del proceso. Usa una clave de OpenRadio y mantenla fuera del repositorio, de los argumentos del comando y de los registros.

```sh
npm run openradio -- account
npm run openradio -- models
npm run openradio -- voices "Brian CM"
npm run openradio -- generate ID_DE_VOZ narracion/rayos.txt out/nueva-narracion.mp3
```

El buscador consulta voces masculinas de ElevenLabs en español. Elige el ID de la voz y revisa sus metadatos de acento. Para usar la nueva toma, sustituye `public/audio/rayos.mp3` y ajusta la duración y las animaciones de `src/rayos.tsx` a la grabación. OpenRadio aplica el consumo de créditos al generar la toma.
