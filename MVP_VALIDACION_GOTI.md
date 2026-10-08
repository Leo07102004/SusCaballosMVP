# SusCaballos MVP — Validación GOTI (entrega 2 / capítulo 8)

## Problema que resuelve
La información educativa y de eventos está dispersa y publicar en distintos canales requiere reprocesos. El MVP **centraliza el contenido**, permite consultarlo mediante filtros y propone material listo para difundir.

## Recorrido funcional que se debe demostrar
1. Registrar un usuario con el interés **Crianza**, y una cuenta administradora (según instrucciones de README).
2. Administrador: ir a **Publicar**, escribir «Crianza: cuidados del potro» y comprobar la **clasificación propuesta** en tiempo real.
3. Guardar. Verificar categoría, etiquetas, copys preparados y contador de notificaciones. **Los copys no se publican automáticamente en redes externas.**
4. Como usuario registrado con interés Crianza, revisar notificación e ir a **Contenido**; buscar «potro» y comprobar el resultado.
5. Crear un evento con fecha y ciudad y comprobarlo en **Eventos**; comprobar el enlace del copy.
6. Exportar el historial en CSV desde **Publicar** para tener evidencia medible.

## Automatizado vs manual
| Paso | Estado |
|---|---|
| Clasificar mediante coincidencias de palabras clave | Automático, reglas en `classify()` |
| Centralizar en Firestore | Automático al guardar |
| Proponer versiones por Instagram, Facebook, YouTube, WhatsApp y TikTok | Automático, textos para copiar |
| Difundir en redes externas | Manual, NO integradas |
| Notificar perfiles coincidentes con la categoría | Automático, sujeto a permisos Firestore |
| Verificar calidad y autorizar el contenido | Responsabilidad humana del administrador antes de pulsar guardar |
| Registrar duración de la operación y total de destinatarios | Automático; registro puede fallar sin deshacer la publicación |

## Medición AS-IS vs TO-BE (no inventar resultados)
Medir 5 publicaciones equivalentes en el proceso manual y 5 en MVP. Registrar inicio, fin, canales involucrados y errores. La duración técnica en milisegundos no es comparable directamente con el trabajo humano total; incluir también tiempo de revisión y publicación manual de copys. Repetir 5 búsquedas equivalentes en redes dispersas y en la biblioteca. Reportar promedio y rango de cada condición.

## Arquitectura resumida
Frontend HTML/CSS/JS → Firebase Authentication (identidad) + Cloud Firestore (usuarios, contenidos, eventos, notificaciones, chat, métricas e historial). Reglas de clasificación y generación de copys ejecutadas en frontend. **Las reglas de seguridad de Firestore deben validarse en la consola:** un botón oculto o un campo `admin` en interfaz NO reemplaza autorización a nivel de base de datos.

## Riesgos / pendientes
- Sin acceso a Firebase real no se validaron permisos, índices, sincronización entre cuentas ni envío de notificaciones.
- Revisar reglas de seguridad antes de publicar y evitar cuentas de demostración con datos reales.
- Generar video de 5 a 10 minutos, capturas de evidencia y diagrama BPMN con decisiones y excepciones.
- Si falla el registro del historial o la notificación después de guardar, **la publicación podría seguir existiendo**: no pulsar guardar de nuevo antes de comprobar.
- No se conectan APIs de Instagram, Facebook, YouTube, TikTok o WhatsApp: no afirmar distribución automática real.

## Ejecución
Desde la carpeta raíz, ejecutar `python -m http.server 8000` y abrir `http://localhost:8000`. Los módulos ES requieren HTTP; no abrir mediante `file://`. Configurar Firebase Authentication, Firestore y dominios autorizados según `README.md`.
