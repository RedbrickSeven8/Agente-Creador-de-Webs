# PROJECT MAP — AGENTE CREADOR DE WEBS

## 1. Topología del Sistema (Mermaid Graph)

```mermaid
graph TD
    User([Usuario: Daniel • Dispositivos Web / Desktop / Mobile]) --> Header[Header: App Branding & Responsive Mobile Nav]
    
    subgraph UI_UX [UI / UX Minimalista & Accesible - WCAG AA]
        Header --> MainView[Contenedor Principal: Main Layout]
        MainView --> Sidebar[Sidebar: Gestor de Carpetas / Proyectos + Conversaciones + Focus-Visible]
        MainView --> ChatArea[Chat Workspace: Historial de Mensajes + Agent Thoughts + Workflow Steps]
        MainView --> WelcomePanel[Welcome / ConfigScene: Parámetros del Agente & Prompt Variables]
        MainView --> InputDock[Input Dock Accesible: Textarea Auto-height + Image Uploader + Attachment Manager]
        MainView --> CookieConsent[Banner de Cookies y Compliance Legal]
    end

    subgraph Context_Engine [Motor de Contexto & Jerarquía de Carpetas]
        Sidebar -->|Selección de Carpeta| ActiveFolderState[State: activeFolderName]
        ActiveFolderState -->|Inyección Automática| ContextInjection[Preamble Injection & Inputs Preamble]
        ContextInjection -->|Inputs: workspace_folder / folder_context| DifyPayload[Payload Enriquecido /chat-messages]
    end

    subgraph Service_Layer [Capa de Servicios & Dify API]
        DifyPayload --> DifyClient[Dify SSE Client & Service Layer: /service/index.ts]
        DifyClient <-->|SSE Streaming / REST| DifyBackend[Backend Dify API / App Server]
    end

    subgraph Accessibility_Compliance [Accesibilidad & Semántica]
        WCAG_Buttons[Botones Semánticos <button> + aria-label en Todas las Acciones]
        WCAG_Focus[Estados :focus-visible con anillo de contraste 2px]
        WCAG_Touch[Targets táctiles optimizados para móviles y escritorio]
    end
```

## 2. Componentes Clave & Modificaciones
- **Gestión de Contexto de Carpeta (`app/components/sidebar/index.tsx`, `app/components/index.tsx`):**
  - Sistema de Carpetas y Proyectos con persistencia en `localStorage`.
  - Inyección en tiempo real del contexto de la carpeta activa tanto en las variables `inputs` (`active_folder`, `workspace_folder`, `folder_context`) como en el preámbulo de la consulta `[Contexto Carpeta: "..."]`.
- **Accesibilidad y Semántica (`app/components/base/button/index.tsx`, `app/components/header.tsx`, `app/components/chat/index.tsx`, `app/components/chat/answer/index.tsx`):**
  - Reemplazo de elementos interactivos `<div>` por `<button type="button">` semánticos.
  - Atributos `aria-label` descriptivos en todos los controles interactivos (subida de archivos, alternar menús, envío de mensajes, feedback like/dislike, gestión de carpetas).
  - Estilos `:focus-visible` universales para navegación completa por teclado (Tab / Enter / Space).
- **Diseño Minimalista & Paleta Limpia (`app/styles/globals.css`, `app/components/sidebar/index.tsx`, `app/components/header.tsx`):**
  - Fondos neutros de baja distracción con bordes sutiles, microinteracciones fluidas y tipografía semántica legible.
