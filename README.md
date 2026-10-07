# SusCaballos – MVP (Capítulo 8)

Prototipo funcional 100% estático (HTML + CSS + JavaScript). Sin servidor ni instalación; los datos viven en `localStorage` del navegador.

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
4. Pestaña **Reglas** → pega el contenido de `firestore.rules` → **Publicar**.
5. **Configuración del proyecto (engranaje) → Tus apps → Web `</>`** → registra la app → copia `firebaseConfig` en `js/firebase-config.js`.
6. **Authentication → Configuración → Dominios autorizados** → agrega `TU_USUARIO.github.io`.
7. Crea tu cuenta de administrador: abre el sitio, **Crear perfil** con tu correo. Luego en **Firestore → users → (tu documento)** cambia el campo `admin` a `true` (booleano) y recarga.
8. Entra a **Publicar** → botón **Cargar datos de ejemplo**.

## Ejecución local
Los módulos ES no funcionan con `file://`. Usa `python3 -m http.server 8000` y abre `http://localhost:8000`.

## Despliegue en GitHub Pages
Sube la carpeta al repositorio (con `index.html` en la raíz) → Settings → Pages → `main` / `(root)`.

## Guion de prueba
1. Crea dos perfiles en navegadores/dispositivos distintos: uno criador con intereses *Crianza*, y el admin (paso 7).
2. Chat: escribe desde ambos; los mensajes llegan en tiempo real.
3. Admin → **Publicar**: *"Manejo de la yegua gestante y cuidados del potro recién nacido"* → detecta Crianza, genera 5 versiones, notifica al criador.
4. El criador recarga el menú, ve la notificación y encuentra el contenido en **Contenido**.
5. Publica un tipo **Evento** con fecha: aparece en **Eventos**.

## Limitaciones (declarar en el informe)
- Las versiones por canal se generan para copiar; la publicación directa requiere las APIs de cada red.
- Los ~30 min de publicación manual son un **supuesto** (5 canales × 6 min); reemplazar con la medición AS-IS real.
- Las notificaciones se crean al publicar (visibles al recargar), no hay push ni correo. Moderación del chat: pendiente.
