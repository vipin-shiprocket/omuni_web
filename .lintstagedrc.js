module.exports = {
  'src/**/*.{ts,scss,md,html}': (files) =>
    `npx prettier ${files.join(' ')} --check --write`,

  'src/**/*.ts': (files) =>
    `ng lint ${files.map((file) => `--lint-file-patterns ${file}`).join(' ')}`,
};
