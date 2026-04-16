# Cortex Design System

## 1. Visual Theme & Atmosphere
The Cortex UI operates as an aerospace-grade mission terminal. The design prioritizes zero cognitive strain—meaning the backdrop is an absolute void (`#030303`) layered beneath real-time WebGL physical physics interfaces (like interacting Light Rays or 3D Brain Telemetry models). 

## 2. Typography Rules
- **Headlines & Interface Nodes:** `Rostex` (Custom industrial military geometric font) — heavily tracked (0.2em - 0.4em) and universally UPPERCASE.
- **Accents:** `Xirod` — used sparingly for severe telemetry warnings or primary status arrays. 
- **Data output & Body paragraphs:** Standard `mono` (Courier, Jetbrains) with a 50%-60% opacity reduction. Everything is strictly legible but inherently technical.

## 3. Structural Semantics
- **No Heavy Backgrounds:** Container elements utilize intense minimalism: `bg-white/[0.02] border border-white/5 backdrop-blur-md`. This is essentially "Ghost Glass".
- **Interaction:** Hovering elements increase opacity (`bg-white/10`, `border-white/20`) with a smooth CSS transition.
- **Motion:** The application utilizes `@studio-freight/lenis` for inertial smooth scrolling across the entire viewport hierarchy. Physical velocity binds digital movement.

## 4. Hierarchy Strategy
Always layer abstract interactive WebGL elements (Spline, LightRays, GLB models) behind or alongside the layout wrapped in `pointer-events-none` blocks to ensure the terminal user experience remains physically unobstructed.
