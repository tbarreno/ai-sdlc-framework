# Workspace — AI-SDLC Framework (pre-publicación)

Documento de seguimiento para correcciones y decisiones pendientes antes de publicar el paquete npm.  
Cada ítem incluye el **problema detectado**, el **estado** y la **instrucción acordada** para abordarlo.

**Leyenda de estado:** `hecho` · `pendiente` · `investigar` · `decisión`

---

## 1. Artefacto `.tgz` en el repositorio

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` (fichero eliminado por el maintainer) |
| **Problema** | Un `ai-sdlc-framework-*.tgz` generado con `npm pack` en la raíz del repo se incluía dentro del siguiente paquete (tarball recursivo), inflando el publish y confundiendo el control de versiones. |
| **Instrucción** | No volver a commitear artefactos de empaquetado. |
| **Seguimiento adicional** | `hecho`: `.gitignore`, `.npmignore`, `"files"` en `package.json`. |

---

## 2. Licencia MIT

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` (añadido `LICENSE.txt`) |
| **Problema** | `package.json` declaraba `"license": "MIT"` sin fichero de licencia en el repo. |
| **Instrucción** | Mantener el fichero de licencia en la raíz. |
| **Seguimiento adicional** | Comprobar que npm apunte al nombre estándar (`LICENSE` vs `LICENSE.txt`; ambos son válidos si el contenido es MIT completo). |

---

## 3. Estados del ciclo de vida y comandos SDLC

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | El README describe un flujo Kanban único (`definition → ready-for-design → ready-for-implementation → in-progress → ready-for-release → released`), pero comandos y plantillas usan valores distintos (`proposed`, `completed`, `in_development`, estados de bugs/experimentos separados, etc.). Faltan transiciones explícitas entre fases. `/sdlc-design` exige `ready-for-design` pero `/sdlc-analyze` deja el spec en `definition`. |

### 3.1 Comandos de cierre de fase

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Instrucción** | Añadir comandos **`/sdlc-close-analysis`** y **`/sdlc-close-design`** (p. ej. `definition` → `ready-for-design` y cierre de diseño hacia `ready-for-implementation` según el flujo acordado). Valorar que el agente los invoque cuando pregunte al usuario algo como *«¿damos el análisis por cerrado?»*. |
| **Notas de factibilidad** | **Sí, es factible en Cursor/Claude** vía regla o comando: la regla maestra puede indicar que, tras confirmación explícita del usuario, el agente debe ejecutar la transición de frontmatter y `history.md` como haría el comando dedicado (invocar `/sdlc-close-analysis` o seguir sus instrucciones inline). No hace falta hook en el CLI; es comportamiento del agente + definición clara en `.mdc`. Comandos dedicados siguen siendo útiles para invocación manual y consistencia entre proveedores. |

### 3.2 `sdlc-dev`, estados finales y `sdlc-deploy`

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` (`sdlc-dev` → `ready-for-release` automático; `sdlc-deploy` eliminado) |
| **Instrucción** | **`sdlc-deploy` eliminado de la metodología** (sustituido por el flujo de **`/sdlc-release`**). Decidir si **`/sdlc-dev`** pasa automáticamente de `in-progress` a **`ready-for-release`** (recomendado, alineado con el Kanban) cuando todas las tareas estén `[x]`, o si hace falta un comando específico tipo **`/sdlc-close-dev`**. |
| **Notas** | Transición automática al completar tareas en `sdlc-dev` es razonable si el comando exige checklist de tests y actualiza `updated_at` + `history.md`. Un comando de cierre aparte solo aporta si se quiere revisión humana obligatoria antes de marcar `ready-for-release`. |

### 3.3 Eliminar `/sdlc-fix`

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Instrucción** | **Eliminar `sdlc-fix`** si **`/sdlc-analyze`** cubre bugs (tipo `BUG`) con el mismo flujo que features/experimentos. |
| **Seguimiento** | Unificar estados en `templates/bug.md` con el Kanban común (o documentar excepción mínima). Actualizar README fase 6 y cualquier referencia cruzada en reglas/comandos. |

---

## 4. `/sdlc-inception` y plantilla incorrecta para README

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | `sdlc-inception.mdc` indica generar `README.md` siguiendo `templates/inception.md`, pero esa plantilla es un documento de **inception** (`type: inception`), no una plantilla de README de proyecto. |
| **Instrucción** | **Corregirlo:** separar plantilla de README (nueva o existente) vs documento de inception (p. ej. `docs/inception.md` o sección en docs), y actualizar las instrucciones del comando. |

---

## 5. Pregunta greenfield / brownfield en el CLI

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | El instalador pregunta el modo, no lo persiste en `config.yaml`, y `/sdlc-inception` vuelve a decidir el enfoque. La distinción no es imprescindible para instalar el framework. |
| **Instrucción** | **Eliminar la pregunta del CLI.** La metodología debe servir igual para proyectos nuevos y existentes; el agente en inception detecta contexto (repo vacío vs código existente) sin preguntar en `init`. |
| **Seguimiento** | Quitar referencias al modo en mensajes del CLI (`history.md` inicial, notas de setup) o sustituir por texto neutro («Framework Setup»). |

---

## 6. `docs/config.yaml` generado por el CLI

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | `bin/cli.js` construye el YAML en código (`configYamlContent`), omitiendo el bloque `phases` y otros detalles del `docs/config.yaml` plantilla del repo. Duplicación y deriva entre fuentes. |
| **Instrucción** | **El CLI debe usar la plantilla** (p. ej. `docs/config.yaml` empaquetado o `templates/config.yaml`) y solo **sustituir** valores interactivos (`language.code`, `user_explanations`, etc.), no redefinir el esquema en JS. |

---

## 7. Protección contra segundo `init`

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | Ejecutar `ai-sdlc init` de nuevo sobrescribe `docs/config.yaml`, plantillas y reglas con `overwrite: true`, pudiendo borrar personalización del usuario. |
| **Instrucción** | **Si `docs/config.yaml` ya existe, detener el CLI** con mensaje claro (sugerir `ai-sdlc update` para refrescar reglas/comandos/plantillas). |

---

## 8. Soporte multi-proveedor (Cursor, Claude, Gemini, OpenAI)

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | Hoy `syncPlatformFiles` distribuye de forma desigual: Cursor recibe reglas + comandos; Claude solo comandos; Gemini/OpenAI solo reglas (sin comandos `/sdlc-*`). Claude no recibe la regla maestra. |
| **Instrucción** | **Investigar** convenciones actuales de cada proveedor y adaptar el instalador (rutas, extensiones `.md`/`.mdc`, skills, project instructions) para que reglas y comandos equivalentes lleguen a **todos** los targets seleccionados. Documentar limitaciones reales si alguna plataforma no soporta slash commands. |

---

## 9. Eliminar `sdlc-deploy` del repositorio

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | Sigue existiendo `files/commands/sdlc-deploy.mdc` y puede copiarse a proyectos en install/update. Choca con el flujo basado en `/sdlc-release`. |
| **Instrucción** | **Eliminar** el fichero del repo y cualquier mención en README, reglas u otros comandos. Tras publicar, los proyectos existentes lo perderán en el próximo `update` (comportamiento deseado). |

---

## 10. Inconsistencias en el README (tabla de fases y estados)

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | La tabla mezcla estados de entrada/salida por fase (p. ej. diseño vs `ready-for-implementation`), sigue listando `/sdlc-fix`, no refleja comandos de cierre ni el flujo sin `deploy`. Versión npm (`1.0.0`) vs `version` en config (`1.1.0`) puede confundir. |
| **Instrucción** | **Arreglar el README** tras cerrar los ítems 3 y 9: fases, comandos, estados Kanban, y aclarar si `version` en `config.yaml` es esquema de metodología (no semver del paquete). |

---

## Detalle A — Regla maestra vs `language.user_explanations`

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` (regla alineada con `language.user_explanations`) |
| **Problema** | `files/rules/sdlc-framework.mdc` fija comunicación «simple» en texto fijo; `/sdlc-analyze` sí lee `language.user_explanations` de `config.yaml`. |
| **Instrucción** | Alinear la regla maestra con la config (`simple` vs `technical`) en todos los comandos que hablan con el usuario. |

---

## Detalle B — Convención de nombres de estado (`in-progress` vs `in_progress`)

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` (plantillas unificadas con `in-progress`) |
| **Problema** | README y `/sdlc-plan` usan `in-progress`; `templates/experiment.md` documenta `in_progress`. |
| **Instrucción** | Elegir **un** formato (recomendado: `in-progress` como en el Kanban del README) y unificar plantillas, comandos e historial. |

---

## Detalle C — Empaquetado npm y `.gitignore`

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Problema** | Sin `.gitignore` / `.npmignore` / `"files"` en `package.json`, riesgo de commitear `node_modules` o tarballs; el paquete puede incluir ficheros innecesarios (`docs/config.yaml` del framework como referencia interna). |
| **Instrucción** | Añadir ignores, `"files": ["bin", "files", "templates", "docs/config.yaml"]` (o mover plantilla de config a `templates/`), y verificar `npm pack --dry-run` antes de publish. |

---

## 12. Comando `/sdlc-status` (tablero Kanban)

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` |
| **Instrucción** | Comando que escanea features/bugs/experiments y regenera `docs/status-board.md` con tablas por columna Kanban; resumen al usuario; solo lectura. |
| **Artefactos** | `files/commands/sdlc-status.mdc`, `templates/status-board.md`, `paths.status_board_file` en config. |

---

## 11. Post-revisión — robustez del CLI (oct 2026)

| ID | Estado | Problema | Solución acordada |
| :--- | :--- | :--- | :--- |
| **11.1** | `hecho` | Subcomandos desconocidos ejecutaban `init` | Solo `init`, `update`, `help` / `-h` / `--help`; resto → error + ayuda |
| **11.2** | `hecho` | `update` sin detección caía en Cursor silenciosamente | Persistir `platforms:` en `docs/config.yaml`; update lee config → detección → aviso + fallback Cursor |
| **11.3** | `hecho` | `.mdc` huérfanos en `.cursor/commands/` (instalaciones viejas) | Limpiar `sdlc-*.md` / `sdlc-*.mdc` antes de sincronizar |
| **11.4** | `hecho` | `update` copiaba todo `templates/` de forma brusca | Copiar solo ficheros del paquete (overwrite por archivo); plantillas extra del usuario se conservan |
| **11.5** | `hecho` | `console.clear()` falla sin TTY | Limpiar solo si `process.stdout.isTTY` |
| **11.6** | `hecho` | Sin `--help` | `ai-sdlc help` |
| **11.7** | `hecho` | `history.md` inicial distinto de `templates/history.md` | Init genera history desde plantilla |
| **11.8** | `hecho` | Sin `engines` en npm | `node >= 18` en `package.json` |
| **11.9** | `hecho` | Metadatos npm (`repository`, `homepage`) | https://github.com/tbarreno/ai-sdlc-framework |

---

## Orden de trabajo sugerido

1. **9** → **3** (estados + comandos close + quitar fix/deploy) — núcleo metodológico  
2. **4**, **5**, **6**, **7** — CLI e inception  
3. **8** — multi-proveedor  
4. **10**, **A**, **B**, **C** — documentación, reglas y publish  
5. **1**, **2** — ya hechos; solo cerrar seguimiento (ignores / `files`)

---

## Registro de cambios en este documento

| Fecha | Nota |
|--------|------|
| 2026-10-26 | Creación inicial a partir de la revisión pre-publicación e instrucciones del maintainer. |
| 2026-10-26 | Ítems **3** y **9** implementados: close-analysis/design, unificación Kanban, eliminación deploy/fix, actualización README parcial. |
| 2026-10-26 | Ítems **4–7**: `templates/readme.md`, inception en `docs/inception.md`, CLI sin modo greenfield, config desde plantilla, guard de re-init. |
| 2026-10-26 | Ítem **8**: `bin/platform-sync.js`, Gemini `GEMINI.md`, Codex `AGENTS.md`, Claude rules+commands, Cursor `.md` commands. |
| 2026-10-26 | Ítem **10** y **Detalle C**: README versioning, `.gitignore`, `files` en npm, `npm pack --dry-run`. |
| 2026-10-26 | Ítem **11** (post-revisión): CLI routing, `platforms` en config, limpieza legacy, templates, help, history template. |
| 2026-10-27 | Ítem **11.9**: `repository`, `homepage`, `bugs` en `package.json`. |
| 2026-10-27 | Ítem **12** + revisión final: `/sdlc-status` documentado en README, config, multi-platform, plantillas. |

---

## 13. Revisión final pre-publicación

| Campo | Detalle |
|--------|---------|
| **Estado** | `hecho` — listo para `npm publish` |
| **Comandos** | 9 en `files/commands/`; sync verificado (Cursor) |
| **Paquete npm** | 27 ficheros, ~20 KB; `files` allowlist; `engines` node ≥18 |
| **Pendiente operativo** | `npm publish --access public` como `@tbarreno/ai-sdlc-framework`; push a GitHub; tag opcional `v1.0.0` |
