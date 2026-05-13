const fs = require('fs');

const file = 'src/docsContent/en.ts';
let content = fs.readFileSync(file, 'utf8');

function findOverviewEnd(toolId) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) return -1;
  const ovStart = content.indexOf('overview: `', toolStart);
  if (ovStart === -1) return -1;
  const start = ovStart + 'overview: `'.length;
  let escape = false;
  for (let i = start; i < content.length; i++) {
    if (escape) { escape = false; continue; }
    if (content[i] === '\\') { escape = true; continue; }
    if (content[i] === '`') return i;
  }
  return -1;
}

function appendToOverview(toolId, text) {
  const end = findOverviewEnd(toolId);
  if (end === -1) { console.error('Could not find overview for', toolId); return false; }
  content = content.slice(0, end) + '\n\n' + text + content.slice(end);
  console.log('Expanded overview for', toolId);
  return true;
}

function setOverview(toolId, text) {
  const toolStart = content.indexOf(`id: '${toolId}',`);
  if (toolStart === -1) { console.error('Tool not found', toolId); return false; }
  const ovStart = content.indexOf('overview: `', toolStart);
  if (ovStart !== -1) {
    return appendToOverview(toolId, text);
  }
  const titleMatch = content.slice(toolStart).match(/title:\s*'([^']+)',/);
  if (!titleMatch) { console.error('Title not found for', toolId); return false; }
  const titleEnd = toolStart + titleMatch.index + titleMatch[0].length;
  content = content.slice(0, titleEnd) + '\n      overview: `' + text + '`,' + content.slice(titleEnd);
  console.log('Set overview for', toolId);
  return true;
}

const expansions = {
  'paper2gal': `
[Training Pipeline]
The complete LoRA training pipeline consists of the following stages:

1. Data Preparation
   - Image preprocessing: Auto-detect and crop face regions, resize to 512x512 or 768x768
   - Data augmentation: Random horizontal flip, slight rotation, color jitter, Gaussian noise
   - Tag generation: Use WD 1.4 Tagger for automatic tagging
   - Manual verification: Check auto-tag accuracy and fix errors
   - Dataset split: 80% training, 10% validation, 10% test

2. Model Configuration
   - Select base model: SD 1.5, SDXL, SD 3.0, or custom model
   - Set LoRA dimension (Rank): 4/8/16/32/64/128
   - Configure training parameters: learning rate, batch size, steps, save interval
   - Set regularization images to prevent overfitting

3. Training Execution
   - Supports Full Fine-tune and LoRA training
   - Real-time loss curve and learning rate decay display
   - Auto-save checkpoints every N steps
   - Resume from checkpoint support
   - Multi-GPU distributed training (requires accelerate config)

4. Model Validation
   - Evaluate with validation set
   - Generate comparison images: original vs fine-tuned
   - Calculate FID (Fréchet Inception Distance) score
   - Manual quality review

5. Model Deployment
   - Export to standard LoRA format (.safetensors)
   - Generate Model Card with trigger words, recommended parameters, example images
   - One-click upload to Civitai, Hugging Face

[Advanced Training Tips]
- Learning rate schedule: Cosine Annealing for most scenarios; Warmup + Cosine for large datasets
- Regularization: Use 10-20 generic images as regularization set
- Tag strategy: Remove character tags for style training; keep character feature tags for character training
- Resolution: SDXL recommend 1024x1024; SD 1.5 recommend 512x512 or 768x768
- Multi-concept: Use <concept1>, <concept2> instance prompts for multiple characters

[Model Format Notes]
- .safetensors: Safe format, no code execution risk, recommended
- .ckpt: Traditional format, good compatibility but security risk
- Diffusers: Hugging Face directory format for inference deployment`,

  'image-converter': `
[Format Support Matrix]
The Image Converter supports any combination of the following input and output formats:

Input: PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, HEIC/HEIF, ICO, SVG, RAW (CR2, NEF, ARW, DNG)
Output: PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, ICO, PDF, Base64

Special conversion scenarios:
- Alpha channel handling: PNG/WebP to JPEG with background fill or separate alpha file
- Animation handling: GIF/WebP animation to frame sequence or static first frame
- SVG rendering: Vector to bitmap at any resolution with custom DPI
- RAW processing: Camera RAW with white balance and exposure compensation

[Batch Conversion Mode]
- Select up to 50 images simultaneously
- Unified output format and parameter settings
- Preserve original directory structure or flatten output
- Filename template support: {original}_{index:03d}.{ext}
- Processing report after completion (success/fail/warning stats)

[Image Processing Options]
- Resize: Percentage scaling, max edge length, exact dimensions (preserve or stretch)
- Crop: Center crop, smart crop (preserve subject), custom region
- Rotate: 90°/180°/270° or arbitrary angle
- Flip: Horizontal, vertical
- Filters: Grayscale, sepia, invert, blur, sharpen
- Watermark: Text or image watermark with position, opacity, rotation
- Metadata: Preserve, strip, or modify EXIF, IPTC, XMP

[Compression and Optimization]
- Smart compression: Maximize compression with acceptable visual quality loss
- Target file size: Specify maximum output file volume
- Progressive JPEG: For web loading with low-res preview first
- Lossless PNG optimization: Reduce size without quality loss
- WebP lossy/lossless: Auto-select optimal mode based on content`,

  'settings-guide': `
The Settings Panel is OC Maker's global configuration center, managing all user preferences and system parameters. All settings are saved in browser local storage and support import/export for cross-device sync.

[Interface Settings]
- Theme mode: Light, Dark, Auto (follow system)
- Accent color: 12 preset theme colors (sakura pink, sky blue, mint green, violet, etc.)
- Font size: Small (14px), Medium (16px), Large (18px), Extra Large (20px)
- Interface density: Compact, Standard, Relaxed
- Animation effects: On/Off (disable for better performance on low-end devices)
- Language: Simplified Chinese, Traditional Chinese, English, Japanese, Russian, Korean

[Audio Settings]
- Master volume: 0-100% global volume control
- SFX volume: Independent UI interaction sound volume
- BGM volume: Independent background music volume
- SFX toggle: Global enable/disable all sound effects
- BGM toggle: Global enable/disable background music
- Audio device: Select output device (speakers, headphones, Bluetooth)
- Audio format: Web Audio API or HTML5 Audio (compatibility option)

[API Settings]
- Text generation API: Configure OpenAI, Google, Anthropic API Keys
- Image generation API: Configure Stable Diffusion WebUI, ComfyUI backend addresses
- Speech synthesis API: Configure Edge TTS, Bark, Piper engine parameters
- Proxy settings: HTTP/HTTPS/SOCKS5 proxy configuration
- Request timeout: Customize API request timeout
- Concurrency limit: Control simultaneous API requests

[Privacy and Security]
- Data local mode: Completely disable all network requests, pure offline operation
- Auto-clear history: Set retention period for conversation history and operation logs
- Export data: Package download all local storage data
- Import data: Restore all settings and data from backup file
- Reset all settings: One-click restore factory defaults

[Advanced Settings]
- Developer mode: Show additional debug info and tools
- Experimental features: Enable unreleased new features
- Performance monitoring: Display FPS, memory usage, render time
- Cache management: View and clean module cache data
- Keyboard shortcut customization: Modify or disable global shortcuts`,

  'audio-guide': `
[Audio Engine Architecture]
OC Maker's audio system uses a layered architecture:

1. Audio Resource Layer
   - Manages all audio file loading, decoding, and caching
   - Supported formats: MP3, WAV, OGG, AAC, FLAC, WebM
   - Automatic format fallback: Prefer compressed, fallback to compatible
   - Preload strategy: Smart preloading based on usage frequency

2. Audio Control Layer
   - Global volume: Master × category (SFX/BGM/Voice)
   - Audio context management: Auto-handle AudioContext suspended/resumed states
   - Multi-track mixing: Up to 16 simultaneous audio tracks
   - 3D audio positioning: Simple pan control

3. Audio Output Layer
   - Web Audio API: High performance, low latency, preferred
   - HTML5 Audio: Compatibility fallback
   - MediaStream API: For speech synthesis and recording

[Sound Effects System]
Built-in 60+ UI sound effects categorized by scenario:

Interaction Feedback:
- Click: Standard button click
- Hover: Mouse hover hint
- Toggle: Switch state change
- Slider: Slider drag feedback
- Type: Keyboard typing

Operation Results:
- Success: Operation success
- Fail: Operation failure or error
- Warning: Attention needed
- Complete: Long task completion
- Cancel: Operation cancelled

System Notifications:
- Notification: New message or reminder
- Message: Chat message alert
- Connect: Network connection success
- Disconnect: Network connection lost

[Background Music System]
- Playlist management with local audio file support
- Loop modes: single, list, shuffle
- Fade in/out: Smooth transitions between tracks
- Smart volume: Auto-reduce BGM when voice detected (ducking)
- Scene music: Auto-switch BGM based on current page/tool

[Voice Synthesis Integration]
- Seamless integration with TTS export module
- Real-time voice preview (synthesize as you type)
- Voice emotion tags: normal, happy, angry, sad, surprised
- Batch voice queue management`,

  'ui-ux-guide': `
[Design System Overview]
OC Maker uses a complete Design System ensuring visual and interaction consistency. The system includes color, typography, spacing, border radius, shadow, and animation design tokens.

[Color System]
- Primary: Main buttons, links, highlights
- Secondary: Auxiliary actions, tags
- Success: Success states, completion prompts
- Warning: Warning states, attention-needed info
- Error: Error states, failure prompts
- Info: Hint messages, help text
- Neutral: Text, borders, backgrounds, dividers
- Each color provides 12 shades (50-950) with automatic light/dark mode adaptation

[Typography]
- Heading font: System sans-serif stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Body font: Same stack for cross-platform consistency
- Monospace: For code and numeric display (Consolas, Monaco, monospace)
- Size scale: xs (12px) to 4xl (36px), 9 levels
- Line height: Body 1.6, heading 1.3, code 1.5
- Font weight: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

[Spacing System]
- Based on 4px base unit
- 14 levels: 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16 (rem multiples)
- Used for margin, padding, gap, width, height

[Border Radius and Shadows]
- Radius: none, sm (2px), md (6px), lg (8px), xl (12px), 2xl (16px), full (9999px)
- Shadows: 5 levels from subtle inset to strong pop-up
- Borders: 1px solid using neutral 200/300 shades

[Layout System]
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Grid: 12-column with auto-fill and fixed column support
- Container: Max-width limit, centered, side margins
- Sidebar: Collapsible, auto-hide as drawer on mobile

[Animation and Transitions]
- Base transition: 150ms ease-in-out for color, opacity, transform
- Page transition: 300ms fade in/out
- Modal: Scale + fade in with backdrop blur gradient
- List animation: Slide-in for new items
- Skeleton screen: Placeholder animation during loading
- Micro-interactions: Button click scale, hover lift, loading spin

[Accessibility (a11y)]
- Keyboard navigation: All interactive elements support Tab focus and Enter/Space activation
- Focus management: Visible focus indicator (outline), customizable
- ARIA labels: Semantic information for screen readers
- Color contrast: Text/background contrast meets WCAG 2.1 AA (4.5:1)
- Dynamic fonts: Supports system font size settings with auto-scaling
- Reduced motion: Respects prefers-reduced-motion, disables non-essential animations

[Dark Mode]
- CSS variables for one-click switching
- Images auto-dimmed (filter: brightness(0.9))
- Shadows adjusted to glow effects
- Colorful elements saturation reduced 10% for dark backgrounds`,
};

for (const [toolId, text] of Object.entries(expansions)) {
  if (toolId === 'paper2gal') {
    appendToOverview(toolId, text);
  } else {
    setOverview(toolId, text);
  }
}

fs.writeFileSync(file, content);
console.log('Done expanding EN tool overviews part 2');
