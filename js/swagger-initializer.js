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

  // Pick the initial product from the `?product=` query param (case-insensitive,
  // e.g. ?product=EC20), falling back to the first registered product.
  function specForProduct(name) {
    if (!name) return null;
    name = name.toLowerCase();
    return specs.filter(function (s) { return s.name.toLowerCase() === name; })[0] || null;
  }
  var requested = new URLSearchParams(window.location.search).get('product');
  var initialSpec = specForProduct(requested) || specs[0];

  // Reflect the current product in the URL so the view is shareable/bookmarkable.
  function setProductInUrl(name) {
    var params = new URLSearchParams(window.location.search);
    params.set('product', name);
    window.history.replaceState(null, '', window.location.pathname + '?' + params.toString() + window.location.hash);
  }

  window.ui = SwaggerUIBundle({
    // The custom topbar selector (below) drives spec switching via specActions,
    // so we load the initial product through `url` to guarantee it renders by
    // default — the native `urls` dropdown is not used (we override Topbar).
    url: initialSpec.url,
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
                    defaultValue: initialSpec.url,
                    onChange: function (e) {
                      var url = e.target.value;
                      var name = specs.filter(function (s) { return s.url === url; }).map(function (s) { return s.name; })[0];
                      ui.specActions.updateUrl(url);
                      ui.specActions.download(url);
                      if (name) setProductInUrl(name);
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
