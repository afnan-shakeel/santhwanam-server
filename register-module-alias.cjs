const moduleAlias = require('module-alias');
const path = require('path');

// Register aliases pointing to the built `dist` folder so runtime imports using `@/...` work.
moduleAlias.addAliases({
  '@': path.join(__dirname, 'dist'),
  '@config': path.join(__dirname, 'dist', 'config'),
  '@modules': path.join(__dirname, 'dist', 'modules'),
  '@shared': path.join(__dirname, 'dist', 'shared'),
  '@constants': path.join(__dirname, 'dist', 'constants'),
});

// Import the compiled ESM entry. Dynamic import runs the module's top-level code.
const { pathToFileURL } = require('node:url');

(async () => {
  try {
    const x = pathToFileURL(path.join(__dirname, 'dist', 'index.js')).href;
    await import(x);
  } catch (err) {
    // Fallback: try plain import path
    try {
      await import('./dist/index.js');
    } catch (e) {
      console.error('Failed to import dist/index.js', e);
      process.exit(1);
    }
  }
})();
