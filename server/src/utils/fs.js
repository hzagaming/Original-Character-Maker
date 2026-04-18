const fs = require("fs/promises");

async function ensureDirectories(paths) {
  await Promise.all(paths.map((dirPath) => fs.mkdir(dirPath, { recursive: true })));
}

module.exports = {
  ensureDirectories
};
