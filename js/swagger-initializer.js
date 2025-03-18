window.onload = function () {
  window.ui = SwaggerUIBundle({
    // SET the URL to the file openapi.yml
    url: window.location.protocol + "//" + window.location.host + "/api/v2.0/openapi.yml",
    dom_id: '#swagger-ui',
    deepLinking: true,
    docExpansion: "none",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
      function () {
        return {
          wrapComponents: {
            authorizeBtn: () => () => null,
            Topbar: () => () => {
              return ui.React.createElement('div',
                { className: "topbar" },
                ui.React.createElement('div',
                  { className: "wrapper" },
                  ui.React.createElement('div',
                    { className: "topbar-wrapper" },
                    ui.React.createElement('a', {
                      // SET the URL of the link for the image in the left top corner when the user clicks it
                      href: "/admin",
                      rel: "noopener noreferrer",
                      className: "link"
                    }, ui.React.createElement('img', {
                      height: "80",
                      // SET the URL of the image in the left top corner
                      src: "/images/product.png",
                      alt: "Pearl"
                    }),
                      ui.React.createElement(
                        'span',
                      )
                    ))
                ));
            },
          }
        }
      },
      function () {
        return {
          statePlugins: {
            spec: {
              wrapSelectors: {
                allowTryItOutFor: () => () => false
              }
            }
          }
        }
      },
    ],
    layout: "StandaloneLayout",
    validatorUrl: "none",
    filter: true
  });
};
