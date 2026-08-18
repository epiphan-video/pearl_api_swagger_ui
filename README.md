# Pearl / Epiphan Device REST API — Swagger UI

Static [Swagger UI](https://swagger.io/tools/swagger-ui/) bundle that documents
the REST APIs of multiple Epiphan products. It is published via GitHub Pages
from the `gh-pages` branch at:

```
https://<org>.github.io/pearl_api_swagger_ui/
```

A **Product** selector in the top-right switches between the available API
specs. You can also deep-link straight to a product (see below).

## Layout

```
api/
  v2.0/openapi.yml        # Pearl device REST API
  ec20/v1/openapi.yml     # EC20 PTZ Camera REST API
css/                      # swagger-ui.css + local overrides (index.css)
js/                       # swagger-ui bundle + swagger-initializer.js
images/                   # logo + favicons
index.html                # entry point
```

## Test it locally

The initializer resolves spec files against a URL that includes the
`/pearl_api_swagger_ui/` path segment (to match the GitHub Pages URL). So you
must serve from the **parent** directory, not from inside the repo — otherwise
the specs 404.

```bash
# from inside the repo, step up to the parent that CONTAINS pearl_api_swagger_ui/
cd ..
python3 -m http.server 65000
```

Then open:

```
http://localhost:65000/pearl_api_swagger_ui/
```

> Serving from *inside* the repo (`http.server` in the repo root) will 404 the
> spec files, because the page requests `/pearl_api_swagger_ui/api/...` which
> won't exist at that root.

## Deep-link to a specific product

Add a `product` query parameter (case-insensitive; must match a name in the
selector). Unknown or missing values fall back to the first product (Pearl).

```
http://localhost:65000/pearl_api_swagger_ui/?product=EC20
```

Switching products in the UI also updates the URL, so the current view is always
shareable and bookmarkable.

## Add another product

1. Drop the OpenAPI file in a versioned folder, e.g. `api/<product>/v1/openapi.yml`.
2. Register it in the `specs` array in [`js/swagger-initializer.js`](js/swagger-initializer.js):

   ```js
   var specs = [
     { name: "Pearl", url: base + "/api/v2.0/openapi.yml" },
     { name: "EC20",  url: base + "/api/ec20/v1/openapi.yml" },
     { name: "NewProduct", url: base + "/api/newproduct/v1/openapi.yml" },
   ];
   ```

The selector, deep-linking, and default-load all pick it up automatically. The
first entry is the default product.

## Notes

- "Try it out" is intentionally disabled — the specs use auth schemes (e.g. HTTP
  Digest) and CORS that can't be exercised from the browser.
- `README.md` and `_config.yml` are excluded from the published site via
  `_config.yml`.
