# Context packet — editor-richer-blocks

Run ID: `editor-richer-blocks-20260528-175200`
Target repo: `clients/light-brands/roses-os` (existing).
Current branch: rebased onto `origin/main` at `22b0b0d`.
Active project: `roses-os` per `.qie/context.yaml`.

## Raw idea (verbatim from Dario)

Reformar el editor de manuales de Roses OS (clients/light-brands/roses-os) para que pueda expresar la fidelidad de los PDFs canónicos.

**Problema.** El editor en `src/components/manuals/BlockEditor.tsx` (442 líneas), `src/components/manuals/blocks/*` y `src/lib/manuals/types.ts` (94 líneas) tiene un modelo lossy. Solo 6 tipos de bloque: `text` (HTML pelado, sin formato estructurado), `heading`, `image`, `image-row`, `divider`, `page-break`. Con eso es imposible reproducir la maquetación de los PDFs canónicos. Memory `project-roses-os-manual-exports` lo confirma: "el modelo de bloques es lossy, la única salida es renderizar a través de un template real o servir los PDFs canónicos directo".

**Por qué ahora (REFORMULADO POST-PHASE-2 PRE-FLIGHT).** El arco hermano `faithful-pdf-export` corrió M1-M5 con /develop el 2026-05-27 en worktree paralelo `roses-os--faithful-pdf-export`: adapter de Chromium, ruta `/api/manuals/[manualId]/pdf` y ruta `print` listas en local. NO está en `origin/main` todavía. Este spec se construye en paralelo asumiendo que ese PR aterriza antes de que la implementación del editor llegue a la milestone de "live preview". Si el export PR demora, el editor todavía mejora el modelo de bloques + UX standalone; la dependencia es solo M-preview.

**Verdad de diseño.** Los 4 PDFs Final Version recién copiados a `docs/canon/` (untracked, pendiente commit en M0 del spec):
- `docs/canon/Rose Meditation Level 1.pdf` (20 MB) → slug `rose-meditation-level-1`
- `docs/canon/Rose Meditation Level 2.pdf` (20 MB) → slug `rose-meditation-level-2`
- `docs/canon/Rose Meditation Level 3.pdf` (15 MB) → slug `rose-meditation-level-3`
- `docs/canon/Aura 1 - Jan2026.pdf` (3.2 MB) → slug `aura-level-1`

Cualquier bloque, control o decisión de layout que el editor incorpore tiene que justificarse contra un patrón visible en alguno de esos 4 PDFs.

**Anclas en el código actual** (verificadas en `origin/main` post-rebase):
- `src/components/manuals/BlockEditor.tsx` (442 líneas) — render + drag-reorder + add menu.
- `src/components/manuals/blocks/{AddBlockMenu,TextBlock,HeadingBlock,ImageBlock,ImageRowBlock,DividerBlock,PageBreakBlock}.tsx` — 7 archivos.
- `src/components/manuals/BlockWrapper.tsx` — chrome común.
- `src/lib/manuals/types.ts` (94 líneas) — schema. `TextContent = { html: string }`. `BlockType = 'heading' | 'text' | 'image' | 'divider' | 'page-break' | 'image-row'`. Locales declarados: `'en' | 'pt' | 'es' | 'el' | 'ru' | 'uk'` (6, no 4 como decía el brief original).
- `src/lib/manuals/export-html.ts`, `src/lib/manuals/export-md.ts` — exportadores hand-rolled actuales.
- `scripts/build-manuals.ts` — pipeline puppeteer build-time existente (referencia).
- Supabase: tabla `manuals` (4 filas en `supabase/manuals-schema.sql:134-137`: rose-meditation-level-{1,2,3} + aura-level-1) + tabla `manual_blocks` con `content JSONB`.

**Locales declarados en código** (`src/lib/data/manual-pdf-paths.ts`): Level 1 cubre EN+ES+PT+EL en PDF servido; Level 2 y Level 3 hoy solo EN; Aura sin PDFs servidos. El modelo en `types.ts` declara 6 locales (EN, PT, ES, EL, RU, UK). El editor tiene que destrabar la carga multi-locale conforme se traduzcan.

## Lo que el spec debe cubrir (sin tope de tareas, integral-arc per genesis-build §J)

1. **Inventario** contra los 4 PDFs de `docs/canon/`: lista cerrada de patrones visuales (cover, doble columna, callout enmarcado, heading decorado, image+caption, ejercicio numerado, glosario, índice, footnote, quote, etc), mapeada a tipos de bloque nuevos o variantes de existentes. Este es el primer task (M1).
2. **Modelo de bloque revisado**: schema TS, migración del JSONB en Supabase, compatibilidad hacia atrás con manuales ya cargados (los 4 manuales seedados no se rompen al cargar).
3. **Rich-text estructurado en TextBlock**: cambiar de "HTML pelado" a editor con esquema controlado (lista cerrada de marks/nodes, no innerHTML libre). Decisión de stack (TipTap / Lexical / Plate / serializador propio) deliberada en panel — Winston/Amelia.
4. **Nuevos bloques mínimos** derivados del inventario: callout, quote, two-column section, image+caption, numbered-exercise, table, footnote/reference, y los que aparezcan en el paso 1.
5. **Controles de layout**: agrupar bloques en secciones, columnas, page-aware.
6. **Live preview** enganchado al renderer Chromium en construcción. Lo que el autor ve en preview es lo que va a salir en PDF. (Depende de faithful-pdf-export PR en main; si demora, la M-preview se difiere.)
7. **Drag-reorder accesible por teclado**, undo/redo, autosave con conflict handling.
8. **Validación**: cada bloque tiene schema, el editor rechaza estado inválido antes de guardar.
9. **Localización**: el modelo soporta la estructura multi-locale que `manuals` ya usa (6 locales declarados), sin obligar a autor por locale separado.
10. **Telemetría mínima**: qué bloque se usa, cuál rompe, dónde se atasca el autor.

## Fuera de alcance

- El render server (faithful-pdf-export ya lo cubre en worktree hermano).
- Auth/PIN (ya está, `ManualPinGate.tsx` + `AdminPinManager.tsx`).
- El visor de lectura para usuario final (otro spec si hace falta).

## Anclas operativas

- `target_kind = existing`, `target_repo = clients/light-brands/roses-os`.
- `target_branch = origin/main` post-rebase, HEAD `22b0b0d`.
- `architecture_author = true`, `architecture_mode = create`, `architecture_path = clients/light-brands/roses-os/ARCHITECTURE.md` (no existe todavía — primera arquitectura formal del repo).
- `kaze_attach = true` (surface autor-facing).
- `Edut auto-attach = false` (no es stakeholder/consent/external-send shape — es UI interna del editor).
- `slug = 001-richer-block-editor`.
- `host_repo = Light-Brands/roses-os`.
- Sin tope de tareas; cohortes ≤10 por milestone per genesis-build §J.

## Memory anchors (relevantes)

- `[[project_roses_os_manual_exports]]` — el lossy block model es un finding documentado, no especulación.
- `[[feedback_voice_dario]]` — voz en spec.md, plan.md, ARCHITECTURE.md, issue bodies.
- `[[feedback_autodev_not_ready]]` — labels default a `human`, no autodev.
- `[[feedback_develop_local_first]]` — el spec asume /develop strict-local; no PR-as-precondition.
- `[[feedback_close_with_live_url]]` — el closing del /create-spec pide live URL del mockup.
- `[[feedback_mockup_data_hygiene]]` — fixture data en mockup usa nombres del dominio Roses, no nombres reales de la red de Dario.

## Las 6 preguntas para cada panelist

1. ¿Qué problema está resolviendo esto realmente?
2. ¿Cuál es la versión más chica que prueba la idea?
3. ¿Qué 3 riesgos lo matan si se ignoran?
4. ¿Cómo se ve el éxito a 90 días?
5. ¿En qué tareas atómicas se descompone? (lista, cada una ≤1 día de trabajo, sin tope superior por integral-arc.)
6. ¿Qué es lo único que solo tu facultad iba a notar?

Cap 600 palabras por review.
