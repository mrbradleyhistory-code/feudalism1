# Agents

## Cursor Cloud specific instructions

Fief Keeper is a zero-dependency static web app (vanilla HTML, CSS, JS). There is no package manager, no build step, no backend, and no database.

### Running the app

Serve the project root with any static file server:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in Chrome. The `file://` protocol also works for quick checks.

### Testing

There are no automated tests, linter, or type checker in this repo. Manual browser testing is the only verification method. Key things to verify after changes:

- Page loads without console errors.
- Resource values update when steward actions are chosen.
- Turn advances when "End Turn" is clicked.
- Tutorial dialog opens/closes.
- Tournament questions display and accept answers.

### Caveats

- All game state lives in memory; refreshing the page resets everything.
- The app uses modern browser APIs (`structuredClone`, `<dialog>`, `replaceChildren`) — Chrome 98+ is required.
