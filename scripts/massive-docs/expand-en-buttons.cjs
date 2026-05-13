const fs = require('fs');

const file = 'src/docsContent/en.ts';
let content = fs.readFileSync(file, 'utf8');

function insertIntoButtonsArray(toolId, newEntries) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) { console.error('Tool not found:', toolId); return false; }
  const btnStart = content.indexOf('buttons: [', toolStart);
  if (btnStart === -1) { console.error('Buttons not found for:', toolId); return false; }
  let depth = 1;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let i = btnStart + 'buttons: ['.length; i < content.length; i++) {
    if (escape) { escape = false; continue; }
    if (content[i] === '\\') { escape = true; continue; }
    if (!inString && (content[i] === "'" || content[i] === '"' || content[i] === '`')) {
      inString = true; stringChar = content[i];
    } else if (inString && content[i] === stringChar) {
      inString = false; stringChar = null;
    } else if (!inString) {
      if (content[i] === '[') depth++;
      else if (content[i] === ']') {
        depth--;
        if (depth === 0) {
          content = content.slice(0, i) + '\n' + newEntries + content.slice(i);
          return true;
        }
      }
    }
  }
  console.error('Could not find end of buttons array for:', toolId);
  return false;
}

function makeButton(name, desc) {
  return `        { name: '${name}', description: '${desc}' },`;
}

const newButtons = {
  'face-maker': [
    makeButton('Randomize', 'Randomly combine all parts and parameters to quickly generate a new character. All sliders will automatically jump to random values. Click repeatedly for inspiration.'),
    makeButton('Undo', 'Undo the last operation, up to 20 steps. Supports Ctrl+Z shortcut.'),
    makeButton('Redo', 'Restore undone operations. Supports Ctrl+Y / Ctrl+Shift+Z shortcuts.'),
    makeButton('Zoom Preview', 'Expand the central canvas to fullscreen mode for detail inspection. Press Esc or click close to exit.'),
    makeButton('Screenshot', 'Copy current canvas content to clipboard for pasting into chat apps or image editors.'),
    makeButton('Share Link', 'Generate a URL containing current configuration parameters. Others opening the link will see the exact same character.'),
    makeButton('Dark Mode Toggle', 'Toggle canvas background between dark and transparent to check dark area details.'),
  ],
  'style-transfer': [
    makeButton('Preview', 'Quickly generate a low-resolution preview (256px) before full processing to confirm style selection.'),
    makeButton('Compare View', 'Display original and stylized images side by side with a draggable slider for transition viewing.'),
    makeButton('History', 'View recent 20 style transfer histories. Reload parameters or delete records.'),
    makeButton('Favorite Style', 'Save current style model and parameters to favorites for quick future access.'),
    makeButton('Adjust Canvas', 'Crop, rotate, or flip input images before style transfer.'),
    makeButton('Advanced Params', 'Expand more professional parameters: content weight, style weight, TV weight, initialization method.'),
    makeButton('GPU Monitor', 'Real-time display of GPU memory usage and temperature to judge device load.'),
  ],
  'prompt-suite': [
    makeButton('New Character', 'Create a new blank character card. Choose from templates or fully customize.'),
    makeButton('Duplicate Character', 'Copy all content of the current character card to an independently editable duplicate.'),
    makeButton('Delete Character', 'Permanently delete current character card. Requires double confirmation; exported files are unaffected.'),
    makeButton('Import Character', 'Import character data from JSON, Markdown, or CSV files. Supports batch import.'),
    makeButton('Template Market', 'Browse and download community-shared custom templates. Upload your own templates.'),
    makeButton('Relationship Map', 'Visualize relationship networks between all characters in the world (family, friends, enemies, lovers).'),
    makeButton('Timeline', 'Create event timelines for characters or worlds. Add events, dates, descriptions, and related characters.'),
    makeButton('Compare Mode', 'Select two character cards for side-by-side comparison. Highlights differences to check setting conflicts.'),
  ],
  'llm-hub': [
    makeButton('Clear Chat', 'Clear all history messages in current conversation while preserving system prompt and model config.'),
    makeButton('Export Chat', 'Export current conversation as Markdown, JSON, or plain text file.'),
    makeButton('Import Chat', 'Import conversation history from file. Supports continuing previous conversations.'),
    makeButton('Share Chat', 'Generate a read-only share link for the conversation. Optionally include system prompt.'),
    makeButton('Token Stats', 'Display current conversation token usage details: system prompt, user messages, AI responses.'),
    makeButton('Preset Prompts', 'Load preset system prompt templates (roleplay, coding assistant, creative writing, etc.).'),
    makeButton('Multi-Model Compare', 'Send the same question to multiple models simultaneously. Display responses side by side.'),
    makeButton('Voice Input', 'Enable microphone voice input. Supports Chinese, English, and Japanese speech recognition.'),
    makeButton('Code Interpreter', 'Let AI execute Python code in a sandbox environment and return results.'),
  ],
  'tts-export': [
    makeButton('Preview', 'Synthesize and play only the first 100 characters of current input for quick voice effect confirmation.'),
    makeButton('Batch Import', 'Import dialogue lists from text files or CSV for automatic audio file generation.'),
    makeButton('Voice Clone', 'Upload 5-10 seconds of reference audio to clone a specific person\'s voice for synthesis.'),
    makeButton('Audio Editor', 'Open basic audio editing interface for cropping, concatenation, fade in/out.'),
    makeButton('Voice Library', 'Manage all saved character voice configs. Quickly switch and preview.'),
    makeButton('SSML Editor', 'Open visual SSML markup editor. Add pauses, emphasis without handwriting XML.'),
    makeButton('Subtitle Generator', 'Automatically generate SRT subtitle files from audio content. Supports timeline adjustment.'),
  ],
  'paper2gal': [
    makeButton('Dataset Analysis', 'Analyze current dataset tag distribution, image size distribution, color distribution statistics.'),
    makeButton('Tag Editor', 'Batch edit all image tags. Supports find/replace, regex, and autocomplete.'),
    makeButton('Training Monitor', 'Real-time display of GPU utilization, VRAM usage, loss curve, learning rate changes.'),
    makeButton('Model Comparison', 'Select two checkpoints for A/B testing. Generate comparison images with identical prompts.'),
    makeButton('Trigger Word Suggestion', 'Auto-generate recommended trigger word combinations and negative prompts based on training data.'),
    makeButton('Model Quantization', 'Quantize FP32/FP16 models to INT8 or INT4. Reduce VRAM usage and inference time.'),
  ],
  'image-converter': [
    makeButton('Add Folder', 'Select an entire folder to automatically import all supported image files within.'),
    makeButton('Presets', 'Save current conversion parameters as a preset for one-click loading next time.'),
    makeButton('Image Info', 'View detailed metadata of selected images: EXIF, color profile, file size, resolution.'),
    makeButton('Preview Compare', 'Display before/after comparison with zoom for detail differences.'),
    makeButton('Smart Rename', 'Batch rename output files using templates. Supports index, date, original name variables.'),
    makeButton('Cloud Sync', 'Automatically upload conversion results to configured cloud storage (optional feature).'),
  ],
  'settings-guide': [
    makeButton('Import Config', 'Import complete settings from JSON file. Can overwrite all current settings.'),
    makeButton('Export Config', 'Export all settings as JSON file for backup or cross-device sync.'),
    makeButton('Restore Defaults', 'Restore current category settings to defaults. Does not affect other categories.'),
    makeButton('Search Settings', 'Search keywords across all settings to quickly locate needed configuration items.'),
    makeButton('Shortcut List', 'Display all available keyboard shortcuts and their corresponding functions.'),
    makeButton('About', 'Show OC Maker version info, open-source licenses, credits, and changelog.'),
  ],
  'audio-guide': [
    makeButton('Sound Library', 'Browse and manage all built-in sound effects by category. Supports search and favorites.'),
    makeButton('Playlists', 'Create and manage BGM playlists. Supports drag sorting and loop mode settings.'),
    makeButton('Equalizer', 'Open 10-band graphic equalizer. Customize gain values for each frequency band.'),
    makeButton('Recording', 'Use microphone to record audio for voice cloning or adding custom sound effects.'),
    makeButton('Visualizer', 'Enable audio waveform visualization showing spectrum of currently playing audio.'),
    makeButton('Device Detection', 'Detect all available audio input/output devices in the system and show their status.'),
    makeButton('Spatial Audio', 'Enable virtual surround sound simulating 3D spatial sound source positioning (requires headphones).'),
  ],
  'ui-ux-guide': [
    makeButton('Component Library', 'Browse all reusable UI components with usage examples and code snippets.'),
    makeButton('Theme Editor', 'Visually edit custom theme colors, fonts, spacing and other design tokens.'),
    makeButton('Layout Preview', 'Preview page layouts at different screen sizes. Supports custom breakpoints.'),
    makeButton('Animation Preview', 'View live demos of all available animation effects and configuration parameters.'),
    makeButton('Accessibility Check', 'Run automated accessibility tests checking color contrast, focus order, ARIA labels.'),
    makeButton('Design Specs', 'View complete design system documentation including principles, usage guidelines, best practices.'),
  ],
};

for (const [toolId, entries] of Object.entries(newButtons)) {
  if (insertIntoButtonsArray(toolId, entries.join('\n'))) {
    console.log(`Added ${entries.length} buttons to ${toolId}`);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding EN buttons');
