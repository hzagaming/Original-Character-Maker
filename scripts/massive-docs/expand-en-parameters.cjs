const fs = require('fs');

const file = 'src/docsContent/en.ts';
let content = fs.readFileSync(file, 'utf8');

function insertIntoParametersArray(toolId, newEntries) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) { console.error('Tool not found:', toolId); return false; }
  const paramStart = content.indexOf('parameters: [', toolStart);
  if (paramStart === -1) { console.error('Parameters not found for:', toolId); return false; }
  let depth = 1;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let i = paramStart + 'parameters: ['.length; i < content.length; i++) {
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
  console.error('Could not find end of parameters array for:', toolId);
  return false;
}

function makeParam(name, desc, tips) {
  if (tips) {
    return `        { name: '${name}', description: '${desc}', tips: '${tips}' },`;
  }
  return `        { name: '${name}', description: '${desc}' },`;
}

const newParams = {
  'face-maker': [
    makeParam('Eyebrow Angle', 'Adjust eyebrow tilt angle, range -30~30 degrees. Positive for upturned (angry/surprised), negative for droopy (sad/confused).', 'Pair with eye corner angle to reinforce expression emotion.'),
    makeParam('Eye Openness', 'Adjust eye opening size, range 30~100. Low values for squinting or closed eyes, high values for wide eyes.', 'Sleeping: 5-15, Surprised: 90-100.'),
    makeParam('Eyelash Length', 'Adjust eyelash prominence, range 0~100. Higher values for dense, long lashes, more suitable for female characters.', 'Male characters: 20-40, Female characters: 60-90.'),
    makeParam('Pupil Size', 'Adjust pupil proportion within eyes, range 30~70. Large pupils appear more innocent; small pupils appear more mature and sharp.', 'Anime style typically larger (60+), realistic style moderate (45-55).'),
    makeParam('Nose Width', 'Adjust nose wing width, range 30~70. Small values for delicate nose, large values for broad nose.', 'Use with nose height to avoid proportion imbalance.'),
    makeParam('Lip Thickness', 'Adjust lip fullness, range 30~70. Low values for thin lips, high values for thick lips.', 'Thin lips suit cool characters, thick lips suit sexy characters.'),
    makeParam('Ear Size', 'Adjust ear proportion relative to head, range 30~70. Elf ears can be enlarged to emphasize racial traits.', 'Animal ears (cat/rabbit) are not affected by this parameter.'),
    makeParam('Cheek Blush', 'Adjust cheek blush intensity, range 0~100. High values for obvious blush, suitable for shy or fever scenes.', 'Blush color auto-adjusts based on skin tone with warm tint.'),
    makeParam('Expression Intensity', 'Overall amplitude adjustment for all expression-related parameters, range 0~100. Acts as a global expression multiplier.', '0 = expressionless, 100 = most exaggerated expression.'),
    makeParam('Shadow Depth', 'Adjust facial shadow contrast, range 0~100. High values for strong 3D effect, low values for flat appearance.', 'Cel-shaded style: 60-80, painterly style: 30-50.'),
    makeParam('Highlight Intensity', 'Adjust brightness of eye and hair highlights, range 0~100. Highlights make characters more lively.', 'Realistic style: 70-90, minimalist style: 30-50.'),
    makeParam('Outline Width', 'Adjust character outer outline thickness, range 0~100. 0 = no line art, painterly effect.', 'Cel animation: 60-80, watercolor: 10-30.'),
  ],
  'style-transfer': [
    makeParam('Noise Strength', 'Control random noise in generated images, range 0~100. Appropriate noise adds texture quality.', 'Oil/sketch style: 20-40, anime style: 5-15.'),
    makeParam('Edge Preservation', 'Preserve original image edge contours, range 0~100. High values keep more original structure; low values let style fully reshape contours.', 'Portraits: 70-90, landscape/abstract: 30-60.'),
    makeParam('Color Saturation', 'Adjust output image color vividness, range 0~200. 100 = original saturation, >100 enhances, <100 reduces.', 'Cyberpunk: 120-150, ink wash: 40-60.'),
    makeParam('Brightness Offset', 'Overall brightness adjustment, range -50~50. Positive brightens, negative darkens.', 'Oil painting usually slightly darker (-10 to -20), watercolor slightly brighter (+10 to +20).'),
    makeParam('Contrast Enhancement', 'Adjust light/dark contrast, range 0~200. 100 = original, >100 enhances contrast.', 'High contrast styles (cyberpunk, poster): 130-160, soft styles: 80-100.'),
    makeParam('Style Blend Ratio', 'Control blend weights when multiple styles are selected. Only effective when Multi-Style Overlay is enabled.', 'Main style 60-80%, auxiliary style 20-40%.'),
    makeParam('Multi-Style Overlay', 'Enable simultaneous application of 2-3 style models. Control individual weights via Style Blend Ratio.', 'Style compatibility varies; preview before batch processing.'),
    makeParam('Region Mask', 'Upload a black-and-white mask image. White regions apply style transfer; black regions preserve original. Enables localized stylization.', 'Mask dimensions should match input. PNG alpha channel supported as mask.'),
    makeParam('Post Sharpening', 'Sharpening filter strength after style transfer, range 0~100. Compensates for blur caused by stylization.', 'Pixel art: 0, oil painting: 20-40, photo: 50-70.'),
    makeParam('Color Quantization', 'Reduce output color count, range 0~64. Non-zero values produce posterization or retro game effects.', 'Pixel art: 16-32, pop art: 8-16, others: 0.'),
    makeParam('Canvas Texture', 'Overlay paper or canvas texture, range 0~100. Suitable for watercolor, oil painting and other media-requiring styles.', 'Watercolor: 60-80, oil painting: 40-60, digital: 0.'),
  ],
  'prompt-suite': [
    makeParam('Tag Count Limit', 'Maximum tags retained during auto-tagging, range 5~50. More tags = more detailed but potentially noisier.', 'Character training: 20-30, style training: 10-15.'),
    makeParam('Tag Confidence Threshold', 'Minimum confidence for auto-tags, range 0~100. Tags below threshold are filtered out.', 'Recommended 30-50; too high loses useful tags.'),
    makeParam('World Tier Depth', 'Control world editor tier expansion depth, range 1~5. Deep tiers for complex settings; shallow for quick browsing.', 'Beginners: 2-3, experienced: 4-5.'),
    makeParam('Auto-Save Interval', 'Auto-save draft interval in minutes, range 1~30. Set 0 to disable.', 'Recommended 3-5 minutes; too short may cause lag, too long risks progress loss.'),
    makeParam('Export Image Quality', 'Image compression quality for documents with images, range 60~100. High = better quality but larger files.', 'Web sharing: 80-85, printing: 95-100.'),
    makeParam('Collaboration Cursors', 'Show other users\' cursor positions and usernames during multi-user collaboration.', 'Large teams: enable. Personal use: disable to reduce distraction.'),
    makeParam('Diff Highlight Mode', 'Version comparison highlight method: line-level (whole line) or word-level (only differing words).', 'Major changes: line-level, minor tweaks: word-level.'),
    makeParam('Template Strict Mode', 'When enabled, required fields in templates must be filled before export or sharing.', 'Formal projects: enable. Draft phase: disable.'),
    makeParam('Max Relationship Connections', 'Maximum relationship connections per character, range 5~50. Prevents overly complex relationship graphs.', 'Light novel: 10-15, TRPG: 20-30.'),
  ],
  'llm-hub': [
    makeParam('System Prompt Length Limit', 'Max tokens for system prompt, range 100~4000. Prevents overly long prompts from consuming conversation space.', 'Roleplay: 500-1000, complex settings: 1500-2500.'),
    makeParam('Conversation History Rounds', 'Recent conversation rounds to retain, range 1~50. More rounds = more complete context but more tokens.', 'Simple Q&A: 3-5, roleplay: 10-20, deep discussion: 20-30.'),
    makeParam('Retry Count', 'Auto-retry count for failed API requests, range 0~5. Increase for unstable networks.', 'Overseas API from China: 2-3, local models: 0-1.'),
    makeParam('Streaming Delay Threshold', 'Minimum character delay for streaming output in ms, range 0~100. Higher = smoother display; lower = faster response.', 'Reading comfort: 20-40, speed priority: 0-10.'),
    makeParam('Code Block Auto-Collapse', 'Auto-collapse code blocks exceeding N lines, range 5~100. Set 0 to never collapse.', 'Recommended 20-30 lines; long code better collapsed.'),
    makeParam('Auto Conversation Naming', 'Auto-generate conversation titles based on content. Off = "New Conversation" + number.', 'Many conversations: enable for easier searching.'),
    makeParam('Multi-Model Parallel Count', 'Simultaneous model requests in multi-model comparison, range 2~5. Limited by API concurrency.', 'Free API: 2, paid API: 3-4.'),
    makeParam('Voice Input Language', 'Speech recognition target language: auto-detect, Chinese, English, Japanese.', 'Multilingual conversations: auto-detect.'),
    makeParam('Function Call Confirmation', 'Require user confirmation before AI executes external tool calls.', 'Sensitive operations (email, data modification): enable.'),
  ],
  'tts-export': [
    makeParam('Audio Sample Rate', 'Output audio sample rate: 22050Hz, 44100Hz, 48000Hz. Higher = better quality but larger files.', 'Voice dialogue: 22050Hz sufficient, music/post-processing: 44100Hz or 48000Hz.'),
    makeParam('Audio Bit Depth', 'Output audio bit depth: 16-bit, 24-bit. 24-bit has larger dynamic range.', 'General use: 16-bit, professional audio: 24-bit.'),
    makeParam('Voice Pause Interval', 'Auto-inserted pause between sentences in ms, range 100~2000. Affects speech rhythm.', 'Normal dialogue: 300-500ms, reading/speech: 500-800ms.'),
    makeParam('Emotion Intensity', 'Voice emotion tag intensity multiplier, range 0.5~2.0. 1.0 = normal, >1 more exaggerated, <1 more restrained.', 'Animation dubbing: 1.2-1.5, audiobooks: 0.8-1.0.'),
    makeParam('Batch Thread Count', 'Simultaneous processing threads for batch generation, range 1~8. More threads = faster but more resource usage.', '8+ core CPU: 4-6, 4-core: 2-3.'),
    makeParam('Reference Audio Length', 'Reference audio length for voice cloning in seconds, range 3~30. Longer usually = more stable cloning.', 'Bark: 5-10s, other engines: 10-20s.'),
    makeParam('Clone Similarity', 'Similarity weight to original voice during cloning, range 0~100. High = more like original but may retain noise.', 'Clean recordings: 80-90, noisy recordings: 60-70.'),
    makeParam('Subtitle Time Offset', 'Generated subtitle timeline overall offset in ms, range -5000~5000. For precise video alignment.', 'Usually not needed; adjust when audio-video sync issues occur.'),
    makeParam('SSML Validation Level', 'SSML markup validation strictness: loose (allow unknown tags), standard (known tags only), strict (complete syntax required).', 'Beginners: loose, production: standard or strict.'),
  ],
  'paper2gal': [
    makeParam('Training Resolution', 'Target resolution for training images: 512x512, 768x768, 1024x1024. Higher requires more VRAM.', 'SD 1.5: 512 or 768, SDXL: 1024.'),
    makeParam('Batch Size', 'Images processed simultaneously per step, range 1~8. Larger batches train more stably but need more VRAM.', '8GB VRAM: 1-2, 16GB: 2-4, 24GB+: 4-8.'),
    makeParam('Learning Rate', 'Model parameter update step size, range 1e-6~1e-3. Too high = unstable; too low = slow convergence.', 'LoRA: 1e-4~5e-4, full fine-tune: 1e-5~1e-4.'),
    makeParam('LoRA Dimension', 'LoRA low-rank dimension: 4, 8, 16, 32, 64, 128. Higher = more expressive power.', 'Simple concepts: 4-8, characters: 16-32, complex styles: 64-128.'),
    makeParam('Alpha Value', 'LoRA scaling parameter, usually half or equal to dimension. Controls LoRA influence on base model.', 'Generally set to Rank/2 or equal to Rank.'),
    makeParam('Training Steps', 'Total training iterations, range 500~20000. Steps = image count × repeat count × epochs.', '10-20 images: 1000-2000 steps, 50-100 images: 3000-5000 steps.'),
    makeParam('Save Interval', 'Save checkpoint every N steps, range 100~2000. Frequent saves use disk space but preserve more intermediate states.', 'Recommended 500-1000 steps; fewer total steps: 250-500.'),
    makeParam('Regularization Weight', 'Regularization image loss weight, range 0~2.0. Higher prevents overfitting but may weaken learning.', 'Recommended 0.5-1.0; small datasets: 1.0-1.5.'),
    makeParam('Noise Offset', 'Random noise added to images during training, range 0~1.0. Appropriate noise improves generated image contrast.', 'Recommended 0.05-0.1; 0 = disabled.'),
    makeParam('Optimizer', 'Optimizer algorithm: AdamW (general), AdamW8bit (saves VRAM), Lion (fast convergence with large LR), DAdaptation (adaptive LR).', 'Beginners: AdamW, tight VRAM: AdamW8bit.'),
    makeParam('Scheduler', 'Learning rate scheduler: constant, cosine, linear, polynomial.', 'Cosine works best for most scenarios.'),
    makeParam('Mixed Precision', 'Enable FP16/BF16 mixed precision training to reduce 40-50% VRAM usage.', 'RTX 20 series+: FP16, RTX 30/40 series: BF16.'),
  ],
  'image-converter': [
    makeParam('JPEG Quality', 'JPEG output quality, range 60~100. 100 = highest quality; 60 = smallest file but visible compression artifacts.', 'Web display: 75-85, archiving: 90-95, printing: 95-100.'),
    makeParam('PNG Compression Level', 'PNG compression strength, range 0~9. 0 = fastest but largest; 9 = smallest but slowest. No quality loss.', 'General: 6, smallest file: 9, fastest: 1-3.'),
    makeParam('WebP Quality', 'WebP output quality, range 0~100. WebP is typically 25-35% smaller than JPEG at same quality.', 'Web display: 80-85, similar to JPEG quality settings.'),
    makeParam('Output DPI', 'Output image DPI (dots per inch), range 72~600. Affects print size but not pixel count.', 'Screen: 72-96, print: 150-300, high-res print: 300-600.'),
    makeParam('Color Space', 'Output color space: sRGB (general), Adobe RGB (wide gamut print), CMYK (four-color print), P3 (Display P3 screens).', 'Web/screen: sRGB, print: Adobe RGB or CMYK.'),
    makeParam('Interpolation Algorithm', 'Resampling algorithm for scaling: Nearest (pixel art), Bilinear (balanced), Bicubic (smooth), Lanczos (best quality).', 'Photos: Lanczos or Bicubic, pixel art: Nearest.'),
    makeParam('Batch Rename Template', 'Filename template for batch processing. Supports {name}, {index}, {date}, {width}, {height} variables.', 'Example: {name}_converted_{index:03d} produces oc_001, oc_002...'),
    makeParam('Output Directory Structure', 'Directory organization for batch output: flat, mirror (preserve structure), or group by date.', 'Many files: group by date; few files: flat.'),
    makeParam('Metadata Handling', 'How to handle metadata on output: preserve all, strip all, keep copyright only, or keep creation time only.', 'Privacy-sensitive: strip all; photography: keep copyright.'),
  ],
  'settings-guide': [
    makeParam('Animation FPS Cap', 'Max frame rate for UI animations, range 30~120 FPS. Lower saves battery; higher is smoother.', 'Laptop battery: 30-60, plugged in: 60-120.'),
    makeParam('Scroll Inertia', 'List and page scroll inertia strength, range 0~100. 0 = no inertia (immediate stop), 100 = strong inertia.', 'Trackpad users: 70-90, mouse users: 30-50.'),
    makeParam('Tooltip Delay', 'Delay before showing tooltip on hover in ms, range 100~2000.', 'Beginners: 500-800, experienced: 200-400.'),
    makeParam('Notification Duration', 'Toast notification auto-dismiss duration in seconds, range 2~10.', 'General: 3-4s, important: 6-8s.'),
    makeParam('Max Concurrent Requests', 'Maximum simultaneous API requests, range 1~10. Too high may cause rate limiting.', 'OpenAI free tier: 2-3, paid tier: 5-8.'),
    makeParam('Auto-Backup Interval', 'Auto-export settings backup interval in days, range 0~30. 0 = disabled.', 'Recommended 7 days; important projects: 1-3 days.'),
    makeParam('Shortcut Conflict Detection', 'Auto-detect conflicts with browser or system shortcuts when customizing keyboard shortcuts.', 'Recommended: enable to prevent shortcut failures.'),
    makeParam('DevTools Hotkey', 'Custom shortcut to open developer tools. Default: F12.', 'Set to uncommon combination to avoid accidental triggers.'),
  ],
  'audio-guide': [
    makeParam('Master Volume', 'Global volume for all audio, range 0~100.', 'Adjust based on environment: quiet 30-50, noisy 70-100.'),
    makeParam('SFX Volume', 'UI interaction sound volume, range 0~100. Independent of master and BGM volume.', 'Recommended 60-80% of master volume to avoid harsh sounds.'),
    makeParam('BGM Volume', 'Background music volume, range 0~100. Independent of master and SFX volume.', 'Recommended 40-60% of master volume as background.'),
    makeParam('Voice Ducking Strength', 'BGM auto-reduce amount when voice detected in dB, range 0~20. 0 = no ducking.', 'Audiobooks/dubbing: 10-15dB, background music: 5-10dB.'),
    makeParam('SFX Pitch Randomization', 'Add tiny pitch variation to consecutive identical sounds, range 0~100. Adds naturalness.', 'Typing sounds: 20-30, notification sounds: 0-10.'),
    makeParam('Spatial Audio Width', 'Virtual surround sound field width, range 0~100. Higher = stronger source positioning.', 'Music appreciation: 60-80, gaming/movies: 80-100.'),
    makeParam('Recording Sample Rate', 'Microphone recording sample rate: 22050Hz, 44100Hz, 48000Hz.', 'Voice: 44100Hz sufficient, music: 48000Hz.'),
    makeParam('Recording Bit Depth', 'Microphone recording bit depth: 16-bit, 24-bit.', 'General: 16-bit, professional: 24-bit.'),
    makeParam('Audio Buffer Size', 'Audio playback buffer size in samples: 256, 512, 1024, 2048, 4096.', 'Low latency: 256-512, stability priority: 1024-2048.'),
    makeParam('Equalizer Preset', 'Quick-load equalizer presets: flat, bass boost, vocal boost, classical, rock, electronic.', 'Switch based on current content type.'),
  ],
  'ui-ux-guide': [
    makeParam('Theme Hue', 'Custom theme primary hue, range 0~360 degrees. Based on HSL color wheel.', '0 = red, 120 = green, 240 = blue, 300 = purple.'),
    makeParam('Border Radius', 'Global UI element border radius base value, range 0~24px. Affects buttons, cards, inputs.', 'Modern: 8-12px, flat: 0-4px, skeuomorphic: 16-24px.'),
    makeParam('Shadow Intensity', 'Global shadow blur and spread, range 0~100. 0 = no shadow, 100 = maximum shadow.', 'Light mode: 30-50, dark mode: 20-40.'),
    makeParam('Layout Grid Display', 'Show auxiliary 4px/8px grid lines on pages to help designers check alignment.', 'Enable for development/debugging, disable for daily use.'),
    makeParam('Focus Highlight Color', 'Keyboard navigation focus indicator color. Customizable to match theme.', 'Ensure sufficient contrast with theme primary color.'),
    makeParam('Minimum Click Area', 'Minimum touch size for interactive elements in px, range 24~64. WCAG 2.1 requires at least 44x44px.', 'Desktop: 32-40px, mobile: 44-48px.'),
    makeParam('Animation Easing', 'UI animation easing curve: linear, ease, ease-in, ease-out, ease-in-out, spring.', 'General transitions: ease-in-out, popups: spring, loading: linear.'),
    makeParam('Page Transition Duration', 'Page switch animation duration in ms, range 100~1000.', 'Speed priority: 150-200ms, quality: 300-500ms.'),
    makeParam('Skeleton Animation', 'Skeleton screen shimmer animation speed in ms, range 0~2000. 0 = static skeleton.', 'Recommended 1200-1500ms; too fast looks anxious, too slow looks frozen.'),
  ],
};

for (const [toolId, entries] of Object.entries(newParams)) {
  if (insertIntoParametersArray(toolId, entries.join('\n'))) {
    console.log(`Added ${entries.length} parameters to ${toolId}`);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding EN parameters');
