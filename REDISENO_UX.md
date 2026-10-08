# SusCaballos — Rediseño UX/UI

## Qué se modificó
- Identidad dorado, negro y blanco basada en el logo oficial suministrado.
- Navegación sticky, logo real, contraste, espaciados y estados de interacción.
- Pantalla de acceso con diseño editorial, sin alterar formularios ni IDs.
- Inicio con jerarquía visual y enlaces de acceso rápido.
- Rediseño responsive de eventos, contenidos, comunidad, perfil y administración.
- Adaptación a móviles, enfoque visible, soporte de movimiento reducido.

## Instalación
Copiar todo el contenido de esta carpeta al repositorio, conservando `js/firebase-config.js` con la configuración del proyecto correspondiente. Servir mediante HTTP(S), por ejemplo `python -m http.server 8000`, y abrir `http://localhost:8000`.

## Funciones preservadas
No se cambiaron las funciones de Firebase Auth, Firestore, chat en tiempo real, publicación, clasificación, notificaciones o métricas. Sólo cambió el HTML de presentación, CSS, y el markup del header en `layout()`.

## Validación pendiente
La verificación end-to-end con Firestore requiere credenciales de un proyecto Firebase configurado, acceso de red y cuentas de prueba de rol usuario y administrador. No se afirma que se haya probado en producción.
