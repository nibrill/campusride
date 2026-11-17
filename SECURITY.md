# Política de seguridad

## Versiones con soporte

Se corrigen vulnerabilidades en la última versión publicada de CampusRide.

## Reportar una vulnerabilidad

**No abras un issue público** para vulnerabilidades. Usa el [reporte privado de GitHub](../../security/advisories/new) (pestaña *Security* → *Report a vulnerability*) e incluye pasos para reproducirla. Intento responder en un plazo de 7 días.

## Alcance y consideraciones

- Las credenciales de Firebase de un proyecto web no son secretos, pero la seguridad depende de las **reglas de Firestore** de `firebase/firestore.rules`. Despliégalas siempre antes de abrir tu proyecto al público.
- El **modo demo** guarda datos en `localStorage` y no está pensado para información real.
- No subas credenciales ni archivos `.env` al repositorio.
