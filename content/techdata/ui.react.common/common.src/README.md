# Summary

`common.src` was created with an intention to have a separate bundle of only those components that are used in non-DCP sites.

Such components are copied to this folder and existing folder structure is retained to preserve existing relative path imports.

Imported component includes:

- SearchBar
- Signin
    - DropdownMenu
    - ProfileMegaMenu
    - spinner
    - Widgets
- Mini Cart

# Technical Debts:

- Remove unused files from all components.
- Remove unused imports
- Clean up package.json

Running `node` commands like `npm run dev` or `npm run prod` will generate necessary bundles, `common.js` and `common.css` in our case and gets moved to the `clientlib-react` folder as specified in the `clientlib.config.js` file.
