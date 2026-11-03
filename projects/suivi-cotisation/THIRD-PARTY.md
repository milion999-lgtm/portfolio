# Third-party assets

The browser bundles in `assets/vendor` are pinned locally; there are no runtime CDN script dependencies.

| Asset | Package version | License | SHA-256 |
|---|---:|---|---|
| `supabase-2.118.0.js` | `@supabase/supabase-js` 2.118.0 | MIT | `EE3BE8DE192B97CB1D73D1E95D6B82BB1F6B658C0F97C4EF757FC331996ED3D3` |
| `jspdf.umd.min.js` | `jspdf` 4.2.1 | MIT | `E6551FCDC32F09D6853B2C5126D18D01D9447E0DA618A41A11EBEEE0F6C20D54` |

The dependency versions are also pinned in `package.json` and `package-lock.json`. Run `npm audit --omit=dev` before release and review the lockfile when updating either bundle.
