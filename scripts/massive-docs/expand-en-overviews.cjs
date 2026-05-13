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
  // Insert overview after title
  const titleMatch = content.slice(toolStart).match(/title:\s*'([^']+)',/);
  if (!titleMatch) { console.error('Title not found for', toolId); return false; }
  const titleEnd = toolStart + titleMatch.index + titleMatch[0].length;
  content = content.slice(0, titleEnd) + '\n      overview: `' + text + '`,' + content.slice(titleEnd);
  console.log('Set overview for', toolId);
  return true;
}

const expansions = {
  'face-maker': `
[Layer System]
The Face Maker uses a multi-layer SVG vector rendering architecture with 12 independent layers: background, back hair, back body, bottom wear, top wear, front body, ears, face shape, eyebrows, eyes, nose, mouth, front hair, and accessories. Each layer renders independently without interfering with others. The layer order is carefully designed so front hair occludes ears and tops occlude the body.

[Asset Library]
The asset library contains over 80 interchangeable parts:
- Hairstyles: 20 types (short, long, twin tails, ponytail, ahoge, curly, straight, wolf cut, hime cut, bob, etc.)
- Eye shapes: 16 types (round, phoenix, droopy, upturned, cat eyes, peach blossom, squint, etc.)
- Eyebrow shapes: 10 types (willow, straight, sword, arched, thick, thin, etc.)
- Nose shapes: 6 types (small, standard, high, flat, upturned, hooked)
- Mouth shapes: 12 types (smile, open, pursed, pout, crooked, laugh, surprised, etc.)
- Face shapes: 8 types (round, oval, heart, square, long, diamond, etc.)
- Ears: 4 types (human, elf, cat, rabbit)
- Accessories: 14 types (round glasses, square glasses, sunglasses, headband, hairpin, bow, hat, mask, earrings, necklace, etc.)
- Poses: 4 types (standing, arms crossed, hand on hip, waving)
- Tops: 5 types (T-shirt, hoodie, suit, sailor uniform, none)
- Bottoms: 4 types (skirt, long pants, shorts, none)

Each part is in vector SVG format for lossless scaling. Colors are controlled uniformly through HSL hue rotation to ensure tonal harmony.

[Advanced Tips]
1. Quick color matching: Set skin tone first, then hair and eye colors for contrast. Use colors 120° apart on the hue wheel.
2. Proportion harmony: Head scale 55 and face length 50 are standard values. Cute styles: head 60+, face 45-. Mature styles: head 50, face 60+.
3. Accessory stacking: Multiple accessories can be worn simultaneously, but keep it under 3 to avoid visual clutter.
4. Pose and outfit pairing: Arms crossed suits formal wear; hand on hip suits energetic styles; waving suits full-body display.
5. Export settings: PNG export supports transparent background. Fixed resolution is 1024x1024 pixels.

[Performance Notes]
- First load preloads all SVG parts, requiring ~2-5MB bandwidth. Use Wi-Fi for first-time setup.
- Low-end devices may experience slight lag during rapid part switching.
- Private/incognito mode may disable localStorage, making "Save Draft" unavailable. Use manual JSON export for backup.

[Version History]
- v0.5.0: Initial version with head customization and basic parts
- v0.6.0: Added body, poses, and clothing system
- v0.6.4: Added full-body preview, 4 poses, 5 tops, 4 bottoms
- v1.0.0: UI overhaul with theme system
- v1.1.0: Added independent accessory color control
- v1.2.0: Added import/export configuration
- v1.3.0: Optimized rendering performance, added error prompts and documentation`,

  'style-transfer': `
[Style Transfer Technology]
The Style Transfer tool is based on Neural Style Transfer (NST) technology, using a pre-trained VGG-19 convolutional neural network to extract feature representations from both content and style images. By minimizing Content Loss and Style Loss, the tool migrates artistic features from the target style to the original image while preserving its structural content.

Content loss measures differences between generated and original images at high-level convolutional features, ensuring pose, expression, and composition remain unchanged. Style loss uses Gram matrices to capture texture, color, and brushstroke characteristics. Total loss: L_total = α * L_content + β * L_style + γ * L_tv, where TV loss smooths the image and reduces noise.

[Supported Models and Styles]
The tool includes 8 pre-trained style models:
1. Anime: Based on AnimeGANv2, ideal for converting photos to anime style
2. Oil Painting: Simulates Van Gogh, Monet impressionist brushstrokes
3. Watercolor: Soft edges and translucent color overlay effects
4. Sketch: Pencil line drawing preserving light/shadow relationships
5. Pixel Art: 8-bit/16-bit retro game style
6. Cyberpunk: High contrast, neon tones, tech aesthetic
7. Ink Wash: Traditional Chinese ink painting effect
8. 3D Render: Simulates Blender/C4D three-dimensional rendering quality

[Parameter Details]
- Style Strength (0~100): Controls stylization degree. Low (20-40) preserves more original detail; high (70-100) strongly stylizes.
- Content Preservation (0~100): Controls original content retention. Inversely related to style strength.
- Iterations (50~500): Computation steps for style transfer. More iterations yield finer results but linearly increase processing time.
- Output Size (256~2048): Final image resolution. Use integer multiples of original size to avoid scaling artifacts.

[Batch Processing Mode]
Supports uploading up to 10 images simultaneously for batch style transfer:
- All images use the same style model and parameters
- Results can be downloaded as a ZIP file
- Each image processes independently; failures don't affect others
- Test with a single image before batch processing

[GPU Acceleration and Performance]
- WebGL acceleration can improve processing speed 5-10x
- 4K image processing requires at least 4GB VRAM; otherwise falls back to CPU
- Real-time progress display with cancel option
- Long processing (>30s) supports background mode allowing tab switching

[Output Formats and Quality]
- PNG: Preserves alpha channel, suitable for secondary editing
- JPEG: Adjustable quality (60-100), smaller file size
- WebP: 25-35% smaller than JPEG at same quality
- Optional metadata preservation (EXIF, ICC color profile)`,

  'prompt-suite': `
[Character Profile System]
The Character Profile is one of OC Maker's core features, allowing creators to record character information in a structured way. Profiles include:

Basic Info Module:
- Character name, aliases, codenames
- Age, birthday, zodiac, blood type
- Height, weight, measurements (optional)
- Race, nationality, native language
- Occupation, identity, social class

Appearance Module:
- Hairstyle, hair color, eye color, skin tone
- Body type, posture, distinguishing features (moles, scars, tattoos)
- Multiple outfit sets (casual, combat, formal)
- Accessories, weapons, props

Personality & Psychology Module:
- MBTI type, Enneagram
- Personality keywords (up to 10 tags)
- Strengths, weaknesses, psychological trauma
- Values, beliefs, motivations
- Fears, likes, dislikes

Background Story Module:
- Family origin, upbringing environment
- Key life events (timeline)
- Relationship network (family, friends, enemies, lovers)
- Affiliated organizations, factions, stance
- Goals and dreams

Ability Settings Module:
- Combat abilities, special skills, magic system
- Ability source, limitations, side effects
- Attribute panel (STR/AGI/INT/CON RPG stats)
- Skill tree, advancement routes

[World Building Editor]
Supports multi-layered structure:
- World: Top level (e.g., "Eorzea", "Cyberpunk 2077")
- Region: Countries, cities, terrain within continents
- Faction: Nations, organizations, gangs, religions
- Race: Humans, elves, orcs, machine life, etc.
- History: Chronicle, timeline, calendar system
- Rules: Physical laws, magic systems, social institutions

[Template System]
Built-in 20+ professional templates:
- Basic Character Card (beginner-friendly)
- Detailed Character Card (all modules)
- Light Novel Card (focus on moe attributes and relationships)
- TRPG Character Card (with stats and skills)
- Game Character Design Doc (art requirements and action descriptions)
- Animation Character Design (expression and color specifications)
- World Setting Book (complete world-building document)

Templates support variable substitution like {{characterName}}, {{age}}, etc.

[Export Formats]
- Markdown: For forums and blogs
- JSON: Structured data for programmatic reading
- PDF: Beautiful layout for printing and sharing
- HTML: Rich text with image embedding
- BBCode: For Discuz!, NGA and similar forums
- Plain text: Most universal format

[Collaboration and Versioning]
- Multi-user collaborative editing (requires cloud sync)
- Automatic version history with point-in-time recovery
- Diff comparison highlighting changes
- Comment and annotation system for team communication`,

  'llm-hub': `
[Supported Models and Providers]
LLM Hub currently supports the following major language models:

OpenAI Series:
- GPT-4o: Latest flagship model, strong multimodal capabilities
- GPT-4o-mini: Lightweight version, fast and cost-effective
- GPT-4-turbo: 128K context for long document processing
- GPT-3.5-turbo: Economical for daily conversations

Google Series:
- Gemini 1.5 Pro: Ultra-long context (2M tokens), video and code analysis
- Gemini 1.5 Flash: Fast response for real-time applications

Anthropic Series:
- Claude 3.5 Sonnet: Strong writing and creativity, gentle personality
- Claude 3 Opus: Deep reasoning for academic and programming tasks

Local Models (via Ollama / LM Studio):
- Llama 3.1 (8B/70B/405B)
- Mistral 7B / Mixtral 8x7B
- Qwen 2.5 (7B/14B/72B)
- DeepSeek V2

[API Configuration Guide]
Each provider requires separate API Key configuration:
1. Click "Add Provider", select the corresponding platform
2. Enter API Key (obtained from the provider's developer dashboard)
3. Optional: Custom Base URL (for proxies or self-hosted services)
4. Optional: Set request timeout (default 30 seconds)
5. Test connection to confirm availability

[Context Management]
- System Prompt: Defines AI role and behavior guidelines
- Conversation History: Automatically maintains recent N turns (configurable)
- Context Window: Shows current token usage / max tokens
- Long Conversation Optimization: Auto-summarizes early conversation when approaching limits

[Streaming Response]
Enabling streaming output displays AI responses word by word:
- Supports pause/resume generation
- Supports mid-generation stop
- Real-time generation speed display (tokens/sec)
- Real-time syntax highlighting for code blocks

[Advanced Features]
- Temperature (0~2): Controls randomness. Low (0.1-0.3) for factual answers; high (0.8-1.2) for creative writing
- Top-p (Nucleus Sampling): 0~1, works with temperature to control diversity
- Max Generation Length: Limits tokens per response
- Frequency Penalty: Reduces repetitive wording
- Presence Penalty: Encourages introducing new topics
- Function Calling: Allows AI to call external tools and APIs

[Usage Examples]
1. Roleplay: Set system prompt as character personality for immersive dialogue
2. World Building: Input existing settings, let AI fill details and check consistency
3. Plot Creation: Provide outline, let AI generate specific chapters
4. Code Assistance: Explain code, generate scripts, debug errors
5. Translation & Polishing: Translate rough settings into fluent target languages`,

  'tts-export': `
[Supported Voice Engines]
TTS Voice Export integrates multiple industry-leading speech synthesis engines:

Edge TTS (Microsoft Azure Speech Services):
- Supports 140+ languages and dialects
- 400+ voice personas (male, female, child, elderly)
- Neural voices approaching human quality
- Voice style adjustment (cheerful, sad, angry, excited)
- Speech rate (-50%~+100%), pitch (-20Hz~+20Hz), volume control

Bark (Open-source Generative TTS):
- Supports multilingual code-switching
- Can generate laughter, sighs, crying and other non-speech sounds
- Voice cloning with 5-10 second reference audio
- Fully local operation, no internet required

Piper (Lightweight Open-source TTS):
- VITS-based architecture with excellent quality
- Compact model size (50-200MB)
- Fast inference (RTF < 0.1)
- Ideal for batch generation and real-time applications

[Character Voice Settings]
Bind exclusive voice configurations for each OC character:
- Select voice persona best matching character personality
- Set default speech rate (energetic characters faster, calm characters slower)
- Set default pitch (high for child/young, low for adult/mature)
- Save multiple emotion variants (normal, happy, angry, sad, surprised)

[Audio Export Formats]
- MP3 (128/192/320 kbps): Universal format compatible with all devices
- WAV (16-bit/44.1kHz or 24-bit/48kHz): Lossless quality for post-processing
- OGG Vorbis: Open format, 20% smaller than MP3 at same quality
- FLAC: Lossless compression for archiving
- WebM: Web-specific format

[Batch Voice Generation]
Supports importing dialogue lists from text files for batch audio generation:
- CSV format support (dialogue, character, emotion, filename)
- Automatic grouping by character using corresponding voice config
- Progress bar display with background operation support
- ZIP download after completion

[Audio Post-processing]
Built-in basic audio editing:
- Fade in/out: Smooth start/end effects
- Volume normalization: Unified loudness (LUFS) across all audio
- Noise reduction: Remove background noise (requires noise sample upload)
- Concatenation: Merge multiple audio clips in sequence
- Format conversion: Batch transcode to different formats

[SSML Advanced Markup]
Supports Speech Synthesis Markup Language for fine control:
- <break time="500ms"/>: Insert pauses
- <emphasis level="strong">text</emphasis>: Emphasis
- <prosody rate="slow" pitch="+5Hz">text</prosody>: Rate and pitch
- <say-as interpret-as="characters">ABC</say-as>: Spell out
- <audio src="..."/>: Insert background music or sound effects`,
};

for (const [toolId, text] of Object.entries(expansions)) {
  appendToOverview(toolId, text);
}

fs.writeFileSync(file, content);
console.log('Done expanding EN tool overviews part 1');
