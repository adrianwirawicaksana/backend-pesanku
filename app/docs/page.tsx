"use client";

import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    const cssId = "swagger-ui-css";
    const jsId = "swagger-ui-js";

    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";
      document.head.appendChild(link);
    }

    const initSwagger = () => {
      // @ts-ignore
      const { SwaggerUIBundle } = window;
      if (!SwaggerUIBundle) return;
      SwaggerUIBundle({
        url: "/api/v1/docs",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: "BaseLayout",
        deepLinking: true,
        displayRequestDuration: true,
        filter: true,
      });
    };

    if (!document.getElementById(jsId)) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";
      script.onload = initSwagger;
      document.body.appendChild(script);
    } else {
      initSwagger();
    }
  }, []);

  return <div id="swagger-ui" />;
}