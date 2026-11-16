# Cómo contribuir

¡Gracias por tu interés! Este proyecto es open source (MIT) y acepta mejoras.

## Puesta en marcha

```bash
npm install
npm start
```

La app corre en modo demo, sin configurar nada.

## Antes de abrir un pull request

```bash
npm run lint
npm test
npm run build
```

- Crea una rama desde `main` (`feat/...`, `fix/...`).
- Mantén los cambios acotados y describe cómo probarlos.
- Sigue el estilo existente: componentes standalone, signals y `OnPush`. `npm run format` aplica Prettier.
- Toda lógica de datos pasa por la clase abstracta `Backend` (`src/app/core/backend.ts`): si agregas una operación, impleméntala en el backend local y en el de Firebase.

## Reportar problemas

Usa las plantillas de issues e incluye pasos para reproducir el problema.
