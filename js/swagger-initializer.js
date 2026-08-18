window.onload = function () {
  pathname = window.location.pathname.length > 0 ? window.location.pathname : '';
  if (pathname.startsWith('/')) {
    pathname = pathname.substring(1);
  }
  pathname = pathname.length > 0 ? pathname.split('/')[0] : 'pearl_api_swagger_ui';

  // Base URL that all spec files are resolved against.
  var base = window.location.protocol + "//" + window.location.host + '/' + pathname;

  // Register a product here to add it to the selector.
  // name: label shown in the dropdown; url: location of its openapi file.
  var specs = [
    { name: "Pearl", url: base + "/api/v2.0/openapi.yml" },
    { name: "EC20", url: base + "/api/ec20/v1/openapi.yml" },
  ];

  window.ui = SwaggerUIBundle({
    // The custom topbar selector (below) drives spec switching via specActions,
    // so we load the first product through `url` to guarantee it renders by
    // default — the native `urls` dropdown is not used (we override Topbar).
    url: specs[0].url,
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
              // Product selector: switches the displayed spec.
              var options = specs.map(function (spec) {
                return ui.React.createElement('option', { value: spec.url, key: spec.url }, spec.name);
              });
              var selector = ui.React.createElement('div',
                { className: "product-selector" },
                ui.React.createElement('label',
                  { className: "product-selector__label", htmlFor: "product-select" }, "Product"),
                ui.React.createElement('div',
                  { className: "product-selector__field" },
                  ui.React.createElement('select', {
                    id: "product-select",
                    className: "product-selector__select",
                    onChange: function (e) {
                      var url = e.target.value;
                      ui.specActions.updateUrl(url);
                      ui.specActions.download(url);
                    }
                  }, options)
                )
              );

              return ui.React.createElement('div',
                { className: "topbar" },
                ui.React.createElement('div',
                  { className: "wrapper" },
                  ui.React.createElement('div',
                    { className: "topbar-wrapper" },
                    ui.React.createElement('a', {
                      // SET the URL of the link for the image in the left top corner when the user clicks it
                      href: "https://epiphan.com",
                      rel: "noopener noreferrer",
                      className: "link"
                    }, ui.React.createElement('img', {
                      height: "80",
                      // SET the URL of the image in the left top corner
                      src: "./images/epiphan-logo-dark.svg",
                      alt: "Epiphan"
                    }),
                      ui.React.createElement(
                        'span',
                      )
                    ),
                    selector
                  ))
                );
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
