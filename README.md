# SusCaballos – MVP (Capítulo 8)

MVP en HTML, CSS y JavaScript con autenticación Firebase y datos en Firestore. El diseño usa la identidad negra y dorada de SusCaballos y se adapta a escritorio y móvil.

## Estructura
| Archivo | Función |
|---|---|
| `index.html` | Inicio de sesión y creación de perfil (rol + intereses) |
| `menu.html` | Menú principal, notificaciones, últimos contenidos y eventos |
| `eventos.html` | Calendario con búsqueda y filtro por categoría |
| `contenido.html` | Biblioteca educativa/técnica con buscador y filtros |
| `publicar.html` | **Automatización** (solo admin) + KPIs |
| `chat.html` | Chat de la comunidad |
| `perfil.html` | Edición de perfil |
| `js/app.js` | Datos semilla, `classify()`, `channels()`, `publish()`, layout |

## Configuración de Firebase (una sola vez)
1. https://console.firebase.google.com → **Agregar proyecto** (sin Analytics).
2. **Compilación → Authentication → Comenzar → Correo/contraseña → Habilitar**.
3. **Compilación → Firestore Database → Crear base de datos** (ubicación `southamerica-east1` o la más cercana; modo producción).
4. Configura y revisa las **reglas de seguridad** de Firestore antes de usar datos reales. Este repositorio no incluye un archivo de reglas; comprueba las reglas activas en Firebase Console.
5. **Configuración del proyecto (engranaje) → Tus apps → Web `</>`** → registra la app → copia `firebaseConfig` en `js/firebase-config.js`.
6. **Authentication → Configuración → Dominios autorizados** → agrega `TU_USUARIO.github.io`.
7. Crea tu cuenta de administrador: abre el sitio, **Crear perfil** con tu correo. Luego en **Firestore → users → (tu documento)** cambia el campo `admin` a `true` (booleano) y recarga.
8. Entra a **Publicar** → botón **Cargar datos de ejemplo**.

## Ejecución local
Los módulos ES no funcionan con `file://`. Usa `python -m http.server 8000` y abre `http://localhost:8000`.

## Despliegue en GitHub Pages
Configura la rama y carpeta de publicación en Settings → Pages. Los cambios de `rediseno-premium` no aparecen en un sitio publicado desde `main` hasta que se integren mediante el proceso habitual del equipo.

## Guion de prueba
1. Crea dos perfiles en navegadores/dispositivos distintos: uno criador con intereses *Crianza*, y el admin (paso 7).
2. Chat: escribe desde ambos; los mensajes llegan en tiempo real.
3. Admin → **Publicar**: *"Manejo de la yegua gestante y cuidados del potro recién nacido"* → detecta Crianza, genera 5 versiones, notifica al criador.
4. El criador recarga el menú, ve la notificación y encuentra el contenido en **Contenido**.
5. Publica un tipo **Evento** con fecha: aparece en **Eventos**.
