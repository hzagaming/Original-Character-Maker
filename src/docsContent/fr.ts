import type { DocsContent } from './types';

export const docsContent: DocsContent = {
  intro: `Bienvenue dans le guide utilisateur d\\'Original Character Maker !

Ce guide contient la documentation détaillée des 9 modules fonctionnels ainsi qu\\'un dictionnaire d\\'erreurs global. Si vous rencontrez une erreur lors de l\\'utilisation d\\'un outil ou si vous n\\'êtes pas sûr de la fonction d\\'un bouton/paramètre, ouvrez ce guide pour trouver le chapitre correspondant.

Structure du guide :
· Guide des outils — Chaque outil dispose d\\'un chapitre indépendant avec un aperçu des fonctionnalités, des descriptions de boutons, de paramètres et d\\'erreurs avec solutions
· Dictionnaire d\\'erreurs — Index global des erreurs, organisé par catégories (A~Z, 0~9), permettant une recherche rapide comme dans un dictionnaire

Comment utiliser le dictionnaire d\\'erreurs :
1. Vérifiez d\\'abord le Code affiché sur le panneau d\\'erreur (ex : STYLE_TRANSFER_REQUEST_FAILED)
2. Trouvez la catégorie correspondant à la première lettre (S → Système et flux de travail)
3. Trouvez l\\'entrée par ordre alphabétique dans la catégorie
4. Lisez « Emplacement » pour confirmer la page et la zone où l\\'erreur s\\'est produite
5. Suivez les « Étapes de résolution » pour résoudre le problème étape par étape`,

    tools: [
    {
      id: 'face-maker',
      title: 'Face Maker',
      overview: `Face Maker is a character face generation tool. Enter a prompt, choose a model and image size, and click "Generate" to generate a character face image through AI. Supports prompt editor, random prompt generation, batch generation, and local model selection.

Basic Process:
1. Enter or generate a prompt in the prompt editor
2. Select a generation model and image size
3. Click "Generate" to wait for the AI to generate the image
4. After generation, the image is displayed in the preview area, supporting copy, download, and re-generation


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
      buttons: [
        { name: 'Generate', description: 'Submits the prompt to the backend model to generate an image. After clicking, the button shows "Generating..." and is disabled until completion.' },
        { name: 'Copy Image', description: 'Copies the currently generated image to the clipboard. If the browser does not support the Clipboard API, a prompt will appear.' },
        { name: 'Download Image', description: 'Downloads the currently generated image to the local machine.' },
        { name: 'Open Image', description: 'Opens the image in a new tab to view the original image.' },
        { name: 'Random Prompt', description: 'Automatically generates a random face description prompt and fills it into the prompt editor.' },
        { name: 'Clear Prompt', description: 'Clears all content in the prompt editor.' },
        { name: 'Toggle History', description: 'Expands or collapses the history panel below the prompt editor to view previously generated prompts and images.' },
      
        { name: 'Randomize', description: 'Randomly combine all parts and parameters to quickly generate a new character. All sliders will automatically jump to random values. Click repeatedly for inspiration.' },
        { name: 'Undo', description: 'Undo the last operation, up to 20 steps. Supports Ctrl+Z shortcut.' },
        { name: 'Redo', description: 'Restore undone operations. Supports Ctrl+Y / Ctrl+Shift+Z shortcuts.' },
        { name: 'Zoom Preview', description: 'Expand the central canvas to fullscreen mode for detail inspection. Press Esc or click close to exit.' },
        { name: 'Screenshot', description: 'Copy current canvas content to clipboard for pasting into chat apps or image editors.' },
        { name: 'Share Link', description: 'Generate a URL containing current configuration parameters. Others opening the link will see the exact same character.' },
        { name: 'Dark Mode Toggle', description: 'Toggle canvas background between dark and transparent to check dark area details.' },],
      parameters: [
        { name: 'Model', description: 'Selects the AI image generation model used.', tips: 'Different models have different styles and quality. It is recommended to try multiple models to find the one that best suits your needs.' },
        { name: 'Size', description: 'Sets the resolution (width x height in pixels) of the generated image.', tips: '1024x1024 is the standard square size; larger sizes take longer to generate and consume more API tokens.' },
        { name: 'Prompt Editor', description: 'Enter the image generation prompt here. Supports multi-line input.', tips: 'Detailed prompts generate more precise images; you can use the "Random Prompt" button to get inspiration.' },
      
        { name: 'Eyebrow Angle', description: 'Adjust eyebrow tilt angle, range -30~30 degrees. Positive for upturned (angry/surprised), negative for droopy (sad/confused).', tips: 'Pair with eye corner angle to reinforce expression emotion.' },
        { name: 'Eye Openness', description: 'Adjust eye opening size, range 30~100. Low values for squinting or closed eyes, high values for wide eyes.', tips: 'Sleeping: 5-15, Surprised: 90-100.' },
        { name: 'Eyelash Length', description: 'Adjust eyelash prominence, range 0~100. Higher values for dense, long lashes, more suitable for female characters.', tips: 'Male characters: 20-40, Female characters: 60-90.' },
        { name: 'Pupil Size', description: 'Adjust pupil proportion within eyes, range 30~70. Large pupils appear more innocent; small pupils appear more mature and sharp.', tips: 'Anime style typically larger (60+), realistic style moderate (45-55).' },
        { name: 'Nose Width', description: 'Adjust nose wing width, range 30~70. Small values for delicate nose, large values for broad nose.', tips: 'Use with nose height to avoid proportion imbalance.' },
        { name: 'Lip Thickness', description: 'Adjust lip fullness, range 30~70. Low values for thin lips, high values for thick lips.', tips: 'Thin lips suit cool characters, thick lips suit sexy characters.' },
        { name: 'Ear Size', description: 'Adjust ear proportion relative to head, range 30~70. Elf ears can be enlarged to emphasize racial traits.', tips: 'Animal ears (cat/rabbit) are not affected by this parameter.' },
        { name: 'Cheek Blush', description: 'Adjust cheek blush intensity, range 0~100. High values for obvious blush, suitable for shy or fever scenes.', tips: 'Blush color auto-adjusts based on skin tone with warm tint.' },
        { name: 'Expression Intensity', description: 'Overall amplitude adjustment for all expression-related parameters, range 0~100. Acts as a global expression multiplier.', tips: '0 = expressionless, 100 = most exaggerated expression.' },
        { name: 'Shadow Depth', description: 'Adjust facial shadow contrast, range 0~100. High values for strong 3D effect, low values for flat appearance.', tips: 'Cel-shaded style: 60-80, painterly style: 30-50.' },
        { name: 'Highlight Intensity', description: 'Adjust brightness of eye and hair highlights, range 0~100. Highlights make characters more lively.', tips: 'Realistic style: 70-90, minimalist style: 30-50.' },
        { name: 'Outline Width', description: 'Adjust character outer outline thickness, range 0~100. 0 = no line art, painterly effect.', tips: 'Cel animation: 60-80, watercolor: 10-30.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Face Maker → Area: prompt editor / generate button area',
          cause: 'API Key is not configured.',
          solution: 'Configure the Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter a valid Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Face Maker → Area: prompt editor / generate button area',
          cause: 'Key has expired.',
          solution: 'Replace the Key.',
          steps: [
            'Open "Settings → API"',
            'Replace with a new Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request timed out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Face Maker → Area: prompt editor / generate button area',
          cause: 'Generation took too long.',
          solution: 'Reduce image size or increase timeout.',
          steps: [
            'Reduce image size',
            'Increase timeout setting',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Face Maker → Area: prompt editor / generate button area',
          cause: 'Backend not started or configuration error.',
          solution: 'Check backend status.',
          steps: [
            'Check API Base URL',
            'Confirm backend service is running',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'CONFIG_CORRUPTED',
          message: 'Config corrupted, editor shows blank or garbled text',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: prompt editor / right panel',
          cause: 'The face-maker config in browser localStorage is corrupted, possibly due to manual data editing, version incompatibility, etc.',
          solution: 'Reset the editor or manually clear localStorage.',
          steps: [
            'Click the "Reset" button in the upper right',
            'Confirm in the dialog and refresh',
            'If still abnormal, press Ctrl+Shift+I to open DevTools → Application → Local Storage, delete keys starting with face-maker',
            'Refresh the page',
          ],
          relatedCodes: ['STORAGE_READ_ONLY', 'LOCAL_STORAGE_FULL'],
          prevention: 'Do not manually edit localStorage data; regularly export configs as backups.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Importing config shows "Invalid JSON format"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: bottom left "Import Config" button',
          cause: 'File is corrupted, not in JSON format, or was modified by another program. It is also possible that a non-face-maker config file was selected.',
          solution: 'Check file validity and re-import.',
          steps: [
            'Open the JSON file to import in a text editor',
            'Confirm the file contains "tool": "face-maker"',
            'Confirm the file is valid UTF-8 encoding, with no garbled text',
            'If the file is corrupted, try to restore from historical backup',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: 'Keep exported configuration files safe; do not modify them with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Importing config shows "Tool type mismatch"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: bottom left "Import Config" button',
          cause: 'The tool field in the imported JSON file is not face-maker.',
          solution: 'Import the correct config file.',
          steps: [
            'Confirm the file was exported from the Face Maker page',
            'Find the correct config file and re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Only config files exported from the corresponding tool page contain the correct tool field.',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Save failed, browser storage space insufficient',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: top right "Save" button',
          cause: 'Browser localStorage storage space is full (usually about 5~10MB).',
          solution: 'Clean up browser storage space or export configuration to a local file.',
          steps: [
            'Export current configuration as a JSON file',
            'Open DevTools → Application → Local Storage',
            'Delete unnecessary large data',
            'Save again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; for large files, do not save directly in the editor—use the export function instead.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker → Area: model dropdown',
          cause: 'Model does not exist or Key has no permission.',
          solution: 'Switch models or replace the Key.',
          steps: [
            'Select another model',
            'Or replace the API Key',
            'Retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Save operation has no response, data lost after refresh',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: top right "Save" button',
          cause: 'Browser is in incognito mode, or localStorage is disabled by system policy.',
          solution: 'Exit incognito mode or use a normal window.',
          steps: [
            'Confirm the browser is not in incognito/private mode',
            'Check whether browser storage permissions are disabled',
            'Export configuration as a local file as an alternative',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
        {
          code: 'UNSAVED_WARNING',
          message: 'There are unsaved changes',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Page: Face Maker → Area: upper-left "Back to Home" button',
          cause: 'User modified configuration but has not saved it.',
          solution: 'Save or discard changes.',
          steps: [
            'Click "Save"',
            'Or click "Confirm Return" to discard',
          ],
        },
      ],
    },
    {
      id: 'style-transfer',
      title: 'Style Transfer',
      overview: `Style Transfer generates images in the specified art style based on a source image and a style description prompt. Upload a reference image, enter a style prompt (e.g., "oil painting style, Van Gogh brushstrokes"), select a model and size, and click "Generate" to get a style-transferred image.

Basic Process:
1. Upload a source image
2. Enter a style description prompt
3. Select a model and size
4. Click "Generate"
5. View, copy, or download the generated image


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
      buttons: [
        { name: 'Generate', description: 'Submits the source image and style prompt to the backend to generate a style-transferred image.' },
        { name: 'Copy Image', description: 'Copies the generated image to the clipboard.' },
        { name: 'Download Image', description: 'Downloads the generated image to the local machine.' },
        { name: 'Open Image', description: 'Opens the image in a new tab.' },
        { name: 'Upload Image', description: 'Selects a local image file as the source image. Supports PNG and JPG formats.' },
        { name: 'Replace Image', description: 'Replaces the currently uploaded source image.' },
      
        { name: 'Preview', description: 'Quickly generate a low-resolution preview (256px) before full processing to confirm style selection.' },
        { name: 'Compare View', description: 'Display original and stylized images side by side with a draggable slider for transition viewing.' },
        { name: 'History', description: 'View recent 20 style transfer histories. Reload parameters or delete records.' },
        { name: 'Favorite Style', description: 'Save current style model and parameters to favorites for quick future access.' },
        { name: 'Adjust Canvas', description: 'Crop, rotate, or flip input images before style transfer.' },
        { name: 'Advanced Params', description: 'Expand more professional parameters: content weight, style weight, TV weight, initialization method.' },
        { name: 'GPU Monitor', description: 'Real-time display of GPU memory usage and temperature to judge device load.' },],
      parameters: [
        { name: 'Model', description: 'Selects the AI image generation model used for style transfer.', tips: 'Some models perform better in specific styles; it is recommended to experiment.' },
        { name: 'Size', description: 'Resolution of the generated image.', tips: 'It is recommended to be consistent with or close to the source image size to avoid distortion.' },
        { name: 'Style Prompt', description: 'Describes the desired target style, such as "cyberpunk style, neon lighting".', tips: 'Detailed style descriptions yield better results; you can refer to the prompts in Prompt Suite.' },
        { name: 'Source Image', description: 'The image to be style-transferred.', tips: 'It is recommended to use images with clear subjects and simple backgrounds for better results.' },
      
        { name: 'Noise Strength', description: 'Control random noise in generated images, range 0~100. Appropriate noise adds texture quality.', tips: 'Oil/sketch style: 20-40, anime style: 5-15.' },
        { name: 'Edge Preservation', description: 'Preserve original image edge contours, range 0~100. High values keep more original structure; low values let style fully reshape contours.', tips: 'Portraits: 70-90, landscape/abstract: 30-60.' },
        { name: 'Color Saturation', description: 'Adjust output image color vividness, range 0~200. 100 = original saturation, >100 enhances, <100 reduces.', tips: 'Cyberpunk: 120-150, ink wash: 40-60.' },
        { name: 'Brightness Offset', description: 'Overall brightness adjustment, range -50~50. Positive brightens, negative darkens.', tips: 'Oil painting usually slightly darker (-10 to -20), watercolor slightly brighter (+10 to +20).' },
        { name: 'Contrast Enhancement', description: 'Adjust light/dark contrast, range 0~200. 100 = original, >100 enhances contrast.', tips: 'High contrast styles (cyberpunk, poster): 130-160, soft styles: 80-100.' },
        { name: 'Style Blend Ratio', description: 'Control blend weights when multiple styles are selected. Only effective when Multi-Style Overlay is enabled.', tips: 'Main style 60-80%, auxiliary style 20-40%.' },
        { name: 'Multi-Style Overlay', description: 'Enable simultaneous application of 2-3 style models. Control individual weights via Style Blend Ratio.', tips: 'Style compatibility varies; preview before batch processing.' },
        { name: 'Region Mask', description: 'Upload a black-and-white mask image. White regions apply style transfer; black regions preserve original. Enables localized stylization.', tips: 'Mask dimensions should match input. PNG alpha channel supported as mask.' },
        { name: 'Post Sharpening', description: 'Sharpening filter strength after style transfer, range 0~100. Compensates for blur caused by stylization.', tips: 'Pixel art: 0, oil painting: 20-40, photo: 50-70.' },
        { name: 'Color Quantization', description: 'Reduce output color count, range 0~64. Non-zero values produce posterization or retro game effects.', tips: 'Pixel art: 16-32, pop art: 8-16, others: 0.' },
        { name: 'Canvas Texture', description: 'Overlay paper or canvas texture, range 0~100. Suitable for watercolor, oil painting and other media-requiring styles.', tips: 'Watercolor: 60-80, oil painting: 40-60, digital: 0.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'API Key is not configured.',
          solution: 'Configure the Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter a valid Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'Key has expired.',
          solution: 'Replace the Key.',
          steps: [
            'Open "Settings → API"',
            'Replace with a new Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request timed out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'Generation took too long.',
          solution: 'Reduce image size or increase timeout.',
          steps: [
            'Reduce image size',
            'Increase timeout setting',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'Backend not started or configuration error.',
          solution: 'Check backend status.',
          steps: [
            'Check API Base URL',
            'Confirm backend service is running',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Browser tab crashes or becomes unresponsive',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Style Transfer → Area: entire page',
          cause: 'Device memory is insufficient and the browser forcibly terminated the tab process. Usually occurs when processing ultra-large images (>4096 resolution).',
          solution: 'Close other tabs, reduce image size, or use a device with more memory.',
          steps: [
            'Save current work',
            'Close other browser tabs',
            'Reduce the uploaded image dimensions',
            'Restart the browser and retry',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Close other browser tabs before processing large files; scale the image\'s longest side to below 2048.',
        },
        {
          code: 'FILE_CORRUPTED',
          message: 'Image file is corrupted',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Style Transfer → Area: image upload / preview area',
          cause: 'The selected image file is corrupted or encoded in an unsupported format.',
          solution: 'Replace with a valid image file.',
          steps: [
            'Open the image in a system image viewer to confirm it displays normally',
            'If corrupted, use image repair tools or replace with another image',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Confirm the image can be opened normally in the system\'s built-in image viewer before uploading.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'Upload shows "Unsupported file format"',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Style Transfer → Area: image selection button',
          cause: 'Selected WEBP, GIF, BMP, TIFF, or other unsupported formats. Style Transfer only supports PNG and JPG.',
          solution: 'Convert the image to PNG or JPG format.',
          steps: [
            'Use the Image Format Converter tool (Home → Image Format Converter) to convert the file to PNG or JPG',
            'Or use the system\'s built-in image preview/editor to export as PNG/JPG',
            'Re-select the converted file on the Style Transfer page',
          ],
          relatedCodes: ['UPLOAD_FORMAT'],
          prevention: 'Confirm the file format is PNG or JPG before uploading.',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'Upload preview fails or generation reports error',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Style Transfer → Area: preview area',
          cause: 'Uploaded image dimensions are too large (exceeding 4096x4096 pixels) or the file size exceeds browser/backend limits.',
          solution: 'Compress or resize the image before uploading.',
          steps: [
            'Use the Image Converter tool to scale the image\'s longest side to below 2048 or 4096 pixels',
            'If it is a PNG, convert to JPG to reduce file size',
            'Re-upload the processed image',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Recommended to upload images of 1024×1024 ~ 2048×2048, balancing quality and processing speed.',
        },
        {
          code: 'IMG_PROMPT_TOO_LONG',
          message: 'Image generation prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: left column prompt editor',
          cause: 'The prompt text entered is too long, exceeding the backend model\'s limit.',
          solution: 'Shorten the prompt.',
          steps: [
            'Delete secondary descriptive vocabulary',
            'Retain core style description',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: model dropdown',
          cause: 'Model does not exist or Key has no permission.',
          solution: 'Switch models or replace the Key.',
          steps: [
            'Select another model',
            'Or replace the API Key',
            'Retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Network disconnected, unable to load model list',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Style Transfer → Area: bottom model dropdown',
          cause: 'Device is not connected to the network, Wi-Fi is disconnected, or a firewall is blocking the request.',
          solution: 'Restore network connection.',
          steps: [
            'Check the device\'s network connection status',
            'Try accessing other websites to confirm the network is normal',
            'If using a proxy/VPN, check whether the proxy settings are correct',
            'If on a company/campus network, confirm whether API access is restricted',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Before using online tools, confirm the network connection is normal; avoid performing long workflows in environments with large network fluctuations.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'Content policy violation or sensitive word interception',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'Content in the prompt was intercepted by the safety filter.',
          solution: 'Modify the prompt, remove sensitive vocabulary.',
          steps: [
            'Check the error details for the specific intercepted content',
            'Modify the prompt, replacing or removing sensitive vocabulary',
            'Retry',
          ],
          relatedCodes: ['403_FORBIDDEN', 'P2G_WORKFLOW_ERROR'],
          prevention: 'Avoid using sensitive vocabulary when modifying prompts; test with the default prompt first, then customize after it passes.',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: 'Prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: left column prompt editor',
          cause: 'The prompt text entered is too long, exceeding the backend model\'s limit.',
          solution: 'Shorten the prompt.',
          steps: [
            'Delete secondary descriptive vocabulary',
            'Retain core subject and style description',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'STYLE_TRANSFER_INPUT_MISSING',
          message: 'Style transfer source image not uploaded',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Style Transfer → Area: left column image upload area',
          cause: 'Clicked "Generate" without uploading a source image.',
          solution: 'Upload a source image first.',
          steps: [
            'Click "Upload Image"',
            'Select a local image file',
            'After the preview appears, click "Generate"',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Confirm the source image is uploaded and the preview is displayed before generating.',
        },
        {
          code: 'STYLE_TRANSFER_REQUEST_FAILED',
          message: 'Style transfer request failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: left column prompt area',
          cause: 'Backend returns an error.',
          solution: 'Check error details and retry.',
          steps: [
            'View specific error information',
            'Check API Key and backend status',
            'Modify prompt and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED'],
        },
      ],
    },
    {
      id: 'character-gif',
      title: 'Character GIF Generator',
      overview: `Character GIF Generator creates animated GIFs from static character images. Upload a PNG/JPG character image, adjust animation parameters (frames, FPS, loop, motion type, easing), and generate a dynamic GIF with effects like breathing, blinking, swaying, floating, heartbeat, hair-flow, tail-wag, and magic-glow. Supports automatic cutout, palette preservation, pose lock, face lock, and other advanced features. Requires internet connection and valid API Key.

Basic Process:
1. Upload a source character image
2. Adjust GIF animation parameters (frames, FPS, motion type)
3. Select model and style options
4. Click "Generate GIF"
5. View, copy, or download the animated GIF

[GIF Animation Technology]
Character GIF uses frame interpolation and motion synthesis. The backend generates intermediate frames between key poses based on the selected motion type and easing function. Loop and reverse-loop options control playback behavior.

Content frames are generated through pose interpolation on the timeline: each frame is a slight deformation from the previous one, ensuring smooth and natural animation. Total frames determine animation smoothness; FPS controls playback speed.

[Supported Motion Types]
The tool includes 8 built-in animation effects:
1. Breathing: Subtle chest expansion/contraction, simulating lifelike presence
2. Blinking: Eye open/close cycle, ideal for portrait characters
3. Swaying: Gentle left-right body movement, adding liveliness
4. Floating: Up-down levitation effect, ideal for magical/fantasy characters
5. Heartbeat: Pulsing glow or scale animation, enhancing emotional expression
6. Hair-flow: Hair strands swaying in the wind, adding dynamic detail
7. Tail-wag: Rhythmic tail movement for characters with tails
8. Magic-glow: Pulsing magical aura effect

[Parameter Details]
- Frames (2~60): Total number of frames in the GIF. More frames = smoother animation but larger file size. 8-16 frames is typical for web GIFs.
- FPS (1~60): Frames per second. 12 FPS is standard for web GIFs; 24+ for smoother animation.
- Loop: Whether the GIF loops infinitely. Disable for one-shot animations.
- Duration (10~1000ms): Display time per frame in milliseconds.
- Motion Type: Select the animation style (breathing, blinking, swaying, etc.).
- Easing: Linear, easeIn, easeOut, easeInOut, spring, or bounce.
- Reverse Loop: Play forward then backward, creating a ping-pong loop.
- Style Intensity (0~1): Controls stylization degree.
- Line Art Style: clean, sketchy, thick, thin, or none.
- Color Scheme: vibrant, pastel, muted, monochrome, neon, warm, or cool.
- Background Type: simple, gradient, detailed, transparent, or blurred.
- Lighting Style: dramatic, soft, neon, natural, studio, or backlight.
- Camera Angle: three-quarter, front, profile, low-angle, high-angle, dutch, or over-shoulder.
- Character Mood: calm, happy, serious, shy, confident, surprised, angry, or sad.
- Outfit Detail: school uniform, casual wear, battle outfit, maid outfit, kimono, gothic lolita, sportswear, swimsuit, wedding dress, or idol costume.

[Output Formats and Optimization]
- GIF format, optimized for web use
- Transparent background supported when cutout is enabled
- Typical file size: 500KB ~ 5MB depending on frames and resolution
- Output resolution controlled via Image Size parameter
- Recommended: 512x512 or 1024x1024 for best balance`,
      buttons: [
        { name: 'Upload / Replace Image', description: 'Upload a character image file. Supports PNG and JPG. Recommend a single-character illustration or clear half-body image.' },
        { name: 'Generate GIF', description: 'Starts the GIF generation workflow. Validates input and parameters, then sends the request to the backend.' },
        { name: 'Abort Task', description: 'Cancels the ongoing GIF generation task.' },
        { name: 'Copy JSON', description: 'Copies current parameter config as JSON to clipboard for sharing or backup.' },
        { name: 'Download JSON', description: 'Downloads current parameter config as a JSON file.' },
        { name: 'Copy Result', description: 'After successful generation, copies the GIF to clipboard (if browser supports).' },
        { name: 'Download Result', description: 'Downloads the generated GIF to local machine.' },
        { name: 'Open File', description: 'Opens the generated GIF in a new tab.' },
        { name: 'Redo', description: 'Regenerates the GIF using the same parameters.' },
        { name: 'Show / Hide Details', description: 'Expands or collapses the advanced parameters panel and debug info panel.' },
        { name: 'Refresh', description: 'Resets all parameters to defaults, clears uploaded image and results.' },
        { name: 'Positive Tag Library', description: 'Opens tag picker to quickly insert positive Prompt tags from categorized library.' },
        { name: 'Negative Tag Library', description: 'Opens tag picker to quickly insert negative Prompt tags from categorized library.' },
        { name: 'Advanced Params', description: 'Expands more professional parameters: aspect ratio, lighting, camera angle, mood, outfit, line art style, etc.' },
      ],
      parameters: [
        { name: 'Model', description: 'Selects the AI image generation model. Built-in mode uses Plato backend; custom mode uses your configured external API.', tips: 'gpt-image-2 is the recommended default. Anime Transfer XL v4 performs better for anime styles.' },
        { name: 'Prompt', description: 'Positive prompt describing desired art style, scene, and character features. Supports Positive Tag Library for quick insertion.', tips: 'Advanced parameters are automatically appended as English suffixes. View final effect in Effective Prompt Preview.' },
        { name: 'Negative Prompt', description: 'Describes content you do not want. Supports Negative Tag Library for quick insertion.', tips: 'Common negative tags: low quality, extra fingers, deformed body, blurry, etc.' },
        { name: 'Temperature', description: 'Sampling temperature controlling randomness. Range 0~2, default 0.78.', tips: 'Lower = more stable/predictable; higher = more creative but may deviate. GIF generation recommends 0.6~0.9.' },
        { name: 'Top P', description: 'Nucleus sampling threshold. Range 0~1, default 0.92.', tips: 'Lower reduces diversity, increases consistency.' },
        { name: 'Top K', description: 'Top-K sampling. Range 1~128, default 48.', tips: 'Lower values make generation more conservative.' },
        { name: 'Seed', description: 'Random seed, default 240315. Fixed seed enables reproducible results.', tips: 'Record seeds of favorite results for easy reproduction.' },
        { name: 'Steps', description: 'Denoising steps. Range 8~60. More steps = richer detail but longer time.', tips: 'GIF generation recommends 20~30 steps for quality-speed balance.' },
        { name: 'CFG', description: 'Classifier-Free Guidance scale. Range 1~14, default 6.8.', tips: 'Higher = stronger prompt adherence. 7~10 is the safe zone.' },
        { name: 'Frames', description: 'Total frames in GIF. Range 2~60, default 8.', tips: '8-16 frames is standard for web GIFs. More frames = smoother but larger file and longer generation.' },
        { name: 'FPS', description: 'Frames per second. Range 1~60, default 12.', tips: '12 FPS is web standard; 24+ for smoother animation.' },
        { name: 'Loop', description: 'Whether GIF loops infinitely.', tips: 'Disable for one-shot animations.' },
        { name: 'Frame Duration (ms)', description: 'Display time per frame in milliseconds. Range 10~1000, default 100.', tips: '100ms = 10 FPS. Works with FPS to control playback speed.' },
        { name: 'Motion Type', description: 'Animation style applied to the character.', tips: 'Breathing works best for static poses; blinking adds life to portraits; floating suits magical/fantasy characters.' },
        { name: 'Easing', description: 'How animation accelerates/decelerates.', tips: 'easeInOut is most natural for breathing and swaying; spring suits heartbeat and tail-wag.' },
        { name: 'Reverse Loop', description: 'Forward then backward playback, creating a ping-pong loop.', tips: 'Great for breathing and swaying; saves frames.' },
        { name: 'Need Cutout', description: 'Whether to auto-remove background before generation. Enables transparent GIF.', tips: 'Transparent GIFs are ideal for web overlays and stickers.' },
        { name: 'Keep Palette', description: 'Whether to force preservation of original image color scheme.', tips: 'Enable to ensure consistent character colors across frames.' },
        { name: 'Preserve Pose', description: 'Whether to maintain original character pose and composition.', tips: 'Recommended to prevent pose distortion from animation.' },
        { name: 'Face Lock', description: 'Whether to use facial feature locking for consistent face across frames.', tips: 'Strongly recommended, especially for blinking animations.' },
        { name: 'Detail Boost', description: 'Whether to enhance detail for sharper output GIF.', tips: 'Improves edge clarity but increases generation time.' },
        { name: 'Aspect Ratio', description: 'Output GIF aspect ratio preset (1:1, 2:3, 3:2, 16:9, etc.).', tips: 'Match source image ratio for best results.' },
        { name: 'Image Size', description: 'Output GIF short-edge pixel count.', tips: '512x512 or 1024x1024 is the sweet spot.' },
        { name: 'Style Intensity', description: 'Controls stylization degree. Range 0~1, default 0.75.', tips: '0.5~0.8 is the common range.' },
        { name: 'Line Art Style', description: 'Output GIF line art processing style.', tips: 'clean suits most anime styles; sketchy for hand-drawn feel.' },
        { name: 'Color Scheme', description: 'Forced color theme application.', tips: 'vibrant for vivid characters; pastel for soft styles.' },
        { name: 'Background Type', description: 'Background processing method.', tips: 'transparent with cutout enables transparent GIFs.' },
        { name: 'Lighting Style', description: 'Scene lighting effect.', tips: 'soft for everyday scenes; dramatic for theatrical characters.' },
        { name: 'Camera Angle', description: 'Virtual camera shooting angle.', tips: 'three-quarter is the most common character display angle.' },
        { name: 'Character Mood', description: 'Character emotional state.', tips: 'Mood affects facial expression and posture.' },
        { name: 'Outfit Detail', description: 'Character clothing type.', tips: 'Detailed outfit descriptions yield more precise results.' },
        { name: 'Eye Style', description: 'Character eye processing style.', tips: 'detailed for most anime characters; sparkling for moe characters.' },
        { name: 'Hair Style', description: 'Character hairstyle type.', tips: 'Hairstyle affects overall character impression.' },
        { name: 'Skin Texture', description: 'Character skin processing style.', tips: 'smooth for anime style; realistic for realistic style.' },
      ],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'Clicking "Generate GIF" immediately shows API Key error',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'API Key not configured in Settings → API, or Key was cleared. Character GIF requires valid API Key.',
          solution: 'Configure a valid API Key in Settings.',
          steps: [
            'Click "Open Settings" or use shortcut',
            'Switch to "API" tab',
            'Enter valid Key in "API Key" field',
            'Save and close settings',
            'Return to Character GIF and click "Generate GIF"',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'Before using any online tool, configure a valid API Key in Settings → API.',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401 or Key invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'API Key expired, revoked, or quota exhausted.',
          solution: 'Replace with a valid API Key.',
          steps: [
            'Open Settings → API',
            'Delete current Key, enter new valid Key',
            'Test Key validity in LLM Hub real-time test panel',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: 'Regularly check API Key validity and quota; verify via LLM Hub real-time test.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request times out after long wait',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel / progress bar',
          cause: 'Backend generation too slow. GIF generation takes longer than single images, especially with many frames or large size.',
          solution: 'Reduce frames, image size, or check network.',
          steps: [
            'Reduce Image Size to 1024 or below',
            'Reduce Frames to 8~12',
            'Reduce Steps to 20~28',
            'Check network stability',
            'Retry',
          ],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE'],
          prevention: 'GIF generation takes longer; reduce parameters (image size, frames, Steps) in advance.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable or cannot connect',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend not started, crashed, or API Base URL misconfigured.',
          solution: 'Check backend status and API config.',
          steps: [
            'Open DevTools → Network tab',
            'Click "Generate GIF", observe request and status code',
            'If no request, check Settings → API → API Base URL',
            'If 502/503, contact admin',
            'If local, confirm backend running (npm start)',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Ensure backend running (npm start) for local; confirm URL for remote.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Network disconnected or no internet',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Device offline, Wi-Fi disconnected, or firewall blocking.',
          solution: 'Restore network connection.',
          steps: [
            'Check device network status',
            'Try other websites',
            'Check proxy/VPN settings',
            'Confirm API access on company/campus networks',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Confirm network before using online tools; avoid unstable networks.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'Upload shows "Unsupported file format"',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: upload button',
          cause: 'Selected WEBP, GIF, BMP, TIFF, or other unsupported formats. Only PNG and JPG supported.',
          solution: 'Convert to PNG or JPG.',
          steps: [
            'Use Image Converter (Home → Image Format Converter)',
            'Or use system image viewer to export as PNG/JPG',
            'Re-select converted file',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'UPLOAD_FORMAT'],
          prevention: 'Confirm PNG or JPG format before uploading.',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'Upload fails or memory error during generation',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: preview area',
          cause: 'Image too large (>4096x4096) or file exceeds limits. GIF generation requires more memory.',
          solution: 'Compress or resize image before upload.',
          steps: [
            'Use Image Converter to scale longest side below 2048 or 1024',
            'Convert PNG to JPG to reduce size',
            'Re-upload',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Upload 1024×1024 ~ 2048×2048 images; GIF uses more memory.',
        },
        {
          code: 'FILE_CORRUPTED',
          message: 'Preview shows blank or corrupted',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: preview area',
          cause: 'Image file corrupted or incomplete download.',
          solution: 'Use another image or repair/re-download.',
          steps: [
            'Open in system image viewer to confirm',
            'Repair or re-download if needed',
            'Use another valid PNG/JPG',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'UPLOAD_FORMAT'],
          prevention: 'Confirm image opens normally before uploading.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Error shows "Model unavailable" or 404',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Model does not exist, removed, or Key lacks permission.',
          solution: 'Switch to another available model.',
          steps: [
            'Select another model (e.g., gpt-image-2)',
            'Confirm model ID spelling for custom API',
            'Verify Key supports selected model in Settings → API',
            'Retry',
          ],
          relatedCodes: ['403_FORBIDDEN', 'API_KEY_EXPIRED'],
          prevention: 'Select known available models; check provider docs for custom API.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'Content policy violation or sensitive word interception',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Prompt or Negative Prompt contains words intercepted by safety filter.',
          solution: 'Modify prompt, remove sensitive vocabulary.',
          steps: [
            'Check error details for intercepted keywords',
            'Replace or remove sensitive words',
            'Simplify prompt, test with basic description first',
            'Add modifiers gradually to find trigger words',
          ],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: 'Avoid sensitive words; test default prompt first before customizing.',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: 'Prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: prompt editor / error panel',
          cause: 'Prompt + advanced parameter suffixes exceed backend model input limit.',
          solution: 'Shorten prompt or reduce advanced parameters.',
          steps: [
            'View full prompt length in Effective Prompt Preview',
            'Trim positive prompt, remove redundancy',
            'Reduce number of advanced parameters',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'CHARACTER_GIF_INPUT_MISSING',
          message: 'Clicking "Generate GIF" shows no image uploaded',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'No image uploaded, or invalid input file when clicking Generate.',
          solution: 'Upload a valid image file.',
          steps: [
            'Click "Upload Image"',
            'Select valid PNG/JPG file',
            'Confirm preview shows thumbnail',
            'Click "Generate GIF"',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
          prevention: 'Confirm source image uploaded and preview normal before generating.',
        },
        {
          code: 'CHARACTER_GIF_REQUEST_FAILED',
          message: 'Error panel shows "CHARACTER_GIF_REQUEST_FAILED"',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend API request failed. Possible: network interruption, invalid Key, model unavailable, too many frames causing memory error, or server error.',
          solution: 'Troubleshoot based on error details.',
          steps: [
            'Expand error panel for details (HTTP code, backend message)',
            '401: Check API Key validity',
            '404: Check model availability',
            '429: Wait and retry, reduce frequency',
            '500/502/503: Check backend status',
            'Memory error: Reduce frames (below 8) and image size',
            'Network error: Check connection',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', '429_TOO_MANY_REQUESTS'],
          prevention: 'Confirm API Key valid, network normal, model available before generating; test with low frames (8) first.',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Too many requests in short time. GIF generation uses more resources, more likely to trigger rate limits.',
          solution: 'Wait and retry.',
          steps: [
            'Check Retry-After hint in error details',
            'Wait 60~120 seconds',
            'Reduce frames and image size if frequent',
            'Consider upgrading API plan',
          ],
          relatedCodes: ['API_RATE_LIMIT', 'CHARACTER_GIF_REQUEST_FAILED'],
          prevention: 'GIF uses more resources; reduce request frequency; avoid rapid retries.',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'Backend returns 500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend internal exception. Possible: model load failure, GPU OOM (GIF uses more VRAM), or code bug.',
          solution: 'Retry later or contact admin.',
          steps: [
            'Wait 1~2 minutes',
            'Reduce image size, frames, and Steps',
            'Contact admin if persistent',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Reduce request scale (image size, frames, Steps); avoid high-load periods.',
        },
        {
          code: '502_BAD_GATEWAY',
          message: 'Backend returns 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Reverse proxy cannot connect to backend. Backend may have crashed.',
          solution: 'Check backend status.',
          steps: [
            'Confirm backend running for local deploy',
            'Check port conflicts',
            'Review backend logs',
            'Restart backend',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'Ensure backend running locally; check reverse proxy config.',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: 'Backend returns 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Character GIF → Area: error panel',
          cause: 'Backend temporarily unavailable. May be under maintenance, restart, or overload protection.',
          solution: 'Retry later.',
          steps: [
            'Wait 2~3 minutes',
            'Check status page if available',
            'Contact admin for maintenance info',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'Avoid maintenance windows; reduce request frequency during high load.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Import shows "Invalid JSON format"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Character GIF → Area: import config button',
          cause: 'File corrupted, not JSON, or modified by other programs.',
          solution: 'Verify valid UTF-8 text file.',
          steps: [
            'Open in text editor, check for garbled text',
            'Confirm file contains "tool": "character-gif"',
            'Validate with online JSON formatter',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Import shows "Tool type mismatch"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Character GIF → Area: import config button',
          cause: 'Imported JSON tool field is not character-gif.',
          solution: 'Confirm importing Character GIF config file.',
          steps: [
            'Open in text editor',
            'Confirm tool field is "character-gif"',
            'Find correct config or import from corresponding tool page',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Browser tab crashes or becomes unresponsive',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Character GIF → Area: entire page',
          cause: 'Device memory insufficient. GIF generation requires more memory, especially with many frames.',
          solution: 'Close other tabs, reduce image size/frames, or use device with more memory.',
          steps: [
            'Save current work',
            'Close other browser tabs',
            'Reduce image longest side to 1024 or below',
            'Reduce frames to 8 or below',
            'Restart browser and retry',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Close tabs before large tasks; scale image to 1024; use 8 or fewer frames.',
        },
      ],
    },
    {
      id: 'index-tts',
      title: 'IndexTTS Voice Synthesis',
      overview: `IndexTTS Voice Synthesis generates speech from text using zero-shot voice cloning. Upload a reference audio clip (3~10 seconds) to clone a voice, or use the default voice. The tool supports emotion control, speed adjustment, and multiple output formats.

【User Guide】

Step 1: Prepare the Text
Enter the text to synthesize in the text input box. Supports Chinese, English, and other languages. Recommendations:
- Keep single-segment text within 500 characters; overly long text may degrade generation quality
- Use standard punctuation (commas, periods, question marks) to control pauses and intonation
- Avoid rare Chinese characters; the model may not accurately pronounce some uncommon hanzi

Step 2: Choose Reference Audio (Optional)
Click the "Upload Reference Audio" button and select a 3~10 second audio file. Recommendations:
- Format: WAV or MP3, sample rate 22050Hz or higher
- Content: Clear single-speaker voice with minimal background noise
- Length: 5~7 seconds is optimal; too short may yield poor cloning, too long increases processing time
- Quality: Better audio quality produces closer voice cloning results
- If no reference audio is uploaded, the default voice will be used

Step 3: Adjust Parameters
Adjust TTS parameters according to your needs:

Basic Parameters:
- Model: Select the TTS model version. index-tts-1.5 is the stable version suitable for most scenarios; index-tts-2 has advanced emotion control for rich emotional expression.
- Temperature (0~1, default 0.8): Controls generation randomness. Lower values (0.5~0.7) suit formal, stable speech; higher values (0.8~1.0) suit more natural, varied speech.
- Top P (0~1, default 0.92): Nucleus sampling threshold. Usually keep the default; lower to 0.85 for more stable output.
- Top K (1~128, default 48): Top-k sampling. Usually no need to adjust.

Voice Parameters:
- Speed (0.5~2.0, default 1.0): Playback speed. 0.8 suits gentle slow speech; 1.2~1.5 suits fast broadcasting; 2.0 is maximum speed.
- CFG (1~14, default 6.8): Classifier-Free Guidance scale. 7~10 is the safe zone; too high may cause voice distortion.

Emotion Parameters:
- Emotion Alpha (0~2.0, default 1.0): Emotion expression intensity. 0.5 suits plain narration; 1.0 is balanced; 1.5~2.0 suits dramatic expression.
- Emotion Text: Use natural language to describe the desired emotional style. Examples: "gentle whisper", "angry shouting", "happy and excited speaking", "sad crying". Supports Chinese and English.

Advanced Parameters:
- Seed (default 240315): Fixed seed enables reproducible results. Record seeds of favorite outputs for later reproduction.
- Device: GPU acceleration is fast but requires NVIDIA GPU support; CPU works on any device but is slower.
- Format: WAV is lossless quality, suitable for post-editing; MP3 is smaller, suitable for direct sharing.
- Sample Rate: 48000Hz is CD quality; 44100Hz is standard; 22050Hz is acceptable for speech.
- Noise Reduction (0~100, default 20): Post-process noise reduction. Increase if reference audio has background noise; decrease if voice sounds unnatural.

Step 4: Generate Speech
Click the "Generate Speech" button. Generation time depends on text length and device performance:
- GPU: ~5~15 seconds for 10 seconds of text
- CPU: ~30~60 seconds for 10 seconds of text
You can click "Abort Task" at any time during generation to cancel.

Step 5: Process Results
After generation completes, the result area displays an audio player. You can:
- Click the play button to preview
- Click "Download Result" to save locally
- Click "Copy Result" to copy to clipboard (browser support varies)
- Click "Open File" to open in a new tab
- Click "Redo" to regenerate with the same parameters
- Click "Copy JSON" to copy current configuration
- Click "Download JSON" to save the config file for later reuse

【TTS Technology】
IndexTTS is a GPT-style text-to-speech model based on XTTS and Tortoise. It supports Chinese pinyin correction and pause control via punctuation marks. The model uses a conformer conditioning encoder and BigVGAN2-based speechcode decoder for high-quality audio output.

【Parameter Quick Reference】
| Parameter | Range | Default | Description |
|---|---|---|---|
| Temperature | 0~1 | 0.8 | Randomness control |
| Top P | 0~1 | 0.92 | Nucleus sampling |
| Top K | 1~128 | 48 | Top-k sampling |
| Speed | 0.5~2.0 | 1.0 | Playback speed |
| CFG | 1~14 | 6.8 | Guidance strength |
| Emotion Alpha | 0~2.0 | 1.0 | Emotion intensity |
| Seed | Integer | 240315 | Random seed |
| Noise Reduction | 0~100 | 20 | Noise reduction strength |

【Output Formats】
- WAV: Uncompressed, highest quality, suitable for post-editing
- MP3: Lossy compression, smaller file, suitable for direct sharing
- Typical file size: 100KB ~ 5MB (depends on duration and format)
- Recommended sample rate: 48000 Hz for best quality

【FAQ】
Q: Why does the cloned voice differ from the original?
A: Reference audio quality directly affects cloning results. Ensure the audio is clear, noise-free, and contains only one speaker. Adjusting Temperature and CFG can optimize similarity.

Q: Generation is very slow. What should I do?
A: Switch to GPU inference mode. If no NVIDIA GPU is available, try shortening the text length or lowering the sample rate.

Q: The generated speech has noise.
A: Increase the "Noise Reduction" parameter (suggested 30~50), or use a cleaner reference audio.

Q: Emotion description doesn't take effect.
A: Ensure you are using the index-tts-2 model and appropriately increase the "Emotion Alpha" parameter. Some emotion descriptions may need more specific phrasing.

Q: How can I reproduce a previous result?
A: Record the Seed value used during generation, then use the same Seed and parameters in subsequent generations.

Q: Which languages are supported for text input?
A: Primarily Chinese and English; other languages may vary in quality depending on model training data.`,
      buttons: [
        { name: 'Generate Speech', description: 'Starts the TTS generation workflow. Validates input text and parameters, then sends the request to the backend.' },
        { name: 'Abort Task', description: 'Cancels the ongoing TTS generation task.' },
        { name: 'Copy JSON', description: 'Copies current parameter config as JSON to clipboard.' },
        { name: 'Download JSON', description: 'Downloads current parameter config as a JSON file.' },
        { name: 'Copy Result', description: 'After successful generation, copies the audio to clipboard (if browser supports).' },
        { name: 'Download Result', description: 'Downloads the generated audio to local machine.' },
        { name: 'Open File', description: 'Opens the generated audio in a new tab.' },
        { name: 'Redo', description: 'Regenerates the speech using the same parameters.' },
        { name: 'Show / Hide Details', description: 'Expands or collapses the parameters panel and debug info panel.' },
        { name: 'Refresh', description: 'Resets all parameters to defaults, clears text and results.' },
      ],
      parameters: [
        { name: 'Model', description: 'Selects the TTS model version.', tips: 'index-tts-1.5 is the stable version; index-tts-2 has advanced emotion control.' },
        { name: 'Temperature', description: 'Sampling temperature controlling randomness. Range 0~1, default 0.8.', tips: 'Lower = more stable/predictable; higher = more creative but may deviate.' },
        { name: 'Top P', description: 'Nucleus sampling threshold. Range 0~1, default 0.92.', tips: 'Lower reduces diversity, increases consistency.' },
        { name: 'Top K', description: 'Top-K sampling. Range 1~128, default 48.', tips: 'Lower values make generation more conservative.' },
        { name: 'Speed', description: 'Playback speed multiplier. Range 0.5~2.0, default 1.0.', tips: '1.0 is normal speed; 0.5 is half speed; 2.0 is double speed.' },
        { name: 'CFG', description: 'Classifier-Free Guidance scale. Range 1~14, default 6.8.', tips: 'Higher = stronger prompt adherence. 7~10 is the safe zone.' },
        { name: 'Emotion Alpha', description: 'Emotion intensity. Range 0.0~2.0, default 1.0.', tips: '0.0 = neutral; 1.0 = balanced; 2.0 = very expressive.' },
        { name: 'Emotion Text', description: 'Soft emotion instruction using natural language.', tips: 'Examples: "angry man shouting", "gentle whisper", "happy and excited".' },
        { name: 'Seed', description: 'Random seed, default 240315. Fixed seed enables reproducible results.', tips: 'Record seeds of favorite results for easy reproduction.' },
        { name: 'Device', description: 'Inference device: GPU (fast) or CPU (fallback).', tips: 'GPU is recommended for faster generation; CPU works on any machine.' },
        { name: 'Format', description: 'Output audio format: WAV or MP3.', tips: 'WAV has best quality; MP3 is smaller and more portable.' },
        { name: 'Sample Rate', description: 'Output sample rate in Hz.', tips: '48000 Hz is CD quality; 44100 Hz is standard; 22050 Hz is acceptable for speech.' },
        { name: 'Noise Reduction', description: 'Post-process noise reduction strength. Range 0~100, default 20.', tips: 'Higher values remove more background noise but may affect voice quality.' },
      ],
            errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'Immediate error after clicking Generate Speech, error panel shows API Key related error',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'No API Key configured in Settings → API, or the Key was cleared. IndexTTS generation requires a valid API Key to call the backend speech synthesis service.',
          solution: 'Configure a valid API Key in the settings panel.',
          steps: ['Click Open Settings in the top right or use the shortcut', 'Switch to the API tab', 'Enter your valid Key in the API Key input', 'Click Save and close the settings panel', 'Return to IndexTTS page and click Generate Speech again'],
          relatedCodes: ['API_KEY_EXPIRED', 'INDEX_TTS_NOT_CONFIGURED'],
          prevention: 'Always configure a valid API Key in Settings → API before using any networked tool for the first time.',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Generation request returns 401 or indicates Key is invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'The configured API Key has expired, been revoked, or run out of quota.',
          solution: 'Replace with a valid API Key.',
          steps: ['Open Settings → API panel', 'Delete the current Key and enter a new valid Key', 'If unsure whether the Key is valid, test it first in the LLM Hub real-time test panel', 'Save and return to IndexTTS to retry'],
          relatedCodes: ['API_KEY_MISSING', '401_UNAUTHORIZED'],
          prevention: 'Regularly check API Key validity and remaining quota; use LLM Hub real-time testing to quickly verify Key validity.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request takes too long and eventually times out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel / progress bar',
          cause: 'Backend generation took too long, exceeding the frontend timeout. TTS generation has high GPU requirements; long text or high sample rates take more time.',
          solution: 'Shorten text length, lower sample rate, or check network connection.',
          steps: ['Shorten input text (suggest within 200 characters)', 'Lower sample rate (e.g., from 48000Hz to 22050Hz)', 'Check if network connection is stable', 'If using CPU inference, consider switching to GPU mode', 'Retry generation'],
          relatedCodes: ['NETWORK_TIMEOUT', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: 'Long text takes longer to generate; shorten text in advance; increase timeout settings when network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Prompt says Backend Unavailable or Cannot connect to server',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Backend server is not started, crashed, or the API Base URL configured in frontend is incorrect.',
          solution: 'Check backend service status and API configuration.',
          steps: ['Open browser dev tools → Network tab', 'Click Generate Speech again, observe if request is sent and the response status code', 'If request is not sent, check Settings → API → API Base URL is correct', 'If request returns 502/503, contact backend admin to confirm service status', 'If local deployment, confirm backend process is running (npm start)'],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'For local deployment ensure backend process is started (npm start); for remote services confirm URL configuration is correct.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Prompt says network disconnected or cannot access internet',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Device is not connected to network, Wi-Fi disconnected, or firewall is blocking requests.',
          solution: 'Restore network connection.',
          steps: ['Check device network connection status', 'Try accessing other websites to confirm network is normal', 'If using proxy/VPN, check proxy settings are correct', 'If on company/campus network, confirm API access is not restricted'],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Confirm network connection is normal before using networked tools; avoid operating in environments with high network fluctuation.',
        },
        {
          code: 'AUDIO_FORMAT_UNSUPPORTED',
          message: 'Upload prompt says Unsupported audio format',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: IndexTTS Voice Synthesis → Area: Reference audio upload zone',
          cause: 'Selected FLAC, OGG, AAC, WMA, or other unsupported format. IndexTTS only supports WAV and MP3 reference audio.',
          solution: 'Convert audio to WAV or MP3 format.',
          steps: ['Use an audio conversion tool to convert file to WAV or MP3', 'Or use system built-in audio editing tool to export as WAV/MP3', 'Ensure sample rate is 22050Hz or above', 'Re-upload the converted file on the IndexTTS page'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_TOO_LONG'],
          prevention: 'Confirm file format is WAV or MP3 before uploading.',
        },
        {
          code: 'AUDIO_TOO_SHORT',
          message: 'Prompt says Reference audio too short',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: IndexTTS Voice Synthesis → Area: Reference audio upload zone',
          cause: 'Reference audio duration is less than 3 seconds. Zero-shot voice cloning requires at least 3 seconds of audio to extract valid voice characteristics.',
          solution: 'Upload a longer reference audio.',
          steps: ['Record or clip a 5~10 second audio segment', 'Ensure the audio contains only one speaker', 'Re-upload the audio file'],
          relatedCodes: ['AUDIO_TOO_LONG', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: 'Prepare 5~10 seconds of reference audio; ensure content is clear and complete.',
        },
        {
          code: 'AUDIO_TOO_LONG',
          message: 'Prompt says Reference audio too long or processing timed out',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: IndexTTS Voice Synthesis → Area: Reference audio upload zone',
          cause: 'Reference audio duration exceeds 10 seconds. Overly long reference audio increases processing time and backend load, with diminishing returns on cloning quality.',
          solution: 'Clip audio to 3~10 seconds.',
          steps: ['Use audio editing tool to clip the middle 5~7 seconds of the audio', 'Ensure the clipped portion contains clear speech', 'Save as WAV or MP3 and re-upload'],
          relatedCodes: ['AUDIO_TOO_SHORT', 'AUDIO_FORMAT_UNSUPPORTED'],
          prevention: 'Prepare 5~10 seconds of reference audio; overly long audio has limited improvement on cloning quality but increases processing time.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Error panel shows Model unavailable or 404',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Selected model does not exist on backend, has been removed, or current API Key has no access to this model.',
          solution: 'Switch to another available model.',
          steps: ['Select another model from the Model dropdown (e.g., index-tts-1.5)', 'Confirm model name spelling is correct', 'In Settings → API confirm current Key supports the selected model', 'Retry generation'],
          relatedCodes: ['INDEX_TTS_NOT_CONFIGURED', 'API_KEY_EXPIRED'],
          prevention: 'Select known available models from the dropdown list; consult service provider documentation for model list when using custom API.',
        },
        {
          code: 'INDEX_TTS_TEXT_MISSING',
          message: 'Immediate error after clicking Generate Speech, prompt says no text entered',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Text input box is empty. IndexTTS requires valid text input to generate speech.',
          solution: 'Enter content to synthesize in the text input box.',
          steps: ['Click the text input area', 'Type or paste the text to synthesize', 'Confirm text is not empty', 'Click Generate Speech'],
          relatedCodes: ['INDEX_TTS_TEXT_TOO_LONG', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: 'Always confirm text input contains valid content before generating.',
        },
        {
          code: 'INDEX_TTS_TEXT_TOO_LONG',
          message: 'Prompt says Text too long or generation timed out',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: IndexTTS Voice Synthesis → Area: Text input box / Left panel bottom error panel',
          cause: 'Input text is too long (over 500 characters), exceeding the backend model maximum processing limit.',
          solution: 'Shorten the input text.',
          steps: ['Split long text into multiple segments, each under 200 characters', 'Remove redundant descriptions and duplicate content', 'Generate segment by segment and merge with audio editing tool', 'Retry'],
          relatedCodes: ['INDEX_TTS_TEXT_MISSING', 'API_TIMEOUT'],
          prevention: 'Keep single-segment text within 500 characters; long content should be generated in segments.',
        },
        {
          code: 'INDEX_TTS_TEXT_BLOCKED',
          message: 'Request blocked, prompt says Content policy violation or sensitive words',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Input text contains words blocked by the backend service provider safety filter.',
          solution: 'Modify text, remove or replace words that may trigger the filter.',
          steps: ['Check error details for specific hints to identify blocked keywords', 'Replace sensitive words with synonyms or delete them', 'First test with simple text to confirm service is normal', 'Gradually add content to identify the specific trigger word'],
          relatedCodes: ['403_FORBIDDEN'],
          prevention: 'Avoid using sensitive words in text; test with default text first before customizing.',
        },
        {
          code: 'INDEX_TTS_REQUEST_FAILED',
          message: 'Error panel shows INDEX_TTS_REQUEST_FAILED',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Backend API request failed. Could be network interruption, invalid API Key, model unavailable, GPU out of memory, text too long, or server internal error.',
          solution: 'Troubleshoot based on specific information in error details.',
          steps: ['Expand error panel to view detailed error info (HTTP status code, backend message)', 'If 401: check if API Key is valid', 'If 404: check if model is available', 'If 429: wait and retry after some time', 'If 500/502/503: check backend service status', 'If GPU error: lower text length or sample rate', 'If network error: check network connection'],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'BACKEND_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: 'Before generating confirm API Key is valid, network is connected, and model is available; first generation should use short text for testing.',
        },
        {
          code: 'INDEX_TTS_NOT_CONFIGURED',
          message: 'IndexTTS backend not configured',
          severity: 'error',
          category: 'E. Config & Data',
          location: 'Server → /api/index-tts',
          cause: 'Backend has no IndexTTS provider configured. The backend route returned an explicit not-configured error.',
          solution: 'Configure an IndexTTS provider in the backend.',
          steps: ['Check if backend .env file contains IndexTTS related configuration', 'Configure IndexTTS API key (e.g., SiliconFlow)', 'Add provider configuration to backend .env', 'Restart backend server', 'Return to frontend and retry'],
          relatedCodes: ['INDEX_TTS_REQUEST_FAILED', 'BACKEND_UNAVAILABLE'],
          prevention: 'Configure IndexTTS provider when deploying backend; confirm backend is correctly configured before use.',
        },
        {
          code: 'INDEX_TTS_GPU_OUT_OF_MEMORY',
          message: 'Backend returns GPU out of memory error',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Server → GPU inference process',
          cause: 'GPU VRAM is insufficient to load the model or process the current request. Long text, high sample rates, and large models consume more VRAM.',
          solution: 'Shorten text, lower sample rate, switch to CPU mode, or upgrade GPU.',
          steps: ['Shorten input text length', 'Lower sample rate (e.g., 48000Hz → 22050Hz)', 'Switch to CPU inference mode', 'Close other programs consuming VRAM', 'If problem persists, contact backend admin to upgrade GPU VRAM'],
          relatedCodes: ['500_INTERNAL_ERROR', 'API_TIMEOUT'],
          prevention: 'Long text and high sample rates consume more VRAM; keep text within 200 characters and use 22050Hz sample rate.',
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'Prompt says Too many requests (Rate Limit)',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Too many requests sent in a short time, exceeding the service provider rate limit.',
          solution: 'Wait and retry after some time.',
          steps: ['Check error details for Retry-After hint if available', 'Wait 60~120 seconds and retry', 'If frequently encountered, shorten text length', 'Consider upgrading API plan for higher rate limits'],
          relatedCodes: ['API_RATE_LIMIT', 'INDEX_TTS_REQUEST_FAILED'],
          prevention: 'Lower request frequency appropriately; avoid multiple retries in short time.',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'Backend returns 500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Backend service encountered an internal exception while processing the request. Could be model loading failure, GPU memory shortage, or code bug.',
          solution: 'Retry later or contact backend administrator.',
          steps: ['Wait 1~2 minutes and retry', 'Shorten text length, lower sample rate to reduce backend load', 'Switch to CPU inference mode', 'If problem persists, contact backend admin to check server logs'],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE', 'INDEX_TTS_GPU_OUT_OF_MEMORY'],
          prevention: 'Reduce request scale (text length, sample rate, etc.); avoid submitting large tasks during high server load.',
        },
        {
          code: '502_BAD_GATEWAY',
          message: 'Backend returns 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Reverse proxy (e.g., Nginx) cannot connect to backend application server. Backend process may have crashed or not started.',
          solution: 'Check backend service status.',
          steps: ['If local deployment, confirm backend process is running', 'Check if backend service port is occupied', 'Check backend logs for startup errors', 'Restart backend service and retry'],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'For local deployment confirm backend process is running; check reverse proxy configuration.',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: 'Backend returns 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: IndexTTS Voice Synthesis → Area: Left panel bottom error panel',
          cause: 'Backend service is temporarily unavailable, possibly undergoing maintenance, restart, or overload protection.',
          solution: 'Retry later.',
          steps: ['Wait 2~3 minutes and retry', 'Check backend service status page if available', 'Contact backend admin to confirm if maintenance is in progress'],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'Avoid operating during server maintenance windows; lower request frequency during high load.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Import config prompt says Invalid JSON format',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: IndexTTS Voice Synthesis → Area: Top Import Config button',
          cause: 'File content is corrupted, not in JSON format, or was modified by another program.',
          solution: 'Check if file is a valid UTF-8 encoded text file.',
          steps: ['Open file in text editor to check for garbled characters', 'Confirm file header contains "tool": "index-tts"', 'Try validating with an online JSON formatting tool'],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: 'Properly save exported config files; avoid modifying with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Import config prompt says Tool type mismatch',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: IndexTTS Voice Synthesis → Area: Top Import Config button',
          cause: 'The tool field in imported JSON file is not index-tts.',
          solution: 'Confirm the imported file is exported from the IndexTTS page.',
          steps: ['Open file in text editor', 'Confirm tool field value is "index-tts"', 'If not, find the correct config file or import from the corresponding tool page'],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Config files from different tools are not interchangeable; export and import from the corresponding tool page.',
        },
      ],
    },
    {
      id: 'prompt-suite',
      title: 'Prompt Suite',
      overview: `Prompt Suite is a prompt management and generation tool. It contains 4 preset prompt categories (Character, Scene, Style, Action), each containing multiple sub-categories. Users can browse, copy, and favorite prompts, and can also create custom prompt combinations.

Basic Process:
1. Select a prompt category on the left
2. Browse prompts in the sub-category list on the right
3. Click the copy button to copy a single prompt to the clipboard
4. Or check multiple prompts and click "Combine & Copy" to generate a combined prompt


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
      buttons: [
        { name: 'Copy', description: 'Copies a single prompt text to the clipboard.' },
        { name: 'Favorite', description: 'Adds the prompt to the favorites list for quick access later.' },
        { name: 'Combine & Copy', description: 'Combines the selected multiple prompts and copies them to the clipboard, separated by commas.' },
        { name: 'Clear Selection', description: 'Clears all currently selected prompts.' },
        { name: 'Expand / Collapse Category', description: 'Expands or collapses a prompt category to show or hide sub-categories.' },
      
        { name: 'New Character', description: 'Create a new blank character card. Choose from templates or fully customize.' },
        { name: 'Duplicate Character', description: 'Copy all content of the current character card to an independently editable duplicate.' },
        { name: 'Delete Character', description: 'Permanently delete current character card. Requires double confirmation; exported files are unaffected.' },
        { name: 'Import Character', description: 'Import character data from JSON, Markdown, or CSV files. Supports batch import.' },
        { name: 'Template Market', description: 'Browse and download community-shared custom templates. Upload your own templates.' },
        { name: 'Relationship Map', description: 'Visualize relationship networks between all characters in the world (family, friends, enemies, lovers).' },
        { name: 'Timeline', description: 'Create event timelines for characters or worlds. Add events, dates, descriptions, and related characters.' },
        { name: 'Compare Mode', description: 'Select two character cards for side-by-side comparison. Highlights differences to check setting conflicts.' },],
      parameters: [
        { name: 'Search Prompts', description: 'Search box, supports searching prompt content by keyword.', tips: 'Enter keywords such as "cyberpunk" or "blue hair" to quickly find relevant prompts.' },
        { name: 'Category Filter', description: 'Filters prompt categories displayed on the left.', tips: 'Quickly locate the desired prompt type when there are many categories.' },
      
        { name: 'Tag Count Limit', description: 'Maximum tags retained during auto-tagging, range 5~50. More tags = more detailed but potentially noisier.', tips: 'Character training: 20-30, style training: 10-15.' },
        { name: 'Tag Confidence Threshold', description: 'Minimum confidence for auto-tags, range 0~100. Tags below threshold are filtered out.', tips: 'Recommended 30-50; too high loses useful tags.' },
        { name: 'World Tier Depth', description: 'Control world editor tier expansion depth, range 1~5. Deep tiers for complex settings; shallow for quick browsing.', tips: 'Beginners: 2-3, experienced: 4-5.' },
        { name: 'Auto-Save Interval', description: 'Auto-save draft interval in minutes, range 1~30. Set 0 to disable.', tips: 'Recommended 3-5 minutes; too short may cause lag, too long risks progress loss.' },
        { name: 'Export Image Quality', description: 'Image compression quality for documents with images, range 60~100. High = better quality but larger files.', tips: 'Web sharing: 80-85, printing: 95-100.' },
        { name: 'Collaboration Cursors', description: 'Show other users\' cursor positions and usernames during multi-user collaboration.', tips: 'Large teams: enable. Personal use: disable to reduce distraction.' },
        { name: 'Diff Highlight Mode', description: 'Version comparison highlight method: line-level (whole line) or word-level (only differing words).', tips: 'Major changes: line-level, minor tweaks: word-level.' },
        { name: 'Template Strict Mode', description: 'When enabled, required fields in templates must be filled before export or sharing.', tips: 'Formal projects: enable. Draft phase: disable.' },
        { name: 'Max Relationship Connections', description: 'Maximum relationship connections per character, range 5~50. Prevents overly complex relationship graphs.', tips: 'Light novel: 10-15, TRPG: 20-30.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'API Key is not configured.',
          solution: 'Configure the Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter a valid Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'Key has expired.',
          solution: 'Replace the Key.',
          steps: [
            'Open "Settings → API"',
            'Replace with a new Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request timed out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'Generation took too long.',
          solution: 'Increase timeout or retry.',
          steps: [
            'Increase timeout setting',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'Backend not started or configuration error.',
          solution: 'Check backend status.',
          steps: [
            'Check API Base URL',
            'Confirm backend service is running',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'CONFIG_CORRUPTED',
          message: 'Editor data blank or garbled when opened',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Prompt Suite → Area: prompt editor / right panel',
          cause: 'The PromptSuite config in browser localStorage is corrupted.',
          solution: 'Refresh the editor or manually clear localStorage.',
          steps: [
            'Click the refresh button',
            'Confirm in the dialog and refresh',
            'If still abnormal, press Ctrl+Shift+I → Application → Local Storage, delete prompt-suite keys',
            'Refresh the page',
          ],
          relatedCodes: ['STORAGE_READ_ONLY', 'LOCAL_STORAGE_FULL'],
          prevention: 'Do not manually edit localStorage data; regularly export configs as backups.',
        },
        {
          code: 'CURSOR_JUMP',
          message: 'Cursor jumps during editing',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: Prompt Suite → Area: prompt editor / right panel',
          cause: 'In earlier versions, real-time rendering using dangerouslySetInnerHTML caused DOM and React state to be out of sync. This has been fixed in the current version.',
          solution: 'Refresh the page to restore auto-saved content.',
          steps: [
            'Press Ctrl+S to manually save current content',
            'Refresh the page (F5 or Ctrl+R)',
            'After page reload, auto-saved content will be restored',
          ],
        },
        {
          code: 'EXPORT_FAILED',
          message: 'Export failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Prompt Suite → Area: top right export button',
          cause: 'Browser blocked the download, or the generated file is too large.',
          solution: 'Check browser download permissions or reduce content size.',
          steps: [
            'Check whether the browser blocked the download (upper right download icon)',
            'If blocked, allow this site to download files',
            'If the file is too large, split into multiple exports or reduce image size',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Regularly export and back up; for large files, split exports.',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: 'Static hosting requires custom API configuration',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'Deployed to a pure static hosting environment, cannot directly access local backend.',
          solution: 'Configure a remote custom API address.',
          steps: [
            'Open "Settings → API"',
            'Switch "Interface Mode" to "Custom API"',
            'Enter the backend root address',
            'Enter the API Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: 'Before using Paper2Gal in a static hosting environment, be sure to deploy the backend service and configure the correct API address and Key.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Prompt Suite → Area: model dropdown',
          cause: 'Model does not exist or Key has no permission.',
          solution: 'Switch models or replace the Key.',
          steps: [
            'Select another model',
            'Or replace the API Key',
            'Retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'PASTE_FORMAT_LOSS',
          message: 'Pasted content lost formatting',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Prompt Suite → Area: prompt editor',
          cause: 'The editor uses plain text mode; pasted rich text (Word, web pages) will lose formatting such as colors and fonts.',
          solution: 'Paste as plain text or manually adjust formatting.',
          steps: [
            'Use Ctrl+Shift+V to paste as plain text',
            'Or paste into Notepad first, then copy to the editor',
          ],
          prevention: 'The editor only supports plain text; for formatted content, use Markdown syntax.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'Content policy violation',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Prompt Suite → Area: prompt generation area',
          cause: 'Generated content was intercepted by the safety filter.',
          solution: 'Modify the prompt, remove sensitive vocabulary.',
          steps: [
            'Check the error details for the specific intercepted content',
            'Modify the prompt, replacing or removing sensitive vocabulary',
            'Retry',
          ],
          relatedCodes: ['403_FORBIDDEN', 'P2G_WORKFLOW_ERROR'],
          prevention: 'Avoid using sensitive vocabulary when modifying prompts; test with the default prompt first, then customize after it passes.',
        },
      ],
    },
    {
      id: 'llm-hub',
      title: 'LLM Hub',
      overview: `LLM Hub is a multi-model AI dialogue and testing tool. It supports simultaneously connecting to multiple LLM (Large Language Model) service providers, sending the same question to different models and comparing their answers. Supports streaming output, Markdown rendering, and conversation history management.

Basic Process:
1. Select one or more models to enable in the model list on the left
2. Enter a question in the input box at the bottom
3. Click "Send" or press Enter
4. View the replies from each model in the dialogue area on the right
5. Click "Compare" to place the answers of multiple models side by side for comparison


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
      buttons: [
        { name: 'Send', description: 'Sends the current question to all enabled models.' },
        { name: 'Clear Conversation', description: 'Clears all dialogue records in the current conversation.' },
        { name: 'Export Conversation', description: 'Exports the current conversation as a JSON or Markdown file.' },
        { name: 'Compare', description: 'Enters comparison mode, displaying answers from multiple models side by side.' },
        { name: 'Copy Answer', description: 'Copies a single model\'s answer to the clipboard.' },
        { name: 'Regenerate', description: 'Resends the question to a specific model to get a new answer.' },
        { name: 'Toggle Model', description: 'Enables or disables a model. Only enabled models will receive questions.' },
        { name: 'Test API', description: 'Tests whether the currently configured API Key and address are valid.' },
      
        { name: 'Clear Chat', description: 'Clear all history messages in current conversation while preserving system prompt and model config.' },
        { name: 'Export Chat', description: 'Export current conversation as Markdown, JSON, or plain text file.' },
        { name: 'Import Chat', description: 'Import conversation history from file. Supports continuing previous conversations.' },
        { name: 'Share Chat', description: 'Generate a read-only share link for the conversation. Optionally include system prompt.' },
        { name: 'Token Stats', description: 'Display current conversation token usage details: system prompt, user messages, AI responses.' },
        { name: 'Preset Prompts', description: 'Load preset system prompt templates (roleplay, coding assistant, creative writing, etc.).' },
        { name: 'Multi-Model Compare', description: 'Send the same question to multiple models simultaneously. Display responses side by side.' },
        { name: 'Voice Input', description: 'Enable microphone voice input. Supports Chinese, English, and Japanese speech recognition.' },
        { name: 'Code Interpreter', description: 'Let AI execute Python code in a sandbox environment and return results.' },],
      parameters: [
        { name: 'Model', description: 'Selects the LLM model to use.', tips: 'Different models have different capabilities and response styles; it is recommended to choose according to the task type.' },
        { name: 'Temperature', description: 'Controls the randomness of the output, range 0~2.', tips: 'Lower values (0.2~0.5) produce more deterministic answers; higher values (0.8~1.2) produce more creative answers.' },
        { name: 'Max Tokens', description: 'Maximum number of tokens for the reply.', tips: 'Higher values allow longer answers but consume more API tokens.' },
        { name: 'System Prompt', description: 'System-level prompt to set the model\'s role and behavior.', tips: 'For example: "You are a helpful assistant" or "You are an expert in character design".' },
        { name: 'API Address', description: 'The API endpoint address for the model.', tips: 'The default is the provider\'s official address; custom addresses can be configured for local deployments.' },
        { name: 'API Key', description: 'API Key for accessing the model service.', tips: 'Each model provider requires a separate Key; Keys will not be displayed in plaintext on the page.' },
        { name: 'Timeout', description: 'Request timeout (seconds).', tips: 'Increase this value when the network is poor or the model response is slow.' },
      
        { name: 'System Prompt Length Limit', description: 'Max tokens for system prompt, range 100~4000. Prevents overly long prompts from consuming conversation space.', tips: 'Roleplay: 500-1000, complex settings: 1500-2500.' },
        { name: 'Conversation History Rounds', description: 'Recent conversation rounds to retain, range 1~50. More rounds = more complete context but more tokens.', tips: 'Simple Q&A: 3-5, roleplay: 10-20, deep discussion: 20-30.' },
        { name: 'Retry Count', description: 'Auto-retry count for failed API requests, range 0~5. Increase for unstable networks.', tips: 'Overseas API from China: 2-3, local models: 0-1.' },
        { name: 'Streaming Delay Threshold', description: 'Minimum character delay for streaming output in ms, range 0~100. Higher = smoother display; lower = faster response.', tips: 'Reading comfort: 20-40, speed priority: 0-10.' },
        { name: 'Code Block Auto-Collapse', description: 'Auto-collapse code blocks exceeding N lines, range 5~100. Set 0 to never collapse.', tips: 'Recommended 20-30 lines; long code better collapsed.' },
        { name: 'Auto Conversation Naming', description: 'Auto-generate conversation titles based on content. Off = "New Conversation" + number.', tips: 'Many conversations: enable for easier searching.' },
        { name: 'Multi-Model Parallel Count', description: 'Simultaneous model requests in multi-model comparison, range 2~5. Limited by API concurrency.', tips: 'Free API: 2, paid API: 3-4.' },
        { name: 'Voice Input Language', description: 'Speech recognition target language: auto-detect, Chinese, English, Japanese.', tips: 'Multilingual conversations: auto-detect.' },
        { name: 'Function Call Confirmation', description: 'Require user confirmation before AI executes external tool calls.', tips: 'Sensitive operations (email, data modification): enable.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: LLM Hub → Area: model card / send button area',
          cause: 'API Key is not configured.',
          solution: 'Configure the Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter a valid Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: LLM Hub → Area: model card / send button area',
          cause: 'Key has expired.',
          solution: 'Replace the Key.',
          steps: [
            'Open "Settings → API"',
            'Replace with a new Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_RATE_LIMIT',
          message: 'API Rate Limit triggered',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: LLM Hub → Area: model card / send button area',
          cause: 'Request frequency is too high, exceeding the service provider\'s limit.',
          solution: 'Slow down request frequency or switch providers.',
          steps: [
            'Reduce request frequency',
            'Wait a while and retry',
            'Consider switching to a provider with higher rate limits',
          ],
          relatedCodes: ['429_TOO_MANY_REQUESTS'],
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request timed out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: LLM Hub → Area: model card / send button area',
          cause: 'Model response took too long.',
          solution: 'Increase timeout or reduce Max Tokens.',
          steps: [
            'Increase timeout setting',
            'Or reduce Max Tokens',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'BACKEND_UNAVAILABLE'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: LLM Hub → Area: model card / send button area',
          cause: 'Backend not started or configuration error.',
          solution: 'Check backend status.',
          steps: [
            'Check API Base URL',
            'Confirm backend service is running',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: 'Config file content is incomplete or corrupted',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: LLM Hub → Area: import button',
          cause: 'The configuration file is missing necessary fields (such as llmConfig).',
          solution: 'Confirm the file was exported from the correct tool page.',
          steps: [
            'Open the file in a text editor',
            'Confirm it contains the fields required by the corresponding tool',
            'Re-export from the correct tool page',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Imported JSON format is invalid',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: LLM Hub → Area: import button',
          cause: 'File is corrupted or is not a valid JSON file.',
          solution: 'Check and fix JSON file.',
          steps: [
            'Open the file in a text editor',
            'Validate with a JSON formatting tool',
            'Fix syntax errors and re-import',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH', 'IMPORT_INVALID_CONFIG'],
          prevention: 'Keep exported configuration files safe; do not modify them with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Imported config file tool type mismatch',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: LLM Hub → Area: import button',
          cause: 'The config file was exported from another tool, not the current tool.',
          solution: 'Import the correct config file.',
          steps: [
            'Confirm the file was exported from the current tool',
            'Find the correct config file and re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Only config files exported from the corresponding tool page contain the correct tool field.',
        },
        {
          code: 'LLM_MODEL_UNAVAILABLE',
          message: 'Model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: real-time test panel / model list',
          cause: 'The selected model does not exist on the backend or the current Key does not have permission to access it.',
          solution: 'Switch to another model.',
          steps: [
            'Select another model in the "Model" dropdown',
            'Confirm the model ID spelling is correct',
            'Confirm the current Key supports the selected model',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', '403_FORBIDDEN'],
          prevention: 'Select from the known model list; confirm the Key has access permission for the target model.',
        },
        {
          code: 'LLM_TEST_ERROR',
          message: 'Real-time test shows "LLM_TEST_ERROR"',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: real-time test panel / model list',
          cause: 'API request failed. Possible causes: network issue, invalid API Key, expired Key, model unavailable, or request timeout.',
          solution: 'Troubleshoot step by step according to error details.',
          steps: [
            'View detailed error information in the error panel',
            'Check network connection',
            'Confirm API Key is valid',
            'Try switching models',
            'Increase timeout setting or reduce Max Tokens',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: 'Before testing, confirm the network is stable, API Key is valid, and the model exists.',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Browser localStorage is full',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: LLM Hub → Area: save button',
          cause: 'Stored data exceeds the browser\'s limit (usually 5~10MB).',
          solution: 'Clean up unnecessary data or export backup.',
          steps: [
            'Export current configuration as a JSON file',
            'Open DevTools → Application → Local Storage',
            'Delete unnecessary large data',
            'Save again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; for large files, do not save directly in the editor—use the export function instead.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: model list',
          cause: 'Model does not exist or Key has no permission.',
          solution: 'Switch models or replace the Key.',
          steps: [
            'Select another model',
            'Or replace the API Key',
            'Retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Browser storage is read-only',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: LLM Hub → Area: save button',
          cause: 'Browser is in incognito mode, or storage is disabled by system policy.',
          solution: 'Exit incognito mode or use a normal window.',
          steps: [
            'Confirm the browser is not in incognito/private mode',
            'Check whether browser storage permissions are disabled',
            'Export configuration as a local file as an alternative',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
      ],
    },
    {
      id: 'tts-export',
      title: 'TTS Export',
      overview: `The TTS Export tool configures speech synthesis parameters and generates character voice assets. Supports adjusting voice, language, speed, pitch, volume, and other basic parameters, as well as advanced parameters such as breathiness, clarity, expressiveness, and pause intensity. Can upload reference audio as a voice cloning source, supports audio post-processing (noise reduction, EQ, compression), and pronunciation fine-tuning (custom replacement rules).


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
      buttons: [
        { name: 'Save', description: 'Saves the current TTS configuration to local storage. After a successful save, the status indicator changes from "Unsaved" to "Saved".' },
        { name: 'Reset', description: 'Resets all parameters to default values, clears reference audio and logs. A confirmation dialog will appear to prevent accidental triggering.' },
        { name: 'Import Config', description: 'Imports a previously exported TTS JSON configuration file to restore all parameter settings.' },
        { name: 'Download JSON', description: 'Downloads the current TTS configuration as a JSON file (oc-tts-config.json), which can be used for backup or cross-device migration.' },
        { name: 'Copy JSON', description: 'Copies the current TTS configuration as JSON text to the clipboard.' },
        { name: 'Upload Reference Audio', description: 'Selects and uploads a reference audio clip (WAV/MP3/FLAC, no more than 10MB) for voice cloning. The file name will be displayed after upload.' },
        { name: 'Expand / Collapse Advanced Parameters', description: 'Expands or collapses the advanced parameters panel (pause intensity, intonation curve, emphasis mode).' },
        { name: 'Expand / Collapse Audio Post-processing', description: 'Expands or collapses the audio post-processing panel (noise reduction, EQ, compression).' },
        { name: 'Expand / Collapse Pronunciation Fine-tuning', description: 'Expands or collapses the pronunciation fine-tuning panel (text preprocessing, replacement rules).' },
        { name: 'Copy Logs', description: 'Copies the right-side log panel content to the clipboard.' },
        { name: 'Download Logs', description: 'Downloads the log content as a text file (tts-logs.txt).' },
      
        { name: 'Preview', description: 'Synthesize and play only the first 100 characters of current input for quick voice effect confirmation.' },
        { name: 'Batch Import', description: 'Import dialogue lists from text files or CSV for automatic audio file generation.' },
        { name: 'Voice Clone', description: 'Upload 5-10 seconds of reference audio to clone a specific person\'s voice for synthesis.' },
        { name: 'Audio Editor', description: 'Open basic audio editing interface for cropping, concatenation, fade in/out.' },
        { name: 'Voice Library', description: 'Manage all saved character voice configs. Quickly switch and preview.' },
        { name: 'SSML Editor', description: 'Open visual SSML markup editor. Add pauses, emphasis without handwriting XML.' },
        { name: 'Subtitle Generator', description: 'Automatically generate SRT subtitle files from audio content. Supports timeline adjustment.' },],
      parameters: [
        { name: 'Voice', description: 'Selects a preset voice timbre.', tips: 'Hanazora is the default female voice; Mirako is an energetic female voice; Rin is a youthful male voice.' },
        { name: 'Language', description: 'Target language for synthesized speech.', tips: 'This field automatically syncs when switching the global interface language.' },
        { name: 'Speed', description: 'Speech playback speed multiplier, range 0.6~1.6.', tips: '1.0 is normal speed; when the character is emotionally excited, it can be set to 1.2~1.4.' },
        { name: 'Emotion', description: 'Describes the desired emotional style tag, such as "gentle", "firm", "melancholy", etc.', tips: 'Some backend models support emotion tags, which will be appended to the synthesis prompt.' },
        { name: 'Pitch', description: 'Pitch offset, range -12~12 (semitone units).', tips: 'Positive values sound higher and brighter; negative values sound lower and deeper.' },
        { name: 'Volume', description: 'Output volume percentage, range 40~140.', tips: '100 is the original volume; when there is more background sound, it can be set to 110~120.' },
        { name: 'Sample Rate', description: 'Output audio sample rate (Hz).', tips: '24000 is standard voice quality; 44100/48000 provides higher quality but larger files.' },
        { name: 'Breathiness', description: 'Controls the breath intensity in the voice, range 0~100.', tips: 'Higher values sound more like natural human breathing, but too high will sound panting.' },
        { name: 'Clarity', description: 'Controls pronunciation clarity, range 0~100.', tips: 'Higher values mean clearer enunciation, but may sound mechanical.' },
        { name: 'Expressiveness', description: 'Controls emotional expressiveness intensity, range 0~100.', tips: 'Higher values produce richer intonation changes, suitable for dramatic scenes.' },
        { name: 'Speed Variation', description: 'Controls the natural fluctuation degree of speech speed, range 0~100.', tips: 'Higher values sound more like the natural speed variation when real people talk.' },
        { name: 'Pause Intensity', description: 'Controls the length of pauses between sentences, range 0~100.', tips: 'Can be appropriately increased when reciting poetry or serious content.' },
        { name: 'Intonation Curve', description: 'Preset intonation change patterns: flat, natural, dramatic, melodic.', tips: '"Natural" is suitable for daily dialogue; "Dramatic" is suitable for animation dubbing; "Melodic" is suitable for singing or recitation.' },
        { name: 'Emphasis Mode', description: 'Keyword emphasis intensity: normal, strong, subtle.', tips: '"Strong" makes the AI place stress on keywords; "Subtle" provides a slight hint.' },
        { name: 'Noise Reduction', description: 'Noise reduction intensity of the output audio, range 0~100.', tips: 'Increase this value when the reference audio has background noise.' },
        { name: 'EQ Preset', description: 'Equalizer preset: flat, warm, bright, broadcast, clear.', tips: '"Warm" is suitable for narration; "Bright" is suitable for young female characters; "Broadcast" is suitable for voice-over.' },
        { name: 'Compression', description: 'Dynamic range compression intensity, range 0~100.', tips: 'Compression makes volume more uniform, preventing sudden loudness changes.' },
        { name: 'Post-processing Master Switch', description: 'Whether to enable audio post-processing (noise reduction + EQ + compression).', tips: 'Turning off post-processing yields raw synthesis quality, but may have background noise.' },
        { name: 'Text Preprocessing', description: 'Whether to perform normalization on text before synthesis.', tips: 'Recommended to enable; can automatically handle number pronunciation, English abbreviations, etc.' },
        { name: 'Custom Replacement Rules', description: 'Enter replacement rules, one per line, in the format "original=replacement".', tips: 'For example, "OC=Oushi" will make the synthesis pronounce "OC" as "Oushi".' },
      
        { name: 'Audio Sample Rate', description: 'Output audio sample rate: 22050Hz, 44100Hz, 48000Hz. Higher = better quality but larger files.', tips: 'Voice dialogue: 22050Hz sufficient, music/post-processing: 44100Hz or 48000Hz.' },
        { name: 'Audio Bit Depth', description: 'Output audio bit depth: 16-bit, 24-bit. 24-bit has larger dynamic range.', tips: 'General use: 16-bit, professional audio: 24-bit.' },
        { name: 'Voice Pause Interval', description: 'Auto-inserted pause between sentences in ms, range 100~2000. Affects speech rhythm.', tips: 'Normal dialogue: 300-500ms, reading/speech: 500-800ms.' },
        { name: 'Emotion Intensity', description: 'Voice emotion tag intensity multiplier, range 0.5~2.0. 1.0 = normal, >1 more exaggerated, <1 more restrained.', tips: 'Animation dubbing: 1.2-1.5, audiobooks: 0.8-1.0.' },
        { name: 'Batch Thread Count', description: 'Simultaneous processing threads for batch generation, range 1~8. More threads = faster but more resource usage.', tips: '8+ core CPU: 4-6, 4-core: 2-3.' },
        { name: 'Reference Audio Length', description: 'Reference audio length for voice cloning in seconds, range 3~30. Longer usually = more stable cloning.', tips: 'Bark: 5-10s, other engines: 10-20s.' },
        { name: 'Clone Similarity', description: 'Similarity weight to original voice during cloning, range 0~100. High = more like original but may retain noise.', tips: 'Clean recordings: 80-90, noisy recordings: 60-70.' },
        { name: 'Subtitle Time Offset', description: 'Generated subtitle timeline overall offset in ms, range -5000~5000. For precise video alignment.', tips: 'Usually not needed; adjust when audio-video sync issues occur.' },
        { name: 'SSML Validation Level', description: 'SSML markup validation strictness: loose (allow unknown tags), standard (known tags only), strict (complete syntax required).', tips: 'Beginners: loose, production: standard or strict.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: TTS Export → Area: left column output area',
          cause: 'API Key is not configured.',
          solution: 'Configure the Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter a valid Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: TTS Export → Area: left column output area',
          cause: 'Key has expired.',
          solution: 'Replace the Key.',
          steps: [
            'Open "Settings → API"',
            'Replace with a new Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Request timed out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: TTS Export → Area: left column output area',
          cause: 'Synthesis took too long.',
          solution: 'Shorten text or increase timeout.',
          steps: [
            'Reduce the length of text to synthesize',
            'Increase timeout setting',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: TTS Export → Area: left column output area',
          cause: 'Backend not started or configuration error.',
          solution: 'Check backend status.',
          steps: [
            'Check API Base URL',
            'Confirm backend service is running',
            'Retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: 'Importing config prompts "Invalid configuration data"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: TTS Export → Area: top "Import Config" button',
          cause: 'Missing ttsConfig field.',
          solution: 'Confirm that a TTS configuration file is being imported.',
          steps: [
            'Open the file in a text editor',
            'Confirm it contains "tool": "tts-export"',
            'Re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Importing config prompts "Invalid JSON format"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: TTS Export → Area: top "Import Config" button',
          cause: 'File is corrupted.',
          solution: 'Check file validity.',
          steps: [
            'Open the file in a text editor',
            'Validate with a JSON formatting tool',
            'Re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_CONFIG'],
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Save failed',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: TTS Export → Area: top "Save" button',
          cause: 'Storage space insufficient.',
          solution: 'Clean up or export backup.',
          steps: [
            'Click "Download JSON" to back up',
            'Clean up localStorage',
            'Save again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; for large files, do not save directly in the editor—use the export function instead.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Save has no response',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: TTS Export → Area: top "Save" button',
          cause: 'Incognito mode.',
          solution: 'Exit incognito mode.',
          steps: [
            'Confirm you are not in incognito mode',
            'Export backup',
            'Reopen in a normal window',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
        {
          code: 'TTS_AUDIO_GENERATION_FAILED',
          message: 'Speech synthesis failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: TTS Export → Area: left column output area',
          cause: 'Backend TTS service exception. Possible causes: model loading failure, unsupported reference audio format, or text containing characters that cannot be synthesized.',
          solution: 'Check backend status, reference audio, and text content.',
          steps: [
            'Check the specific information in the error details',
            'If reference audio is used, confirm the format is WAV/MP3/OGG',
            'Simplify text, removing special symbols and emojis',
            'Try switching the voice preset',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: 'Simplify text and remove special symbols; confirm reference audio format is correct; select known available voice presets.',
        },
        {
          code: 'TTS_REFERENCE_INVALID',
          message: 'Reference audio upload failed',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: TTS Export → Area: reference audio upload area',
          cause: 'File format is not supported or file is too large.',
          solution: 'Replace with a valid audio file.',
          steps: [
            'Confirm the audio file format is WAV, MP3, or OGG',
            'Confirm the file size does not exceed 10MB',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
        },
        {
          code: 'UNSAVED_WARNING',
          message: 'Returning to home page prompts unsaved changes',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Page: TTS Export → Area: upper-left "Back to Home" button',
          cause: 'There are unsaved changes.',
          solution: 'Save or discard.',
          steps: [
            'Click "Save"',
            'Or click "Confirm Return" to discard',
          ],
        },
      ],
    },
    {
      id: 'paper2gal',
      title: 'Paper2Gal Image Asset Generation',
      overview: `Paper2Gal is the core workflow tool of Original Character Maker, connecting to the p2g-character-workflow backend to achieve "single image in, multiple assets out" batch character asset generation. After uploading a character reference image, the workflow automatically executes 10 steps, generating 8 final assets and 5 metadata files.

**Final Output Assets (8 images total)**
· Expression images ×3: thinking, surprise, angry — portrait composition
· CG scene images ×2: CG01, CG02 — landscape 16:9 composition, single-character all-ages daily story scene
· Transparent cutouts ×3: transparent-background PNGs corresponding to the three expressions above

**Metadata Files (5 total)**
· manifest: Complete workflow manifest
· character_profile: Character analysis profile
· prompts: Final prompt records used in each step
· character_pack: Character package
· p2g_handoff: Paper2Gal handoff file

**Workflow Execution Order (10 steps)**
1. validate_input — Validates input image format and dimensions
2. analyze_character — AI analyzes character features and generates a character description for reuse in subsequent steps
3. expression_thinking — Generates thinking expression image
4. expression_surprise — Generates surprise expression image
5. expression_angry — Generates angry expression image
6. cg_01 — Generates the first CG scene image
7. cg_02 — Generates the second CG scene image
8. cutout_expression_thinking — Transparent cutout of the thinking expression
9. cutout_expression_surprise — Transparent cutout of the surprise expression
10. cutout_expression_angry — Transparent cutout of the angry expression

**Prompt Override System**
Each generation step supports custom Prompt overrides. The default prompts already include strict character consistency constraints (identity, face shape, hairstyle, clothing, color scheme, art style remain consistent) and safety boundaries (prohibiting sexualization, revealing clothing, suggestive poses, adult implications). You can fine-tune expression descriptions and scene atmosphere according to character traits, but it is recommended to retain the constraint portions in the default prompts to ensure output quality.

**Redo System (v1.0.0+)**
Supports redoing individual results; different expressions and CGs can be redone in parallel. During redo, the page displays a "Redoing" status and automatically syncs backend progress. Note: Redoing an expression will automatically sync redo the corresponding cutout (they belong to the same conflict group).

**Cutout Solution**
Cutout is uniformly scheduled by the backend. When the backend sets the remove_background provider to frontend, the browser automatically executes AI cutout (based on the IMG.LY background-removal model). Browser cutout runs locally without requiring an additional API Key; the first run requires downloading model resources (about 1-2 minutes). If browser cutout fails, it will automatically fall back to an edge color detection fallback solution.

**State Persistence**
The page automatically saves the current workflow state, Prompt override configuration, and concurrency settings to browser local storage. Progress can be restored after refreshing the page. Unsaved changes will show a yellow "Unsaved" indicator, and a confirmation prompt will appear before leaving the page.


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
      buttons: [
        { name: 'Back to Home', description: 'Leaves the Paper2Gal page and returns to the home page. If there are unsaved configuration modifications (Prompt overrides or concurrency settings), a confirmation dialog will appear first, allowing you to choose "Continue Editing" to save before leaving, or "Confirm Return" to discard modifications.' },
        { name: 'Open Settings', description: 'Opens the global settings panel. The most commonly used settings in Paper2Gal are the "API" tab (configure backend address and Key) and the "Performance" tab (adjust image preview quality, maximum concurrent requests).' },
        { name: 'Unsaved / Saved', description: 'Status indicator. When Prompt override text or the AI concurrency toggle is modified, the indicator shows yellow "Unsaved". After clicking "Save Config" it turns green "Saved". This state also determines whether a leave confirmation dialog appears.' },
        { name: 'Save Config', description: 'Saves the current Prompt override configuration and AI concurrency setting as a snapshot. After saving, the "Unsaved" indicator becomes "Saved", and no dialog prompt appears when leaving the page. Note: This operation only saves configuration, not workflow state (workflow state is automatically persisted by the page).' },
        { name: 'Reset Workflow', description: 'Clears all workflow state, uploaded images, generated results, and configuration, restoring the initial blank state. This operation cannot be undone; generated asset images, step progress, and debug logs will all be lost. A confirmation dialog will appear before the operation.' },
        { name: 'Import Config', description: 'Imports a previously exported Paper2Gal JSON configuration file to restore Prompt overrides and AI concurrency settings. Supports two formats: standard format (containing tool: "paper2gal" and a config object) and compatible format (directly containing promptOverrides and aiConcurrencyEnabled fields). If the file format is incorrect, a prompt will appear.' },
        { name: 'Copy JSON', description: 'Copies the current workflow\'s complete debug information (including message status, workflow object, active API address, Prompt overrides, etc.) as JSON text to the clipboard. Used to provide context when reporting issues to developers.' },
        { name: 'Download JSON', description: 'Downloads the current workflow debug JSON file (paper2gal-workflow.json), with the same content as "Copy JSON".' },
        { name: 'Export Package Config', description: 'Downloads a streamlined JSON file containing only Prompt overrides and AI concurrency settings (paper2gal-config.json), without workflow state. This file can be restored via "Import Config", facilitating cross-device migration of configurations or sharing Prompt templates.' },
        { name: 'Source Image Panel — Expand/Collapse', description: 'Click the panel title to expand or collapse the source image area. When expanded, it shows the image preview, file name, and format converter shortcut entry.' },
        { name: 'Select Image / Replace Image', description: 'Opens the system file picker to upload a character reference image. Only accepts PNG and JPG formats. Supports repeatedly selecting the same file (the file input is automatically reset after each selection). It is recommended to upload a single-character standing art or clear half-body image, with recommended dimensions of 1024×1024 ~ 2048×2048.' },
        { name: 'Format Converter', description: 'A shortcut button to jump to the "Image Format Converter" tool. If the current image format or size is not suitable, you can first go to the converter tool to process it, then return to upload.' },
        { name: 'Settings Panel — Expand/Collapse', description: 'Click the panel title to expand or collapse the settings area. When expanded, it shows source file info, current step, AI concurrency toggle, operation buttons, and hint text.' },
        { name: 'Start', description: 'Submits the character image to the backend to launch the complete Paper2Gal workflow. Before submission, it checks whether an image has been selected. After the workflow starts, the page automatically polls progress (once per second), and the right-side progress area updates each step\'s status in real time.' },
        { name: 'Redo Workflow', description: 'Restarts the workflow using the currently uploaded same image. Equivalent to a "quick do-over", without needing to reselect the file. If the workflow is completed but you are dissatisfied with the results, or want to regenerate after changing Prompt overrides, you can use this button.' },
        { name: 'Download All', description: 'Downloads a ZIP archive containing all generated assets and metadata files (file name format: {workflowId}-outputs.zip). This button is only available when the workflow has been started (a workflowId exists).' },
        { name: 'Prompt Override Panel — Expand/Collapse', description: 'Click the panel title to expand or fold the Prompt override editing area. Collapsed by default; expand when custom prompts are needed. When expanded, it shows 5 text editing boxes corresponding to the 3 expressions and 2 CGs.' },
        { name: 'Step Card — Open File', description: 'When a step successfully generates output, an "Open File" button appears on its step card. Clicking it opens the step\'s output image URL in a new tab, allowing direct viewing of the original image.' },
        { name: 'Step Card — Redo / Retry', description: 'For redoable steps (expression_thinking / expression_surprise / expression_angry / cg_01 / cg_02 and corresponding cutout steps), a redo button is displayed on the step card. Failed steps show "Retry Step"; successful steps show "Redo Current Result". Clicking submits a redo request to the backend, and the page continues polling for new progress. Different steps can be redone in parallel, but steps within the same conflict group (e.g., expression and corresponding cutout) are mutually exclusive.' },
        { name: 'Result Area — Open File', description: 'On each output card in the right-side result grid, click "Open File" to view the original image in a new tab.' },
        { name: 'Result Area — Download', description: 'Downloads a single output image to the local machine, using the preset file name (e.g., expression-thinking.png, cg-01.png, etc.).' },
        { name: 'Result Area — Copy Asset', description: 'Copies a single output image to the system clipboard (if the browser supports the ClipboardItem API). After a successful copy, the button text briefly changes to "Copied".' },
        { name: 'Result Area — Redo Current Result', description: 'Directly initiates a redo for an output image on the result card, with the same functionality as the redo on the step card.' },
        { name: 'Metadata Operation — Open Manifest', description: 'After workflow completion, click this button to open the manifest.json file in a new tab, viewing the workflow\'s complete execution record and output manifest.' },
        { name: 'Metadata Operation — Open Character Profile', description: 'Opens the character_profile file to view the AI\'s analysis results of the uploaded character (appearance features, clothing, color scheme, etc.).' },
        { name: 'Metadata Operation — Open Prompt Records', description: 'Opens the prompts file to view the final prompts actually used in each step (including the merged result of default prompts and your Prompt overrides).' },
        { name: 'Metadata Operation — Open Character Pack', description: 'Opens the character_pack file to view the character package data.' },
        { name: 'Metadata Operation — Open P2G Handoff', description: 'Opens the p2g_handoff file to view the handoff data for downstream Paper2Gal processes.' },
        { name: 'Log Panel — Copy Logs', description: 'Copies all step status logs of the current workflow to the clipboard. The log format includes each step\'s status, provider, output URL, and error information.' },
        { name: 'Log Panel — Download Logs', description: 'Downloads the log content as a text file (paper2gal-logs.txt).' },
        { name: 'Result Summary — Copy Result', description: 'Copies the result summary JSON (outputs object) to the clipboard.' },
        { name: 'Result Summary — Download Result', description: 'Downloads the result summary JSON file (paper2gal-result.json).' },
        { name: 'Latest Error — Copy / Download', description: 'Copies or downloads the current latest error details JSON, containing human-readable error information, possible causes, fix hints, and debug data.' },
        { name: 'Latest Error — Open Detail Panel', description: 'Opens a draggable error detail floating window, displaying error code, stage, message, hints, and detailed data in a structured way.' },
        { name: 'Debug Panel — Copy Debug / Download Debug', description: 'Copies or downloads the complete debug JSON (paper2gal-debug.json), containing messages, workflow state, active API address, interface mode, input file name, concurrency settings, and Prompt overrides. Used to provide complete context to developers when troubleshooting in depth.' },
      
        { name: 'Dataset Analysis', description: 'Analyze current dataset tag distribution, image size distribution, color distribution statistics.' },
        { name: 'Tag Editor', description: 'Batch edit all image tags. Supports find/replace, regex, and autocomplete.' },
        { name: 'Training Monitor', description: 'Real-time display of GPU utilization, VRAM usage, loss curve, learning rate changes.' },
        { name: 'Model Comparison', description: 'Select two checkpoints for A/B testing. Generate comparison images with identical prompts.' },
        { name: 'Trigger Word Suggestion', description: 'Auto-generate recommended trigger word combinations and negative prompts based on training data.' },
        { name: 'Model Quantization', description: 'Quantize FP32/FP16 models to INT8 or INT4. Reduce VRAM usage and inference time.' },],
      parameters: [
        { name: 'AI Concurrency', description: 'Toggle parameter. When enabled, AI generation steps in the workflow (expressions ×3 + CGs ×2) can execute in parallel, significantly shortening total time. When disabled, all steps execute serially, taking longer but with smoother API calls.', tips: 'When concurrency is enabled, the backend schedules multiple model requests simultaneously, which may increase API costs; low-configuration servers or Keys with strict rate limits are recommended to disable it. Whether browser-side cutout steps participate in concurrency is controlled by the backend.' },
        { name: 'Prompt Override — Thinking Expression', description: 'Overrides the default Prompt for the "thinking" expression generation step. The default prompt requires strict character consistency and specifies portrait composition, natural thinking state (lightly resting chin, gaze shifted sideways, etc.).', tips: 'It is recommended to retain the constraint portions such as "strictly maintain... consistency" and "portrait composition" in the default prompt, only modifying the expression action description. If the text box is cleared, the backend will use the default prompt.' },
        { name: 'Prompt Override — Surprise Expression', description: 'Overrides the default Prompt for the "surprise" expression generation step. The default prompt requires slightly widened eyes, light shoulder lift, hands slightly raised, and other natural restrained surprise actions.', tips: 'Surprise expressions are prone to generating exaggerated deformations; you can add constraints such as "natural and restrained actions, do not exaggerate deformation" in the override.' },
        { name: 'Prompt Override — Angry Expression', description: 'Overrides the default Prompt for the "angry" expression generation step. The default prompt requires eyebrows, eyes, and mouth shape to clearly show dissatisfaction, with slight forward lean, arms crossed, or small fist clench; anger level follows the character\'s temperament naturally.', tips: 'Be careful to avoid generating violent elements. The default prompt already includes the balanced constraint "do not let all characters just be slightly angry, nor go into exaggerated rampages".' },
        { name: 'Prompt Override — CG01', description: 'Overrides the generation Prompt for the first CG scene image. The default prompt requires generating a single-character all-ages daily story scene based on the same character, landscape 16:9, prohibiting adding other characters, and prohibiting sexualization, revealing clothing, suggestive poses, and adult implications.', tips: 'On the premise of retaining character consistency constraints, you can specify specific scenes (e.g., "classroom", "park", "rainy street") or atmosphere (e.g., "warm", "tense", "leisurely").' },
        { name: 'Prompt Override — CG02', description: 'Overrides the generation Prompt for the second CG scene image. The default constraints are the same as CG01.', tips: 'It is recommended to keep the character and art style consistent with CG01, only changing the scene, camera angle, pose, or emotion to create a series feel.' },
        { name: 'Input Image', description: 'The source image for the workflow. Only supports PNG and JPG formats. The image content should contain a clear character image; a single-character standing art or half-body image is recommended.', tips: 'Recommended dimensions: 1024×1024 ~ 2048×2048. Too large (>4096) will significantly increase generation and cutout time; too small (<512) will affect character detail quality.' },
        { name: 'Source File Info', description: 'Read-only information displaying the current uploaded file name.', tips: null },
        { name: 'Current Step', description: 'Read-only information displaying the name of the step currently being executed by the workflow (Chinese label). Displays "—" when the workflow is not started.', tips: null },
        { name: 'Workflow ID', description: 'Read-only information displaying the unique identifier of the current workflow. Displays "paper2gal-idle" when the workflow is not started. This ID is used for backend tracking and downloading all assets.', tips: 'If you need to find the corresponding record in backend logs, you can copy this ID and provide it to the backend administrator.' },
        { name: 'Cutout Provider', description: 'Read-only information displaying the name of the background removal engine currently used by the workflow (e.g., frontend, sharp, aliyun, etc.). Automatically assigned by the backend based on available resources.', tips: 'When displayed as frontend, cutout is executed by the browser-side AI model; when displayed as other values, it is executed by backend services.' },
        { name: 'Expression Provider / CG Provider', description: 'Read-only information displaying the backend service provider for expression generation and CG generation. Automatically assigned by the backend based on configuration.', tips: null },
      
        { name: 'Training Resolution', description: 'Target resolution for training images: 512x512, 768x768, 1024x1024. Higher requires more VRAM.', tips: 'SD 1.5: 512 or 768, SDXL: 1024.' },
        { name: 'Batch Size', description: 'Images processed simultaneously per step, range 1~8. Larger batches train more stably but need more VRAM.', tips: '8GB VRAM: 1-2, 16GB: 2-4, 24GB+: 4-8.' },
        { name: 'Learning Rate', description: 'Model parameter update step size, range 1e-6~1e-3. Too high = unstable; too low = slow convergence.', tips: 'LoRA: 1e-4~5e-4, full fine-tune: 1e-5~1e-4.' },
        { name: 'LoRA Dimension', description: 'LoRA low-rank dimension: 4, 8, 16, 32, 64, 128. Higher = more expressive power.', tips: 'Simple concepts: 4-8, characters: 16-32, complex styles: 64-128.' },
        { name: 'Alpha Value', description: 'LoRA scaling parameter, usually half or equal to dimension. Controls LoRA influence on base model.', tips: 'Generally set to Rank/2 or equal to Rank.' },
        { name: 'Training Steps', description: 'Total training iterations, range 500~20000. Steps = image count × repeat count × epochs.', tips: '10-20 images: 1000-2000 steps, 50-100 images: 3000-5000 steps.' },
        { name: 'Save Interval', description: 'Save checkpoint every N steps, range 100~2000. Frequent saves use disk space but preserve more intermediate states.', tips: 'Recommended 500-1000 steps; fewer total steps: 250-500.' },
        { name: 'Regularization Weight', description: 'Regularization image loss weight, range 0~2.0. Higher prevents overfitting but may weaken learning.', tips: 'Recommended 0.5-1.0; small datasets: 1.0-1.5.' },
        { name: 'Noise Offset', description: 'Random noise added to images during training, range 0~1.0. Appropriate noise improves generated image contrast.', tips: 'Recommended 0.05-0.1; 0 = disabled.' },
        { name: 'Optimizer', description: 'Optimizer algorithm: AdamW (general), AdamW8bit (saves VRAM), Lion (fast convergence with large LR), DAdaptation (adaptive LR).', tips: 'Beginners: AdamW, tight VRAM: AdamW8bit.' },
        { name: 'Scheduler', description: 'Learning rate scheduler: constant, cosine, linear, polynomial.', tips: 'Cosine works best for most scenarios.' },
        { name: 'Mixed Precision', description: 'Enable FP16/BF16 mixed precision training to reduce 40-50% VRAM usage.', tips: 'RTX 20 series+: FP16, RTX 30/40 series: BF16.' },],
      errors: [
        {
          code: 'API_KEY_MISSING',
          message: 'Starting workflow immediately reports error, prompting API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'API Key is not configured in "Settings → API", or the Key has been cleared. Paper2Gal needs to call the backend image generation service and must have a valid API Key configured.',
          solution: 'Configure a valid API Key in the Settings panel.',
          steps: [
            'Click "Open Settings" in the upper right or press the corresponding shortcut',
            'Switch to the "API" tab',
            'Enter your valid Key in the "API Key" input field',
            'Click "Save" and close the settings panel',
            'Return to the Paper2Gal page and click "Start" again',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '401_UNAUTHORIZED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'Request returns 401 or indicates Key is invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'The configured API Key has expired, been revoked, or its quota has been exhausted.',
          solution: 'Replace with a valid API Key.',
          steps: [
            'Open the "Settings → API" panel',
            'Delete the current Key and enter a new valid Key',
            'If unsure whether the Key is valid, test it first in the LLM Hub real-time test panel',
            'Save and return to Paper2Gal to retry',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: 'Prompts "Currently in a static hosting environment, custom API must be configured"',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar',
          cause: 'The current page is deployed in a pure static hosting environment such as GitHub Pages, Alibaba Cloud OSS/CDN, and cannot directly access the local backend. A remote custom API address must be configured to use workflow functionality.',
          solution: 'Configure a remote API address in settings.',
          steps: [
            'Open "Settings → API"',
            'Switch "Interface Mode" to "Custom API"',
            'Enter the deployed backend root address in "API Address" (e.g., https://your-backend.example.com)',
            'Enter the corresponding API Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: 'Before using Paper2Gal in a static hosting environment, be sure to deploy the backend service and configure the correct API address and Key.',
        },
        {
          code: 'DIRECT_MODEL_ENDPOINT',
          message: 'Prompts "What you entered appears to be a model endpoint, not a workflow backend root address"',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: Settings panel API tab / top message bar',
          cause: 'In "Settings → API → API Address", an address like https://api.example.com/v1/chat/completions was entered, which is a model interface address, not a workflow backend root address (e.g., https://your-backend.example.com). Paper2Gal needs the backend root address; the frontend automatically appends paths such as /api/workflows.',
          solution: 'Change to the correct workflow backend root address.',
          steps: [
            'Open "Settings → API"',
            'Change "API Address" to the backend root address (format like https://your-backend.example.com or http://localhost:3001)',
            'Ensure there are no paths such as /api/workflows or /v1/chat/completions at the end of the address',
            'Save and retry',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_BASE_INVALID'],
          prevention: 'When configuring the API address, only enter the backend service\'s root domain and port; do not append any API paths.',
        },
        {
          code: 'API_TIMEOUT',
          message: 'Workflow remains unresponsive for a long time, eventually timing out',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column progress bar',
          cause: 'A certain step took too long. Possible causes: image size too large, high model load, high network latency, or backend processing queue.',
          solution: 'Check the network or retry later, or redo a single step.',
          steps: [
            'Wait 2~3 minutes to see if there is progress update (some steps do indeed take a long time)',
            'Check whether the network connection is stable',
            'If stuck on a long-running step, you can click "Redo" on that step\'s card to retry individually',
            'If the entire workflow is stuck, try clicking "Redo Workflow" to restart with the same image',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'BACKEND_UNAVAILABLE'],
          prevention: 'Compress large images in advance; when the network is unstable, disable AI concurrency to reduce request frequency.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Prompts "Backend unavailable" or "Cannot connect to server"',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'Backend server is not started, crashed, or the API Base URL configured in the frontend is incorrect.',
          solution: 'Check backend service status and API configuration.',
          steps: [
            'Open browser DevTools → Network tab',
            'Click "Start" again and observe whether the request is sent and the response status code',
            'If the request is not sent, check whether "Settings → API → API Base URL" is correct',
            'If the request returns 502/503, contact the backend administrator to confirm service status',
            'If it is a local deployment, confirm whether the backend process is running (npm start)',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Prompts network disconnected or no internet access',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'Device is not connected to the network, Wi-Fi is disconnected, or a firewall is blocking the request.',
          solution: 'Restore network connection.',
          steps: [
            'Check the device\'s network connection status',
            'Try accessing other websites to confirm the network is normal',
            'If using a proxy/VPN, check whether the proxy settings are correct',
            'If on a company/campus network, confirm whether API access is restricted',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Before using online tools, confirm the network connection is normal; avoid performing long workflows in environments with large network fluctuations.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'Upload prompts "Unsupported file format"',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Paper2Gal → Area: left column source image panel',
          cause: 'Selected WEBP, GIF, BMP, TIFF, or other unsupported formats. Paper2Gal only supports PNG and JPG.',
          solution: 'Convert the image to PNG or JPG format.',
          steps: [
            'Use the Image Converter tool (Home → Image Format Converter) to convert the file to PNG or JPG',
            'Or use the system\'s built-in image preview/editor to export as PNG/JPG',
            'Re-select the converted file on the Paper2Gal page',
          ],
          relatedCodes: ['UPLOAD_FORMAT'],
          prevention: 'Confirm the file format is PNG or JPG before uploading.',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'Upload preview fails or workflow reports error',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Paper2Gal → Area: left column preview area',
          cause: 'Uploaded image dimensions are too large (exceeding 4096x4096 pixels) or the file size exceeds browser/backend limits.',
          solution: 'Compress or resize the image before uploading.',
          steps: [
            'Use the Image Converter tool to scale the image\'s longest side to below 2048 or 4096 pixels',
            'If it is a PNG, convert to JPG to reduce file size',
            'Re-upload the processed image',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Recommended to upload images of 1024×1024 ~ 2048×2048, balancing quality and processing speed.',
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'A workflow step reports error, prompting model unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'The model configured on the backend does not exist, has been removed, or the current API Key does not have permission to access it.',
          solution: 'Contact the backend administrator to switch models, or replace with an API Key that has permission.',
          steps: [
            'View the specific step and model information in the error panel',
            'Contact the backend administrator to confirm model configuration',
            'If a certain step keeps failing, you can click "Redo" on that step\'s card to try',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '403_FORBIDDEN'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'A step reports error, prompting content policy violation or sensitive word interception',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'Content in the Prompt override is intercepted by the backend service provider\'s safety filter. Even normal artistic vocabulary may be misjudged by certain platforms.',
          solution: 'Modify the Prompt override, removing or replacing vocabulary that may trigger the filter.',
          steps: [
            'Expand the "Prompt Override" panel in the left column',
            'Find the Prompt corresponding to the step that reported the error',
            'Remove or replace vocabulary that may trigger the filter',
            'Click "Redo" on that step\'s card',
            'If it still fails, try simplifying the Prompt to the most basic description and gradually add modifiers to identify the trigger word',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', '403_FORBIDDEN'],
          prevention: 'Avoid using sensitive vocabulary when modifying Prompt overrides; test with the default Prompt first, then customize after it passes.',
        },
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: 'Error panel shows "P2G_WORKFLOW_ERROR"',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel / draggable error floating window',
          cause: 'A step in the Paper2Gal workflow failed to execute. Possible causes: input validation failure, model unavailable, API Key expired, generated content intercepted by safety filter, network interruption, or backend internal exception.',
          solution: 'Troubleshoot step by step according to the "Stage", "Message", and "Hints" in the error details.',
          steps: [
            'Expand the error panel or open the draggable error floating window, and read "Human-readable Error Info", "Possible Causes", and "Fix Hints"',
            'Check whether the uploaded image is a valid PNG/JPG',
            'Check network connection',
            'If "content policy violation" is prompted, modify sensitive vocabulary in the Prompt override',
            'Confirm the backend service is running normally',
            'If a certain step fails, you can click "Redo" on the step card to retry that step individually',
            'If the entire workflow fails, click "Reset Workflow" to clear and restart',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED', 'STYLE_TRANSFER_REQUEST_FAILED', 'WORKFLOW_STEP_FAILED'],
          prevention: 'Before starting the workflow, confirm the image is a valid PNG/JPG, network connection is stable, Prompt override contains no sensitive vocabulary, and API Key is valid.',
        },
        {
          code: 'WORKFLOW_NOT_FOUND',
          message: 'Redoing or downloading prompts "This workflow record no longer exists"',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'After the backend (especially serverless platforms like Zeabur) is redeployed or restarted, WORKFLOW_STATE_DIR was not mounted to persistent storage, and old wf_* state files were cleared.',
          solution: 'Start a new workflow.',
          steps: [
            'This is a backend storage issue; the old workflow cannot be recovered',
            'Click "Start" to launch a new workflow with the current image',
            'If you need to retain historical workflows, contact the backend administrator to set up persistent storage mounts for WORKFLOW_STATE_DIR, OUTPUT_DIR, and UPLOAD_DIR on Zeabur/server',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'BACKEND_UNAVAILABLE'],
          prevention: 'When using serverless platforms like Zeabur, be sure to configure persistent storage mounts; after generating important assets, promptly click "Download All" to back up to local.',
        },
        {
          code: 'WORKFLOW_STEP_FAILED',
          message: 'A step card shows "Failed" status',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: right column step list',
          cause: 'An error occurred during execution of that specific step. Common causes: model unavailable, Prompt intercepted, network timeout, or insufficient backend resources.',
          solution: 'View step details and retry individually.',
          steps: [
            'Click the failed step card to view error details (error field)',
            'Troubleshoot according to the error information (e.g., modify Prompt, check network, switch model)',
            'Click the "Retry Step" button on that step\'s card to retry individually',
            'If multiple retries still fail, contact the backend administrator',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'PROMPT_BLOCKED', 'API_TIMEOUT'],
          prevention: 'After a step fails, view error details and retry after modifying the corresponding Prompt or checking the network as prompted.',
        },
        {
          code: 'REDO_CONFLICT',
          message: 'Clicking redo prompts "This result is already being redone"',
          severity: 'info',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: step cards / result cards',
          cause: 'The current step or another step in its conflict group is already being redone. For example, when redoing expression_thinking, the corresponding cutout_expression_thinking also enters redo state; clicking again at this time will prompt a conflict.',
          solution: 'Wait for the current redo to complete before operating.',
          steps: [
            'Observe the page message bar to confirm redo progress',
            'Wait for that step\'s status to change from "Redoing" to "Success" or "Failed"',
            'If the redo remains unresponsive for a long time, refresh the page and retry',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: 'Do not initiate multiple redo requests for steps within the same conflict group simultaneously; wait for one to complete before initiating the next.',
        },
        {
          code: 'WORKFLOW_CANCELLED',
          message: 'Workflow status shows as cancelled',
          severity: 'info',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: right column progress area',
          cause: 'User manually cancelled the workflow, or the backend actively cancelled the task due to resource constraints.',
          solution: 'Restart the workflow.',
          steps: [
            'Confirm whether you clicked cancel yourself',
            'If not, it may be due to insufficient backend resources',
            'Wait a few minutes and click "Start" again',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR'],
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: 'Prompts requests too frequent (Rate Limit)',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'The workflow sent too many requests during concurrent execution, exceeding the service provider\'s rate limit.',
          solution: 'Disable AI concurrency or wait and retry.',
          steps: [
            'Turn off the "AI Concurrency" toggle in the left column settings panel',
            'Wait 1~2 minutes',
            'Restart the workflow',
          ],
          relatedCodes: ['API_RATE_LIMIT'],
          prevention: 'When using an API Key with strict rate limits, it is recommended to disable AI concurrency; avoid repeatedly starting multiple workflows in a short time.',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: 'Backend returns 500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'An internal exception occurred in the backend service while processing the request. Possible causes: model loading failure, GPU memory insufficient, or code bug.',
          solution: 'Retry later or contact the backend administrator.',
          steps: [
            'Wait 2 minutes',
            'Reduce the uploaded image size and retry',
            'If the problem persists, contact the backend administrator to check server logs',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Reduce request scale (image size); avoid submitting large tasks when the server is under high load.',
        },
        {
          code: '502_BAD_GATEWAY',
          message: 'Backend returns 502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'The reverse proxy (e.g., Nginx) cannot connect to the backend application server. The backend process may have crashed or not been started.',
          solution: 'Check backend service status.',
          steps: [
            'If it is a local deployment, confirm whether the backend process is running',
            'Check whether the backend service port is occupied',
            'Check backend logs to confirm whether there are startup errors',
            'Restart the backend service and retry',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'When deploying locally, confirm the backend process is running; check reverse proxy configuration.',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: 'Backend returns 503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Paper2Gal → Area: top message bar / right column error panel',
          cause: 'Backend service is temporarily unavailable, possibly undergoing maintenance, restart, or overload protection.',
          solution: 'Retry later.',
          steps: [
            'Wait 2~3 minutes and retry',
            'Check the backend service status page (if any)',
            'Contact the backend administrator to confirm whether maintenance is in progress',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'Avoid operating during server maintenance windows; reduce request frequency during high load.',
        },
        {
          code: 'FRONTEND_CUTOUT_SPAWN_FAILED',
          message: 'Cutout step reports error, prompting browser-side cutout resources cannot be loaded',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'Browser-side IMG.LY model resources cannot be loaded, or the current browser does not support the required WebGL/WASM capabilities.',
          solution: 'Refresh the page and retry, or use a modern browser.',
          steps: [
            'Refresh the page and re-trigger browser-side cutout',
            'Confirm the browser is a modern browser such as Chrome/Firefox/Edge (IE and old Safari are not supported)',
            'Check whether WebGL or WASM is disabled in the browser',
            'If it is a Docker deployment, confirm the image was built correctly (the Dockerfile already includes model resources)',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'Use a modern browser (Chrome/Firefox/Edge latest version); do not disable WebGL or WASM.',
        },
        {
          code: 'FRONTEND_CUTOUT_TIMEOUT',
          message: 'Cutout step remains unresponsive for a long time then fails',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'Browser-side cutout processing timed out. Possible causes: image too large, insufficient device CPU/RAM, or slow model resource loading.',
          solution: 'Shrink the image or improve device performance.',
          steps: [
            'Re-upload an image with longest side not exceeding 2048 pixels',
            'Close other browser tabs to free up memory',
            'Turn off "AI Concurrency" to let steps execute serially, reducing resource contention',
            'Retry',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: 'Compress images to reasonable size before uploading (recommended 1024~2048px); ensure the device has sufficient memory.',
        },
        {
          code: 'FRONTEND_CUTOUT_EXECUTION_FAILED',
          message: 'Cutout step reports error, prompting browser-side cutout execution failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'An internal error occurred during browser-side cutout image processing. Possible causes: image format corrupted, unsupported encoding, or IMG.LY model exception.',
          solution: 'Replace the image and retry.',
          steps: [
            'Confirm the expression image was successfully generated (click the step card to view output_url)',
            'If the source image is corrupted, re-upload a new PNG/JPG image',
            'Click "Redo" on that step\'s card to retry cutout individually',
            'If browser cutout keeps failing, contact the backend administrator to switch the remove_background provider to a backend service',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_SPAWN_FAILED', 'FRONTEND_CUTOUT_TIMEOUT'],
          prevention: 'Upload standard format PNG/JPG images; avoid using special encoding or corrupted image files.',
        },
        {
          code: 'FRONTEND_CUTOUT_SOURCE_MISSING',
          message: 'Cutout step reports error, prompting source image not found',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'The upstream expression generation step failed, causing the browser-side cutout to have no input file to process.',
          solution: 'First troubleshoot and fix the expression generation step error, then retry cutout.',
          steps: [
            'Check the error information of the expression generation steps (thinking / surprise / angry)',
            'Fix the expression generation issue (usually invalid API Key, intercepted Prompt, or network issue)',
            'After confirming the expression image was successfully generated, click "Redo" on the cutout step',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: 'Ensure expression generation steps succeed before performing cutout; the workflow automatically executes in order—do not skip steps.',
        },
        {
          code: 'FRONTEND_CUTOUT_OUTPUT_MISSING',
          message: 'Browser-side cutout executed successfully but did not generate output',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: right column step cards / error panel',
          cause: 'Browser-side cutout processing was abnormal, possibly generating empty data or upload failure.',
          solution: 'Replace the image or refresh the page and retry.',
          steps: [
            'Confirm the expression image was successfully generated',
            'Refresh the page to let the page re-detect pending cutout tasks',
            'If it still fails, re-upload a new image and start a new workflow',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'Ensure input image format is correct; avoid using corrupted or special encoding images.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Importing config prompts "Invalid JSON format"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Paper2Gal → Area: top "Import Config" button',
          cause: 'File content is corrupted, not in JSON format, or modified by another program.',
          solution: 'Check whether the file is a valid UTF-8 encoded text file.',
          steps: [
            'Open the JSON file to import in a text editor',
            'Confirm the file is valid UTF-8 encoding, with no garbled text',
            'Validate with an online JSON formatter tool',
            'If the file is corrupted, try to restore from historical backup',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH'],
          prevention: 'Keep exported configuration files safe; do not modify them with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Importing config prompts "Tool type mismatch"',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Paper2Gal → Area: top "Import Config" button',
          cause: 'The tool field in the imported JSON file is not paper2gal, or it does not contain the promptOverrides field.',
          solution: 'Confirm that the imported file is a config file exported from the Paper2Gal page.',
          steps: [
            'Open the JSON file to import in a text editor',
            'Confirm the file contains "tool": "paper2gal" or directly contains the promptOverrides field',
            'If not, find the correct Paper2Gal config file and import it',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Only config files exported from the Paper2Gal page contain the correct tool field.',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Save failed, browser storage space insufficient',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Paper2Gal → Area: top "Save Config" button',
          cause: 'Browser localStorage storage space is full (usually about 5~10MB). Workflow state, Prompt overrides, and history may occupy a large amount of space.',
          solution: 'Clean up browser storage space or export configuration to a local file.',
          steps: [
            'First click "Export Package Config" to back up the current config to a local file',
            'Press Ctrl+Shift+I to open DevTools → Application → Local Storage',
            'Delete unnecessary keys (especially large keys containing workflow history)',
            'Return to Paper2Gal and click "Save Config" again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; promptly export configurations to local files for backup.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Save operation has no response, data lost after refresh',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Paper2Gal → Area: top "Save Config" button',
          cause: 'Browser is in private/incognito mode, or localStorage is disabled by system policy, or disk space is full causing the browser to set storage to read-only.',
          solution: 'Exit private mode or free up disk space.',
          steps: [
            'Confirm the browser is not in incognito/private browsing mode (this mode usually disables localStorage)',
            'Check if system disk space is full',
            'Try reopening the app in a normal window',
            'If the issue persists, use the "Export Package Config" function to save the config as a local file as an alternative',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
        {
          code: 'UNSAVED_WARNING',
          message: 'Returning to home page prompts "You haven\'t saved the current page content"',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Page: Paper2Gal → Area: upper-left "Back to Home" button',
          cause: 'The current Prompt override or AI concurrency setting does not match the last saved snapshot (isDirty is true). You may have modified the config but forgot to save.',
          solution: 'Choose to save or discard as needed.',
          steps: [
            'If you want to keep changes: click "Continue Editing" in the dialog, return to the page and click "Save Config", then return to home',
            'If you don\'t need to keep them: click "Confirm Return" in the dialog',
          ],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Browser tab crashes or becomes unresponsive',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal → Area: entire page',
          cause: 'Device memory is insufficient and the browser forcibly terminated the tab process. Usually occurs when processing ultra-large images (>4096 resolution) or loading the browser cutout model.',
          solution: 'Close other tabs, reduce image size, or use a device with more memory.',
          steps: [
            'Save current work (click "Save Config")',
            'Close other unused browser tabs',
            'Use the Image Converter tool to scale the image\'s longest side to below 2048',
            'Restart the browser and retry',
            'If the problem persists, try operating on a device with more memory',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Close other browser tabs before processing large files; scale the image\'s longest side to below 2048; on low-memory devices it is recommended to disable AI concurrency.',
        },
      ],
    },
    {
      id: 'image-converter',
      title: 'Image Format Converter',
      overview: `The Image Format Converter supports rapid conversion of local images to target formats (JPEG, PNG, WebP, BMP) and resizing. Supports multiple upload methods (select files, drag and drop, paste from clipboard), displays original image information (format, dimensions, size), and supports batch download or copy converted images. Suitable for quickly adjusting image format or size before uploading to other tools (such as Paper2Gal).


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
      buttons: [
        { name: 'Upload Image / Replace Image', description: 'Opens the file picker to select local image files, supporting PNG/JPG/WEBP/BMP/ICO formats. After selection, the original image preview and format information are displayed immediately.' },
        { name: 'Copy Original Image', description: 'Copies the original image to the clipboard. If the browser does not support it, a prompt will appear.' },
        { name: 'Download Original Image', description: 'Downloads the original image to the local machine.' },
        { name: 'Copy Converted Image', description: 'Copies the converted image to the clipboard.' },
        { name: 'Download Converted Image', description: 'Downloads the converted image to the local machine.' },
        { name: 'Reset / Clear Images', description: 'Clears all uploaded images and conversion settings, restoring the initial state.' },
      
        { name: 'Add Folder', description: 'Select an entire folder to automatically import all supported image files within.' },
        { name: 'Presets', description: 'Save current conversion parameters as a preset for one-click loading next time.' },
        { name: 'Image Info', description: 'View detailed metadata of selected images: EXIF, color profile, file size, resolution.' },
        { name: 'Preview Compare', description: 'Display before/after comparison with zoom for detail differences.' },
        { name: 'Smart Rename', description: 'Batch rename output files using templates. Supports index, date, original name variables.' },
        { name: 'Cloud Sync', description: 'Automatically upload conversion results to configured cloud storage (optional feature).' },],
      parameters: [
        { name: 'Target Format', description: 'Selects the conversion output format: JPEG, PNG, WebP, BMP.', tips: 'JPEG is suitable for photos, small file size; PNG supports transparent backgrounds; WebP offers better compression; BMP is uncompressed and large in size.' },
        { name: 'Quality', description: 'Output image quality (for lossy formats such as JPEG and WebP), range 1~100.', tips: '80~90 offers a good balance between quality and file size; 100 is the highest quality but largest file size.' },
        { name: 'Width', description: 'Output image width (pixels). Automatically scales the height proportionally based on the original image aspect ratio.', tips: 'If maintaining the aspect ratio is needed, only modify the width; the height will be automatically calculated. If the height is manually set to 0, it will be automatically calculated.' },
        { name: 'Height', description: 'Output image height (pixels). Automatically scales the width proportionally based on the original image aspect ratio.', tips: 'Same as width. When both width and height are non-zero, stretching may occur—be careful when using fixed aspect ratios.' },
        { name: 'Original Image Preview', description: 'Displays the preview of the uploaded original image, showing the original format, dimensions, and file size.', tips: null },
        { name: 'Converted Image Preview', description: 'Displays the preview after conversion, showing the converted format, dimensions, estimated file size, and scale percentage.', tips: null },
      
        { name: 'JPEG Quality', description: 'JPEG output quality, range 60~100. 100 = highest quality; 60 = smallest file but visible compression artifacts.', tips: 'Web display: 75-85, archiving: 90-95, printing: 95-100.' },
        { name: 'PNG Compression Level', description: 'PNG compression strength, range 0~9. 0 = fastest but largest; 9 = smallest but slowest. No quality loss.', tips: 'General: 6, smallest file: 9, fastest: 1-3.' },
        { name: 'WebP Quality', description: 'WebP output quality, range 0~100. WebP is typically 25-35% smaller than JPEG at same quality.', tips: 'Web display: 80-85, similar to JPEG quality settings.' },
        { name: 'Output DPI', description: 'Output image DPI (dots per inch), range 72~600. Affects print size but not pixel count.', tips: 'Screen: 72-96, print: 150-300, high-res print: 300-600.' },
        { name: 'Color Space', description: 'Output color space: sRGB (general), Adobe RGB (wide gamut print), CMYK (four-color print), P3 (Display P3 screens).', tips: 'Web/screen: sRGB, print: Adobe RGB or CMYK.' },
        { name: 'Interpolation Algorithm', description: 'Resampling algorithm for scaling: Nearest (pixel art), Bilinear (balanced), Bicubic (smooth), Lanczos (best quality).', tips: 'Photos: Lanczos or Bicubic, pixel art: Nearest.' },
        { name: 'Batch Rename Template', description: 'Filename template for batch processing. Supports {name}, {index}, {date}, {width}, {height} variables.', tips: 'Example: {name}_converted_{index:03d} produces oc_001, oc_002...' },
        { name: 'Output Directory Structure', description: 'Directory organization for batch output: flat, mirror (preserve structure), or group by date.', tips: 'Many files: group by date; few files: flat.' },
        { name: 'Metadata Handling', description: 'How to handle metadata on output: preserve all, strip all, keep copyright only, or keep creation time only.', tips: 'Privacy-sensitive: strip all; photography: keep copyright.' },],
      errors: [
        {
          code: 'CONVERSION_FAILED',
          message: 'Image conversion failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Image Format Converter → Area: bottom right conversion result area',
          cause: 'Unsupported format or browser does not support canvas conversion.',
          solution: 'Try switching the target format.',
          steps: [
            'Confirm the original image is not corrupted',
            'Try switching the target format',
            'Use a modern browser (Chrome/Firefox/Edge)',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
        },
        {
          code: 'CONVERT_ERROR',
          message: 'Conversion shows "CONVERT_ERROR"',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter → Area: bottom conversion result area',
          cause: 'An exception occurred during image conversion. Possible causes: source image corrupted, unsupported Canvas 2D filter, or insufficient memory.',
          solution: 'Retry with a different image or browser.',
          steps: [
            'Confirm the source image is not corrupted and displays normally',
            'Try refreshing the page and re-uploading',
            'Check if the image is corrupted',
            'Try turning off filters that the browser does not support',
            'Try using a different browser',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'DEVICE_MEMORY_LOW'],
        },
        {
          code: 'CONVERT_FILTER_UNSUPPORTED',
          message: 'Applying certain filters causes exceptions (all on/all off)',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter → Area: filter preview / conversion result area',
          cause: 'The current browser\'s Canvas 2D filter does not support certain values. For example, some older versions of Safari have known issues with filter support.',
          solution: 'Turn off unsupported filters or switch browsers.',
          steps: [
            'Reset filter values to defaults (brightness/contrast/saturation=100, blur/hue rotation/grayscale=0)',
            'Adjust filters one by one to find the one causing the exception',
            'Turn off the problematic filter',
            'Try Chrome/Firefox/Edge',
          ],
          relatedCodes: ['CONVERT_ERROR'],
          prevention: 'For filter adjustments, test incrementally; use mainstream browsers (Chrome/Firefox/Edge).',
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Browser tab crashes during conversion',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Image Format Converter → Area: entire page',
          cause: 'Image too large causes memory overflow.',
          solution: 'Close other tabs or reduce image size.',
          steps: [
            'Save current work',
            'Close other browser tabs',
            'Reduce the uploaded image dimensions',
            'Restart the browser and retry',
          ],
          relatedCodes: ['CONVERSION_FAILED'],
          prevention: 'Close other browser tabs before processing large files; scale the image\'s longest side to below 2048.',
        },
        {
          code: 'FILE_CORRUPTED',
          message: 'Image file is corrupted',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Image Format Converter → Area: image upload / preview area',
          cause: 'The selected image file is corrupted or encoded in an unsupported format.',
          solution: 'Replace with a valid image file.',
          steps: [
            'Open the image in a system image viewer to confirm it displays normally',
            'If corrupted, use image repair tools or replace with another image',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Confirm the image can be opened normally in the system\'s built-in image viewer before uploading.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'Upload shows "Unsupported file format"',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Image Format Converter → Area: image selection button',
          cause: 'Selected format is not within the supported list (PNG/JPG/WEBP/BMP/ICO).',
          solution: 'Convert the file to a supported format.',
          steps: [
            'Confirm the required file format for the target tool',
            'Use an image processing tool to convert the format',
            'Re-upload',
          ],
          relatedCodes: ['UPLOAD_FORMAT'],
          prevention: 'Confirm the file format is in the supported list before uploading.',
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds limit',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Image Format Converter → Area: preview area',
          cause: 'File dimensions are too large or file size exceeds limit.',
          solution: 'Compress or resize the image.',
          steps: [
            'Use the Image Converter tool to scale the image',
            'Convert PNG to JPG to reduce file size',
            'Re-upload',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Recommended to upload images of 1024×1024 ~ 2048×2048, balancing quality and processing speed.',
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Imported JSON format is invalid',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Image Format Converter → Area: import button',
          cause: 'File is corrupted or is not a valid JSON file.',
          solution: 'Check and fix JSON file.',
          steps: [
            'Open the file in a text editor',
            'Validate with a JSON formatting tool',
            'Fix syntax errors and re-import',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH', 'IMPORT_INVALID_CONFIG'],
          prevention: 'Keep exported configuration files safe; do not modify them with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Imported config file tool type mismatch',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Image Format Converter → Area: import button',
          cause: 'The config file was exported from another tool, not the current tool.',
          solution: 'Import the correct config file.',
          steps: [
            'Confirm the file was exported from the current tool',
            'Find the correct config file and re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Only config files exported from the corresponding tool page contain the correct tool field.',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Browser localStorage is full',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Image Format Converter → Area: save button',
          cause: 'Stored data exceeds the browser\'s limit (usually 5~10MB).',
          solution: 'Clean up unnecessary data or export backup.',
          steps: [
            'Export current configuration as a JSON file',
            'Open DevTools → Application → Local Storage',
            'Delete unnecessary large data',
            'Save again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; for large files, do not save directly in the editor—use the export function instead.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Browser storage is read-only',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Image Format Converter → Area: save button',
          cause: 'Browser is in incognito mode, or storage is disabled by system policy.',
          solution: 'Exit incognito mode or use a normal window.',
          steps: [
            'Confirm the browser is not in incognito/private mode',
            'Check whether browser storage permissions are disabled',
            'Export configuration as a local file as an alternative',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
        {
          code: 'UNSAVED_WARNING',
          message: 'There are unsaved changes',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Page: Image Format Converter → Area: upper-left "Back to Home" button',
          cause: 'User modified configuration but has not saved it.',
          solution: 'Save or discard changes.',
          steps: [
            'Click "Save"',
            'Or click "Confirm Return" to discard',
          ],
        },
      ],
    },
    {
      id: 'audio-editor',
      title: 'Audio Editor',
      overview: `The Audio Editor is a comprehensive waveform-based audio editing tool. Import audio files (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) and visualize the full waveform on an interactive canvas. Edit with precision using region selection, trim, split, duplicate, and delete operations. Apply a rich suite of real-time effects including volume/gain, playback speed, pitch shift, fade in/out, reverse, EQ, compressor, reverb, stereo panning, noise reduction, and normalization.

Key capabilities:
· Waveform Visualization — Full audio waveform rendered on a high-resolution canvas with zoom (1x–50x) and pan support
· Region Selection — Click and drag on the waveform to select a time range for targeted edits
· Trim / Split / Delete / Duplicate — Standard editing operations applied to the selected region or playhead position
· Volume & Pan — Gain from 0% to 200%, mute toggle, and stereo panning left/right
· Speed & Pitch — Playback speed 25%–400%, pitch shift ±1200 cents (±1 octave), reverse playback
· Fade — Adjustable fade-in and fade-out durations (0–10 seconds)
· 3-Band EQ — Independent low, mid, and high frequency gain controls (-12dB to +12dB)
· Compressor — Threshold, ratio, attack, and release parameters for dynamic range control
· Reverb — Room size, damping, and wet/dry mix for spatial ambience
· Noise Reduction & Normalize — Reduce background noise and normalize peak levels
· Multi-Format Export — WAV (8/16/32-bit), WebM/Opus, OGG/Opus, MP3, MP4/AAC (browser-dependent)
· Results Panel — Browse, preview, and re-download all exported files
· Workflow Logs — Timestamped debug log of every import, edit, and export action
· Keyboard Shortcuts — Space to play/pause, Ctrl+Z to undo, Ctrl+Shift+Z to redo`,
      buttons: [
        { name: 'Play / Pause', description: 'Start or pause playback from the current playhead position. Playback respects speed, pitch, loop, and mute settings.' },
        { name: 'Stop', description: 'Stop playback and reset the playhead to the beginning of the audio.' },
        { name: 'Undo', description: 'Revert the last destructive edit (trim, split, delete, duplicate, reverse, fade, normalize, mono). Up to the full edit history is preserved.' },
        { name: 'Redo', description: 'Re-apply the most recently undone edit action.' },
        { name: 'Trim', description: 'Keep only the selected region and discard everything else. The audio is shortened to the selection boundaries.' },
        { name: 'Split', description: 'Split the audio at the start of the selected region, creating two clips. Only the first clip is retained for further editing.' },
        { name: 'Delete', description: 'Remove the selected region from the audio and automatically join the remaining left and right segments.' },
        { name: 'Duplicate', description: 'Copy the selected region and append it to the end of the audio.' },
        { name: 'Reverse', description: 'Reverse the entire audio buffer so it plays backwards.' },
        { name: 'Fade', description: 'Apply the configured fade-in and fade-out curves to the entire audio buffer.' },
        { name: 'Normalize', description: 'Analyze the entire buffer and scale the amplitude so the loudest peak reaches 99.9% without clipping.' },
        { name: 'Mono', description: 'Mix all channels down to a single mono channel by averaging sample values.' },
        { name: 'Export', description: 'Render all applied effects into the selected format and trigger a browser download. Supported formats include WAV 8/16/32-bit, WebM/Opus, OGG/Opus, MP3, and MP4/AAC depending on browser capabilities.' },
        { name: 'New File', description: 'Import a new audio file to replace the current project. The previous edit history is cleared.' },
      ],
      parameters: [
        { name: 'Volume', description: 'Master output gain from 0% (silent) to 200% (double amplitude). Applies during playback and export.', tips: 'Values above 100% may cause distortion if the source already peaks near 0dBFS.' },
        { name: 'Mute', description: 'Silences playback output without changing the underlying buffer data.', tips: 'Useful for A/B comparison when toggling effects.' },
        { name: 'Pan (L/R)', description: 'Stereo panning from -100 (full left) through 0 (center) to +100 (full right).', tips: 'Only audible on stereo systems or headphones.' },
        { name: 'Speed', description: 'Playback speed percentage from 25% (quarter speed) to 400% (quadruple speed).', tips: 'Changing speed also stretches or compresses time. Pitch can be controlled independently via the Pitch parameter.' },
        { name: 'Pitch (cents)', description: 'Pitch shift in cents from -1200 (one octave down) to +1200 (one octave up).', tips: '100 cents = 1 semitone. Use small values (+/-50) for subtle tuning corrections.' },
        { name: 'Reverse', description: 'When enabled, the audio plays backwards from end to start.', tips: 'Destructive reverse is applied on export; real-time reverse is applied during playback.' },
        { name: 'Loop', description: 'When enabled, playback loops continuously within the selected region (or the full audio if no selection).', tips: 'Set loop boundaries by selecting a region before enabling loop.' },
        { name: 'Fade In', description: 'Duration of the linear fade-in ramp at the start of the audio, from 0 to 10 seconds.', tips: 'A gentle fade-in of 0.1–0.5s is recommended for voice to avoid plosive pops.' },
        { name: 'Fade Out', description: 'Duration of the linear fade-out ramp at the end of the audio, from 0 to 10 seconds.', tips: 'Match fade-out duration to reverb tail if using reverb to avoid abrupt cutoff.' },
        { name: 'EQ Low Gain', description: 'Low-frequency shelf gain from -12dB to +12dB, centered around 200Hz.', tips: 'Boost for warmth and body; cut to reduce rumble or microphone handling noise.' },
        { name: 'EQ Mid Gain', description: 'Mid-frequency peaking gain from -12dB to +12dB, centered around 1kHz.', tips: 'Boost for vocal presence and intelligibility; cut to reduce harshness.' },
        { name: 'EQ High Gain', description: 'High-frequency shelf gain from -12dB to +12dB, centered around 5kHz.', tips: 'Boost for air and brightness; cut to reduce hiss or sibilance.' },
        { name: 'Compressor Threshold', description: 'Level in dBFS at which the compressor begins reducing gain, from -60dB to 0dB.', tips: 'Set threshold slightly below the average peak level of the loudest parts.' },
        { name: 'Compressor Ratio', description: 'Compression ratio from 1:1 (no compression) to 20:1 (heavy limiting).', tips: '4:1 is a versatile starting point for voice and music.' },
        { name: 'Compressor Attack', description: 'Time in milliseconds for the compressor to respond after the threshold is exceeded, from 0ms to 100ms.', tips: 'Fast attack (0–5ms) tames transients; slower attack (10–30ms) preserves punch.' },
        { name: 'Compressor Release', description: 'Time in milliseconds for the compressor to stop compressing after the signal drops below threshold, from 0ms to 500ms.', tips: 'Longer release (100–300ms) sounds more natural on sustained notes.' },
        { name: 'Reverb Room Size', description: 'Simulated room size percentage from 0% (no reverb) to 100% (cathedral-like).', tips: '30–50% simulates a small studio; 70–90% simulates a concert hall.' },
        { name: 'Reverb Damping', description: 'High-frequency absorption percentage from 0% (bright reflections) to 100% (dark/muffled).', tips: 'Higher damping simulates soft furnishings; lower damping simulates hard surfaces.' },
        { name: 'Reverb Wet/Dry', description: 'Blend between dry (original) signal and wet (reverberant) signal, from 0% to 100%.', tips: '20–30% wet mix adds subtle depth without washing out the source.' },
        { name: 'Noise Reduction', description: 'Intensity of noise gate/suppression from 0% (off) to 100% (aggressive). Applied during export.', tips: 'High values may remove quiet details along with noise. Use sparingly.' },
        { name: 'Normalize', description: 'When enabled, the exported audio is normalized to peak at 99.9% of digital full scale.', tips: 'Normalization is non-destructive preview; it is only baked into the exported file.' },
        { name: 'Export Format', description: 'Choose the output file format. WAV variants are universally supported. WebM/Opus, OGG, MP3, and MP4 availability depends on the browser\'s MediaRecorder implementation.', tips: 'WAV 16-bit is the safest choice for maximum compatibility. WebM/Opus offers the best compression-to-quality ratio.' },
      ],
      errors: [
        {
          code: 'IMPORT_FAILED',
          message: 'Failed to decode audio file',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Audio Editor → Area: Import dropzone',
          cause: 'The selected file is not a valid audio format, is corrupted, or uses an unsupported codec.',
          solution: 'Use a supported format (MP3, WAV, OGG, FLAC, M4A, AAC, WEBM) and ensure the file is not corrupted.',
          steps: ['Check file extension', 'Try re-exporting from your DAW', 'Convert to WAV using an external tool'],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Always verify audio files play correctly in a media player before importing.',
        },
        {
          code: 'AUDIO_CONTEXT_FAILED',
          message: 'Web Audio API initialization failed',
          severity: 'critical',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Entire page',
          cause: 'The browser blocked AudioContext creation due to autoplay policy, or the device lacks audio hardware.',
          solution: 'Click anywhere on the page first to unlock audio, then reload.',
          steps: ['Click on the page canvas', 'Check browser permissions', 'Reload the page'],
          relatedCodes: ['BROWSER_NOT_SUPPORTED'],
          prevention: 'Ensure the app is opened via a user gesture (click) rather than automatic redirect.',
        },
        {
          code: 'TRIM_NO_SELECTION',
          message: 'Cannot trim without a selection',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Trim button was clicked but no time region is currently selected on the waveform.',
          solution: 'Click and drag on the waveform to select a region, then click Trim.',
          steps: ['Click on the waveform canvas', 'Drag to define start and end', 'Click the Trim button'],
          relatedCodes: ['SPLIT_NO_SELECTION'],
          prevention: 'Always verify the selection highlight is visible before applying region-based edits.',
        },
        {
          code: 'SPLIT_NO_SELECTION',
          message: 'Cannot split without a selection',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Split button was clicked but no time region is selected.',
          solution: 'Select a region on the waveform first, then click Split.',
          steps: ['Select a region on the waveform', 'Click Split'],
          relatedCodes: ['TRIM_NO_SELECTION'],
          prevention: 'Same as TRIM_NO_SELECTION.',
        },
        {
          code: 'EXPORT_NO_AUDIO',
          message: 'Nothing to export',
          severity: 'warning',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Export button',
          cause: 'The Export button was clicked before any audio file was imported.',
          solution: 'Import an audio file first using the dropzone or New File button.',
          steps: ['Click the upload dropzone', 'Select an audio file', 'Wait for waveform to load'],
          relatedCodes: ['IMPORT_FAILED'],
          prevention: 'The export button is disabled when no audio is loaded; this error may appear from programmatic calls.',
        },
        {
          code: 'EXPORT_FAILED',
          message: 'Export failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export section',
          cause: 'The browser does not support the selected export format, or MediaRecorder failed to capture the audio stream.',
          solution: 'Try a different format (WAV 16-bit is universally supported) or use a different browser.',
          steps: ['Select WAV 16-bit format', 'Click Export again', 'If still failing, reload the page'],
          relatedCodes: ['FORMAT_NOT_SUPPORTED', 'MEDIA_RECORDER_ERROR'],
          prevention: 'Always check the browser\'s supported format list in the format dropdown before exporting.',
        },
        {
          code: 'FORMAT_NOT_SUPPORTED',
          message: 'Selected export format not supported',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export format dropdown',
          cause: 'The browser does not implement the selected MIME type for MediaRecorder (e.g., MP3 on Safari).',
          solution: 'Choose WAV 16-bit PCM, which is guaranteed to work on all browsers.',
          steps: ['Open the Format dropdown', 'Select WAV 16-bit PCM', 'Click Export'],
          relatedCodes: ['EXPORT_FAILED'],
          prevention: 'WAV formats are native and do not rely on MediaRecorder; they are the safest choice.',
        },
        {
          code: 'UNDO_EMPTY',
          message: 'Nothing to undo',
          severity: 'info',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Undo button was clicked but the edit history is empty (only the original imported file exists).',
          solution: 'Make an edit first (trim, fade, reverse, etc.) before using undo.',
          steps: ['Apply an edit', 'Click Undo'],
          relatedCodes: ['REDO_EMPTY'],
          prevention: 'N/A — this is normal user behavior.',
        },
        {
          code: 'REDO_EMPTY',
          message: 'Nothing to redo',
          severity: 'info',
          category: 'B. Settings & Data',
          location: 'Page: Audio Editor → Area: Toolbar',
          cause: 'The Redo button was clicked but there are no undone actions to re-apply.',
          solution: 'Undo an action first, then click Redo.',
          steps: ['Click Undo', 'Click Redo'],
          relatedCodes: ['UNDO_EMPTY'],
          prevention: 'N/A — this is normal user behavior.',
        },
        {
          code: 'PLAYBACK_ERROR',
          message: 'Playback failed',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Playback controls',
          cause: 'The AudioBufferSourceNode failed to start, usually because the AudioContext was suspended or the buffer was garbage-collected.',
          solution: 'Click anywhere on the page to resume the AudioContext, then try playing again.',
          steps: ['Click on the waveform', 'Press Space or click Play'],
          relatedCodes: ['AUDIO_CONTEXT_FAILED'],
          prevention: 'Avoid rapid start/stop clicking; allow at least 100ms between play commands.',
        },
        {
          code: 'WAVEFORM_RENDER_ERROR',
          message: 'Waveform rendering failed',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Waveform canvas',
          cause: 'The canvas context was lost, or the audio buffer is too large to process in a single frame.',
          solution: 'Reload the page. For very large files (>30min), consider trimming before detailed editing.',
          steps: ['Reload the page', 'Import a shorter audio segment'],
          relatedCodes: ['AUDIO_CONTEXT_FAILED'],
          prevention: 'Keep individual editing sessions under 30 minutes of audio. Split long recordings first.',
        },
        {
          code: 'STORAGE_FULL',
          message: 'Browser storage full',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Page: Audio Editor → Area: Export / Download',
          cause: 'The browser disk quota is exceeded, preventing the WAV blob from being created.',
          solution: 'Free up disk space or use a different browser profile.',
          steps: ['Clear browser cache', 'Close other tabs', 'Restart browser'],
          relatedCodes: ['EXPORT_NO_AUDIO'],
          prevention: 'Export shorter clips or lower-bitrate formats when disk space is limited.',
        },
      ],
    },
    {
      id: 'settings-guide',
      title: 'Settings Panel Guide',
      overview: `
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
      buttons: [
        { name: 'Save Style Preset', description: 'Save the current theme, color, and font combination as a custom preset for one-click switching later.' },
        { name: 'Apply Preset', description: 'Select a saved preset from the list and instantly apply all its style settings.' },
        { name: 'Reset All Settings', description: 'Restore all settings across all tabs to defaults. Requires double confirmation to prevent accidental clicks.' },
        { name: 'Restore Defaults', description: 'Restore only the current tab\'s settings to defaults without affecting other tabs.' },
        { name: 'Import Config', description: 'Import a previously exported configuration JSON file, supporting per-tool granular import.' },
        { name: 'Export Config', description: 'Export all current settings as a JSON file for backup or migration.' },
      
        { name: 'Import Config', description: 'Import complete settings from JSON file. Can overwrite all current settings.' },
        { name: 'Export Config', description: 'Export all settings as JSON file for backup or cross-device sync.' },
        { name: 'Restore Defaults', description: 'Restore current category settings to defaults. Does not affect other categories.' },
        { name: 'Search Settings', description: 'Search keywords across all settings to quickly locate needed configuration items.' },
        { name: 'Shortcut List', description: 'Display all available keyboard shortcuts and their corresponding functions.' },
        { name: 'About', description: 'Show OC Maker version info, open-source licenses, credits, and changelog.' },],
      parameters: [
        { name: 'Style Preset', description: 'Quickly switch appearance theme combinations, including default and Paper2Gal-specific styles.' },
        { name: 'Theme Mode', description: 'Light mode is suitable for daytime use; dark mode reduces eye strain at night.' },
        { name: 'Custom Contrast', description: 'Adjust the lightness/darkness contrast of interface elements, from soft to high contrast.' },
        { name: 'Accent Color', description: 'Choose the main interface color, affecting buttons, links, progress bars, and selected states.' },
        { name: 'Font', description: 'Select the interface font family, supporting sans-serif, rounded, serif, monospace, Heiti, Songti, Kaiti, and Western fonts.' },
        { name: 'Interface Language', description: 'Switch the interface display language. Supports 30 languages and takes effect immediately.' },
        { name: 'API Mode', description: '"Built-in Mode" uses the backend-configured Plato service; "Custom API" uses your own OpenAI-compatible endpoint.' },
        { name: 'API Base URL', description: 'The OC Maker backend root address, not the model provider endpoint. Example: https://your-backend.example.com' },
        { name: 'API Key', description: 'The API key for Custom API mode. Used only in the frontend and never sent to the backend.' },
        { name: 'Master Volume', description: 'Global volume multiplier affecting both BGM and SFX. Set to 0 to completely mute.' },
        { name: 'SFX Volume', description: 'Independent volume for interaction sound effects (button clicks, hovers, success/failure alerts, etc.).' },
        { name: 'BGM Volume', description: 'Independent volume for background music, does not affect SFX.' },
        { name: 'Animation Enabled', description: 'Global animation master switch. When off, all UI animations, page transitions, and modal animations are disabled.' },
        { name: 'Animation Speed', description: 'Adjust animation playback speed: slow, normal, or fast.' },
        { name: 'Reduce Animations', description: 'Performance optimization that lowers animation complexity instead of fully disabling, suitable for low-end devices.' },
        { name: 'Disable Glassmorphism', description: 'Remove blur background effects to significantly improve rendering performance on low-end GPUs.' },
        { name: 'Low-Res Preview', description: 'Use lower resolution for image previews and thumbnails to reduce memory usage.' },
        { name: 'Lazy Loading', description: 'Defer loading of images and resources outside the current viewport to reduce initial load time.' },
        { name: 'Disable Particles', description: 'Turn off background particle animation effects on the home page and workflow pages.' },
        { name: 'Aggressive Caching', description: 'Enhance browser resource caching strategy to reduce repeated requests, but may delay fetching latest resources.' },
        { name: 'Image Quality', description: 'Output image quality level: low (fastest), medium (balanced), high (best quality).' },
        { name: 'Max Concurrent', description: 'Maximum number of tasks processed simultaneously. Lower values reduce browser stuttering.' },
        { name: 'Show Tooltips', description: 'Display functional tooltip boxes when hovering over buttons and controls.' },
        { name: 'Confirm Destructive Actions', description: 'Show confirmation dialogs before executing reset, delete, or overwrite operations.' },
        { name: 'Show Keyboard Hints', description: 'Display corresponding keyboard shortcut hints on buttons and controls.' },
        { name: 'Smooth Scroll', description: 'Enable smooth scrolling effects; when off, use instant jumps.' },
        { name: 'Enable Notification Sounds', description: 'Play corresponding sound effects for success, failure, warning, and other system notifications.' },
        { name: 'Auto-Save Interval', description: 'Frequency (in minutes) for automatically backing up settings and data. Set to 0 to disable auto-save.' },
        { name: 'Date Format', description: 'Date/time display format in the interface: ISO standard, locale format, or friendly format.' },
        { name: 'Show Clock', description: 'Display the current time in the bottom-right corner of the status bar.' },
        { name: 'Enable Status Bar', description: 'Show the bottom information bar containing version, language, connection status, etc.' },
        { name: 'High-Contrast Focus', description: 'Enhance the visibility of focus indicators to improve keyboard navigation and accessibility.' },
        { name: 'Error Panel', description: 'Whether to show the draggable error detail panel when errors occur on workflow pages.' },
      
        { name: 'Animation FPS Cap', description: 'Max frame rate for UI animations, range 30~120 FPS. Lower saves battery; higher is smoother.', tips: 'Laptop battery: 30-60, plugged in: 60-120.' },
        { name: 'Scroll Inertia', description: 'List and page scroll inertia strength, range 0~100. 0 = no inertia (immediate stop), 100 = strong inertia.', tips: 'Trackpad users: 70-90, mouse users: 30-50.' },
        { name: 'Tooltip Delay', description: 'Delay before showing tooltip on hover in ms, range 100~2000.', tips: 'Beginners: 500-800, experienced: 200-400.' },
        { name: 'Notification Duration', description: 'Toast notification auto-dismiss duration in seconds, range 2~10.', tips: 'General: 3-4s, important: 6-8s.' },
        { name: 'Max Concurrent Requests', description: 'Maximum simultaneous API requests, range 1~10. Too high may cause rate limiting.', tips: 'OpenAI free tier: 2-3, paid tier: 5-8.' },
        { name: 'Auto-Backup Interval', description: 'Auto-export settings backup interval in days, range 0~30. 0 = disabled.', tips: 'Recommended 7 days; important projects: 1-3 days.' },
        { name: 'Shortcut Conflict Detection', description: 'Auto-detect conflicts with browser or system shortcuts when customizing keyboard shortcuts.', tips: 'Recommended: enable to prevent shortcut failures.' },
        { name: 'DevTools Hotkey', description: 'Custom shortcut to open developer tools. Default: F12.', tips: 'Set to uncommon combination to avoid accidental triggers.' },],
      errors: [
        {
          code: 'SETTINGS_SAVE_FAILED',
          message: 'Settings save failed',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Settings Panel → Any Tab',
          cause: 'Browser localStorage is full, storage is disabled, or data serialization failed.',
          solution: 'Clear browser cache and localStorage, or check privacy mode settings.',
          steps: [
            'Open DevTools → Application → Local Storage and delete old oc-maker keys.',
            'Disable "Block third-party cookies" or similar privacy settings and retry.',
            'If using Private/Incognito mode, switch to normal browsing mode.',
          ],
          relatedCodes: ['LOCAL_STORAGE_VERSION_MISMATCH', 'CONFIG_CORRUPTED'],
        },
        {
          code: 'SETTINGS_IMPORT_INVALID',
          message: 'Imported configuration file format is invalid',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Settings Panel → Import Config',
          cause: 'The imported file is not valid JSON, missing required fields, or version-incompatible.',
          solution: 'Use a configuration JSON file exported by this app, or manually fix the format.',
          steps: [
            'Confirm the file extension is .json and the content is JSON.parse-able.',
            'Check that the file contains top-level keys such as language, style, api, audio, animation, others.',
            'If importing across major versions, reset settings first and then manually reconfigure.',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_INVALID_CONFIG'],
        },
        {
          code: 'SETTINGS_RESET_CANCELLED',
          message: 'User cancelled the reset operation',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Settings Panel → Reset Button',
          cause: 'User clicked "Reset All Settings" but chose Cancel in the double-confirmation dialog.',
          solution: 'No action needed. Current settings remain unchanged.',
        },
        {
          code: 'SETTINGS_PRESET_NOT_FOUND',
          message: 'Selected style preset does not exist or is corrupted',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Settings Panel → Style → Preset',
          cause: 'Preset data was lost, corrupted, or manually edited in localStorage.',
          solution: 'Save a new preset, or restore default style settings.',
          steps: [
            'Manually adjust the desired theme, color, and font first.',
            'Click "Save Style Preset" and enter a new name.',
            'Delete the old corrupted preset if it still appears.',
          ],
        },
      ],
    },
    {
      id: 'audio-guide',
      title: 'Audio System Guide',
      overview: `
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
      buttons: [
        { name: 'Play/Pause BGM', description: 'Toggle background music playback. First playback may require a user click to unlock.' },
        { name: 'SFX Test', description: 'Play a sample of the currently selected SFX preset for preview.' },
        { name: 'BGM Test', description: 'Play a sample clip of the currently selected BGM preset for preview.' },
        { name: 'Upload Custom SFX', description: 'Upload your own audio file as an SFX preset. Supports WAV, MP3, and OGG formats.' },
        { name: 'Upload Custom BGM', description: 'Upload your own audio file as a BGM preset. Supports WAV, MP3, and OGG formats.' },
        { name: 'Remove Custom Audio', description: 'Delete uploaded custom SFX or BGM files and revert to system presets.' },
        { name: 'Reset SFX', description: 'Restore SFX settings to default preset and default volume.' },
        { name: 'Reset BGM', description: 'Restore BGM settings to default preset and default volume.' },
      
        { name: 'Sound Library', description: 'Browse and manage all built-in sound effects by category. Supports search and favorites.' },
        { name: 'Playlists', description: 'Create and manage BGM playlists. Supports drag sorting and loop mode settings.' },
        { name: 'Equalizer', description: 'Open 10-band graphic equalizer. Customize gain values for each frequency band.' },
        { name: 'Recording', description: 'Use microphone to record audio for voice cloning or adding custom sound effects.' },
        { name: 'Visualizer', description: 'Enable audio waveform visualization showing spectrum of currently playing audio.' },
        { name: 'Device Detection', description: 'Detect all available audio input/output devices in the system and show their status.' },
        { name: 'Spatial Audio', description: 'Enable virtual surround sound simulating 3D spatial sound source positioning (requires headphones).' },],
      parameters: [
        { name: 'Master Volume', description: 'Global volume multiplier (0%~100%), affecting both SFX and BGM.' },
        { name: 'SFX Volume', description: 'Independent volume for interaction sound effects including button clicks, hovers, and success/failure alerts.' },
        { name: 'BGM Volume', description: 'Independent volume for background music, does not interfere with SFX volume.' },
        { name: 'SFX Preset', description: '15+ procedural sound effect styles: Classic, Electronic, Retro, Xylophone, Bell, Space, Drum, Piano, Synthwave, Chiptune, Strings, Wind, Jazz, Percussion, Ambient, Sci-Fi, Cartoon, Horror, Nature, Mechanical.' },
        { name: 'BGM Preset', description: '20+ background music styles: Orchestral, Ambient, Electronic, Piano, Synthwave, Nature, Jazz, Meditation, Cyber, LoFi, Rock, Blues, Folk, Reggae, Funk, Soul, Gospel, Country, Celtic, Oriental, Tribal, Space, Underwater, Rain, Windchime, Fireplace, Night, Sunrise, Dreamy, Energetic, Battle, Adventure, Mystery, Romantic, Nostalgic, Hopeful, Epic, Chill, Study, Focus.' },
        { name: 'SFX Pitch', description: 'Base pitch offset for sound effects, adjustable in semitones.' },
        { name: 'SFX Duration', description: 'Duration of the sound effect in milliseconds, affecting the decay envelope length.' },
        { name: 'SFX Filter', description: 'Low-pass / high-pass / band-pass filter cutoff frequency, shaping the brightness of the tone.' },
        { name: 'SFX Detune', description: 'Microtonal offset for sound effects, used to create dissonance or thickness.' },
        { name: 'SFX Reverb', description: 'Add spatial reverb to sound effects, simulating different acoustic environments.' },
        { name: 'BGM Pitch', description: 'Overall pitch offset for background music without affecting playback speed.' },
        { name: 'BGM Tempo', description: 'Background music playback speed multiplier (0.5x~2.0x), also affects pitch.' },
        { name: 'BGM Stereo Width', description: 'Expand or narrow the BGM stereo soundstage. 0% is mono, 200% is ultra-wide.' },
      
        { name: 'Master Volume', description: 'Global volume for all audio, range 0~100.', tips: 'Adjust based on environment: quiet 30-50, noisy 70-100.' },
        { name: 'SFX Volume', description: 'UI interaction sound volume, range 0~100. Independent of master and BGM volume.', tips: 'Recommended 60-80% of master volume to avoid harsh sounds.' },
        { name: 'BGM Volume', description: 'Background music volume, range 0~100. Independent of master and SFX volume.', tips: 'Recommended 40-60% of master volume as background.' },
        { name: 'Voice Ducking Strength', description: 'BGM auto-reduce amount when voice detected in dB, range 0~20. 0 = no ducking.', tips: 'Audiobooks/dubbing: 10-15dB, background music: 5-10dB.' },
        { name: 'SFX Pitch Randomization', description: 'Add tiny pitch variation to consecutive identical sounds, range 0~100. Adds naturalness.', tips: 'Typing sounds: 20-30, notification sounds: 0-10.' },
        { name: 'Spatial Audio Width', description: 'Virtual surround sound field width, range 0~100. Higher = stronger source positioning.', tips: 'Music appreciation: 60-80, gaming/movies: 80-100.' },
        { name: 'Recording Sample Rate', description: 'Microphone recording sample rate: 22050Hz, 44100Hz, 48000Hz.', tips: 'Voice: 44100Hz sufficient, music: 48000Hz.' },
        { name: 'Recording Bit Depth', description: 'Microphone recording bit depth: 16-bit, 24-bit.', tips: 'General: 16-bit, professional: 24-bit.' },
        { name: 'Audio Buffer Size', description: 'Audio playback buffer size in samples: 256, 512, 1024, 2048, 4096.', tips: 'Low latency: 256-512, stability priority: 1024-2048.' },
        { name: 'Equalizer Preset', description: 'Quick-load equalizer presets: flat, bass boost, vocal boost, classical, rock, electronic.', tips: 'Switch based on current content type.' },],
      errors: [
        {
          code: 'AUDIO_CONTEXT_SUSPENDED',
          message: 'Audio suspended by browser autoplay policy',
          severity: 'info',
          category: 'F. Browser & Performance',
          location: 'Any Page → Audio Playback',
          cause: 'Modern browser autoplay policies require user interaction before starting audio. The AudioContext is in suspended state after page load.',
          solution: 'Click anywhere on the page or any button to resume audio playback.',
          steps: [
            'Click any button or blank area on the page.',
            'If BGM still does not play, check the browser address bar for a mute icon.',
            'iOS Safari requires additional user gestures; try clicking the "Play BGM" button.',
          ],
          prevention: 'The app includes attachAudioResumeHandler which automatically resumes AudioContext on first user interaction.',
        },
        {
          code: 'AUDIO_DECODE_FAILED',
          message: 'Custom audio file decoding failed',
          severity: 'error',
          category: 'C. Files & Upload',
          location: 'Settings Panel → Audio → Custom Upload',
          cause: 'The uploaded file is not a valid audio format, uses an unsupported codec, or is corrupted.',
          solution: 'Re-upload using a standard-encoded WAV, MP3, or OGG file.',
          steps: [
            'Confirm the file extension is .wav, .mp3, or .ogg.',
            'Test the file in your system media player.',
            'Try re-exporting as 44100Hz stereo MP3 using audio editing software.',
            'File size should not exceed 5MB.',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'IMAGE_DECODE_FAILED'],
        },
        {
          code: 'AUDIO_FILE_TOO_LARGE',
          message: 'Uploaded audio file is too large',
          severity: 'warning',
          category: 'C. Files & Upload',
          location: 'Settings Panel → Audio → Custom Upload',
          cause: 'The audio file exceeds the browser or app processing limit, causing decoding and storage issues.',
          solution: 'Compress the audio file or trim it to a shorter clip.',
          steps: [
            'Use audio editing software to compress the file below 5MB.',
            'For BGM, recommended duration is 30~120 seconds with loop playback.',
            'Lower the sample rate to 44100Hz or 22050Hz.',
            'Use VBR MP3 encoding for smaller file size.',
          ],
        },
        {
          code: 'AUDIO_AUTOPLAY_BLOCKED',
          message: 'Browser blocked autoplay',
          severity: 'info',
          category: 'F. Browser & Performance',
          location: 'Home or Workflow Page → BGM Autoplay',
          cause: 'Browser autoplay policy prohibits audio playback without user interaction, especially for audible media.',
          solution: 'Audio will automatically resume after user interaction; no extra action needed.',
          steps: [
            'Click any button or area on the page.',
            'Check browser settings to allow autoplay media for the current site.',
            'Chrome users can click the site icon in the address bar → Site Settings → Sound → Allow.',
          ],
          prevention: 'The app delays audio initialization until after user interaction, but browser policies may still intercept.',
        },
        {
          code: 'AUDIO_WEB_AUDIO_UNSUPPORTED',
          message: 'Browser does not support Web Audio API',
          severity: 'error',
          category: 'F. Browser & Performance',
          location: 'Any Page',
          cause: 'The current browser version is too old, or is in a restricted mode (e.g., some enterprise security browser lockdown modes).',
          solution: 'Upgrade to a modern browser (Chrome 90+, Firefox 90+, Edge 90+, Safari 15+).',
          steps: [
            'Confirm the browser is not IE or legacy Edge (non-Chromium).',
            'Check if the browser is in "Safe Mode" or "Incognito with strict protection".',
            'Try opening the app in a standard window (not Incognito).',
          ],
          relatedCodes: ['BROWSER_MEMORY_EXHAUSTED'],
        },
      ],
    },
    {
      id: 'ui-ux-guide',
      title: 'Interface & Experience Guide',
      overview: `
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
      buttons: [
        { name: 'Toggle Theme', description: 'Switch between light and dark modes. All page elements transition smoothly.' },
        { name: 'Apply Style Preset', description: 'One-click apply a saved complete style combination (theme + color + font).' },
        { name: 'Change Font', description: 'Choose from 11 interface fonts. Switch takes effect immediately across all text.' },
        { name: 'Enable Animations', description: 'Enable all UI animation effects including fade-in, hover, page transitions, and modal animations.' },
        { name: 'Disable Animations', description: 'Disable all animations. Interface changes become instant switches, suitable for efficiency or low-end devices.' },
        { name: 'Reset Animations', description: 'Restore animation settings to defaults (enabled, normal speed, all effects on).' },
        { name: 'Enable Performance Mode', description: 'One-click enable all performance optimization options (reduce animations, disable glassmorphism, low-res preview, disable particles).' },
      
        { name: 'Component Library', description: 'Browse all reusable UI components with usage examples and code snippets.' },
        { name: 'Theme Editor', description: 'Visually edit custom theme colors, fonts, spacing and other design tokens.' },
        { name: 'Layout Preview', description: 'Preview page layouts at different screen sizes. Supports custom breakpoints.' },
        { name: 'Animation Preview', description: 'View live demos of all available animation effects and configuration parameters.' },
        { name: 'Accessibility Check', description: 'Run automated accessibility tests checking color contrast, focus order, ARIA labels.' },
        { name: 'Design Specs', description: 'View complete design system documentation including principles, usage guidelines, best practices.' },],
      parameters: [
        { name: 'Theme Mode', description: 'Light mode is suitable for daytime and bright environments; dark mode reduces eye strain and OLED power consumption at night.' },
        { name: 'Accent Color', description: 'Primary interface color affecting buttons, progress bars, selected states, links, icons, and other highlighted elements. Options: red, orange, yellow, green, cyan, blue, purple, pink.' },
        { name: 'Custom Contrast', description: 'Adjust interface lightness/darkness contrast from soft (low contrast) to strong (high contrast) in 5 levels.' },
        { name: 'Font Family', description: '11 interface fonts: Sans-serif (default), Rounded, Serif, Monospace, Heiti, Songti, Kaiti, Georgia, Times, Verdana, Fira Code.' },
        { name: 'Animation Enabled', description: 'Global animation master switch. When off, all transitions become instant.' },
        { name: 'Animation Speed', description: 'Slow (1.5x duration), Normal (1x), Fast (0.5x).' },
        { name: 'UI Fade-In', description: 'Fade-in animation effect when pages load and elements first appear.' },
        { name: 'Button Hover Animation', description: 'Scale/glow feedback effect when hovering over buttons and cards.' },
        { name: 'Page Transitions', description: 'Slide/fade transition animation when switching between tool pages.' },
        { name: 'Modal Transitions', description: 'Scale/fade animation when modals and settings panels open/close.' },
        { name: 'Reduce Animations', description: 'Keep necessary transitions but lower complexity, suitable for users who dislike excessive motion but don\'t want everything off.' },
        { name: 'Disable Glassmorphism', description: 'Remove backdrop-filter blur effects from panels and cards to significantly improve rendering performance on low-end GPUs.' },
        { name: 'Low-Res Preview', description: 'Use 0.5x resolution for image previews to reduce memory usage and rendering pressure.' },
        { name: 'Lazy Loading', description: 'Defer loading of images and resources outside the viewport to reduce initial page load.' },
        { name: 'Disable Particles', description: 'Turn off Canvas particle background animations on the home page and workflow pages.' },
        { name: 'Aggressive Caching', description: 'Extend static resource cache duration to reduce network requests, but may delay receiving updates.' },
        { name: 'Image Quality', description: 'Output image quality: low (fastest, suitable for preview), medium (balanced), high (best quality).' },
        { name: 'Max Concurrent', description: 'Maximum number of simultaneous tasks (1~8). Lower values reduce main thread stuttering.' },
        { name: 'High-Contrast Focus', description: 'Add high-contrast borders to keyboard focus indicators to improve keyboard navigation and accessibility.' },
      
        { name: 'Theme Hue', description: 'Custom theme primary hue, range 0~360 degrees. Based on HSL color wheel.', tips: '0 = red, 120 = green, 240 = blue, 300 = purple.' },
        { name: 'Border Radius', description: 'Global UI element border radius base value, range 0~24px. Affects buttons, cards, inputs.', tips: 'Modern: 8-12px, flat: 0-4px, skeuomorphic: 16-24px.' },
        { name: 'Shadow Intensity', description: 'Global shadow blur and spread, range 0~100. 0 = no shadow, 100 = maximum shadow.', tips: 'Light mode: 30-50, dark mode: 20-40.' },
        { name: 'Layout Grid Display', description: 'Show auxiliary 4px/8px grid lines on pages to help designers check alignment.', tips: 'Enable for development/debugging, disable for daily use.' },
        { name: 'Focus Highlight Color', description: 'Keyboard navigation focus indicator color. Customizable to match theme.', tips: 'Ensure sufficient contrast with theme primary color.' },
        { name: 'Minimum Click Area', description: 'Minimum touch size for interactive elements in px, range 24~64. WCAG 2.1 requires at least 44x44px.', tips: 'Desktop: 32-40px, mobile: 44-48px.' },
        { name: 'Animation Easing', description: 'UI animation easing curve: linear, ease, ease-in, ease-out, ease-in-out, spring.', tips: 'General transitions: ease-in-out, popups: spring, loading: linear.' },
        { name: 'Page Transition Duration', description: 'Page switch animation duration in ms, range 100~1000.', tips: 'Speed priority: 150-200ms, quality: 300-500ms.' },
        { name: 'Skeleton Animation', description: 'Skeleton screen shimmer animation speed in ms, range 0~2000. 0 = static skeleton.', tips: 'Recommended 1200-1500ms; too fast looks anxious, too slow looks frozen.' },],
      errors: [
        {
          code: 'THEME_CSS_LOAD_FAILED',
          message: 'Theme CSS variables failed to load',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Settings Panel → Style',
          cause: 'Custom theme values could not be parsed by the browser, possibly due to invalid color format or CSS variable value overflow.',
          solution: 'Reset style settings or select a system preset.',
          steps: [
            'Click "Restore Defaults" to reset the current tab\'s styles.',
            'Check that the custom accent color is a valid HEX or RGB value.',
            'If the issue persists, click "Reset All Settings".',
          ],
        },
        {
          code: 'FONT_LOAD_FAILED',
          message: 'Font loading failed',
          severity: 'warning',
          category: 'F. Browser & Performance',
          location: 'Settings Panel → Style → Font',
          cause: 'The selected font is not available on the current system, network font load timed out, or the font file was blocked by browser security policy.',
          solution: 'Choose a system-installed font, or check network connection and retry.',
          steps: [
            'Prefer generic font families like "Sans-serif" or "Serif".',
            'Chinese fonts (Heiti, Songti, Kaiti) require the corresponding font library to be installed on the system.',
            'Check browser DevTools Console for font loading errors.',
          ],
        },
        {
          code: 'ANIMATION_DISABLE_FAILED',
          message: 'Animation disable did not fully take effect',
          severity: 'info',
          category: 'F. Browser & Performance',
          location: 'Settings Panel → Animation',
          cause: 'Some third-party components or dynamically injected styles may not be controlled by the global animation switch.',
          solution: 'Refresh the page to ensure all styles are recalculated.',
          steps: [
            'Refresh the page (F5 or Ctrl+R) after disabling animations.',
            'If animations persist, check if a browser extension is injecting custom CSS.',
          ],
        },
        {
          code: 'PERFORMANCE_MODE_CONFLICT',
          message: 'Performance mode conflicts with animation settings',
          severity: 'info',
          category: 'F. Browser & Performance',
          location: 'Settings Panel → Performance / Animation',
          cause: 'Performance mode\'s "Reduce Animations" is enabled simultaneously with certain animation effect switches in the Animation tab.',
          solution: 'Performance mode takes priority. Manually disable conflicting animation options or turn off performance mode.',
          steps: [
            'Understand that performance mode automatically overrides animation settings.',
            'For fine-grained control, disable performance mode and manually adjust each animation option.',
          ],
        },
      ],
    },
  ],
  errorDictionary: [
    {
      id: 'A',
      name: 'A. API & Network',
      description: 'API Key issues, network disconnection, backend unavailability, request timeout, rate limiting, and other external dependency errors',
      errors: [
        {
          code: 'API_BASE_INVALID',
          message: 'API Base URL format is invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Settings → API tab',
          cause: 'URL format error or unreachable.',
          solution: 'Check the URL format.',
          steps: [
            'Confirm the URL starts with http:// or https://',
            'Confirm there is no extra path at the end (such as /api/workflows)',
            'Ensure the URL can be accessed normally in the browser',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE'],
          prevention: 'When configuring the API address, only enter the backend service\'s root domain and port; do not append any API paths.',
        },
        {
          code: 'API_KEY_EXPIRED',
          message: 'API Key expired or invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'The configured API Key has expired, been revoked, or its quota has been exhausted.',
          solution: 'Replace with a new valid API Key.',
          steps: [
            'Open "Settings → API"',
            'Delete the old Key and enter a new valid Key',
            'Save settings',
            'Retry the operation',
          ],
          relatedCodes: ['API_KEY_MISSING'],
          prevention: 'Regularly check the API Key\'s validity period and remaining quota; quickly verify whether the Key is valid through real-time testing in LLM Hub.',
        },
        {
          code: 'API_KEY_MISSING',
          message: 'API Key not configured',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'The user has not configured an API Key in Settings → API, or the Key has been cleared.',
          solution: 'Configure a valid API Key in the Settings panel.',
          steps: [
            'Open "Settings → API"',
            'Enter your valid Key in the API Key input field',
            'Save settings',
            'Return to the corresponding tool page and retry the operation',
          ],
          relatedCodes: ['API_KEY_EXPIRED'],
          prevention: 'Before using any online tool for the first time, be sure to configure a valid API Key in "Settings → API".',
        },
        {
          code: 'API_RATE_LIMIT',
          message: 'API Rate Limit triggered',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'Request frequency is too high, exceeding the service provider\'s limit.',
          solution: 'Slow down request frequency or switch providers.',
          steps: [
            'Reduce request frequency',
            'Wait a while and retry',
            'Consider switching to a provider with higher rate limits',
          ],
          relatedCodes: ['429_TOO_MANY_REQUESTS'],
        },
        {
          code: 'API_TIMEOUT',
          message: 'API request timeout',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'Request processing time exceeds the set timeout.',
          solution: 'Shorten content length, increase timeout, or retry.',
          steps: [
            'Reduce request content (shorten text, reduce image size)',
            'Increase timeout setting (Settings → API → Timeout)',
            'Retry the operation',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'BACKEND_UNAVAILABLE'],
          prevention: 'When processing large images or large amounts of text, reduce parameter scale (image size, Max Tokens, etc.) in advance; increase timeout settings when the network is unstable.',
        },
        {
          code: 'BACKEND_UNAVAILABLE',
          message: 'Backend unavailable',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'Backend service is not started, has crashed, or is not configured correctly.',
          solution: 'Check backend service status.',
          steps: [
            'Check API Base URL configuration',
            'Confirm backend service is running',
            'Check backend logs for startup errors',
            'Restart the backend service and retry',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', '502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'When deploying locally, ensure the backend process is started (npm start); when using a remote service, confirm the URL is configured correctly.',
        },
        {
          code: 'HOSTED_API_REQUIRED',
          message: 'Static hosting requires custom API configuration',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Paper2Gal / Prompt Suite / others',
          cause: 'Deployed to a pure static hosting environment (e.g., GitHub Pages), cannot directly access local backend.',
          solution: 'Configure a remote custom API address.',
          steps: [
            'Open "Settings → API"',
            'Switch "Interface Mode" to "Custom API"',
            'Enter the backend root address in "API Address"',
            'Enter the API Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_MISSING', 'BACKEND_UNAVAILABLE'],
          prevention: 'Before using Paper2Gal in a static hosting environment, be sure to deploy the backend service and configure the correct API address and Key.',
        },
        {
          code: 'NETWORK_DISCONNECTED',
          message: 'Network disconnected',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'Device is not connected to the network, or network connection is interrupted.',
          solution: 'Restore network connection.',
          steps: [
            'Check device network connection status',
            'Try accessing other websites to confirm network is normal',
            'Check proxy/VPN settings',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_TIMEOUT'],
          prevention: 'Before using online tools, confirm the network connection is normal; avoid performing long workflows in environments with large network fluctuations.',
        },
        {
          code: 'NETWORK_TIMEOUT',
          message: 'Network request timeout',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Global / All pages',
          cause: 'Network connection is unstable or the server response is too slow.',
          solution: 'Check network or retry later.',
          steps: [
            'Check device network connection',
            'Try accessing other websites',
            'If using a proxy/VPN, check settings',
            'Retry later',
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'API_TIMEOUT'],
          prevention: 'Use a stable network; avoid long operations when network is poor.',
        },
      {
        code: 'API_DNS_RESOLUTION_FAILED',
        message: 'DNS resolution failed, unable to connect to API server',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Domain name resolution failed, possibly due to DNS misconfiguration, non-existent domain, or network disconnection.',
        solution: 'Check domain spelling, change DNS server, or contact domain administrator.',
        steps: [
          'Confirm domain spelling is correct',
          'Try accessing directly via IP address',
          'Change DNS server to 8.8.8.8 or 1.1.1.1',
          'Check local network connection',
        ],
        prevention: 'Use reliable DNS services and avoid unstable domains.',
      },
      {
        code: 'API_SSL_CERTIFICATE_INVALID',
        message: 'SSL certificate invalid or expired',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server SSL certificate is expired, self-signed, or domain name mismatch.',
        solution: 'Update server certificate, or temporarily allow insecure connections (development only).',
        steps: [
          'Check certificate validity period',
          'Confirm certificate domain matches access domain',
          'Re-apply and deploy certificate',
          'Development environments can temporarily bypass certificate verification',
        ],
        prevention: 'Use automated certificate management tools (e.g., certbot) for regular updates.',
      },
      {
        code: 'API_CONNECTION_RESET',
        message: 'Connection reset by server',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server actively closed the connection, possibly due to firewall, security group, or server overload.',
        solution: 'Check server firewall rules, confirm port is open, reduce request frequency.',
        steps: [
          'Check server firewall and security group rules',
          'Confirm target port is open',
          'Check server load status',
          'Reduce concurrent request count',
        ],
        prevention: 'Configure reasonable connection pools and timeout strategies to avoid sudden high concurrency.',
      },
      {
        code: 'API_PROXY_AUTHENTICATION_REQUIRED',
        message: 'Proxy server requires authentication',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Network accesses through a proxy server but lacks proxy authentication information.',
        solution: 'Configure proxy authentication in requests, or change network environment.',
        steps: [
          'Check system proxy settings',
          'Confirm proxy username and password are correct',
          'Configure proxy authentication in app settings',
          'Try direct connection to bypass proxy',
        ],
        prevention: 'Pre-configure proxy authentication in enterprise networks.',
      },
      {
        code: 'API_IPV6_NOT_SUPPORTED',
        message: 'Current network environment does not support IPv6',
        severity: 'warning',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server or client only supports IPv4/IPv6 single stack, and the network environment does not match.',
        solution: 'Switch network protocol stack, or use dual-stack server.',
        steps: [
          'Check IP protocol support of network interfaces',
          'Try disabling IPv6 to force IPv4',
          'Contact network administrator to confirm protocol support',
          'Change to a network environment that supports dual-stack',
        ],
        prevention: 'Ensure servers support IPv4/IPv6 dual-stack during deployment.',
      },
      {
        code: 'API_WEBSOCKET_UPGRADE_FAILED',
        message: 'WebSocket upgrade failed',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server does not support WebSocket, or intermediate proxy blocked protocol upgrade.',
        solution: 'Confirm server supports WebSocket, check proxy configuration.',
        steps: [
          'Confirm server-side WebSocket support is implemented',
          'Check if reverse proxy supports WebSocket forwarding',
          'Confirm request header contains Upgrade: websocket',
          'Try using alternative transport protocols',
        ],
        prevention: 'Use servers and reverse proxy configurations that support WebSocket.',
      },
      {
        code: 'API_CHUNKED_ENCODING_ERROR',
        message: 'Chunked transfer encoding error',
        severity: 'error',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server or intermediate proxy encountered format errors during chunked transfer.',
        solution: 'Disable chunked transfer, or check intermediate proxy configuration.',
        steps: [
          'Check Transfer-Encoding in response headers',
          'Try disabling chunked transfer',
          'Check reverse proxy chunk support',
          'Check server logs for encoding errors',
        ],
        prevention: 'Ensure all intermediate nodes support HTTP/1.1 chunked transfer.',
      },
      {
        code: 'API_CONTENT_LENGTH_MISMATCH',
        message: 'Content-Length does not match actual body length',
        severity: 'warning',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Content-Length header returned by server does not match actual response body length.',
        solution: 'Ignore Content-Length header, or use Transfer-Encoding: chunked.',
        steps: [
          'Check if server correctly calculates content length',
          'Confirm intermediate proxy did not modify response body',
          'Try using chunked transfer',
          'Update server framework to latest version',
        ],
        prevention: 'Use reliable web frameworks and avoid manually setting Content-Length.',
      },
      {
        code: 'API_HTTPS_ONLY_REQUIRED',
        message: 'Server enforces HTTPS only',
        severity: 'warning',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server is configured with HSTS or only allows HTTPS access.',
        solution: 'Use HTTPS protocol, or disable forced HTTPS configuration on server.',
        steps: [
          'Change http:// to https://',
          'Check server HSTS configuration',
          'Confirm SSL certificate is properly installed',
          'Development environments can temporarily disable forced HTTPS',
        ],
        prevention: 'Always use HTTPS in production, use self-signed certificates in development.',
      },
      {
        code: 'API_RESPONSE_COMPRESSION_FAILED',
        message: 'Response decompression failed',
        severity: 'warning',
        category: 'A. API & Network',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server returned gzip/br compressed content, but client cannot decompress properly.',
        solution: 'Disable compression, or ensure client supports corresponding compression algorithm.',
        steps: [
          'Check Accept-Encoding request header',
          'Confirm client supports gzip/brotli',
          'Try disabling compression and retry',
          'Update client decompression library',
        ],
        prevention: 'Ensure both client and server support common compression algorithms.',
      },
      
        {
          code: 'DNS_RESOLUTION_FAILED',
          message: 'DNS resolution failed, unable to connect to server',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Domain name resolution failed. Possible causes: DNS server failure, domain does not exist, or local DNS cache corruption.',
          solution: 'Check domain spelling, flush DNS cache, or switch to a public DNS server.',
          steps: [
            'Check if the domain name is spelled correctly',
            'Run ipconfig /flushdns or sudo dscacheutil -flushcache',
            'Switch to a public DNS like 8.8.8.8 or 1.1.1.1',
            'Check if the hosts file has been tampered with',
            'Restart network equipment'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'TLS_CERT_EXPIRED',
          message: 'TLS certificate has expired, connection refused',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server SSL/TLS certificate has expired, or the local system time is incorrect causing certificate validation to fail.',
          solution: 'Contact the administrator to update the certificate, or check the local system time.',
          steps: [
            'Check if the local system time is correct',
            'Try accessing the API address directly in a browser to check certificate info',
            'Contact the service provider to update the certificate',
            'Temporarily bypass: disable certificate verification in development (not recommended for production)'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'TLS_CERT_UNTRUSTED',
          message: 'TLS certificate is not trusted',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server uses a self-signed certificate, intermediate certificate is missing, or the certificate chain is incomplete.',
          solution: 'Install the root certificate, or contact the administrator to fix the certificate chain.',
          steps: [
            'Download and install the server root certificate',
            'Check if the certificate chain is complete',
            'Ensure the system CA store is up to date',
            'If using a self-signed certificate, add it to the trust store'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'TLS_HANDSHAKE_FAILED',
          message: 'TLS handshake failed',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The TLS version or cipher suites supported by the client and server are incompatible.',
          solution: 'Upgrade the client TLS version, or contact the server administrator to enable compatible cipher suites.',
          steps: [
            'Check the TLS versions supported by the client (at least 1.2)',
            'Use openssl s_client to test the handshake',
            'Contact the administrator to enable TLS 1.2/1.3',
            'Update the operating system and browser'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'PROXY_AUTHENTICATION_REQUIRED',
          message: 'Proxy server requires authentication',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'When accessing the internet through a proxy server, the proxy requires a username and password.',
          solution: 'Configure proxy authentication information in system or application settings.',
          steps: [
            'Check system proxy settings',
            'Configure proxy username and password in application settings',
            'Confirm the proxy server address and port are correct',
            'Contact the network administrator for proxy credentials'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'PROXY_CONNECTION_REFUSED',
          message: 'Proxy server connection refused',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The configured proxy server address is incorrect or the proxy service is not running.',
          solution: 'Check proxy settings and confirm the proxy server is available.',
          steps: [
            'Confirm the proxy server address and port are correct',
            'Test direct connection (bypass proxy)',
            'Check if the proxy service is running',
            'Contact the network administrator'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'WEBSOCKET_CONNECTION_FAILED',
          message: 'WebSocket connection failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'WebSocket server is not running, firewall is blocking the WebSocket port, or the URL path is incorrect.',
          solution: 'Check the WebSocket server status and confirm firewall rules.',
          steps: [
            'Check if the WebSocket URL is correct',
            'Confirm the server-side WebSocket service is running',
            'Check if the firewall is blocking ws/wss ports',
            'Check browser console network logs'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'WEBSOCKET_CLOSED_UNEXPECTEDLY',
          message: 'WebSocket closed unexpectedly',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Network instability, server restart, or heartbeat timeout caused the connection to drop.',
          solution: 'Implement automatic reconnection and increase the heartbeat interval.',
          steps: [
            'Check network stability',
            'Implement exponential backoff reconnection logic',
            'Increase heartbeat packet frequency',
            'Check server logs for disconnect reasons'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'CDN_RESOURCE_UNAVAILABLE',
          message: 'CDN resource unavailable',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'CDN node failure, resource deleted, or cache expired.',
          solution: 'Refresh CDN cache or switch to a backup CDN source.',
          steps: [
            'Try accessing the origin directly to confirm the resource exists',
            'Refresh the CDN cache',
            'Check if the CDN configuration is correct',
            'Switch to a backup CDN domain'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'CDN_CACHE_STALE',
          message: 'CDN returned stale cached content',
          severity: 'info',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'CDN cache was not refreshed in time, causing the client to receive an old version of the resource.',
          solution: 'Force refresh CDN cache or add a version number parameter.',
          steps: [
            'Add ?v=timestamp to the URL to force refresh',
            'Contact the CDN provider to refresh the cache',
            'Check the cache TTL configuration',
            'Use filename hashing for long-term caching'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'LOAD_BALANCER_UNAVAILABLE',
          message: 'Load balancer has no available backends',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'All backend servers are unavailable or health checks have failed.',
          solution: 'Check backend server status, repair or scale out.',
          steps: [
            'Check the health status of all backend servers',
            'Review load balancer logs',
            'Restart failed backend instances',
            'Temporarily reduce load or enable degradation strategy'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'IPv6_CONNECTIVITY_ISSUE',
          message: 'IPv6 connectivity issue',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The client prefers IPv6 but the network does not support it, causing connection timeout before fallback to IPv4.',
          solution: 'Disable IPv6 or fix IPv6 network configuration.',
          steps: [
            'Test IPv6 connectivity (test-ipv6.com)',
            'Temporarily disable IPv6 in system settings',
            'Check router IPv6 configuration',
            'Contact ISP to confirm IPv6 support'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'FIREWALL_BLOCKED_REQUEST',
          message: 'Firewall blocked the request',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Enterprise firewall, ISP blocking, or regional network restrictions prevented the outbound request.',
          solution: 'Use a VPN, switch networks, or contact the network administrator.',
          steps: [
            'Test if other devices on the same network can access',
            'Try using a VPN or proxy',
            'Contact the network administrator to add a whitelist',
            'Check if the request triggered WAF rules'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'MAN_IN_THE_MIDDLE_DETECTED',
          message: 'Man-in-the-middle attack detected',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The HTTPS connection was intercepted and tampered with by an intermediate device (e.g., corporate proxy, malware).',
          solution: 'Stop operations immediately and check the security of the network environment.',
          steps: [
            'Do not continue operations to avoid leaking sensitive data',
            'Check if unknown certificates are installed on the system',
            'Run antivirus software',
            'Switch to a secure network environment (e.g., mobile hotspot)',
            'Contact the security team'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'COOKIE_BLOCKED_THIRD_PARTY',
          message: 'Third-party cookie blocked',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Browser privacy settings or extensions blocked third-party cookies, affecting cross-domain authentication.',
          solution: 'Adjust browser privacy settings or use SameSite=None; Secure.',
          steps: [
            'Check if the browser has "Block third-party cookies" enabled',
            'Add a website exception in browser settings',
            'Set Cookie SameSite attribute to None with Secure on the backend',
            'Consider using Token instead of Cookie'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'CORS_PREFLIGHT_FAILED',
          message: 'CORS preflight request failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The OPTIONS preflight request did not return the correct Access-Control-Allow headers.',
          solution: 'Add OPTIONS route on the backend and return correct CORS headers.',
          steps: [
            'Check if the backend correctly handles OPTIONS requests',
            'Confirm Access-Control-Allow-Methods includes the actual method used',
            'Confirm Access-Control-Allow-Headers includes custom headers',
            'Check Access-Control-Max-Age configuration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'CORS_CREDENTIALS_NOT_ALLOWED',
          message: 'CORS does not allow credentials',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The frontend set withCredentials=true but the backend did not return Access-Control-Allow-Credentials: true.',
          solution: 'Add Access-Control-Allow-Credentials: true header on the backend.',
          steps: [
            'Set Access-Control-Allow-Credentials: true on the backend',
            'Confirm Access-Control-Allow-Origin is not wildcard *',
            'Check if the frontend correctly set the credentials option',
            'Test the request without credentials'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_VERSION_DEPRECATED',
          message: 'API version is deprecated',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API version used has been marked as deprecated and will be removed in the future.',
          solution: 'Migrate to the latest API version.',
          steps: [
            'Check the API documentation for version migration guide',
            'Update the request URL to the new version',
            'Test the new version API response format differences',
            'Update related parsing code'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_VERSION_REMOVED',
          message: 'API version has been removed',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API version used has been completely removed and is no longer available.',
          solution: 'Urgently migrate to a supported API version.',
          steps: [
            'Check the API provider version support timeline',
            'Upgrade to the latest stable version',
            'Test all affected features comprehensively',
            'Update client code and documentation'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_ENDPOINT_CHANGED',
          message: 'API endpoint address has changed',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The service provider changed the API endpoint domain or path structure.',
          solution: 'Update the API Base URL and endpoint paths.',
          steps: [
            'Check the API provider official announcement',
            'Update the API Base URL in configuration',
            'Check if all endpoint paths need adjustment',
            'Test all API calls'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SCHEMA_CHANGED',
          message: 'API response structure changed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API returned data structure does not match expectations, possibly due to a backend upgrade causing field changes.',
          solution: 'Update frontend parsing logic to adapt to the new response structure.',
          steps: [
            'Check the API changelog',
            'Update TypeScript type definitions',
            'Add field existence checks to avoid undefined access',
            'Use optional chaining ?. for safe field access'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_RESPONSE_MALFORMED_JSON',
          message: 'API returned malformed JSON',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server returned non-JSON content (e.g., HTML error page, BOM header, truncated response).',
          solution: 'Check backend logs and confirm the response format is correct.',
          steps: [
            'Check the raw response content in browser network panel',
            'Check if the backend threw an uncaught exception',
            'Confirm the response header Content-Type is application/json',
            'Check if a proxy modified the response content'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_RESPONSE_TOO_LARGE',
          message: 'API response body too large',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API returned an oversized response body, exceeding frontend or proxy reception limits.',
          solution: 'Request paginated data or use streaming transmission.',
          steps: [
            'Check the response body size',
            'Implement paginated request logic',
            'Use Range requests for chunked retrieval',
            'Enable compression (gzip/brotli) for transmission'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_REQUEST_TOO_LARGE',
          message: 'API request body too large',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The uploaded data (e.g., image Base64, long text) exceeded the server reception limit.',
          solution: 'Compress data, use chunked upload, or increase server limits.',
          steps: [
            'Compress images before re-uploading',
            'Split large requests into multiple small requests',
            'Contact the administrator to increase server body-parser limit',
            'Use streaming upload instead of one-time upload'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_QUERY_PARAM_TOO_LONG',
          message: 'Query parameter too long',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The URL query string exceeded the browser or server limit (typically 2048 characters).',
          solution: 'Use POST request body instead of query parameters.',
          steps: [
            'Move data from URL parameters to POST body',
            'Use form data or JSON body',
            'Shorten parameter names or values',
            'Check for duplicate parameters'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_HEADER_TOO_LARGE',
          message: 'Request header too large',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'A custom header (e.g., Authorization Bearer token) is too long, exceeding server limits.',
          solution: 'Shorten the token length or reduce the number of custom headers.',
          steps: [
            'Check the length of the Authorization header',
            'Remove unnecessary custom headers',
            'Contact the administrator to increase large_client_header_buffers',
            'Use cookies instead of overly long headers'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'OAUTH_TOKEN_EXPIRED',
          message: 'OAuth access token expired',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The OAuth 2.0 access_token has expired and needs to be refreshed using refresh_token.',
          solution: 'Use refresh_token to obtain a new access_token.',
          steps: [
            'Check the token expiration time',
            'Use refresh_token to call the token endpoint',
            'Update the stored access_token',
            'Implement automatic refresh logic'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'OAUTH_REFRESH_TOKEN_EXPIRED',
          message: 'OAuth refresh token expired',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The refresh_token has also expired, requiring re-authorization.',
          solution: 'Guide the user through the OAuth authorization flow again.',
          steps: [
            'Clear locally stored token information',
            'Redirect the user to the OAuth authorization page',
            'Store the new token pair after user completes authorization',
            'Set reminders to refresh before token expiration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'OAUTH_SCOPE_INSUFFICIENT',
          message: 'OAuth scope insufficient',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The current access_token scope does not include the permission required for this operation.',
          solution: 'Request authorization with a larger scope, or contact the administrator to assign permissions.',
          steps: [
            'Check the current token scope list',
            'Add missing scopes to the authorization request',
            'Guide the user to re-authorize',
            'Contact the administrator to confirm permission configuration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'OAUTH_STATE_MISMATCH',
          message: 'OAuth state parameter mismatch',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The CSRF protection state parameter does not match during the authorization callback, possibly a CSRF attack.',
          solution: 'Re-initiate the authorization request and ensure the state parameter is correctly passed.',
          steps: [
            'Clear the current authorization flow state',
            'Regenerate a random state parameter',
            'Ensure state is consistent between request and callback',
            'Check if an intermediate page tampered with the state'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'JWT_SIGNATURE_INVALID',
          message: 'JWT signature invalid',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The JWT token signature does not match the key, the token may have been tampered with.',
          solution: 'Re-obtain a valid JWT token.',
          steps: [
            'Check if the token is complete (three parts base64)',
            'Confirm the key used matches the one at issuance',
            'Re-login to get a new token',
            'Check if the token was truncated during transmission'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'JWT_TOKEN_EXPIRED',
          message: 'JWT token expired',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The JWT exp claim has expired.',
          solution: 'Use refresh mechanism or re-login to get a new token.',
          steps: [
            'Check the token exp timestamp',
            'If refresh is supported, call the refresh interface',
            'Otherwise guide the user to re-login',
            'Implement automatic refresh before token expiration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'JWT_ISSUER_MISMATCH',
          message: 'JWT issuer mismatch',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The JWT iss claim does not match the expected issuer.',
          solution: 'Check the token source and ensure the correct authentication service is used.',
          steps: [
            'Verify the JWT iss field',
            'Confirm the correct authentication server is used',
            'Check if multiple authentication services coexist',
            'Contact the administrator to confirm issuer configuration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'JWT_AUDIENCE_MISMATCH',
          message: 'JWT audience mismatch',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The JWT aud claim does not match the current application.',
          solution: 'Confirm the token was issued for the current application.',
          steps: [
            'Check the JWT aud field',
            'Confirm the application client_id matches aud',
            'If multi-tenant, check tenant configuration',
            'Re-obtain the correct token'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEY_FORMAT_INVALID',
          message: 'API Key format invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The entered API Key does not match the expected format (e.g., length, prefix, character set).',
          solution: 'Check if the API Key was copied correctly and remove extra spaces.',
          steps: [
            'Check if the Key contains leading or trailing spaces',
            'Confirm the Key length matches the provider requirement',
            'Check for illegal characters (e.g., line breaks)',
            'Re-copy the Key from the provider dashboard'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEY_REVOKED',
          message: 'API Key has been revoked',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API Key has been actively revoked by the user or administrator.',
          solution: 'Generate a new API Key and update the configuration.',
          steps: [
            'Log in to the provider dashboard to check Key status',
            'Confirm if the Key was accidentally revoked',
            'Generate a new API Key',
            'Update all configurations using that Key'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEY_QUOTA_EXHAUSTED',
          message: 'API Key quota exhausted',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The monthly/annual call quota for the API Key has been fully consumed.',
          solution: 'Upgrade the plan or wait for quota reset.',
          steps: [
            'Log in to the provider dashboard to check quota usage',
            'Consider upgrading to a higher quota plan',
            'Optimize call frequency to reduce waste',
            'Set quota usage alerts'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEY_IP_RESTRICTED',
          message: 'API Key has IP whitelist restriction',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The API Key is bound to a specific IP, and the current request source IP is not in the whitelist.',
          solution: 'Add the current IP to the whitelist in the provider dashboard, or switch to an unrestricted Key.',
          steps: [
            'Check the current public IP (whatismyipaddress.com)',
            'Log in to the provider dashboard to add IP whitelist',
            'Or generate a new Key without IP restrictions',
            'If using a proxy, confirm the proxy exit IP'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEY_REGION_BLOCKED',
          message: 'API Key restricted in current region',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The provider blocks API calls from this region based on geographic restrictions.',
          solution: 'Use a VPN to switch to an allowed region, or contact the provider to lift the restriction.',
          steps: [
            'Confirm if the current region is on the restriction list',
            'Use a VPN to switch to an allowed region',
            'Contact the provider to request region restriction removal',
            'Consider using a provider in another region'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_RETRY_EXHAUSTED',
          message: 'API retry attempts exhausted',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'All retry strategies have been executed but still failed, possibly a persistent failure.',
          solution: 'Check network and service status, retry later, or contact support.',
          steps: [
            'Check the provider status page',
            'Check if the network connection is normal',
            'Wait a few minutes and retry manually',
            'Contact the provider technical support'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_CIRCUIT_BREAKER_OPEN',
          message: 'Circuit breaker is open',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Consecutive failure count exceeded the threshold, the circuit breaker entered open state, rejecting subsequent requests.',
          solution: 'Wait for the circuit breaker timeout to auto-recover, or manually reset.',
          steps: [
            'Wait for the circuit breaker cooldown period (typically 30-60s)',
            'Check and fix the root cause of consecutive failures',
            'Manually reset the circuit breaker state (if management interface exists)',
            'Monitor failure rate to avoid triggering again'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_THROTTLING_BURST_LIMIT',
          message: 'API burst traffic limit',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Request volume in a short time exceeded the burst limit, even if the average rate did not exceed.',
          solution: 'Smooth request sending frequency, use token bucket or leaky bucket algorithm for rate limiting.',
          steps: [
            'Implement client request queue and rate limiting',
            'Use token bucket algorithm to smooth requests',
            'Increase request interval',
            'Contact the provider to increase burst limit'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_THROTTLING_STEADY_LIMIT',
          message: 'API steady rate limit',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Sustained request rate exceeded the steady limit.',
          solution: 'Reduce sustained request frequency, or upgrade the plan.',
          steps: [
            'Calculate the current average request rate',
            'Reduce to a frequency below the limit',
            'Implement adaptive rate control',
            'Consider upgrading the plan or requesting a limit increase'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_CONCURRENT_LIMIT_EXCEEDED',
          message: 'API concurrent request limit exceeded',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The number of simultaneous requests exceeded the provider concurrent limit.',
          solution: 'Use connection pool or request queue to limit concurrency.',
          steps: [
            'Check the current number of concurrent requests',
            'Implement request queue and max concurrency limit',
            'Use Promise.allSettled instead of Promise.all',
            'Reduce the number of simultaneous operations'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_CONTENT_MODERATION_BLOCKED',
          message: 'API content moderation blocked',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Request content triggered the provider content safety policy (e.g., sensitive words, prohibited images).',
          solution: 'Modify request content to comply with content policy, or contact the provider to appeal.',
          steps: [
            'Check if the request content contains sensitive information',
            'Modify or delete content that triggers moderation',
            'If误判, contact the provider to appeal',
            'Read the provider content policy documentation'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_CONTENT_MODERATION_ERROR',
          message: 'API content moderation service error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The content moderation service itself malfunctioned and could not complete moderation.',
          solution: 'Retry later, or temporarily bypass moderation (if business allows).',
          steps: [
            'Wait a few minutes and retry',
            'Check the provider status page',
            'If business allows, temporarily disable content moderation',
            'Contact the provider to report the issue'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_RESPONSE_ENCODING_ERROR',
          message: 'API response encoding error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server returned non-UTF-8 encoded content, or the Content-Type header does not match the content encoding.',
          solution: 'Check backend encoding configuration and ensure UTF-8 is returned.',
          steps: [
            'Check the charset declaration in the response header',
            'Use TextDecoder to specify encoding',
            'Contact the backend team to confirm encoding settings',
            'Unify to UTF-8 encoding'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_RESPONSE_COMPRESSION_ERROR',
          message: 'API response decompression failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server returned gzip/brotli compressed content but decompression failed (e.g., data corruption).',
          solution: 'Disable compression transmission, or check compressed data integrity.',
          steps: [
            'Remove Accept-Encoding from the request header',
            'Check if the proxy modified the compressed data',
            'Test with raw uncompressed data',
            'Contact the provider to check compression implementation'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_CHUNKED_TRANSFER_ERROR',
          message: 'Chunked transfer error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Connection interrupted during Chunked Transfer-Encoding or data chunk format error.',
          solution: 'Check network stability, or disable chunked transfer.',
          steps: [
            'Check if the network connection is stable',
            'Disable chunked transfer on the server side',
            'Increase connection keep-alive time',
            'Use Content-Length instead of chunked'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_KEEPALIVE_TIMEOUT',
          message: 'Keep-Alive connection timeout',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'HTTP Keep-Alive connection idle time was too long and was closed by the server or middleware.',
          solution: 'Reduce Keep-Alive idle time, or send heartbeat requests.',
          steps: [
            'Reduce client Keep-Alive idle timeout',
            'Periodically send heartbeat requests to keep the connection alive',
            'Use connection pool to automatically manage connection lifecycle',
            'Check connection status before requests'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_HTTP2_STREAM_ERROR',
          message: 'HTTP/2 stream error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'An error occurred in a stream within the HTTP/2 connection (e.g., stream reset, window overflow).',
          solution: 'Downgrade to HTTP/1.1, or fix HTTP/2 configuration.',
          steps: [
            'Disable HTTP/2 on the client',
            'Check the server HTTP/2 settings',
            'Increase flow control window size',
            'Check HTTP/2 error code (RST_STREAM)'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_HTTP2_GOAWAY',
          message: 'HTTP/2 GOAWAY frame received',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server sent a GOAWAY frame, indicating the connection is about to close.',
          solution: 'Retry requests on a new connection, implement graceful connection migration.',
          steps: [
            'Capture the GOAWAY event',
            'Retry incomplete requests on a new connection',
            'Check the server maximum stream limit',
            'Implement connection warm-up to avoid cold start'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_HTTP3_CONNECTION_ERROR',
          message: 'HTTP/3 connection error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'HTTP/3 connection based on QUIC failed to establish (e.g., UDP blocked).',
          solution: 'Downgrade to HTTP/2 or HTTP/1.1, or open UDP ports.',
          steps: [
            'Check if the firewall is blocking UDP',
            'Disable HTTP/3 on the client',
            'Confirm the server supports HTTP/3',
            'Use a library version that supports HTTP/3'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_GRAPHQL_VALIDATION_ERROR',
          message: 'GraphQL query validation failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'GraphQL query syntax error, field does not exist, or type mismatch.',
          solution: 'Check query syntax, use GraphQL documentation validation tools.',
          steps: [
            'Use GraphQL Playground to validate the query',
            'Check if field names and types match the schema',
            'Confirm query variable types are correct',
            'Check the path information in GraphQL error details'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_GRAPHQL_EXECUTION_ERROR',
          message: 'GraphQL execution error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'GraphQL query encountered an error during execution (e.g., resolver threw an exception).',
          solution: 'Check the path and extension information in GraphQL error details, fix the corresponding resolver.',
          steps: [
            'Check the path in the errors array to locate the problem field',
            'Check resolver logs',
            'Confirm if data sources (database, API) are normal',
            'Add error handling to resolvers'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_GRAPHQL_RATE_LIMITED',
          message: 'GraphQL query complexity limit exceeded',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'GraphQL query complexity score exceeded the server limit (e.g., nesting too deep, too many returned fields).',
          solution: 'Simplify the query, reduce nesting levels and the number of returned fields.',
          steps: [
            'Use query complexity analysis tools',
            'Reduce query nesting levels',
            'Use pagination instead of full query',
            'Split large queries into multiple small queries'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_WEBHOOK_DELIVERY_FAILED',
          message: 'Webhook delivery failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server attempted to send an event to the configured Webhook URL but failed (e.g., URL unreachable, returned non-2xx).',
          solution: 'Check Webhook URL availability and ensure the endpoint returns 2xx.',
          steps: [
            'Test if the Webhook URL is reachable',
            'Ensure the endpoint can respond quickly (< 30 seconds)',
            'Return 2xx status code to confirm receipt',
            'Check Webhook delivery logs and retry records'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_WEBHOOK_SIGNATURE_INVALID',
          message: 'Webhook signature validation failed',
          severity: 'critical',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The Webhook request signature does not match the locally computed result, possibly a forged request.',
          solution: 'Check the signature algorithm and key, ensure the correct secret is used.',
          steps: [
            'Confirm the secret used matches the configuration',
            'Check the signature algorithm (HMAC-SHA256, etc.)',
            'Verify the timestamp is within the allowed window',
            'Do not rely on webhook request body for critical operations'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_IDEMPOTENCY_KEY_REUSE',
          message: 'Idempotency key already used',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The same idempotency key (Idempotency-Key) was used but the request content is different.',
          solution: 'Generate a unique idempotency key for each new request.',
          steps: [
            'Use UUID to generate a unique idempotency key',
            'Ensure the idempotency key is consistent for the same business operation',
            'Check the storage and reuse logic of idempotency keys',
            'Read the provider idempotency documentation'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_IDEMPOTENCY_KEY_EXPIRED',
          message: 'Idempotency key expired',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The idempotency key validity period has passed, the server no longer recognizes the key.',
          solution: 'Regenerate the idempotency key and initiate the request.',
          steps: [
            'Understand the provider idempotency key validity period',
            'Complete the operation within the validity period',
            'Regenerate a new idempotency key',
            'Implement automatic idempotency key refresh mechanism'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_BATCH_PARTIAL_FAILURE',
          message: 'Batch request partial failure',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Some sub-requests in the batch API request failed, others succeeded.',
          solution: 'Process successful results, retry failed sub-requests individually.',
          steps: [
            'Parse each sub-result in the batch response',
            'Extract failed sub-requests',
            'Retry failed sub-requests individually',
            'Record failure reasons for subsequent analysis'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_BATCH_SIZE_EXCEEDED',
          message: 'Batch request size exceeded',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The number of sub-requests in the batch request exceeded the server limit.',
          solution: 'Split large batches into multiple small batches.',
          steps: [
            'Check the provider batch size limit',
            'Split requests into multiple batches',
            'Implement batch queue and sequential processing',
            'Monitor the processing results of each batch'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_PAGINATION_CURSOR_INVALID',
          message: 'Pagination cursor invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The pagination cursor used has expired or is in incorrect format.',
          solution: 'Re-fetch the first page of data, use a new cursor.',
          steps: [
            'Re-request the first page to get a new cursor',
            'Check if the cursor was truncated or tampered',
            'Confirm the cursor encoding format is correct',
            'Implement automatic fallback when cursor expires'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_PAGINATION_OFFSET_TOO_LARGE',
          message: 'Pagination offset too large',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'When using offset pagination, the offset exceeded the maximum value supported by the server.',
          solution: 'Use cursor-based pagination instead of offset pagination.',
          steps: [
            'Understand the maximum offset limit',
            'Migrate to cursor-based pagination',
            'If offset must be used, reduce page size',
            'Consider using search filters to reduce total data volume'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SORT_PARAMETER_INVALID',
          message: 'Sort parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The sort field specified in the request does not exist or does not support sorting.',
          solution: 'Check the available sort field list, use the correct field name.',
          steps: [
            'Check the sort field list in API documentation',
            'Confirm the field name is spelled correctly',
            'Check if an unsupported sort direction (asc/desc) was used',
            'Remove illegal sort parameters'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_FILTER_PARAMETER_INVALID',
          message: 'Filter parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The filter condition specified in the request has incorrect format or the field does not exist.',
          solution: 'Check the filter parameter format, refer to the filter syntax in API documentation.',
          steps: [
            'Check the filter syntax in API documentation',
            'Confirm filter field names and operators are correct',
            'Check if the filter value type matches',
            'Simplify filter conditions and test step by step'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_FIELD_SELECTION_INVALID',
          message: 'Field selection parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The returned field specified in the request does not exist or is not accessible.',
          solution: 'Check the available field list, remove illegal fields.',
          steps: [
            'Check the field list in API documentation',
            'Confirm the field name is spelled correctly',
            'Check if specific permissions are required to access certain fields',
            'Use wildcards or default field sets'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_EXPAND_PARAMETER_INVALID',
          message: 'Expand parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The associated resource attempted to be expanded in the request does not exist or does not support expansion.',
          solution: 'Check the list of expandable associated resources.',
          steps: [
            'Check the expand support list in API documentation',
            'Confirm the associated resource name is correct',
            'Check if there is permission to access the associated resource',
            'Reduce expansion levels to avoid performance issues'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_INCLUDE_PARAMETER_INVALID',
          message: 'Include parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The included resource specified in the request does not exist.',
          solution: 'Check the available include options list.',
          steps: [
            'Check the include support list in API documentation',
            'Confirm the resource name is spelled correctly',
            'Check the difference between include and expand',
            'Remove illegal include parameters'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_EMBED_PARAMETER_INVALID',
          message: 'Embed parameter invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The resource type attempted to be embedded in the request does not support embedding.',
          solution: 'Check the list of embeddable resource types.',
          steps: [
            'Check the embed support list in API documentation',
            'Confirm the embedded resource type is correct',
            'Consider using expand or include as alternatives',
            'Check embed depth limits'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_AGGREGATION_NOT_SUPPORTED',
          message: 'Aggregation query not supported',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The request used aggregation operations (e.g., count, sum, avg) but the endpoint does not support them.',
          solution: 'Use client-side aggregation, or call a dedicated aggregation endpoint.',
          steps: [
            'Check API documentation to confirm aggregation support',
            'Aggregate returned data on the client side',
            'Use dedicated statistics/reporting endpoints',
            'Contact the provider to request aggregation features'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SEARCH_QUERY_SYNTAX_ERROR',
          message: 'Search query syntax error',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The search query string contains syntax errors (e.g., unclosed quotes, illegal operators).',
          solution: 'Check the search syntax, refer to the search engine query syntax documentation.',
          steps: [
            'Check if quotes are paired and closed',
            'Confirm operators (AND/OR/NOT) are used correctly',
            'Escape special characters',
            'Use simple keyword search for testing'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SEARCH_INDEX_NOT_READY',
          message: 'Search index not ready',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The search service is rebuilding the index and cannot provide accurate results temporarily.',
          solution: 'Wait for index rebuild to complete, or return partial results.',
          steps: [
            'Check the search service status',
            'Wait for the index rebuild to complete',
            'Use direct database query as a fallback',
            'Implement search result caching'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_REALTIME_CONNECTION_LIMIT',
          message: 'Real-time connection limit exceeded',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The number of simultaneous real-time connections (WebSocket/SSE) exceeded the limit.',
          solution: 'Close unnecessary connections, or use connection multiplexing.',
          steps: [
            'Check the current number of active real-time connections',
            'Close connections that are not needed',
            'Use a single connection to subscribe to multiple topics',
            'Implement connection pool management'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SSE_CONNECTION_FAILED',
          message: 'SSE connection failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Server-Sent Events connection could not be established, possibly because the server does not support it or middleware is blocking.',
          solution: 'Check server SSE support, confirm the proxy allows text/event-stream.',
          steps: [
            'Confirm the server implements SSE endpoints',
            'Check the response header Content-Type: text/event-stream',
            'Confirm the proxy and firewall allow long connections',
            'Test a simple SSE endpoint'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_SSE_RECONNECT_FAILED',
          message: 'SSE reconnection failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'SSE connection disconnected and automatic reconnection failed multiple times.',
          solution: 'Check network and service status, implement exponential backoff reconnection.',
          steps: [
            'Implement exponential backoff reconnection logic',
            'Check if the server is still running',
            'Confirm last-event-id is correctly passed',
            'If multiple failures occur, prompt the user to manually refresh'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_LONG_POLLING_TIMEOUT',
          message: 'Long polling timeout',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The long polling request timed out before receiving new data.',
          solution: 'This is normal behavior, the client should automatically initiate a new long polling request.',
          steps: [
            'Catch the timeout error',
            'Immediately initiate a new long polling request',
            'Maintain last-seen state',
            'Do not display this error to the user'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_PUSH_NOTIFICATION_FAILED',
          message: 'Push notification sending failed',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Failed to send push notification to the client (e.g., device offline, token invalid).',
          solution: 'Update the device token, or retry after the device comes online.',
          steps: [
            'Check if the device token is valid',
            'Confirm push service (FCM/APNs) configuration is correct',
            'Remove expired device tokens',
            'Implement push retry queue'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_PUSH_NOTIFICATION_TOKEN_INVALID',
          message: 'Push notification token invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The device push token has expired or is in incorrect format.',
          solution: 'Request the client to re-register the push token.',
          steps: [
            'Remove expired tokens from the database',
            'Notify the client to re-obtain the token',
            'Update the stored token',
            'Check if the token format matches FCM/APNs requirements'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_FILE_UPLOAD_URL_EXPIRED',
          message: 'File upload presigned URL expired',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The obtained presigned upload URL (e.g., S3 presigned URL) has expired.',
          solution: 'Request a new presigned URL.',
          steps: [
            'Re-call the interface to get the upload URL',
            'Check the URL validity period configuration',
            'Complete the upload before expiration',
            'Implement URL refresh mechanism'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_FILE_UPLOAD_URL_INVALID',
          message: 'File upload presigned URL invalid',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The presigned URL format is incorrect or has already been used.',
          solution: 'Request a new presigned URL.',
          steps: [
            'Check if the URL is complete',
            'Confirm the URL was not reused',
            'Request a new upload URL',
            'Check the URL generation logic'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_MULTIPART_UPLOAD_INIT_FAILED',
          message: 'Multipart upload initialization failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'The server could not create a multipart upload task (e.g., insufficient bucket permissions).',
          solution: 'Check storage service configuration and permissions.',
          steps: [
            'Check bucket write permissions',
            'Confirm the multipart upload interface is available',
            'Check server-side logs',
            'Contact the administrator to check storage configuration'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_MULTIPART_UPLOAD_PART_FAILED',
          message: 'Multipart upload part failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Upload of a specific part failed (e.g., network interruption, signature expired).',
          solution: 'Retry only the failed part, no need to re-upload all parts.',
          steps: [
            'Record the failed part number',
            'Re-upload that part individually',
            'Confirm the ETag of that part matches',
            'Continue to complete the multipart merge'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_MULTIPART_UPLOAD_COMPLETE_FAILED',
          message: 'Multipart upload merge failed',
          severity: 'error',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'After all parts were uploaded, the server merge failed (e.g., missing parts, incorrect order).',
          solution: 'Check if all parts were uploaded successfully, retry the merge request.',
          steps: [
            'List the uploaded parts',
            'Confirm no parts are missing',
            'Check if the part order is correct',
            'Re-call the completion interface'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },
        {
          code: 'API_MULTIPART_UPLOAD_ABORT_FAILED',
          message: 'Multipart upload abort failed',
          severity: 'warning',
          category: 'A. API & Network',
          location: 'Page: Any network-dependent tool → Area: Network request layer',
          cause: 'Attempt to cancel the multipart upload task failed, may lead to wasted storage space.',
          solution: 'Manually clean up incomplete uploads, or configure automatic cleanup policy.',
          steps: [
            'Manually call the abort interface',
            'Check if the server has an automatic cleanup policy',
            'Periodically clean up incomplete multipart uploads',
            'Monitor incomplete uploads in the storage bucket'
          ],
          prevention: 'Regularly check API configuration, network environment, and certificate validity.',
        },],
    },
    {
      id: 'B',
      name: 'B. Config & Data',
      description: 'Local storage issues, configuration import/export errors, data conflicts',
      errors: [
        {
          code: 'CONFIG_CORRUPTED',
          message: 'Config corrupted, editor shows blank or garbled text',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Face Maker / Prompt Suite → Area: editor',
          cause: 'The config in browser localStorage is corrupted, possibly due to manual data editing, version incompatibility, etc.',
          solution: 'Reset the editor or manually clear localStorage.',
          steps: [
            'Click the "Reset" button',
            'Confirm in the dialog and refresh',
            'If still abnormal, press Ctrl+Shift+I → Application → Local Storage, delete relevant keys',
            'Refresh the page',
          ],
          relatedCodes: ['STORAGE_READ_ONLY', 'LOCAL_STORAGE_FULL'],
          prevention: 'Do not manually edit localStorage data; regularly export configs as backups.',
        },
        {
          code: 'IMPORT_INVALID_CONFIG',
          message: 'Config file content is incomplete or corrupted',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Prompt Suite / TTS Export / Paper2Gal / LLM Hub',
          cause: 'The configuration file is missing necessary fields.',
          solution: 'Confirm the file was exported from the correct tool page.',
          steps: [
            'Open the file in a text editor',
            'Confirm it contains the fields required by the corresponding tool',
            'Re-export from the correct tool page',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'IMPORT_TOOL_MISMATCH'],
        },
        {
          code: 'IMPORT_INVALID_JSON',
          message: 'Imported JSON format is invalid',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Global / All pages',
          cause: 'File is corrupted or is not a valid JSON file.',
          solution: 'Check and fix JSON file.',
          steps: [
            'Open the file in a text editor',
            'Validate with a JSON formatting tool',
            'Fix syntax errors and re-import',
          ],
          relatedCodes: ['IMPORT_TOOL_MISMATCH', 'IMPORT_INVALID_CONFIG'],
          prevention: 'Keep exported configuration files safe; do not modify them with non-text editors.',
        },
        {
          code: 'IMPORT_TOOL_MISMATCH',
          message: 'Imported config file tool type mismatch',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Global / All pages',
          cause: 'The config file was exported from another tool, not the current tool.',
          solution: 'Import the correct config file.',
          steps: [
            'Confirm the file was exported from the current tool',
            'Find the correct config file and re-import',
          ],
          relatedCodes: ['IMPORT_INVALID_JSON'],
          prevention: 'Only config files exported from the corresponding tool page contain the correct tool field.',
        },
        {
          code: 'LOCAL_STORAGE_FULL',
          message: 'Browser localStorage is full',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Global / All pages',
          cause: 'Stored data exceeds the browser\'s limit (usually 5~10MB).',
          solution: 'Clean up unnecessary data or export backup.',
          steps: [
            'Export current configuration as a JSON file',
            'Open DevTools → Application → Local Storage',
            'Delete unnecessary large data',
            'Save again',
          ],
          relatedCodes: ['STORAGE_READ_ONLY'],
          prevention: 'Regularly clean up data no longer needed from browser localStorage; for large files, do not save directly in the editor—use the export function instead.',
        },
        {
          code: 'STORAGE_READ_ONLY',
          message: 'Browser storage is read-only',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Global / All pages',
          cause: 'Browser is in incognito mode, or storage is disabled by system policy.',
          solution: 'Exit incognito mode or use a normal window.',
          steps: [
            'Confirm the browser is not in incognito/private mode',
            'Check whether browser storage permissions are disabled',
            'Export configuration as a local file as an alternative',
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL'],
          prevention: 'Avoid using this app in browser incognito/private mode; regularly export configurations to local files as backups.',
        },
        {
          code: 'UNSAVED_WARNING',
          message: 'There are unsaved changes',
          severity: 'info',
          category: 'B. Config & Data',
          location: 'Global / All pages',
          cause: 'User modified configuration but has not saved it.',
          solution: 'Save or discard changes.',
          steps: [
            'Click "Save"',
            'Or click "Confirm Return" to discard',
          ],
        },
      {
        code: 'CONFIG_JSON_PARSE_ERROR',
        message: 'Configuration file JSON parse error',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Configuration file contains illegal JSON syntax such as trailing commas or unclosed quotes.',
        solution: 'Use JSON validation tool to check and fix syntax errors.',
        steps: [
          'Paste configuration into online JSON validator',
          'Check for trailing commas',
          'Confirm all quotes are closed',
          'Check special character escaping',
        ],
        prevention: 'Use IDE JSON syntax checking, avoid manually editing complex configurations.',
      },
      {
        code: 'CONFIG_REQUIRED_FIELD_MISSING',
        message: 'Configuration file missing required field',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Configuration object is missing required fields that the application needs.',
        solution: 'Add all required fields according to documentation.',
        steps: [
          'Check missing fields mentioned in error prompt',
          'Cross-reference configuration documentation for required items',
          'Copy missing fields from default config template',
          'Save and reload application',
        ],
        prevention: 'Use configuration Schema validation, or start from a complete template.',
      },
      {
        code: 'CONFIG_TYPE_MISMATCH',
        message: 'Configuration field type mismatch',
        severity: 'warning',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Configuration field value type does not match expectation, such as string where number is expected.',
        solution: 'Convert field value to correct type.',
        steps: [
          'Check field mentioned in error prompt',
          'Confirm whether field should be string/number/boolean',
          'Modify value type and save',
          'Reload application to verify',
        ],
        prevention: 'Use TypeScript interfaces or JSON Schema to validate configuration types.',
      },
      {
        code: 'CONFIG_ENV_VARIABLE_NOT_FOUND',
        message: 'Environment variable not found',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Environment variable that application depends on is not set or misspelled.',
        solution: 'Set correct environment variable, or check variable name spelling.',
        steps: [
          'Check .env file or system environment variables',
          'Confirm variable name case is correct',
          'Restart application for environment variables to take effect',
          'Use default values as fallback',
        ],
        prevention: 'Check all required environment variables in startup scripts.',
      },
      {
        code: 'CONFIG_CROSS_ORIGIN_BLOCKED',
        message: 'Cross-origin configuration blocked operation',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Browser same-origin policy blocked cross-origin configuration read/write.',
        solution: 'Ensure frontend and backend are same-origin, or properly configure CORS.',
        steps: [
          'Check frontend and backend domain/port',
          'Confirm CORS configuration allows current domain',
          'Avoid operating configuration in cross-origin iframes',
          'Use postMessage for cross-domain communication',
        ],
        prevention: 'Ensure frontend and backend use same-origin policy or properly configure CORS during deployment.',
      },
      {
        code: 'DATA_EXPORT_TIMEOUT',
        message: 'Data export timeout',
        severity: 'warning',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Exported data volume is too large causing operation timeout.',
        solution: 'Export in batches, or increase timeout duration.',
        steps: [
          'Reduce single export data volume',
          'Export multiple small files in batches',
          'Increase export operation timeout settings',
          'Use background tasks for large exports',
        ],
        prevention: 'Provide batch export options for large data volumes.',
      },
      {
        code: 'DATA_IMPORT_DUPLICATE_KEY',
        message: 'Imported data contains duplicate keys',
        severity: 'warning',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Imported JSON contains duplicate key names.',
        solution: 'Clean duplicate keys, or use deduplication strategy.',
        steps: [
          'Check imported file for duplicate keys',
          'Decide which value to keep',
          'Manually remove duplicate keys',
          'Re-import',
        ],
        prevention: 'Ensure unique key names during export, validate before import.',
      },
      {
        code: 'DATA_SCHEMA_VERSION_TOO_OLD',
        message: 'Data schema version too old',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Imported data uses outdated schema version incompatible with current application.',
        solution: 'Use data migration tool to upgrade schema version.',
        steps: [
          'Confirm current application supported schema version',
          'Find migration script for corresponding version',
          'Run migration script to upgrade data',
          'Re-import upgraded data',
        ],
        prevention: 'Include schema version information in exports, provide migration tools.',
      },
      {
        code: 'STORAGE_INDEXEDDB_BLOCKED',
        message: 'IndexedDB blocked by browser',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Browser privacy mode or settings blocked IndexedDB access.',
        solution: 'Exit privacy mode, or adjust browser storage settings.',
        steps: [
          'Confirm not in private/incognito mode',
          'Check browser settings for storage permissions',
          'Clear browser data and retry',
          'Try using localStorage as alternative',
        ],
        prevention: 'Avoid using features requiring persistent storage in privacy mode.',
      },
      {
        code: 'STORAGE_QUOTA_EXCEEDED',
        message: 'Storage quota exceeded',
        severity: 'error',
        category: 'B. Config & Data',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Application storage usage exceeded browser or device quota limit.',
        solution: 'Clean old data, or request larger storage quota.',
        steps: [
          'Check current storage usage',
          'Delete unnecessary historical data',
          'Compress stored data',
          'Request persistent storage permission',
        ],
        prevention: 'Regularly clean expired data, use compressed storage.',
      },
      
        {
          code: 'ENV_FILE_MISSING',
          message: 'Environment variable file .env is missing',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The .env file is missing from the project root directory, causing all environment variables to fail to load.',
          solution: 'Copy .env.example to .env and fill in the necessary configuration.',
          steps: [
            'Copy .env.example to .env',
            'Fill in all required environment variables',
            'Restart the application to apply the configuration',
            'Check logs to confirm configuration is loaded'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'ENV_VARIABLE_EMPTY',
          message: 'Environment variable value is empty',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The .env file contains a key but no value, or the value contains only whitespace characters.',
          solution: 'Provide valid values for all required environment variables.',
          steps: [
            'Check the .env file for empty values',
            'Provide valid values for missing variables',
            'Remove unnecessary empty lines',
            'Restart the application'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'ENV_VARIABLE_SYNTAX_ERROR',
          message: 'Environment variable syntax error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The .env file contains syntax errors (e.g., spaces around the equals sign, values containing spaces without quotes).',
          solution: 'Fix the .env file syntax, use quotes to wrap values containing spaces.',
          steps: [
            'Check for spaces around the equals sign',
            'Wrap values containing spaces in double quotes',
            'Remove illegal characters',
            'Use dotenv parser to validate'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'ENV_VARIABLE_TYPE_MISMATCH',
          message: 'Environment variable type mismatch',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The environment variable was parsed as the wrong type (e.g., numeric variable contains non-numeric characters, boolean variable is not true/false).',
          solution: 'Check the environment variable format and ensure it matches the type expected by the code.',
          steps: [
            'Check the actual value of the variable',
            'Confirm the type expected by the code',
            'Perform necessary type conversion',
            'Add input validation'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_FILE_PARSE_ERROR',
          message: 'Configuration file parse error',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'JSON/YAML/TOML configuration file format is incorrect (e.g., missing commas, mismatched brackets, incorrect indentation).',
          solution: 'Use a format validation tool to check and fix the configuration file.',
          steps: [
            'Use JSON/YAML validation tool to check the file',
            'Find and fix syntax errors',
            'Restore to the last known good version',
            'Reload the configuration'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_FILE_NOT_FOUND',
          message: 'Configuration file not found',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The specified configuration file path does not exist or the filename is misspelled.',
          solution: 'Confirm the configuration file path is correct, or create a default configuration file.',
          steps: [
            'Check if the file path is correct',
            'Confirm the filename is spelled correctly',
            'Create the missing configuration file',
            'Update the configuration loading path'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_SCHEMA_VALIDATION_FAILED',
          message: 'Configuration schema validation failed',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The configuration file content does not match the expected schema (e.g., missing required fields, incorrect field types, values out of range).',
          solution: 'Fix configuration values according to the schema definition.',
          steps: [
            'Review schema validation error details',
            'Fix missing or incorrect fields',
            'Confirm field types and value ranges',
            'Re-validate the configuration'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_VERSION_INCOMPATIBLE',
          message: 'Configuration version incompatible',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The current configuration file version does not match the version expected by the application.',
          solution: 'Upgrade or downgrade the configuration file, or run a migration script.',
          steps: [
            'Check the current configuration version',
            'Check the application expected configuration version',
            'Run configuration migration script',
            'Manually adjust incompatible fields'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_CIRCULAR_REFERENCE',
          message: 'Configuration contains circular reference',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The configuration file uses variable references that form a circular dependency (A references B, B references A).',
          solution: 'Refactor the configuration to eliminate circular references.',
          steps: [
            'Identify the circular reference chain',
            'Refactor the configuration structure',
            'Use absolute paths instead of relative references',
            'Add configuration parsing depth limits'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CONFIG_OVERRIDE_CONFLICT',
          message: 'Configuration override conflict',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Multiple configuration sources (file, environment variable, command line parameter) provide different values for the same key.',
          solution: 'Clarify configuration priority and ensure the expected value is used.',
          steps: [
            'Understand the configuration loading priority order',
            'Check values from each configuration source',
            'Explicitly specify the final effective configuration value',
            'Unify configuration management approach'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_CONNECTION_STRING_INVALID',
          message: 'Database connection string invalid',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The database URL format is incorrect (e.g., missing protocol, wrong port, illegal characters).',
          solution: 'Correct the connection string format according to the database documentation.',
          steps: [
            'Check the connection string format',
            'Confirm the protocol is correct (postgresql://, mongodb://, etc.)',
            'Validate hostname, port, and database name',
            'Test the connection string'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_CONNECTION_TIMEOUT',
          message: 'Database connection timeout',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The database server is unresponsive, possibly due to network issues, database overload, or firewall blocking.',
          solution: 'Check database service status and network connectivity.',
          steps: [
            'Test network connectivity to the database server',
            'Check if the database service is running',
            'Confirm the firewall allows the database port',
            'Increase connection timeout settings'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_AUTH_FAILED',
          message: 'Database authentication failed',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The database username or password is incorrect, or the user does not have access to the database.',
          solution: 'Check database credentials and confirm user permissions.',
          steps: [
            'Confirm the username and password are correct',
            'Check if the user has database access permissions',
            'Reset the database password',
            'Check database logs'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_SSL_REQUIRED',
          message: 'Database requires SSL connection',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The database server enforces SSL/TLS connections, but the client has not enabled it.',
          solution: 'Enable SSL in the connection configuration.',
          steps: [
            'Add sslmode=require to the connection string',
            'Configure SSL certificate paths',
            'Check the database server SSL configuration',
            'Test the SSL connection'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_POOL_EXHAUSTED',
          message: 'Database connection pool exhausted',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'All database connections are occupied and not released in time, causing new requests to fail to obtain a connection.',
          solution: 'Increase the connection pool size, or check for connection leaks.',
          steps: [
            'Increase the maximum number of connections in the pool',
            'Check if connections are being properly released',
            'Optimize queries to reduce connection hold time',
            'Implement connection timeout auto-recovery'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_QUERY_TIMEOUT',
          message: 'Database query timeout',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'SQL query execution time is too long, exceeding the set timeout threshold.',
          solution: 'Optimize query statements, add indexes, or increase the timeout.',
          steps: [
            'Analyze query execution plan',
            'Add appropriate indexes',
            'Rewrite inefficient queries',
            'Increase query timeout settings'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_DEADLOCK_DETECTED',
          message: 'Database deadlock detected',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Two or more transactions are waiting for each other to release locks, forming a deadlock.',
          solution: 'The database will automatically roll back one of the transactions, the application layer should catch the error and retry.',
          steps: [
            'Catch deadlock errors and retry transactions',
            'Adjust the order in which tables are accessed in transactions',
            'Reduce the time transactions hold locks',
            'Use finer-grained locks'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_UNIQUE_CONSTRAINT_VIOLATION',
          message: 'Database unique constraint violation',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Inserting or updating data violates a uniqueness constraint (e.g., duplicate primary key, unique index).',
          solution: 'Check if the data already exists, use UPSERT or query before inserting.',
          steps: [
            'Query to confirm if the data already exists',
            'Use INSERT ... ON CONFLICT (UPSERT)',
            'Or DELETE first then INSERT',
            'Check the unique index definition'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_FOREIGN_KEY_VIOLATION',
          message: 'Database foreign key constraint violation',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Inserting or updating data references a non-existent foreign key value.',
          solution: 'Ensure the referenced data exists, or disable foreign key checks (not recommended).',
          steps: [
            'Confirm the referenced foreign key value exists in the related table',
            'Insert data into the related table first, then into the primary table',
            'Check the foreign key constraint definition',
            'Only temporarily disable foreign keys when necessary'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_CHECK_CONSTRAINT_VIOLATION',
          message: 'Database check constraint violation',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The data value does not satisfy the CHECK constraint condition (e.g., age must be greater than 0).',
          solution: 'Correct the data value to satisfy the constraint condition.',
          steps: [
            'Review the CHECK constraint definition',
            'Correct the data value',
            'Or modify the constraint condition when necessary',
            'Add application-layer data validation'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_MIGRATION_FAILED',
          message: 'Database migration failed',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Executing database migration script failed (e.g., SQL syntax error, constraint conflict, table already exists).',
          solution: 'Review migration logs, fix SQL errors, or manually roll back.',
          steps: [
            'Review migration error logs',
            'Fix SQL syntax errors',
            'If partial migration has been executed, manually clean up',
            'Re-run the migration'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_MIGRATION_LOCK_HELD',
          message: 'Database migration lock is held',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Another process is executing the migration, the current process cannot obtain the migration lock.',
          solution: 'Wait for other migrations to complete, or manually release the migration lock.',
          steps: [
            'Check if another process is running the migration',
            'Wait for the migration to complete',
            'If the migration process has crashed, manually clean up the lock table',
            'Re-run the migration'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATABASE_MIGRATION_DIRTY_STATE',
          message: 'Database migration in dirty state',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The previous migration failed, leaving the database in an inconsistent state.',
          solution: 'Manually fix the database state, or reset the migration records.',
          steps: [
            'Review the migration history table',
            'Identify the failed migration step',
            'Manually execute or roll back the failed migration',
            'Update the migration records table'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_CONNECTION_FAILED',
          message: 'Cache service connection failed',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Redis/Memcached and other cache servers are not running or the network is unreachable.',
          solution: 'Check cache service status and confirm connection configuration is correct.',
          steps: [
            'Check if the cache server is running',
            'Test network connectivity',
            'Confirm the connection address and port are correct',
            'Check authentication password'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_KEY_TOO_LARGE',
          message: 'Cache key too large',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The cache key length exceeds the cache server limit (Redis max 512MB key, but recommended much smaller).',
          solution: 'Use a hash function to shorten the key name, or refactor the caching strategy.',
          steps: [
            'Calculate the actual length of the key',
            'Use MD5/SHA256 hash to shorten the key',
            'Refactor cache key naming strategy',
            'Avoid using the entire query as the key'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_VALUE_TOO_LARGE',
          message: 'Cache value too large',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The cache value size exceeds the recommended limit, affecting performance and memory usage.',
          solution: 'Compress the cache value, or split large data into multiple small caches.',
          steps: [
            'Check the cache value size',
            'Use compression algorithms (e.g., gzip)',
            'Split large data into multiple small keys',
            'Or avoid caching and query directly'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_TTL_INVALID',
          message: 'Cache TTL invalid',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The set TTL (time-to-live) is negative or exceeds the maximum value supported by the cache server.',
          solution: 'Set a reasonable TTL value (positive integer, typically in seconds).',
          steps: [
            'Check if the TTL value is positive',
            'Confirm the unit is correct (seconds vs milliseconds)',
            'Set a reasonable expiration time',
            'For permanent caching, use a special value or do not set TTL'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_SERIALIZATION_ERROR',
          message: 'Cache serialization error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The object attempted to be cached cannot be properly serialized (e.g., contains circular references, functions, Symbol).',
          solution: 'Ensure the cache object is JSON serializable, or use a dedicated serialization library.',
          steps: [
            'Check if the object can be JSON.stringify',
            'Remove functions, Symbols, and circular references',
            'Use binary serialization like msgpack',
            'Or only cache simple data types'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_DESERIALIZATION_ERROR',
          message: 'Cache deserialization error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Data read from the cache cannot be properly deserialized (e.g., data corruption, version incompatibility).',
          solution: 'Check cache data integrity and confirm serialization version consistency.',
          steps: [
            'Check the integrity of cache data',
            'Confirm serialization/deserialization versions are consistent',
            'Add data version numbers',
            'Fallback to the data source when deserialization fails'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_STAMPEDE_DETECTED',
          message: 'Cache stampede detected',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Large amounts of cache expire simultaneously, causing all requests to hit the database at once.',
          solution: 'Use locks or mutex mechanisms to prevent simultaneous cache rebuilds.',
          steps: [
            'Add random offsets to cache expiration times',
            'Use mutex locks to ensure only one request rebuilds the cache',
            'Implement proactive async refresh mechanisms',
            'Increase database connection pool to handle burst traffic'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_PENETRATION_DETECTED',
          message: 'Cache penetration detected',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Large numbers of requests query non-existent data, bypassing the cache and directly querying the database.',
          solution: 'Also cache empty results for non-existent data (with shorter TTL).',
          steps: [
            'Also write cache for empty query results',
            'Set a short TTL for empty values',
            'Use Bloom filter to predict if data exists',
            'Add request rate limiting'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CACHE_BREAKDOWN_DETECTED',
          message: 'Cache breakdown detected',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'At the moment a hot data item expires, large numbers of requests simultaneously query that data.',
          solution: 'Use mutex locks or logical expiration to prevent simultaneous rebuilds.',
          steps: [
            'Keep hot data permanently cached or use logical expiration',
            'Use mutex locks to rebuild cache',
            'Proactively async refresh hot data about to expire',
            'Use multi-level caching (local + remote)'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'JSON_PARSE_ERROR',
          message: 'JSON parse error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The string is not valid JSON format (e.g., missing quotes, extra commas, illegal characters).',
          solution: 'Use a JSON validation tool to check and fix the format.',
          steps: [
            'Use tools like JSONLint to validate',
            'Check if quotes are paired',
            'Remove extra commas',
            'Ensure there are no comments (JSON does not support comments)'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'JSON_STRINGIFY_ERROR',
          message: 'JSON stringify error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The object contains values that cannot be serialized (e.g., circular references, BigInt, functions).',
          solution: 'Clean up the object, remove non-serializable properties.',
          steps: [
            'Check if the object has circular references',
            'Convert BigInt to string',
            'Remove functions and Symbols',
            'Use a custom replacer function'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'XML_PARSE_ERROR',
          message: 'XML parse error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The string is not valid XML format (e.g., unclosed tags, illegal characters, encoding errors).',
          solution: 'Use an XML validation tool to check and fix the format.',
          steps: [
            'Check if tags are properly closed',
            'Confirm XML declaration and encoding',
            'Escape special characters (<, >, &)',
            'Use XML parser error location'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'YAML_PARSE_ERROR',
          message: 'YAML parse error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'YAML file format is incorrect (e.g., indentation errors, illegal characters, circular references).',
          solution: 'Use a YAML validation tool to check and fix the format.',
          steps: [
            'Check if indentation uses spaces (not tabs)',
            'Confirm key-value pair format is correct',
            'Check for circular references',
            'Use YAML parser detailed error messages'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'CSV_PARSE_ERROR',
          message: 'CSV parse error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'CSV file format is incorrect (e.g., mismatched quotes, inconsistent delimiters, newline issues).',
          solution: 'Use a CSV validation tool, or specify the correct delimiter and quote rules.',
          steps: [
            'Check if quotes are paired and closed',
            'Confirm delimiter consistency (comma/semicolon/tab)',
            'Handle fields containing newlines',
            'Use CSV parser library configuration options'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_VALIDATION_FAILED',
          message: 'Data validation failed',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Input data does not match the expected validation rules (e.g., required fields missing, format errors, values out of range).',
          solution: 'Fix data according to validation error information.',
          steps: [
            'Review validation error details',
            'Fix missing or incorrect fields',
            'Confirm data type and format',
            'Add client-side pre-validation'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_TYPE_CONVERSION_ERROR',
          message: 'Data type conversion error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Attempting to convert data from one type to another failed (e.g., string to number contains letters).',
          solution: 'Ensure the source data format is correct, or use safe conversion methods.',
          steps: [
            'Check the actual format of the source data',
            'Use safe conversions like Number(), parseInt()',
            'Validate the conversion result',
            'Use type guard functions'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_TRUNCATION_ERROR',
          message: 'Data truncation error',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Data length exceeds the maximum limit of the target field, causing truncation or rejection.',
          solution: 'Shorten the data length, or increase the field limit.',
          steps: [
            'Check the actual length of the data',
            'Shorten the data or store in segments',
            'Increase database field length limit',
            'Add length validation at the application layer'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_ENCRYPTION_ERROR',
          message: 'Data encryption error',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'An error occurred during encryption (e.g., invalid key, unsupported algorithm, incorrect data format).',
          solution: 'Check the key and algorithm configuration, ensure the data format is correct.',
          steps: [
            'Confirm the key length matches the algorithm requirements',
            'Check if the encryption algorithm is supported',
            'Confirm the data is a Buffer or string',
            'Check the encryption library error details'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_DECRYPTION_ERROR',
          message: 'Data decryption error',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'An error occurred during decryption (e.g., wrong key, data corruption, algorithm mismatch).',
          solution: 'Confirm the correct key and algorithm are used, check data integrity.',
          steps: [
            'Confirm the decryption key matches the encryption key',
            'Check if the encryption algorithm matches',
            'Confirm the data has not been truncated or tampered',
            'Check if the IV/Nonce was properly passed'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_HASH_MISMATCH',
          message: 'Data hash mismatch',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The data checksum/hash does not match the expected value, indicating the data was tampered with during transmission or storage.',
          solution: 'Re-transmit the data, or restore from backup.',
          steps: [
            'Re-calculate the data hash',
            'Compare with the expected hash',
            'If they match, the expected value may be wrong',
            'If they do not match, the data is corrupted and needs to be re-fetched'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_INTEGRITY_CHECK_FAILED',
          message: 'Data integrity check failed',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Data integrity validation failed (e.g., checksum, digital signature, Merkle tree verification failed).',
          solution: 'Re-fetch data from a trusted source, or repair corrupted data.',
          steps: [
            'Confirm the validation algorithm and parameters are correct',
            'Re-fetch data from backup or original source',
            'Check if the storage medium has bad sectors',
            'Implement redundant validation mechanisms'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_MIGRATION_INCOMPLETE',
          message: 'Data migration incomplete',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Data migration was interrupted, some data has been migrated but some has not, leading to data inconsistency.',
          solution: 'Roll back to the pre-migration state, or fill in the missing data.',
          steps: [
            'Check migration logs to confirm executed steps',
            'Compare source and target data volumes',
            'Fill in missing data',
            'Or roll back and re-execute the complete migration'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_BACKUP_CORRUPTED',
          message: 'Data backup corrupted',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Backup file is corrupted or checksum failed, cannot be used for recovery.',
          solution: 'Use another backup copy, or re-create the backup.',
          steps: [
            'Check the backup file integrity checksum',
            'Try using another backup copy',
            'If all backups are corrupted, try data recovery tools',
            'Establish a multi-copy backup strategy'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_REPLICATION_LAG',
          message: 'Data replication lag too large',
          severity: 'warning',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Master-slave replication delay exceeds the acceptable range, reading from the slave may return stale data.',
          solution: 'Check replication performance, optimize queries, or force reads from the master.',
          steps: [
            'Check replication delay monitoring',
            'Optimize slow queries on the slave',
            'Increase slave resources or add read replicas',
            'For strong consistency requirements, force reads from the master'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_REPLICATION_CONFLICT',
          message: 'Data replication conflict',
          severity: 'critical',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'In multi-master replication or bidirectional synchronization, the same data was modified simultaneously on different nodes, causing a conflict.',
          solution: 'Implement conflict detection and resolution strategies (last-write-wins, merge, manual intervention).',
          steps: [
            'Review conflict logs and data',
            'Choose a conflict resolution strategy',
            'Merge data or keep a specific version',
            'Implement automatic conflict detection and notification'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_SEEDING_FAILED',
          message: 'Data seed initialization failed',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'Initial data loading during application startup failed (e.g., seed file missing, format error).',
          solution: 'Check the seed file, fix the format, or manually insert initial data.',
          steps: [
            'Check if the seed file exists',
            'Validate the seed file format',
            'Manually insert necessary initial data',
            'Disable seed loading (development environment only)'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_EXPORT_FORMAT_ERROR',
          message: 'Data export format error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The format specified for data export is not supported or parameters are incorrect.',
          solution: 'Check the supported export format list, use the correct format parameters.',
          steps: [
            'Review supported export formats (CSV/JSON/XML/Excel)',
            'Check format parameter spelling',
            'Confirm the export field list is correct',
            'Test with a small data volume'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_IMPORT_FORMAT_ERROR',
          message: 'Data import format error',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The import file format is incorrect or contains data that cannot be parsed.',
          solution: 'Check the import file format and ensure it matches the expected template.',
          steps: [
            'Review the import template format',
            'Validate if the import file matches the template',
            'Check if required fields are complete',
            'Test with a small data volume'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },
        {
          code: 'DATA_IMPORT_CONSTRAINT_VIOLATION',
          message: 'Data import violates constraints',
          severity: 'error',
          category: 'B. Config & Data',
          location: 'Page: Any tool → Area: Configuration loading or data processing',
          cause: 'The imported data violates database constraints (e.g., foreign key, check constraint, not-null constraint).',
          solution: 'Clean the import data to ensure it satisfies all constraint conditions.',
          steps: [
            'Review the specific constraint violation details',
            'Clean or fix data that violates constraints',
            'Temporarily disable constraints (not recommended for production)',
            'Import in batches and validate'
          ],
          prevention: 'Use configuration validation tools, regularly back up data, implement schema version control.',
        },],
    },
    {
      id: 'C',
      name: 'C. File & Input',
      description: 'File upload, unsupported format, size exceeded, parsing failure',
      errors: [
        {
          code: 'FILE_CORRUPTED',
          message: 'Image file is corrupted',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Style Transfer / Image Converter → Area: image upload',
          cause: 'The selected image file is corrupted or encoded in an unsupported format.',
          solution: 'Replace with a valid image file.',
          steps: [
            'Open the image in a system image viewer to confirm it displays normally',
            'If corrupted, use image repair tools or replace with another image',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Confirm the image can be opened normally in the system\'s built-in image viewer before uploading.',
        },
        {
          code: 'FILE_FORMAT_UNSUPPORTED',
          message: 'File format is not supported',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Paper2Gal / Image Converter / Face Maker / Style Transfer',
          cause: 'File format does not meet requirements.',
          solution: 'Replace with a supported format file.',
          steps: [
            'Confirm the tool\'s supported format list',
            'Use the Image Converter tool to convert',
            'Re-upload',
          ],
          relatedCodes: ['UPLOAD_FORMAT'],
        },
        {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds limit',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Paper2Gal / Image Converter / Style Transfer',
          cause: 'File dimensions are too large or file size exceeds limit.',
          solution: 'Compress or resize the image.',
          steps: [
            'Use the Image Converter tool to scale the image',
            'Convert PNG to JPG to reduce file size',
            'Re-upload',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Recommended to upload images of 1024×1024 ~ 2048×2048, balancing quality and processing speed.',
        },
        {
          code: 'UPLOAD_FORMAT',
          message: 'Uploaded file format is not supported',
          severity: 'warning',
          category: 'C. File & Input',
          location: 'Page: Image Converter / Paper2Gal',
          cause: 'File format is not within the supported list.',
          solution: 'Convert the file to a supported format.',
          steps: [
            'Confirm the required file format for the target tool',
            'Use an image processing tool to convert the format',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Confirm the file format is in the supported list before uploading.',
        },
      {
        code: 'FILE_UPLOAD_INTERRUPTED',
        message: 'File upload interrupted',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Network interruption, user cancellation, or browser closure caused incomplete upload.',
        solution: 'Re-upload file, or use resumable upload.',
        steps: [
          'Check network connection status',
          'Re-select file and upload',
          'Use upload component that supports resumable upload',
          'Upload large files in chunks',
        ],
        prevention: 'Use resumable upload or chunked upload mechanisms.',
      },
      {
        code: 'FILE_MIME_TYPE_MISMATCH',
        message: 'File MIME type does not match extension',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'File extension does not match actual content type, such as renaming .png to .jpg.',
        solution: 'Use correct file extension, or determine true type via content detection.',
        steps: [
          'Use file detection tool to confirm true MIME type',
          'Change file extension to correct type',
          'Re-export file to ensure consistency',
          'Perform MIME type validation during upload',
        ],
        prevention: 'Check MIME type and extension consistency before upload.',
      },
      {
        code: 'FILE_VIRUS_SCAN_FAILED',
        message: 'File virus scan failed',
        severity: 'error',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Uploaded file did not pass virus scan, or scan service is unavailable.',
        solution: 'Use files from trusted sources, or change scan service.',
        steps: [
          'Confirm file source is trusted',
          'Scan file with local antivirus software',
          'Try changing file source',
          'Contact administrator to check scan service status',
        ],
        prevention: 'Only upload files from trusted sources.',
      },
      {
        code: 'FILE_NAME_TOO_LONG',
        message: 'File name too long',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'File name exceeded system or application maximum length limit.',
        solution: 'Shorten file name and re-upload.',
        steps: [
          'Shorten file name to under 100 characters',
          'Remove special characters from file name',
          'Use simple alphanumeric naming',
          'Re-upload',
        ],
        prevention: 'Automatically truncate or rename overly long file names before upload.',
      },
      {
        code: 'FILE_PATH_TRAVERSAL_DETECTED',
        message: 'Path traversal attack detected',
        severity: 'critical',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'File name contains path traversal characters like ../, possibly malicious attack.',
        solution: 'Reject upload and sanitize path characters from file name.',
        steps: [
          'Immediately reject this file upload',
          'Log security event',
          'Sanitize all path separators from file name',
          'Notify security team',
        ],
        prevention: 'Strictly validate file names, prohibit path separator characters.',
      },
      {
        code: 'FILE_TEMPORARY_UNAVAILABLE',
        message: 'Temporary file unavailable',
        severity: 'error',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server temp directory is full or lacks permissions, cannot create temporary files.',
        solution: 'Clean temp directory, or check directory permissions.',
        steps: [
          'Check server temp directory disk space',
          'Clean old temporary files',
          'Confirm temp directory has write permissions',
          'Change temp directory path',
        ],
        prevention: 'Regularly clean temp directory, monitor disk space.',
      },
      {
        code: 'FILE_BATCH_UPLOAD_PARTIAL_FAILURE',
        message: 'Batch upload partial failure',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Some files in batch upload failed while others succeeded.',
        solution: 'Retry failed files, or upload individually.',
        steps: [
          'View list of failed files',
          'Individually retry each failed file',
          'Check format and size of failed files',
          'Reduce number of simultaneous uploads per batch',
        ],
        prevention: 'Provide detailed status feedback and retry mechanism for batch uploads.',
      },
      {
        code: 'FILE_WATERMARK_DETECTION_FAILED',
        message: 'File watermark detection failed',
        severity: 'info',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Uploaded image could not be correctly identified or have watermark removed.',
        solution: 'Use original image without watermark, or manually remove watermark.',
        steps: [
          'Confirm whether image has watermark',
          'Try using higher quality original image',
          'Manually remove watermark and re-upload',
          'Disable automatic watermark detection feature',
        ],
        prevention: 'Use watermark-free materials from official channels.',
      },
      {
        code: 'FILE_METADATA_STRIP_FAILED',
        message: 'File metadata strip failed',
        severity: 'info',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Unable to clear EXIF and other metadata information from image.',
        solution: 'Use professional tools to manually clear metadata.',
        steps: [
          'Use exiftool or similar to view metadata',
          'Manually clear GPS, camera model and other sensitive info',
          'Re-save image to remove metadata',
          'Confirm metadata is cleared before upload',
        ],
        prevention: 'Automatically strip all sensitive metadata before upload.',
      },
      {
        code: 'FILE_THUMBNAIL_GENERATION_FAILED',
        message: 'Thumbnail generation failed',
        severity: 'warning',
        category: 'C. Files & Upload',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Image format not supported or dimensions too large, unable to generate thumbnail.',
        solution: 'Convert image format, or reduce image resolution.',
        steps: [
          'Check if image format is supported',
          'Try converting to JPEG/PNG',
          'Reduce image resolution and retry',
          'Use alternative image as thumbnail',
        ],
        prevention: 'Automatically convert and compress images for thumbnail generation during upload.',
      },
      
        {
          code: 'FILE_CORRUPTED',
          message: 'File is corrupted',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'File was corrupted during transmission or storage (e.g., network interruption, disk bad sectors, memory errors).',
          solution: 'Re-download or re-generate the file, check storage medium health status.',
          steps: [
            'Try to re-download/upload the file',
            'Check if the file hash matches the original',
            'Use file repair tools',
            'Check disk health status (SMART)'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_INCOMPLETE_DOWNLOAD',
          message: 'File download incomplete',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The download was interrupted during the process, only part of the file was downloaded.',
          solution: 'Re-download the file, or use resume support.',
          steps: [
            'Delete the incomplete file',
            'Re-download',
            'If supported, use Range request to resume',
            'Check network stability'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_ENCODING_MISMATCH',
          message: 'File encoding mismatch',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The actual file encoding does not match the declared encoding (e.g., declared UTF-8 but actually GBK).',
          solution: 'Re-read the file using the correct encoding, or use an encoding detection tool.',
          steps: [
            'Use a file encoding detection tool (e.g., chardet)',
            'Try opening with different encodings',
            'Convert the file to the correct encoding',
            'Explicitly specify encoding in code'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_BOM_CONFLICT',
          message: 'File BOM header conflict',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'UTF-8 file contains a BOM header, but the parser did not handle it correctly, causing the first character parsing error.',
          solution: 'Remove the BOM header, or configure the parser to handle BOM correctly.',
          steps: [
            'Use an editor to check if there is a BOM',
            'Remove the BOM header (e.g., using sed)',
            'Configure the parser to automatically handle BOM',
            'Unify team file encoding standards'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_LINE_ENDING_MISMATCH',
          message: 'File line ending mismatch',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'Windows (CRLF) and Unix (LF) line endings are mixed, causing script or parser behavior anomalies.',
          solution: 'Unify line endings to LF, or use tools that support both line endings.',
          steps: [
            'Use dos2unix or unix2dos to convert',
            'Configure the editor to automatically handle line endings',
            'Specify line endings in .gitattributes',
            'Use parsers that support CRLF/LF'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_HIDDEN_ATTRIBUTE',
          message: 'File is set to hidden',
          severity: 'info',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file has the hidden attribute and is not visible in the default file browser.',
          solution: 'Show hidden files, or remove the hidden attribute.',
          steps: [
            'Show hidden files in the file browser',
            'Use command line to remove hidden attribute (attrib -h)',
            'Check file permissions',
            'Confirm the file was not hidden by malware'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_SYSTEM_READONLY',
          message: 'File system is read-only',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file system is mounted as read-only, or the disk encountered an error and automatically switched to read-only mode.',
          solution: 'Check disk health, remount as read-write, or repair the file system.',
          steps: [
            'Check disk mount options',
            'Run file system check (fsck/chkdsk)',
            'Check disk SMART status',
            'Back up data and replace faulty disk'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_HARD_LINK_LIMIT',
          message: 'File hard link limit reached',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The number of hard links for the file system has reached the limit (e.g., ext4 default 65000).',
          solution: 'Delete unnecessary hard links, or use symbolic links instead.',
          steps: [
            'Check the number of hard links for the file (ls -l)',
            'Delete unnecessary hard links',
            'Use symbolic links (soft links) instead',
            'Consider using a file system that supports more hard links'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_SYMBOLIC_LINK_BROKEN',
          message: 'Symbolic link is broken',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The target file or directory pointed to by the symbolic link no longer exists.',
          solution: 'Delete the broken symbolic link, or re-create it pointing to the correct target.',
          steps: [
            'Check if the symbolic link target exists',
            'Delete the broken link (rm linkname)',
            'Re-create the symbolic link (ln -s)',
            'Check if the target path is correct'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_SYMBOLIC_LINK_LOOP',
          message: 'Symbolic link loop',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'Symbolic links form a circular reference (A points to B, B points to A).',
          solution: 'Delete the symbolic links causing the loop and reorganize the directory structure.',
          steps: [
            'Use find -follow to detect loops',
            'Delete the links causing the loop',
            'Re-plan the directory structure',
            'Use absolute paths when creating links'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_NAME_TOO_LONG',
          message: 'File name too long',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file name or path length exceeds the file system limit (e.g., ext4 255 chars, NTFS 260 chars).',
          solution: 'Shorten the file name or path, or use a file system that supports long paths.',
          steps: [
            'Shorten the file name',
            'Move the file to a shallower directory',
            'On Windows, enable long path support',
            'Use a file system that supports long paths'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_PATH_TOO_DEEP',
          message: 'Directory nesting too deep',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file path directory levels are too deep, exceeding the operating system or file system limit.',
          solution: 'Reduce directory nesting levels, or move files to shallower locations.',
          steps: [
            'Reduce directory levels',
            'Use a flattened directory structure',
            'Move deep files closer to the root',
            'Check the operating system path length limit'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_ILLEGAL_CHARACTERS',
          message: 'File name contains illegal characters',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file name contains characters not supported by the file system (e.g., /  : * ? " < > |).',
          solution: 'Remove illegal characters, use safe file names.',
          steps: [
            'Check for illegal characters in the file name',
            'Remove or replace with underscore/hyphen',
            'Use a file name sanitization function',
            'Validate the file name before saving'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_RESERVED_NAME',
          message: 'Used system reserved file name',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file name conflicts with a system reserved name (e.g., Windows CON, PRN, AUX, NUL, COM1, etc.).',
          solution: 'Use a different file name, avoid system reserved names.',
          steps: [
            'Check if it is a system reserved name',
            'Modify the file name',
            'Add a prefix or suffix to distinguish',
            'Refer to the operating system reserved name list'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_CASE_SENSITIVITY_CONFLICT',
          message: 'File name case conflict',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'On case-insensitive file systems (e.g., macOS default APFS, Windows NTFS), File.txt and file.txt are treated as the same file.',
          solution: 'Unify file name case conventions, or migrate to a case-sensitive file system.',
          steps: [
            'Unify to lowercase file names',
            'Use kebab-case or snake_case',
            'Avoid file names that differ only in case',
            'Develop on a case-sensitive file system'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_PERMISSION_DENIED_READ',
          message: 'File read permission denied',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The current user does not have permission to read the file.',
          solution: 'Modify file permissions, or run as a user with permissions.',
          steps: [
            'Check file permissions (ls -l)',
            'Use chmod to add read permission',
            'Confirm the file owner is correct',
            'Run as administrator/root'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_PERMISSION_DENIED_WRITE',
          message: 'File write permission denied',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The current user does not have permission to write the file.',
          solution: 'Modify file permissions, or move the file to a writable directory.',
          steps: [
            'Check file and directory write permissions',
            'Use chmod to add write permission',
            'Move the file to a user-writable directory',
            'Check if the directory is mounted read-only'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_PERMISSION_DENIED_EXECUTE',
          message: 'File execute permission denied',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The current user does not have permission to execute the file (common for scripts and binaries).',
          solution: 'Add execute permission, or check if the file is actually executable.',
          steps: [
            'Use chmod +x to add execute permission',
            'Check the file header to confirm it is an executable format',
            'Confirm the file is not corrupted',
            'Check file system mount options (noexec)'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_LOCKED_BY_ANOTHER_PROCESS',
          message: 'File locked by another process',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'Another process is using the file and holding a lock, the current process cannot access it.',
          solution: 'Close the process occupying the file, or wait for it to release the lock.',
          steps: [
            'Find the process occupying the file (lsof/fuser)',
            'Terminate the occupying process',
            'Wait for the file to be released',
            'Use file lock timeout mechanism'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_QUOTA_EXCEEDED',
          message: 'User disk quota exceeded',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The current user disk usage exceeds the quota limit set by the administrator.',
          solution: 'Delete unnecessary files, or contact the administrator to increase the quota.',
          steps: [
            'Check current disk usage (du)',
            'Delete large or old files',
            'Compress files to save space',
            'Contact the administrator to increase the quota'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_INODE_EXHAUSTED',
          message: 'File system inode exhausted',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The number of files created in the file system has reached the inode limit (common with large numbers of small files).',
          solution: 'Delete unnecessary files, or reformat the file system with more inodes.',
          steps: [
            'Check inode usage (df -i)',
            'Delete large numbers of small files',
            'Merge small files into archives',
            'Recreate the file system and increase inode count'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_SYSTEM_FULL',
          message: 'File system is full',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'Disk partition usage has reached 100%, unable to write new data.',
          solution: 'Clean up disk space, delete unnecessary files, or expand disk capacity.',
          steps: [
            'Check disk usage (df -h)',
            'Find large files and delete or archive them',
            'Clean up logs and temporary files',
            'Expand the disk partition'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_TEMP_DIRECTORY_UNWRITABLE',
          message: 'Temporary directory not writable',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The system temporary directory (/tmp, C:\Windows\Temp) is not writable or is full.',
          solution: 'Clean up the temporary directory, or specify another writable temporary directory.',
          steps: [
            'Check temporary directory write permissions',
            'Clean up temporary files',
            'Set TMPDIR/TEMP environment variable to point to a writable directory',
            'Restart the application'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_INTERRUPTED',
          message: 'File upload interrupted',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The upload was interrupted due to network disconnection, browser closure, or user cancellation.',
          solution: 'Re-upload the file, or use resume support.',
          steps: [
            'Check network connection',
            'Re-select the file to upload',
            'If resume is supported, continue the upload',
            'Monitor upload progress'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_SIZE_MISMATCH',
          message: 'Uploaded file size mismatch',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file size declared by the client does not match the actually uploaded size.',
          solution: 'Re-upload the file, or check if the file was modified during transmission.',
          steps: [
            'Re-upload the file',
            'Check if the file was compressed or modified during transmission',
            'Verify file integrity',
            'Check if the proxy modified the request'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_CHECKSUM_MISMATCH',
          message: 'Uploaded file checksum mismatch',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'After upload, the server-calculated checksum does not match the client-provided one, indicating data corruption during transmission.',
          solution: 'Re-upload the file, or check network stability.',
          steps: [
            'Re-upload the file',
            'Check network stability',
            'Use a stronger checksum algorithm',
            'If multiple failures occur, check network card or cable'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_VIRUS_DETECTED',
          message: 'Uploaded file contains a virus',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The file was detected to contain malicious code by antivirus software after upload.',
          solution: 'Delete the file, use files from trusted sources, or check if it is a false positive.',
          steps: [
            'Immediately delete the infected file',
            'Cross-validate with other antivirus software',
            'If it is a false positive, add to whitelist',
            'Only download files from trusted sources'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_CONTENT_TYPE_SPOOFED',
          message: 'Uploaded file content type spoofed',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The uploaded file extension does not match its actual content (e.g., renaming .exe to .jpg).',
          solution: 'Server-side validation of file magic number, not just extension.',
          steps: [
            'Server-side check of file magic number instead of extension',
            'Reject files with mismatched content types',
            'Use file type detection libraries',
            'Log and audit suspicious uploads'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_UPLOAD_PATH_TRAVERSAL',
          message: 'Upload path traversal attack',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The uploaded file name contains path traversal characters (e.g., ../) attempting to write the file to an unexpected directory.',
          solution: 'Strictly filter file names, only allow legal characters, store files in an isolated directory.',
          steps: [
            'Filter path separators and .. in file names',
            'Use UUID as the storage file name',
            'Store uploaded files in an isolated directory',
            'Prohibit determining storage path based on user input'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_DOWNLOAD_INTERRUPTED',
          message: 'File download interrupted',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The download was interrupted due to network disconnection, browser closure, or insufficient disk space.',
          solution: 'Re-download the file, or use resume support.',
          steps: [
            'Check network connection',
            'Confirm there is sufficient disk space',
            'Re-download',
            'Use a download tool that supports resume'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_DOWNLOAD_REDIRECT_LOOP',
          message: 'File download redirect loop',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The download URL has a circular redirect (A → B → A).',
          solution: 'Check the download link, manually follow the redirect chain.',
          steps: [
            'Use curl -v to view the redirect chain',
            'Check server redirect configuration',
            'Use a direct download link',
            'Limit the maximum number of redirects'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_DOWNLOAD_MIME_TYPE_MISMATCH',
          message: 'Downloaded file MIME type mismatch',
          severity: 'warning',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The downloaded file Content-Type does not match the file extension.',
          solution: 'Verify the actual file content, do not rely solely on extension or MIME type.',
          steps: [
            'Check the response header Content-Type',
            'Verify the file magic number',
            'If the content is normal, ignore the warning',
            'If it is a malicious file, delete it'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_ARCHIVE_CORRUPTED',
          message: 'Archive file is corrupted',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The archive file (zip/rar/7z) was corrupted during transmission or the download is incomplete.',
          solution: 'Re-download the archive file, or attempt to repair it.',
          steps: [
            'Re-download the archive file',
            'Try the repair function of the compression software',
            'Check the file hash value',
            'Use a more reliable transmission method'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_ARCHIVE_PASSWORD_REQUIRED',
          message: 'Archive file requires password',
          severity: 'info',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The archive file is password protected and cannot be extracted directly.',
          solution: 'Enter the correct extraction password.',
          steps: [
            'Obtain the password for the archive file',
            'Enter the password in the extraction tool',
            'If the password is forgotten, try contacting the file provider',
            'Do not use brute force on others files'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_ARCHIVE_UNSUPPORTED_FORMAT',
          message: 'Unsupported archive format',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The archive file uses an unsupported format (e.g., rar5, lzma2).',
          solution: 'Use extraction software that supports the format, or ask the provider to use a standard format.',
          steps: [
            'Confirm the archive file format',
            'Install software that supports the format',
            'Ask the provider to use zip format',
            'Use an online conversion tool'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_IMAGE_DECOMPRESSION_BOMB',
          message: 'Image decompression bomb detected',
          severity: 'critical',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The uploaded image is a compression bomb (image version of zip bomb), consuming extremely large amounts of memory after decompression.',
          solution: 'Limit the maximum decompressed image size, reject suspicious files.',
          steps: [
            'Limit the maximum image pixel size',
            'Check if the image compression ratio is abnormal',
            'Use streaming decoding to avoid one-time loading',
            'Reject images with abnormally high compression ratios'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_AUDIO_UNSUPPORTED_CODEC',
          message: 'Unsupported audio codec',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The audio file uses a codec not supported by the browser or application (e.g., FLAC, ALAC).',
          solution: 'Convert the audio to a supported format (MP3, AAC, OGG, WAV).',
          steps: [
            'Confirm the encoding format of the audio file',
            'Use FFmpeg to convert to MP3/AAC',
            'Check the browser supported audio format list',
            'Provide multiple formats for user selection'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_VIDEO_UNSUPPORTED_CODEC',
          message: 'Unsupported video codec',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The video file uses a codec not supported by the browser or application (e.g., H.265/HEVC, AV1).',
          solution: 'Convert the video to a supported format (H.264, VP9).',
          steps: [
            'Confirm the encoding format of the video file',
            'Use FFmpeg to convert to H.264',
            'Check the browser supported video format list',
            'Provide multiple formats or transcoding services'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_DOCUMENT_MALFORMED',
          message: 'Document format corrupted',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The document file (PDF, DOCX, etc.) structure is corrupted and cannot be properly parsed.',
          solution: 'Try opening with other software, or restore from backup.',
          steps: [
            'Try opening with different software',
            'Use document repair tools',
            'Restore from backup',
            'Re-generate the document'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },
        {
          code: 'FILE_SCAN_OCR_FAILED',
          message: 'Scanned document OCR recognition failed',
          severity: 'error',
          category: 'C. Files & Input',
          location: 'Page: Any tool involving file operations → Area: File upload/download/processing',
          cause: 'The scanned image quality is poor, text is blurry, or the language is not supported, causing OCR to fail.',
          solution: 'Increase scan resolution, ensure text is clear, or use an OCR engine that supports the language.',
          steps: [
            'Increase scan resolution (at least 300 DPI)',
            'Ensure text is clear and not blurry',
            'Check if OCR supports the language',
            'Preprocess the image (denoise, binarize)'
          ],
          prevention: 'Validate file format and size, use safe file name handling, regularly clean temporary files.',
        },],
    },
    {
      id: 'D',
      name: 'D. Model & Generation',
      description: 'Model loading failure, image generation errors, content interception',
      errors: [
        {
          code: 'IMG_PROMPT_TOO_LONG',
          message: 'Image generation prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer / Face Maker',
          cause: 'The prompt text entered is too long, exceeding the backend model\'s limit.',
          solution: 'Shorten the prompt.',
          steps: [
            'Delete secondary descriptive vocabulary',
            'Retain core subject and style description',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'MODEL_NOT_FOUND',
          message: 'Model not found or unavailable',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer / Paper2Gal / Prompt Suite / LLM Hub',
          cause: 'Model is not configured on the backend, has been removed, or the Key does not have access permission.',
          solution: 'Contact the backend administrator or replace the Key.',
          steps: [
            'View the specific model information in the error details',
            'Contact the backend administrator to confirm model status',
            'Or replace with an API Key that has permission',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '403_FORBIDDEN'],
          prevention: 'Ensure the model configured on the backend is available and the current Key has permission to access it; regularly verify Key permissions.',
        },
        {
          code: 'PROMPT_BLOCKED',
          message: 'Content policy violation or sensitive word interception',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Paper2Gal / Prompt Suite / Style Transfer',
          cause: 'Content in the prompt was intercepted by the safety filter.',
          solution: 'Modify the prompt, remove sensitive vocabulary.',
          steps: [
            'Check the error details for the specific intercepted content',
            'Modify the prompt, replacing or removing sensitive vocabulary',
            'Retry',
          ],
          relatedCodes: ['403_FORBIDDEN', 'P2G_WORKFLOW_ERROR'],
          prevention: 'Avoid using sensitive vocabulary when modifying prompts; test with the default prompt first, then customize after it passes.',
        },
        {
          code: 'PROMPT_TOO_LONG',
          message: 'Prompt exceeds maximum length',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer / Face Maker',
          cause: 'The prompt text entered is too long, exceeding the backend model\'s limit.',
          solution: 'Shorten the prompt.',
          steps: [
            'Delete secondary descriptive vocabulary',
            'Retain core subject and style description',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND'],
        },
        {
          code: 'STYLE_TRANSFER_REQUEST_FAILED',
          message: 'Style transfer request failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer',
          cause: 'Backend returns an error.',
          solution: 'Check error details and retry.',
          steps: [
            'View specific error information',
            'Check API Key and backend status',
            'Modify prompt and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED'],
        },
        {
          code: 'TTS_AUDIO_GENERATION_FAILED',
          message: 'TTS audio generation failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: TTS Export',
          cause: 'Backend TTS service exception.',
          solution: 'Check backend status, reference audio, and text content.',
          steps: [
            'Check specific error information',
            'Confirm reference audio format is correct',
            'Simplify text',
            'Switch voice preset',
            'Retry',
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: 'Simplify text and remove special symbols; confirm reference audio format is correct; select known available voice presets.',
        },
        {
          code: 'TTS_REFERENCE_INVALID',
          message: 'Reference audio is invalid',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: TTS Export',
          cause: 'Reference audio format is not supported or file is too large.',
          solution: 'Replace with a valid audio file.',
          steps: [
            'Confirm format is WAV/MP3/OGG',
            'Confirm file size is within limit',
            'Re-upload',
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_TOO_LARGE'],
        },
      {
        code: 'RENDER_DOM_TOO_DEEP',
        message: 'DOM tree nesting too deep',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Component nesting levels too many, causing rendering performance degradation.',
        solution: 'Refactor components to reduce nesting levels.',
        steps: [
          'Use React DevTools to inspect component hierarchy',
          'Extract deep nesting into independent components',
          'Use virtual lists for rendering large numbers of elements',
          'Reduce unnecessary wrapper components',
        ],
        prevention: 'Keep component hierarchy under 10 levels, use flattened structure.',
      },
      {
        code: 'RENDER_STYLE_RECALCULATION_STORM',
        message: 'Style recalculation storm',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Frequent style modifications causing browser to constantly reflow and repaint.',
        solution: 'Batch style modifications, use CSS variables or transform.',
        steps: [
          'Use DevTools Performance panel for analysis',
          'Hide element before batch DOM modifications',
          'Use CSS transform instead of position properties',
          'Throttle style updates with requestAnimationFrame',
        ],
        prevention: 'Avoid frequently modifying styles in loops, use CSS variables for unified control.',
      },
      {
        code: 'RENDER_IFRAME_SANDBOX_VIOLATION',
        message: 'iframe sandbox policy violation',
        severity: 'error',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'iframe sandbox attributes blocked necessary operations like script execution or form submission.',
        solution: 'Adjust sandbox attributes to allow necessary permissions.',
        steps: [
          'Check iframe sandbox attributes',
          'Add allow-scripts or allow-forms',
          'Confirm parent and child pages are same-origin',
          'Use postMessage for cross-domain communication',
        ],
        prevention: 'Design with clear iframe permission requirements, minimize sandbox restrictions.',
      },
      {
        code: 'RENDER_SHADOW_DOM_SLOT_MISMATCH',
        message: 'Shadow DOM slot mismatch',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Content inserted into Shadow DOM does not match defined slot names.',
        solution: 'Check slot names, ensure content corresponds to slots.',
        steps: [
          'Check custom element slot definitions',
          'Confirm slot attribute of inserted content',
          'Use default slot as fallback',
          'View Shadow DOM tree in browser DevTools',
        ],
        prevention: 'Clearly define all slot names and purposes in documentation.',
      },
      {
        code: 'RENDER_WEB_COMPONENT_UNDEFINED',
        message: 'Custom element undefined',
        severity: 'error',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Used tag for unregistered custom element.',
        solution: 'Import and register corresponding custom element.',
        steps: [
          'Confirm custom element JS file is loaded',
          'Check customElements.define call',
          'Confirm element tag name spelling is correct',
          'Wait for script to finish loading before use',
        ],
        prevention: 'Ensure custom element definition is registered before use.',
      },
      {
        code: 'RENDER_SVG_VIEWBOX_INVALID',
        message: 'SVG viewBox attribute invalid',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'SVG viewBox attribute format incorrect or values unreasonable.',
        solution: 'Fix viewBox attribute to correct format.',
        steps: [
          'Check viewBox="x y width height" format',
          'Confirm all values are valid numbers',
          'Re-export SVG from design tool',
          'Manually fix viewBox values',
        ],
        prevention: 'Export standard format SVG from design tools.',
      },
      {
        code: 'RENDER_CANVAS_CONTEXT_LOST',
        message: 'Canvas context lost',
        severity: 'error',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Browser lost Canvas context due to insufficient memory or GPU reset.',
        solution: 'Listen for contextlost event and reinitialize Canvas.',
        steps: [
          'Add canvas.addEventListener("webglcontextlost")',
          'Save current state in event handler',
          'Add webglcontextrestored listener',
          'Redraw content after restoration',
        ],
        prevention: 'Avoid creating too many Canvases simultaneously, release unused contexts promptly.',
      },
      {
        code: 'RENDER_CSS_GRID_OVERFLOW',
        message: 'CSS Grid content overflow',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Grid cell content exceeds defined dimensions.',
        solution: 'Adjust grid template, or use minmax() and auto sizing.',
        steps: [
          'Check grid-template-columns/rows definitions',
          'Use minmax(200px, 1fr) instead of fixed sizes',
          'Add overflow: hidden or scroll',
          'Adjust content size to fit grid',
        ],
        prevention: 'Use responsive grid definitions, avoid fixed dimensions.',
      },
      {
        code: 'RENDER_ACCESSIBILITY_TREE_BROKEN',
        message: 'Accessibility tree structure broken',
        severity: 'warning',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'DOM structure prevents screen readers from correctly parsing page.',
        solution: 'Fix semantic HTML structure, add correct ARIA attributes.',
        steps: [
          'Use axe DevTools to check accessibility',
          'Ensure heading hierarchy is continuous',
          'Add correct role to interactive elements',
          'Fix label and input associations',
        ],
        prevention: 'Use accessibility checking tools during development, follow WCAG standards.',
      },
      {
        code: 'RENDER_PRINT_STYLESHEET_MISSING',
        message: 'Print stylesheet missing',
        severity: 'info',
        category: 'D. Model & Generation',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Page lacks @media print styles, causing poor print output.',
        solution: 'Add print styles, hide unnecessary elements.',
        steps: [
          'Add @media print style rules',
          'Hide navigation bars, buttons and other interactive elements',
          'Adjust font sizes and colors for print',
          'Use print preview to check results',
        ],
        prevention: 'Consider print scenarios during design, add print styles.',
      },
      
        {
          code: 'MODEL_LOAD_TIMEOUT',
          message: 'Model loading timed out',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model selection / generation',
          cause: 'The AI model took too long to load from the backend, possibly due to large model size or slow network.',
          solution: 'Retry with a different model or check backend connectivity.',
          steps: [
            'Select a smaller or lighter model',
            'Check network connection stability',
            'Refresh the page and retry',
            'Contact backend admin if issue persists'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'API_TIMEOUT'],
          prevention: 'Use models with known fast load times; ensure stable network before generation.',
        },
        {
          code: 'MODEL_INFERENCE_FAILED',
          message: 'Model inference failed during generation',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer / LLM Hub',
          cause: 'The model encountered an internal error during inference, such as NaN values or layer mismatch.',
          solution: 'Switch to a different model version or restart the backend service.',
          steps: [
            'Check backend error logs for model stack trace',
            'Switch to an alternative model',
            'Restart the backend inference service',
            'Retry generation with simplified input'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Keep models updated; monitor backend inference health regularly.',
        },
        {
          code: 'GPU_OUT_OF_MEMORY',
          message: 'GPU ran out of memory during inference',
          severity: 'critical',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: generation panel',
          cause: 'The model inference request exceeded available GPU VRAM, especially with large images or batch sizes.',
          solution: 'Reduce image size, batch size, or switch to CPU inference.',
          steps: [
            'Reduce image resolution to 512x512 or lower',
            'Set batch size to 1',
            'Enable CPU offload if backend supports it',
            'Close other GPU-intensive applications'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Monitor GPU memory usage; use smaller resolutions for tests.',
        },
        {
          code: 'TOKEN_LIMIT_EXCEEDED',
          message: 'Input tokens exceed model maximum context length',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: prompt editor',
          cause: 'The combined system prompt and user message exceed the model\'s maximum token limit.',
          solution: 'Shorten the prompt or increase Max Tokens within model limits.',
          steps: [
            'Count tokens using a tokenizer tool',
            'Shorten system prompt to essential instructions',
            'Split long input into multiple messages',
            'Select a model with larger context window'
          ],
          relatedCodes: ['PROMPT_TOO_LONG', 'LLM_MODEL_UNAVAILABLE'],
          prevention: 'Estimate token count before sending; use models with adequate context windows.',
        },
        {
          code: 'FINETUNE_DATA_INVALID',
          message: 'Fine-tuning dataset format is invalid',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: fine-tune panel',
          cause: 'The uploaded JSONL file for fine-tuning does not conform to the required schema.',
          solution: 'Validate and correct the dataset format before uploading.',
          steps: [
            'Open the JSONL file in a text editor',
            'Ensure each line has "prompt" and "completion" fields',
            'Validate JSON syntax on each line',
            'Re-upload the corrected file'
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', '400_BAD_REQUEST'],
          prevention: 'Use the provided dataset template; validate JSONL before upload.',
        },
        {
          code: 'FINETUNE_JOB_FAILED',
          message: 'Fine-tuning job failed on backend',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: fine-tune panel',
          cause: 'The fine-tuning process crashed due to insufficient resources, invalid hyperparameters, or corrupted data.',
          solution: 'Review job logs, fix parameters, and resubmit.',
          steps: [
            'Open job logs on the backend dashboard',
            'Check for out-of-memory or data errors',
            'Adjust learning rate and batch size',
            'Resubmit with corrected configuration'
          ],
          relatedCodes: ['FINETUNE_DATA_INVALID', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Start with small datasets and conservative hyperparameters.',
        },
        {
          code: 'SAMPLING_TEMP_INVALID',
          message: 'Sampling temperature parameter out of range',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: parameters panel',
          cause: 'Temperature value is set outside the valid range (typically 0 to 2).',
          solution: 'Adjust temperature to a value within the supported range.',
          steps: [
            'Set Temperature to 0.7 as a safe default',
            'Ensure value is between 0.0 and 2.0',
            'Save configuration and retry'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED'],
          prevention: 'Use UI sliders with clamped values to prevent out-of-range inputs.',
        },
        {
          code: 'TOP_P_INVALID',
          message: 'Top-p (nucleus sampling) parameter invalid',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: parameters panel',
          cause: 'Top-p value is outside the valid 0 to 1 range.',
          solution: 'Set top-p to a valid value between 0 and 1.',
          steps: [
            'Change Top-p to 1.0 for full sampling',
            'Ensure value is between 0.0 and 1.0',
            'Retry the request'
          ],
          relatedCodes: ['SAMPLING_TEMP_INVALID'],
          prevention: 'Validate parameter ranges client-side before sending requests.',
        },
        {
          code: 'MAX_TOKENS_TOO_HIGH',
          message: 'Max Tokens exceeds model capacity',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: parameters panel',
          cause: 'The requested Max Tokens is larger than the model\'s maximum output capacity.',
          solution: 'Reduce Max Tokens to within the model\'s supported limit.',
          steps: [
            'Check model documentation for max output tokens',
            'Set Max Tokens to half the context length',
            'Retry generation'
          ],
          relatedCodes: ['TOKEN_LIMIT_EXCEEDED', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Display model-specific token limits in the UI.',
        },
        {
          code: 'MODEL_QUANTIZATION_ERROR',
          message: 'Quantized model failed to load',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model dropdown',
          cause: 'The quantized model file is incompatible with the current inference engine or corrupted.',
          solution: 'Re-download or regenerate the quantized model weights.',
          steps: [
            'Verify quantization format matches backend (GGUF, ONNX, etc.)',
            'Re-download model weights from official source',
            'Try unquantized version if available',
            'Update inference engine to latest version'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_LOAD_TIMEOUT'],
          prevention: 'Use officially supported quantization formats and versions.',
        },
        {
          code: 'LORA_LOAD_FAILED',
          message: 'LoRA adapter failed to load',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The LoRA weights file is incompatible with the base model or corrupted.',
          solution: 'Use a LoRA compatible with the selected base model.',
          steps: [
            'Confirm LoRA is trained for the selected base model',
            'Check LoRA file size and format',
            'Re-download LoRA if corrupted',
            'Try generation without LoRA'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Only use LoRAs explicitly compatible with the base model version.',
        },
        {
          code: 'CONTROLNET_INCOMPATIBLE',
          message: 'ControlNet model incompatible with base model',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer',
          cause: 'The ControlNet architecture does not match the base diffusion model version.',
          solution: 'Select a ControlNet variant built for the current base model.',
          steps: [
            'Check ControlNet model card for compatibility',
            'Download matching ControlNet version',
            'Reload the backend with correct models',
            'Retry style transfer'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Maintain a compatibility matrix for ControlNet and base models.',
        },
        {
          code: 'VAE_DECODE_ERROR',
          message: 'VAE decode produced corrupted output',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The VAE failed to decode latent representations into a valid image.',
          solution: 'Switch to a different VAE or regenerate with new seed.',
          steps: [
            'Try a different VAE model',
            'Change random seed and retry',
            'Check GPU memory and temperature',
            'Restart backend inference service'
          ],
          relatedCodes: ['GPU_OUT_OF_MEMORY', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Use VAEs validated with the base model; monitor GPU health.',
        },
        {
          code: 'SCHEDULER_STEP_ERROR',
          message: 'Diffusion scheduler step computation failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The noise scheduler encountered a numerical error during denoising steps.',
          solution: 'Change scheduler type or reduce inference steps.',
          steps: [
            'Switch from DPM++ to Euler scheduler',
            'Reduce number of inference steps to 20',
            'Check for NaN values in model weights',
            'Retry with a different seed'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Use stable schedulers; avoid extreme step counts.',
        },
        {
          code: 'NEGATIVE_PROMPT_TOO_LONG',
          message: 'Negative prompt exceeds token limit',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The negative prompt text is too long and was truncated, reducing its effectiveness.',
          solution: 'Shorten the negative prompt to essential terms only.',
          steps: [
            'Remove redundant negative terms',
            'Keep only the most important exclusions',
            'Count tokens and verify under limit',
            'Retry generation'
          ],
          relatedCodes: ['PROMPT_TOO_LONG', 'TOKEN_LIMIT_EXCEEDED'],
          prevention: 'Keep negative prompts concise; avoid copy-pasting long lists.',
        },
        {
          code: 'CLIP_TEXT_ENCODE_FAILED',
          message: 'CLIP text encoder failed to process prompt',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The CLIP model encountered an error encoding the prompt, possibly due to special characters.',
          solution: 'Remove special characters and retry with plain text.',
          steps: [
            'Remove emojis and unusual Unicode characters',
            'Use standard ASCII punctuation only',
            'Simplify prompt grammar',
            'Retry encoding'
          ],
          relatedCodes: ['PROMPT_BLOCKED', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Sanitize prompts before submission; reject unusual Unicode.',
        },
        {
          code: 'IMAGE_SEED_INVALID',
          message: 'Random seed value is invalid',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The seed value is outside the valid integer range or contains decimals.',
          solution: 'Enter a valid non-negative integer seed.',
          steps: [
            'Set seed to -1 for random',
            'Or enter an integer between 0 and 2147483647',
            'Remove decimal points',
            'Retry generation'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED'],
          prevention: 'Use integer input fields with validation for seed values.',
        },
        {
          code: 'BATCH_SIZE_UNSUPPORTED',
          message: 'Batch size not supported by model',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The requested batch size exceeds what the backend can process with current memory.',
          solution: 'Reduce batch size to 1 and retry.',
          steps: [
            'Set batch size to 1',
            'Close other generation tasks',
            'Check backend memory usage',
            'Retry with smaller batch'
          ],
          relatedCodes: ['GPU_OUT_OF_MEMORY', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Limit batch size in UI based on backend capacity.',
        },
        {
          code: 'CHECKPOINT_MERGE_FAILED',
          message: 'Model checkpoint merge failed',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: model management',
          cause: 'Merging two model checkpoints produced incompatible weights or shape mismatches.',
          solution: 'Ensure checkpoints have identical architectures before merging.',
          steps: [
            'Verify both checkpoints use same base architecture',
            'Check layer shapes match exactly',
            'Use merge tools that validate compatibility',
            'Fallback to single checkpoint if merge fails'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Only merge checkpoints known to share the same architecture.',
        },
        {
          code: 'DIFFUSION_PIPELINE_INIT_FAILED',
          message: 'Diffusion pipeline initialization failed',
          severity: 'critical',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The diffusion pipeline could not initialize due to missing components or version mismatch.',
          solution: 'Reinstall pipeline dependencies and verify model cache.',
          steps: [
            'Clear the model cache directory',
            'Reinstall diffusers/transformers libraries',
            'Verify Python environment versions',
            'Restart backend service'
          ],
          relatedCodes: ['MODEL_LOAD_TIMEOUT', 'MODEL_NOT_FOUND'],
          prevention: 'Pin dependency versions; use containerized deployments.',
        },
        {
          code: 'TEXT_ENCODER_OOM',
          message: 'Text encoder ran out of memory',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: generation panel',
          cause: 'The text encoding phase exceeded available memory due to very long input.',
          solution: 'Truncate input or enable gradient checkpointing on backend.',
          steps: [
            'Shorten the input prompt',
            'Enable memory-efficient attention if available',
            'Switch to a smaller text encoder model',
            'Retry with chunked input'
          ],
          relatedCodes: ['TOKEN_LIMIT_EXCEEDED', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Set input length limits; use memory-efficient attention.',
        },
        {
          code: 'UNET_INFERENCE_ERROR',
          message: 'U-Net inference returned invalid latents',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The U-Net model produced NaN or Inf values during denoising.',
          solution: 'Adjust guidance scale or use a different model.',
          steps: [
            'Reduce CFG scale to 7 or lower',
            'Switch to a different checkpoint',
            'Check for mixed precision conflicts',
            'Retry with float32 precision'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Use stable guidance scales; validate model weights integrity.',
        },
        {
          code: 'MODEL_CACHED_CORRUPTED',
          message: 'Cached model weights are corrupted',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model loading',
          cause: 'Previously downloaded model weights were incomplete or corrupted during download.',
          solution: 'Clear model cache and re-download.',
          steps: [
            'Locate backend model cache directory',
            'Delete corrupted model folder',
            'Trigger re-download from official source',
            'Verify checksum after download'
          ],
          relatedCodes: ['MODEL_LOAD_TIMEOUT', 'MODEL_NOT_FOUND'],
          prevention: 'Verify model checksums after download; use atomic downloads.',
        },
        {
          code: 'PRECISION_MISMATCH',
          message: 'Model precision mismatch with backend',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model loading',
          cause: 'The model was saved in fp16 but backend expects fp32, or vice versa.',
          solution: 'Convert model precision or configure backend to match.',
          steps: [
            'Check model precision metadata',
            'Convert weights using conversion script',
            'Or set backend precision flag to match',
            'Reload model'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED', 'MODEL_LOAD_TIMEOUT'],
          prevention: 'Standardize on fp16 with fp32 fallback; document precision requirements.',
        },
        {
          code: 'INPAINT_MASK_INVALID',
          message: 'Inpainting mask format is invalid',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Style Transfer → Area: mask editor',
          cause: 'The uploaded mask image does not match the source dimensions or has invalid channel format.',
          solution: 'Use a mask with exact same dimensions as source image.',
          steps: [
            'Verify mask width and height match source',
            'Convert mask to single-channel grayscale',
            'Upload PNG mask with transparency or black/white',
            'Retry inpainting'
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Auto-resize masks to source dimensions; validate format on upload.',
        },
        {
          code: 'UPSCALE_MODEL_MISSING',
          message: 'Upscaling model not found',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Image Format Converter',
          cause: 'The Real-ESRGAN or similar upscaling model is missing from backend.',
          solution: 'Download the upscaling model or disable upscaling.',
          steps: [
            'Check backend model directory for upscaler weights',
            'Download Real-ESRGAN model from official release',
            'Place in correct models folder',
            'Restart backend'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_LOAD_TIMEOUT'],
          prevention: 'Bundle common upscaling models with backend deployment.',
        },
        {
          code: 'TTS_VOICE_CLONE_FAILED',
          message: 'Voice cloning reference audio rejected',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: TTS Export → Area: reference upload',
          cause: 'The reference audio contains too much noise, multiple speakers, or is too short.',
          solution: 'Use clean, single-speaker audio of at least 10 seconds.',
          steps: [
            'Record in quiet environment',
            'Ensure only one speaker is present',
            'Trim audio to 10-30 seconds',
            'Re-upload clean audio'
          ],
          relatedCodes: ['TTS_REFERENCE_INVALID', 'TTS_AUDIO_GENERATION_FAILED'],
          prevention: 'Provide audio recording guidelines in the UI.',
        },
        {
          code: 'EMBEDDING_LOAD_FAILED',
          message: 'Textual inversion embedding failed to load',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The textual inversion embedding file is incompatible with the current model or corrupted.',
          solution: 'Use embeddings trained for the exact base model version.',
          steps: [
            'Check embedding model version compatibility',
            'Re-download embedding if corrupted',
            'Try generation without the embedding',
            'Verify file extension (.pt or .safetensors)'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Maintain embedding compatibility lists; validate on upload.',
        },
        {
          code: 'HYPERNETWORK_INCOMPATIBLE',
          message: 'Hypernetwork incompatible with model',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The hypernetwork was trained on a different base model architecture.',
          solution: 'Disable hypernetwork or switch to a compatible one.',
          steps: [
            'Check hypernetwork training base model',
            'Disable hypernetwork in settings',
            'Find hypernetwork for current model',
            'Retry generation'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED', 'CHECKPOINT_MERGE_FAILED'],
          prevention: 'Tag hypernetworks with compatible base model versions.',
        },
        {
          code: 'DYNAMIC_PROMPT_PARSE_ERROR',
          message: 'Dynamic prompt syntax error',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Prompt Suite → Area: prompt editor',
          cause: 'The dynamic prompt syntax (e.g., {red|blue}) is malformed or nested incorrectly.',
          solution: 'Fix dynamic prompt syntax according to documentation.',
          steps: [
            'Check brace matching in prompt',
            'Avoid nesting dynamic syntax too deeply',
            'Use preview mode to test variants',
            'Simplify syntax and retry'
          ],
          relatedCodes: ['PROMPT_TOO_LONG', 'CLIP_TEXT_ENCODE_FAILED'],
          prevention: 'Provide syntax highlighting and validation for dynamic prompts.',
        },
        {
          code: 'MODEL_BLACKLISTED',
          message: 'Selected model is blacklisted',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model dropdown',
          cause: 'The selected model has been removed from the allowlist due to policy or quality issues.',
          solution: 'Select a different approved model.',
          steps: [
            'Check model status in admin panel',
            'Select an alternative model from the list',
            'Contact admin if model should be reinstated'
          ],
          relatedCodes: ['MODEL_NOT_FOUND', '403_FORBIDDEN'],
          prevention: 'Maintain clear model policies; notify users of blacklisted models.',
        },
        {
          code: 'INFERENCE_QUEUE_FULL',
          message: 'Inference queue is full',
          severity: 'warning',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: generation button',
          cause: 'Too many concurrent inference requests; the backend queue has reached capacity.',
          solution: 'Wait and retry, or reduce concurrent generation requests.',
          steps: [
            'Wait 30 seconds and retry',
            'Cancel non-essential generation tasks',
            'Contact admin to scale backend workers',
            'Retry during off-peak hours'
          ],
          relatedCodes: ['429_TOO_MANY_REQUESTS', 'API_TIMEOUT'],
          prevention: 'Implement client-side rate limiting; scale backend based on demand.',
        },
        {
          code: 'TOKENIZER_MISMATCH',
          message: 'Tokenizer version mismatch with model',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: generation panel',
          cause: 'The tokenizer vocab file does not match the model weights version.',
          solution: 'Update tokenizer files to match model version.',
          steps: [
            'Check tokenizer_config.json version',
            'Download matching tokenizer from model repo',
            'Clear cache and reload',
            'Restart backend service'
          ],
          relatedCodes: ['MODEL_INFERENCE_FAILED', 'MODEL_LOAD_TIMEOUT'],
          prevention: 'Always deploy tokenizer and model from the same model release.',
        },
        {
          code: 'ADAPTER_CONFLICT',
          message: 'Multiple adapters conflict with each other',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: LLM Hub → Area: model settings',
          cause: 'Two or more LoRA/adapter weights interfere, producing garbage output.',
          solution: 'Use only one adapter at a time or merge adapters beforehand.',
          steps: [
            'Disable all but one adapter',
            'Test each adapter individually',
            'Merge adapters offline if combination is needed',
            'Retry with single adapter'
          ],
          relatedCodes: ['LORA_LOAD_FAILED', 'MODEL_INFERENCE_FAILED'],
          prevention: 'Warn users when multiple adapters are selected; recommend merging.',
        },
        {
          code: 'MODEL_DOWNLOAD_INTERRUPTED',
          message: 'Model download was interrupted',
          severity: 'error',
          category: 'D. Model & Generation',
          location: 'Page: Any tool → Area: model loading',
          cause: 'Network interruption caused incomplete model download.',
          solution: 'Resume or restart the model download.',
          steps: [
            'Check network connection',
            'Delete partial download file',
            'Restart download from official source',
            'Verify file integrity after completion'
          ],
          relatedCodes: ['MODEL_CACHED_CORRUPTED', 'MODEL_LOAD_TIMEOUT'],
          prevention: 'Use resumable downloads; verify checksums after transfer.',
        },],
    },
    {
      id: 'E',
      name: 'E. Workflow & Conversion',
      description: 'Workflow step failure, conversion errors, progress exceptions',
      errors: [
        {
          code: 'CONVERT_ERROR',
          message: 'Conversion shows "CONVERT_ERROR"',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter → Area: bottom conversion result area',
          cause: 'An exception occurred during image conversion. Possible causes: source image corrupted, unsupported Canvas 2D filter, or insufficient memory.',
          solution: 'Retry with a different image or browser.',
          steps: [
            'Confirm the source image is not corrupted and displays normally',
            'Try refreshing the page and re-uploading',
            'Check if the image is corrupted',
            'Try turning off filters that the browser does not support',
            'Try using a different browser',
          ],
          relatedCodes: ['FILE_CORRUPTED', 'DEVICE_MEMORY_LOW'],
        },
        {
          code: 'CONVERT_FILTER_UNSUPPORTED',
          message: 'Applying certain filters causes exceptions (all on/all off)',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter → Area: filter preview / conversion result area',
          cause: 'The current browser\'s Canvas 2D filter does not support certain values. For example, some older versions of Safari have known issues with filter support.',
          solution: 'Turn off unsupported filters or switch browsers.',
          steps: [
            'Reset filter values to defaults (brightness/contrast/saturation=100, blur/hue rotation/grayscale=0)',
            'Adjust filters one by one to find the one causing the exception',
            'Turn off the problematic filter',
            'Try Chrome/Firefox/Edge',
          ],
          relatedCodes: ['CONVERT_ERROR'],
          prevention: 'For filter adjustments, test incrementally; use mainstream browsers (Chrome/Firefox/Edge).',
        },
        {
          code: 'P2G_WORKFLOW_ERROR',
          message: 'Paper2Gal workflow error',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'A step in the workflow failed to execute.',
          solution: 'Troubleshoot according to error details and retry.',
          steps: [
            'View human-readable error info, possible causes, and fix hints',
            'Check input image',
            'Check network',
            'Modify prompt',
            'Retry or redo individual steps',
          ],
          relatedCodes: ['API_KEY_MISSING', 'API_KEY_EXPIRED', 'MODEL_NOT_FOUND', 'PROMPT_BLOCKED', 'WORKFLOW_STEP_FAILED'],
          prevention: 'Before starting the workflow, confirm the image is valid, network is stable, prompt contains no sensitive vocabulary, and API Key is valid.',
        },
        {
          code: 'REDO_CONFLICT',
          message: 'Redo conflict',
          severity: 'info',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'The current step or another step in its conflict group is already being redone.',
          solution: 'Wait for the current redo to complete.',
          steps: [
            'Observe the redo progress message',
            'Wait for the step status to change to Success or Failed',
            'If stuck for a long time, refresh the page and retry',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: 'Do not initiate multiple redo requests for steps within the same conflict group simultaneously; wait for one to complete before initiating the next.',
        },
        {
          code: 'WORKFLOW_CANCELLED',
          message: 'Workflow was cancelled',
          severity: 'info',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'User cancelled or backend cancelled due to resource constraints.',
          solution: 'Restart the workflow.',
          steps: [
            'Confirm whether you cancelled it yourself',
            'If not, it may be due to insufficient backend resources',
            'Wait a few minutes and restart',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR'],
        },
        {
          code: 'WORKFLOW_NOT_FOUND',
          message: 'Workflow record no longer exists',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'Backend storage was cleared or the workflow record expired.',
          solution: 'Start a new workflow.',
          steps: [
            'The old workflow cannot be recovered',
            'Start a new workflow with the current image',
            'Configure persistent storage to prevent recurrence',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'BACKEND_UNAVAILABLE'],
          prevention: 'When using serverless platforms like Zeabur, be sure to configure persistent storage mounts; after generating important assets, promptly click "Download All" to back up to local.',
        },
        {
          code: 'WORKFLOW_STEP_FAILED',
          message: 'A workflow step failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'An error occurred during execution of a specific step.',
          solution: 'View step error details and retry individually.',
          steps: [
            'Click the failed step card',
            'View error details',
            'Troubleshoot as prompted',
            'Click "Retry Step"',
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'API_TIMEOUT', 'PROMPT_BLOCKED'],
          prevention: 'After a step fails, view error details and retry after modifying the corresponding prompt or checking the network as prompted.',
        },
      {
        code: 'PERFORMANCE_MAIN_THREAD_BLOCKED',
        message: 'Main thread blocked for extended time',
        severity: 'error',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'JavaScript execution too long, causing page freeze or unresponsiveness.',
        solution: 'Split long tasks into smaller tasks, or use Web Worker.',
        steps: [
          'Use Performance panel to locate long tasks',
          'Split calculations into multiple setTimeout/setImmediate',
          'Move complex calculations to Web Worker',
          'Use requestIdleCallback for low-priority tasks',
        ],
        prevention: 'Avoid synchronous tasks over 50ms on main thread.',
      },
      {
        code: 'PERFORMANCE_LAYOUT_THRASHING',
        message: 'Layout thrashing',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Alternating reads and writes of DOM geometric properties causing browser to repeatedly reflow.',
        solution: 'Batch reads and writes, use libraries like FastDOM.',
        steps: [
          'Use FastDOM or similar library for batched read/write',
          'Read all needed geometric properties first',
          'Then batch write all modifications',
          'Use CSS transform instead of position modifications',
        ],
        prevention: 'Follow read-before-write principle, avoid alternating DOM reads/writes in loops.',
      },
      {
        code: 'PERFORMANCE_MEMORY_LEAK_DETECTED',
        message: 'Memory leak detected',
        severity: 'error',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Unreleased references in application causing memory to continuously grow.',
        solution: 'Use memory analysis tools to locate leak source, clean unused references.',
        steps: [
          'Take heap snapshot using Memory panel',
          'Compare memory before and after operations',
          'Check uncleaned event listeners',
          'Check large object references held in closures',
        ],
        prevention: 'Clean all timers, listeners and references when component unmounts.',
      },
      {
        code: 'PERFORMANCE_FORCED_SYNCHRONOUS_LAYOUT',
        message: 'Forced synchronous layout',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Reading geometric properties immediately after style modification forces browser to synchronously calculate layout.',
        solution: 'Separate style modifications from geometric property reads.',
        steps: [
          'Use Performance panel to locate forced layouts',
          'Move read operations before writes',
          'Use requestAnimationFrame to delay reads',
          'Cache geometric properties to avoid repeated reads',
        ],
        prevention: 'Avoid reading offsetWidth/Height immediately after modifying styles.',
      },
      {
        code: 'PERFORMANCE_LONG_TASK_ON_TTI',
        message: 'Long task before Time to Interactive (TTI)',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Long tasks during page load blocked user interaction.',
        solution: 'Defer non-critical script execution, split long tasks.',
        steps: [
          'Use Lighthouse to measure TTI',
          'Mark non-critical scripts as async/defer',
          'Code splitting, load modules on demand',
          'Use PerformanceObserver to monitor long tasks',
        ],
        prevention: 'Only load necessary resources on critical path, defer all other scripts.',
      },
      {
        code: 'PERFORMANCE_CUMULATIVE_LAYOUT_SHIFT',
        message: 'Cumulative Layout Shift (CLS) too high',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Page elements shifted visibly during loading.',
        solution: 'Reserve fixed dimensions for images and containers, avoid content pushing layout after loading.',
        steps: [
          'Set width/height attributes for images',
          'Reserve fixed space for ads and iframes',
          'Use CSS aspect-ratio to maintain proportions',
          'Avoid inserting new elements above existing content',
        ],
        prevention: 'Reserve space for all dynamic content during design, use skeleton screens.',
      },
      {
        code: 'PERFORMANCE_FIRST_INPUT_DELAY_HIGH',
        message: 'First Input Delay (FID) too high',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Main thread busy when user first interacted, unable to respond promptly.',
        solution: 'Reduce main thread load, split long tasks.',
        steps: [
          'Reduce number of third-party scripts',
          'Move non-critical calculations to Web Worker',
          'Use code splitting to reduce initial bundle size',
          'Defer loading non-critical modules',
        ],
        prevention: 'Keep main thread free, ensure critical interaction paths are unobstructed.',
      },
      {
        code: 'PERFORMANCE_SERVICE_WORKER_UPDATE_FAILED',
        message: 'Service Worker update failed',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'New Service Worker installation or activation failed.',
        solution: 'Check Service Worker script, clear cache and retry.',
        steps: [
          'Check Service Worker registration code',
          'View SW status in DevTools Application panel',
          'Clear site data and re-register',
          'Check SW script for syntax errors',
        ],
        prevention: 'Use mature libraries like Workbox to manage Service Workers.',
      },
      {
        code: 'PERFORMANCE_PUSH_NOTIFICATION_BLOCKED',
        message: 'Push notification blocked',
        severity: 'info',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'User or browser settings blocked push notification permission request.',
        solution: 'Guide user to allow notifications in browser settings.',
        steps: [
          'Check Notification.permission status',
          'Guide user to allow notifications in browser settings',
          'Provide clear value proposition for notifications',
          'Do not request permission too frequently',
        ],
        prevention: 'Request notification permission after user completes valuable actions.',
      },
      {
        code: 'PERFORMANCE_OFFLINE_CACHE_STALE',
        message: 'Offline cache data stale',
        severity: 'warning',
        category: 'E. Workflow & Conversion',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Service Worker cached data version too old.',
        solution: 'Update cache strategy, or force refresh cache.',
        steps: [
          'Check Service Worker cache version',
          'Update CACHE_NAME to force refresh',
          'Set maximum age when using Cache-First strategy',
          'Provide manual cache refresh button',
        ],
        prevention: 'Use versioned cache names, implement automatic update mechanism.',
      },
      
        {
          code: 'AUDIO_CONVERT_FAILED',
          message: 'Audio format conversion failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: TTS Export → Area: output settings',
          cause: 'The target audio format is unsupported or the encoder failed.',
          solution: 'Select a supported output format and retry.',
          steps: [
            'Select WAV or MP3 as target format',
            'Check sample rate is supported',
            'Remove special characters from filename',
            'Retry conversion'
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'CONVERT_ERROR'],
          prevention: 'Only show supported formats in the dropdown; validate before conversion.',
        },
        {
          code: 'VIDEO_ENCODE_FAILED',
          message: 'Video encoding failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Workflow → Area: video export',
          cause: 'The video encoder crashed due to unsupported codec or resolution.',
          solution: 'Change codec or reduce resolution and retry.',
          steps: [
            'Switch to H.264 codec',
            'Reduce resolution to 1080p or lower',
            'Check available disk space',
            'Retry encoding'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'CONVERT_ERROR'],
          prevention: 'Validate codec support and disk space before encoding.',
        },
        {
          code: 'ARCHIVE_EXTRACT_FAILED',
          message: 'Archive extraction failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Import / Export → Area: archive upload',
          cause: 'The ZIP or TAR archive is corrupted, password-protected, or uses an unsupported compression.',
          solution: 'Re-create the archive with standard ZIP and no password.',
          steps: [
            'Verify archive opens in system file manager',
            'Re-compress as standard ZIP',
            'Remove password protection',
            'Re-upload'
          ],
          relatedCodes: ['FILE_CORRUPTED', 'IMPORT_INVALID_JSON'],
          prevention: 'Standardize on passwordless ZIP; validate archives before upload.',
        },
        {
          code: 'ARCHIVE_CREATE_FAILED',
          message: 'Archive creation failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: batch download',
          cause: 'The backend failed to create a ZIP archive due to file size or permission issues.',
          solution: 'Reduce batch size or export files individually.',
          steps: [
            'Reduce number of files in batch',
            'Export files one by one',
            'Check backend temp directory permissions',
            'Retry archive creation'
          ],
          relatedCodes: ['EXPORT_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: 'Limit batch size; monitor temp directory permissions.',
        },
        {
          code: 'PDF_RENDER_FAILED',
          message: 'PDF rendering failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Document Viewer → Area: PDF preview',
          cause: 'The PDF file is corrupted, password-protected, or uses unsupported features.',
          solution: 'Use a different PDF file or repair the current one.',
          steps: [
            'Open PDF in another viewer to verify',
            'Remove password if protected',
            'Flatten complex layers',
            'Re-upload repaired PDF'
          ],
          relatedCodes: ['FILE_CORRUPTED', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Recommend simple, unprotected PDFs; validate on upload.',
        },
        {
          code: 'PDF_TEXT_EXTRACTION_FAILED',
          message: 'PDF text extraction failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Document Viewer → Area: text panel',
          cause: 'The PDF contains scanned images instead of embedded text.',
          solution: 'Use OCR on the PDF or provide a text-based PDF.',
          steps: [
            'Run OCR on scanned pages',
            'Export as text-based PDF from source',
            'Use image-to-text tool',
            'Re-upload processed document'
          ],
          relatedCodes: ['PDF_RENDER_FAILED', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Warn users when uploading scanned PDFs; suggest OCR tools.',
        },
        {
          code: 'IMAGE_RESIZE_FAILED',
          message: 'Image resize operation failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter',
          cause: 'The resize algorithm failed due to extreme aspect ratio or memory limits.',
          solution: 'Use a different resize method or reduce dimensions.',
          steps: [
            'Try bilinear instead of nearest-neighbor',
            'Reduce dimensions in steps',
            'Maintain aspect ratio',
            'Retry resize'
          ],
          relatedCodes: ['CONVERT_ERROR', 'DEVICE_MEMORY_LOW'],
          prevention: 'Set maximum dimension limits; use memory-safe resize libraries.',
        },
        {
          code: 'COLOR_SPACE_CONVERSION_FAILED',
          message: 'Color space conversion failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter',
          cause: 'Converting between color spaces (sRGB, CMYK, LAB) produced invalid values.',
          solution: 'Convert via an intermediate color space or use ICC profiles.',
          steps: [
            'Convert to sRGB first',
            'Embed ICC profile in output',
            'Use professional color management tool',
            'Retry conversion'
          ],
          relatedCodes: ['CONVERT_ERROR', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Use standard sRGB for web workflows; validate ICC profiles.',
        },
        {
          code: 'ANIMATION_EXPORT_FAILED',
          message: 'Animated image export failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: GIF/WebP export',
          cause: 'The animation frames exceeded memory limits or frame count limits.',
          solution: 'Reduce frame count, resolution, or colors.',
          steps: [
            'Reduce frames to 50 or fewer',
            'Lower resolution to 480px width',
            'Reduce color palette to 128',
            'Retry export'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'EXPORT_FAILED'],
          prevention: 'Set frame count and resolution limits for animated exports.',
        },
        {
          code: 'SVG_RASTERIZE_FAILED',
          message: 'SVG rasterization failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: image export',
          cause: 'The SVG contains external references, scripts, or unsupported elements.',
          solution: 'Sanitize SVG by inlining resources and removing scripts.',
          steps: [
            'Inline all external images in SVG',
            'Remove script tags',
            'Convert text to paths',
            'Retry rasterization'
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'CONVERT_ERROR'],
          prevention: 'Sanitize SVGs on upload; warn about external references.',
        },
        {
          code: 'WORKFLOW_LOOP_DETECTED',
          message: 'Workflow contains a cyclic dependency',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: workflow editor',
          cause: 'Two or more workflow steps depend on each other, creating an infinite loop.',
          solution: 'Break the cycle by removing or restructuring one dependency.',
          steps: [
            'Review step dependency graph',
            'Identify the circular reference',
            'Remove redundant dependency edge',
            'Validate workflow acyclicity'
          ],
          relatedCodes: ['P2G_WORKFLOW_ERROR', 'WORKFLOW_STEP_FAILED'],
          prevention: 'Validate workflow DAG before execution; reject cyclic graphs.',
        },
        {
          code: 'WORKFLOW_TIMEOUT',
          message: 'Workflow execution exceeded time limit',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'The total workflow execution time exceeded the configured timeout.',
          solution: 'Optimize slow steps or increase workflow timeout.',
          steps: [
            'Identify slowest step from logs',
            'Reduce image resolution for slow steps',
            'Increase workflow timeout in settings',
            'Retry workflow'
          ],
          relatedCodes: ['API_TIMEOUT', 'WORKFLOW_STEP_FAILED'],
          prevention: 'Set per-step timeouts; optimize bottleneck steps.',
        },
        {
          code: 'WORKFLOW_STEP_SKIPPED',
          message: 'Required workflow step was skipped',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'A step marked as required was skipped due to a condition or manual override.',
          solution: 'Re-run the skipped step or adjust step conditions.',
          steps: [
            'Review workflow conditions',
            'Manually execute skipped step',
            'Adjust condition logic',
            'Re-run full workflow'
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED', 'P2G_WORKFLOW_ERROR'],
          prevention: 'Require explicit confirmation before skipping required steps.',
        },
        {
          code: 'DOCUMENT_MERGE_FAILED',
          message: 'Document merge operation failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: document assembly',
          cause: 'Merging multiple documents failed due to format mismatch or page size differences.',
          solution: 'Normalize all documents to same format before merging.',
          steps: [
            'Convert all docs to same format',
            'Standardize page sizes',
            'Merge in smaller batches',
            'Retry merge'
          ],
          relatedCodes: ['PDF_RENDER_FAILED', 'CONVERT_ERROR'],
          prevention: 'Auto-normalize documents before merge; validate compatibility.',
        },
        {
          code: 'SUBTITLE_SYNC_FAILED',
          message: 'Subtitle synchronization failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: TTS Export → Area: subtitle panel',
          cause: 'The subtitle timestamps do not align with audio duration.',
          solution: 'Regenerate subtitles or manually adjust timestamps.',
          steps: [
            'Regenerate subtitles from audio',
            'Check TTS speed settings',
            'Manually adjust first and last timestamps',
            'Export synchronized subtitles'
          ],
          relatedCodes: ['TTS_AUDIO_GENERATION_FAILED', 'CONVERT_ERROR'],
          prevention: 'Generate subtitles directly from TTS output metadata.',
        },
        {
          code: 'FONT_LOAD_FAILED',
          message: 'Custom font failed to load',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: text overlay',
          cause: 'The custom font file is corrupted or in an unsupported format.',
          solution: 'Use a standard TTF or OTF font file.',
          steps: [
            'Verify font opens in system font viewer',
            'Convert to TTF if needed',
            'Upload standard web-safe font',
            'Retry text overlay'
          ],
          relatedCodes: ['FILE_FORMAT_UNSUPPORTED', 'FILE_CORRUPTED'],
          prevention: 'Whitelist standard font formats; validate on upload.',
        },
        {
          code: 'WATERMARK_APPLY_FAILED',
          message: 'Watermark application failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: image export',
          cause: 'The watermark image or text overlay could not be composited.',
          solution: 'Simplify watermark or use a supported image format.',
          steps: [
            'Use PNG watermark with transparency',
            'Reduce watermark dimensions',
            'Position watermark within image bounds',
            'Retry export'
          ],
          relatedCodes: ['CONVERT_ERROR', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Validate watermark dimensions and format before applying.',
        },
        {
          code: 'CROP_OUT_OF_BOUNDS',
          message: 'Crop region exceeds image boundaries',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter',
          cause: 'The specified crop coordinates are larger than the source image.',
          solution: 'Adjust crop coordinates to fit within image dimensions.',
          steps: [
            'Check source image dimensions',
            'Set crop x + width <= image width',
            'Set crop y + height <= image height',
            'Retry crop'
          ],
          relatedCodes: ['CONVERT_ERROR', 'IMAGE_RESIZE_FAILED'],
          prevention: 'Constrain crop UI to image bounds; validate coordinates.',
        },
        {
          code: 'ROTATE_DEGREE_INVALID',
          message: 'Rotation degree is invalid',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter',
          cause: 'The rotation angle is not supported by the converter (e.g., non-90 multiple).',
          solution: 'Use angles that are multiples of 90 degrees.',
          steps: [
            'Set rotation to 90, 180, or 270',
            'For arbitrary angles use external editor',
            'Retry with valid angle'
          ],
          relatedCodes: ['CONVERT_ERROR'],
          prevention: 'Restrict rotation input to 90-degree increments.',
        },
        {
          code: 'METASTRIP_FAILED',
          message: 'Metadata stripping failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Image Format Converter',
          cause: 'The tool could not remove EXIF or other metadata from the image.',
          solution: 'Use an alternative metadata removal tool.',
          steps: [
            'Try export as PNG (metadata-free)',
            'Use external EXIF removal tool',
            'Re-save image in paint program',
            'Retry conversion'
          ],
          relatedCodes: ['CONVERT_ERROR', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Use libraries that support metadata manipulation for target formats.',
        },
        {
          code: 'THUMBNAIL_GENERATION_FAILED',
          message: 'Thumbnail generation failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: Any tool → Area: image preview',
          cause: 'The thumbnail generation process failed due to corrupted source or extreme dimensions.',
          solution: 'Regenerate from original or use a placeholder.',
          steps: [
            'Verify original image is valid',
            'Regenerate thumbnail at smaller size',
            'Use generic placeholder if regeneration fails',
            'Re-upload original if corrupted'
          ],
          relatedCodes: ['IMAGE_RESIZE_FAILED', 'FILE_CORRUPTED'],
          prevention: 'Generate thumbnails asynchronously with fallback placeholders.',
        },
        {
          code: 'LAYER_COMPOSITE_FAILED',
          message: 'Layer composite operation failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Style Transfer → Area: layer panel',
          cause: 'Blending layers with incompatible color modes or dimensions failed.',
          solution: 'Ensure all layers have same dimensions and color mode.',
          steps: [
            'Check all layer dimensions match',
            'Convert to RGBA if needed',
            'Flatten image before composite',
            'Retry operation'
          ],
          relatedCodes: ['CONVERT_ERROR', 'COLOR_SPACE_CONVERSION_FAILED'],
          prevention: 'Auto-flatten or resize layers to match on import.',
        },
        {
          code: 'MASK_APPLY_FAILED',
          message: 'Mask application failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Style Transfer → Area: mask editor',
          cause: 'The mask dimensions or bit depth do not match the target image.',
          solution: 'Resize mask to match image and use 8-bit grayscale.',
          steps: [
            'Resize mask to exact image dimensions',
            'Convert mask to 8-bit grayscale',
            'Invert mask if needed',
            'Retry application'
          ],
          relatedCodes: ['CROP_OUT_OF_BOUNDS', 'INPAINT_MASK_INVALID'],
          prevention: 'Auto-resize masks to target; validate bit depth on upload.',
        },
        {
          code: 'AUDIO_MIX_FAILED',
          message: 'Audio mixing operation failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: TTS Export → Area: post-processing',
          cause: 'Mixing multiple audio tracks failed due to sample rate mismatch or clipped output.',
          solution: 'Normalize sample rates and levels before mixing.',
          steps: [
            'Convert all tracks to same sample rate',
            'Normalize volume levels',
            'Apply limiter to prevent clipping',
            'Retry mix'
          ],
          relatedCodes: ['AUDIO_CONVERT_FAILED', 'CONVERT_ERROR'],
          prevention: 'Auto-normalize sample rates and levels on import.',
        },
        {
          code: 'CHAPTER_SPLIT_FAILED',
          message: 'Audio chapter split failed',
          severity: 'warning',
          category: 'E. Workflow & Conversion',
          location: 'Page: TTS Export → Area: export settings',
          cause: 'The chapter markers are invalid or out of audio duration bounds.',
          solution: 'Adjust chapter markers to valid timestamps.',
          steps: [
            'Review chapter timestamp values',
            'Ensure last chapter <= audio duration',
            'Remove overlapping chapter markers',
            'Retry split'
          ],
          relatedCodes: ['TTS_AUDIO_GENERATION_FAILED', 'SUBTITLE_SYNC_FAILED'],
          prevention: 'Validate chapter markers against audio duration before split.',
        },
        {
          code: 'WORKFLOW_IMPORT_INVALID',
          message: 'Imported workflow definition is invalid',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: import button',
          cause: 'The workflow JSON is missing required fields or has invalid step references.',
          solution: 'Validate workflow JSON against schema and re-import.',
          steps: [
            'Validate JSON syntax',
            'Check all step IDs are unique',
            'Verify step dependencies exist',
            'Re-import corrected workflow'
          ],
          relatedCodes: ['IMPORT_INVALID_JSON', 'P2G_WORKFLOW_ERROR'],
          prevention: 'Provide workflow schema validation in import dialog.',
        },
        {
          code: 'WORKFLOW_EXPORT_CORRUPTED',
          message: 'Exported workflow file is corrupted',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal → Area: export button',
          cause: 'The export process wrote incomplete JSON due to disk space or memory issues.',
          solution: 'Re-export after freeing resources.',
          steps: [
            'Check available disk space',
            'Close other applications',
            'Re-export workflow',
            'Validate exported JSON'
          ],
          relatedCodes: ['EXPORT_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: 'Check disk space before export; write to temp file first.',
        },
        {
          code: 'TEMPLATE_RENDER_FAILED',
          message: 'Template rendering failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: document template',
          cause: 'The template engine encountered a syntax error or missing variable.',
          solution: 'Fix template syntax and ensure all variables are defined.',
          steps: [
            'Check template for syntax errors',
            'Provide default values for optional variables',
            'Validate variable names match data keys',
            'Retry render'
          ],
          relatedCodes: ['DOCUMENT_MERGE_FAILED', 'PDF_RENDER_FAILED'],
          prevention: 'Use strict template linting; provide variable autocomplete.',
        },
        {
          code: 'BATCH_PROCESS_FAILED',
          message: 'Batch processing job failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Any tool → Area: batch operations',
          cause: 'One or more items in the batch failed, causing the entire job to abort.',
          solution: 'Process items individually to identify failures.',
          steps: [
            'Review batch error logs',
            'Identify failing item(s)',
            'Process failing items individually',
            'Re-run batch with corrected items'
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: 'Implement per-item error handling; allow partial batch success.',
        },
        {
          code: 'STREAM_MUX_FAILED',
          message: 'Media stream multiplexing failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: video export',
          cause: 'Combining audio and video streams failed due to codec incompatibility.',
          solution: 'Use compatible codec pairs (e.g., H.264 + AAC).',
          steps: [
            'Select H.264 for video',
            'Select AAC for audio',
            'Ensure container supports both codecs',
            'Retry mux'
          ],
          relatedCodes: ['VIDEO_ENCODE_FAILED', 'AUDIO_CONVERT_FAILED'],
          prevention: 'Recommend validated codec combinations in the UI.',
        },
        {
          code: 'TIMELINE_EXPORT_FAILED',
          message: 'Timeline export failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Export → Area: timeline',
          cause: 'The timeline contains unsupported effects or transitions.',
          solution: 'Simplify timeline by removing complex effects.',
          steps: [
            'Remove unsupported transitions',
            'Bake effects into clips',
            'Export as simpler format',
            'Retry export'
          ],
          relatedCodes: ['VIDEO_ENCODE_FAILED', 'EXPORT_FAILED'],
          prevention: 'Validate timeline effects against export format capabilities.',
        },
        {
          code: 'OCR_ENGINE_FAILED',
          message: 'OCR engine failed to recognize text',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Document Viewer → Area: OCR panel',
          cause: 'The OCR engine crashed or the image quality was too low.',
          solution: 'Improve image quality or use a different OCR engine.',
          steps: [
            'Increase image resolution to 300 DPI',
            'Ensure high contrast between text and background',
            'Deskew image if tilted',
            'Retry OCR'
          ],
          relatedCodes: ['PDF_TEXT_EXTRACTION_FAILED', 'FILE_CORRUPTED'],
          prevention: 'Pre-process images for OCR: deskew, binarize, upscale.',
        },
        {
          code: 'HASH_VERIFY_FAILED',
          message: 'File hash verification failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Import / Export → Area: file transfer',
          cause: 'The file checksum does not match, indicating corruption or tampering.',
          solution: 'Re-transfer the file and verify hash again.',
          steps: [
            'Re-download or re-upload file',
            'Compute hash locally',
            'Compare with expected hash',
            'If mismatch persists, check source file'
          ],
          relatedCodes: ['FILE_CORRUPTED', 'IMPORT_INVALID_JSON'],
          prevention: 'Always compute and compare hashes for critical transfers.',
        },
        {
          code: 'ENCRYPTION_DECRYPT_FAILED',
          message: 'File decryption failed',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Import → Area: encrypted file',
          cause: 'The password is incorrect or the encrypted file is corrupted.',
          solution: 'Enter the correct password or obtain an uncorrupted file.',
          steps: [
            'Double-check password spelling and case',
            'Try password without extra spaces',
            'Obtain file from original source',
            'Retry decryption'
          ],
          relatedCodes: ['FILE_CORRUPTED', 'IMPORT_INVALID_JSON'],
          prevention: 'Store passwords securely; verify file integrity before encryption.',
        },
        {
          code: 'WORKFLOW_STEP_TIMEOUT',
          message: 'Individual workflow step timed out',
          severity: 'error',
          category: 'E. Workflow & Conversion',
          location: 'Page: Paper2Gal',
          cause: 'A single workflow step exceeded its allocated execution time.',
          solution: 'Increase per-step timeout or optimize the step.',
          steps: [
            'Identify the slow step from logs',
            'Simplify input or reduce resolution',
            'Increase step timeout in settings',
            'Retry the step individually'
          ],
          relatedCodes: ['WORKFLOW_TIMEOUT', 'WORKFLOW_STEP_FAILED'],
          prevention: 'Set generous per-step timeouts; optimize heavy operations.',
        },],
    },
    {
      id: 'F',
      name: 'F. System & Permissions',
      description: 'Device memory insufficient, browser permission denied, browser-side cutout failure',
      errors: [
        {
          code: 'CONVERSION_FAILED',
          message: 'Image conversion failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Image Format Converter',
          cause: 'Unsupported format or browser does not support canvas conversion.',
          solution: 'Try switching the target format.',
          steps: [
            'Confirm the original image is not corrupted',
            'Try switching the target format',
            'Use a modern browser',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
        },
        {
          code: 'CURSOR_JUMP',
          message: 'Cursor jumps during editing',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: Prompt Suite → Area: prompt editor',
          cause: 'In earlier versions, real-time rendering using dangerouslySetInnerHTML caused DOM and React state to be out of sync. This has been fixed in the current version.',
          solution: 'Refresh the page to restore auto-saved content.',
          steps: [
            'Press Ctrl+S to manually save current content',
            'Refresh the page (F5 or Ctrl+R)',
            'After page reload, auto-saved content will be restored',
          ],
        },
        {
          code: 'DEVICE_MEMORY_LOW',
          message: 'Device memory insufficient',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'Device memory is insufficient and the browser forcibly terminated the tab process.',
          solution: 'Close other tabs, reduce image size, or use a device with more memory.',
          steps: [
            'Save current work',
            'Close other browser tabs',
            'Reduce the uploaded image size',
            'Restart the browser and retry',
          ],
          relatedCodes: ['FILE_TOO_LARGE'],
          prevention: 'Close other browser tabs before processing large files; scale the image\'s longest side to below 2048; on low-memory devices it is recommended to disable AI concurrency.',
        },
        {
          code: 'EXPORT_FAILED',
          message: 'Export failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Prompt Suite → Area: top right export button',
          cause: 'Browser blocked the download, or the generated file is too large.',
          solution: 'Check browser download permissions or reduce content size.',
          steps: [
            'Check whether the browser blocked the download (upper right download icon)',
            'If blocked, allow this site to download files',
            'If the file is too large, split into multiple exports or reduce image size',
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Regularly export and back up; for large files, split exports.',
        },
        {
          code: 'FRONTEND_CUTOUT_EXECUTION_FAILED',
          message: 'Browser-side cutout execution failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal',
          cause: 'An error occurred during browser-side cutout processing.',
          solution: 'Replace the image or refresh the page and retry.',
          steps: [
            'Confirm the source image was successfully generated',
            'Re-upload a new image',
            'Click "Redo" to retry',
            'If it keeps failing, contact the backend administrator to switch the provider',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_SPAWN_FAILED', 'FRONTEND_CUTOUT_TIMEOUT'],
          prevention: 'Upload standard format PNG/JPG images; avoid using special encoding or corrupted image files.',
        },
        {
          code: 'FRONTEND_CUTOUT_OUTPUT_MISSING',
          message: 'Browser-side cutout did not generate output',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal',
          cause: 'Cutout processing was abnormal.',
          solution: 'Replace the image or refresh the page and retry.',
          steps: [
            'Confirm the source image was successfully generated',
            'Refresh the page',
            'If it still fails, start a new workflow',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'Ensure input image format is correct; avoid using corrupted or special encoding images.',
        },
        {
          code: 'FRONTEND_CUTOUT_SOURCE_MISSING',
          message: 'Browser-side cutout source image not found',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal',
          cause: 'Upstream expression generation step failed.',
          solution: 'First fix the expression generation error, then retry cutout.',
          steps: [
            'Check the error information of expression generation steps',
            'Fix the expression generation issue',
            'After confirming success, click "Redo" on the cutout step',
          ],
          relatedCodes: ['WORKFLOW_STEP_FAILED'],
          prevention: 'Ensure expression generation steps succeed before performing cutout; the workflow automatically executes in order—do not skip steps.',
        },
        {
          code: 'FRONTEND_CUTOUT_SPAWN_FAILED',
          message: 'Browser-side cutout resources cannot be loaded',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal',
          cause: 'Browser-side IMG.LY model resources cannot be loaded, or the browser does not support WebGL/WASM.',
          solution: 'Refresh the page and retry, or use a modern browser.',
          steps: [
            'Refresh the page',
            'Use Chrome/Firefox/Edge',
            'Check whether WebGL or WASM is disabled',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED'],
          prevention: 'Use a modern browser (Chrome/Firefox/Edge latest version); do not disable WebGL or WASM.',
        },
        {
          code: 'FRONTEND_CUTOUT_TIMEOUT',
          message: 'Browser-side cutout timed out',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Paper2Gal',
          cause: 'Image too large or device performance insufficient.',
          solution: 'Shrink the image or improve device performance.',
          steps: [
            'Re-upload an image with longest side not exceeding 2048',
            'Close other browser tabs',
            'Turn off AI concurrency',
            'Retry',
          ],
          relatedCodes: ['FRONTEND_CUTOUT_EXECUTION_FAILED', 'DEVICE_MEMORY_LOW'],
          prevention: 'Compress images to reasonable size before uploading (recommended 1024~2048px); ensure the device has sufficient memory.',
        },
        {
          code: 'PASTE_FORMAT_LOSS',
          message: 'Pasted content lost formatting',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: Prompt Suite → Area: prompt editor',
          cause: 'The editor uses plain text mode; pasted rich text (Word, web pages) will lose formatting such as colors and fonts.',
          solution: 'Paste as plain text or manually adjust formatting.',
          steps: [
            'Use Ctrl+Shift+V to paste as plain text',
            'Or paste into Notepad first, then copy to the editor',
          ],
          prevention: 'The editor only supports plain text; for formatted content, use Markdown syntax.',
        },
      {
        code: 'WORKFLOW_CONCURRENCY_LIMIT_EXCEEDED',
        message: 'Workflow concurrency limit exceeded',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Number of simultaneously running workflows exceeded system configured limit.',
        solution: 'Wait for existing workflows to complete, or increase concurrency limit.',
        steps: [
          'View list of currently running workflows',
          'Wait for some workflows to complete',
          'Cancel unnecessary workflows',
          'Contact administrator to increase concurrency limit',
        ],
        prevention: 'Configure reasonable concurrency limits, provide queue mechanism.',
      },
      {
        code: 'WORKFLOW_DEPENDENCY_CYCLE',
        message: 'Workflow has circular dependency',
        severity: 'critical',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Circular references between workflow steps, unable to determine execution order.',
        solution: 'Check and break circular dependencies, redesign workflow.',
        steps: [
          'Use workflow visualization tool to check dependency graph',
          'Identify steps in the cycle',
          'Extract common logic to eliminate cycle',
          'Redesign workflow as DAG',
        ],
        prevention: 'Ensure no circular dependencies in workflow design, validate with topological sort.',
      },
      {
        code: 'WORKFLOW_STEP_TIMEOUT_CASCADE',
        message: 'Workflow step timeout cascade',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'One step timeout caused all subsequent dependent steps to fail.',
        solution: 'Increase timeout duration, or design degradation strategy.',
        steps: [
          'Identify the first step that timed out',
          'Increase timeout for that step',
          'Design degradation plan for critical steps',
          'Add step-level retry mechanism',
        ],
        prevention: 'Set reasonable timeouts for each step, design independent degradation strategies.',
      },
      {
        code: 'WORKFLOW_STATE_CORRUPTION',
        message: 'Workflow state corruption',
        severity: 'critical',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Workflow state file was accidentally modified or partially written.',
        solution: 'Restore state from backup, or restart workflow from beginning.',
        steps: [
          'Check state file integrity',
          'Try restoring from automatic backup',
          'If unable to recover, reset workflow',
          'Check disk and filesystem health',
        ],
        prevention: 'Use transactional writes for state, automatic backups on schedule.',
      },
      {
        code: 'WORKFLOW_RETRY_EXHAUSTED',
        message: 'Workflow retry attempts exhausted',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Step failed and retries reached maximum count but still failed.',
        solution: 'Check failure cause, fix and manually retry.',
        steps: [
          'View detailed error from last failure',
          'Fix the issue causing failure',
          'Manually trigger workflow retry',
          'Contact support if issue persists',
        ],
        prevention: 'Set reasonable retry strategy, distinguish between retryable and non-retryable errors.',
      },
      {
        code: 'WORKFLOW_INPUT_VALIDATION_FAILED',
        message: 'Workflow input validation failed',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Workflow input parameters do not satisfy validation rules.',
        solution: 'Correct input parameters according to error prompt.',
        steps: [
          'View failed fields and rules from validation error',
          'Modify input values to satisfy rules',
          'Confirm all required fields are filled',
          'Check field types and formats',
        ],
        prevention: 'Provide real-time input validation on frontend with clear error messages.',
      },
      {
        code: 'WORKFLOW_OUTPUT_ARTIFACT_MISSING',
        message: 'Workflow output artifact missing',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'After workflow completion, expected output file or data does not exist.',
        solution: 'Check workflow execution logs, confirm output step succeeded.',
        steps: [
          'View workflow execution logs',
          'Confirm status of output steps',
          'Check output directory permissions',
          'Manually re-execute output step',
        ],
        prevention: 'Verify artifact existence after each output step.',
      },
      {
        code: 'WORKFLOW_NOTIFICATION_DELIVERY_FAILED',
        message: 'Workflow notification delivery failed',
        severity: 'warning',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Workflow completion or failure notification could not be sent to user.',
        solution: 'Check notification configuration, confirm notification channel is available.',
        steps: [
          'Check notification configuration (email/push/webhook)',
          'Test notification channel connectivity',
          'View notification service logs',
          'Update notification configuration and retry',
        ],
        prevention: 'Provide multiple notification channels, configure failure notification alerts.',
      },
      {
        code: 'WORKFLOW_SCHEDULER_MISFIRE',
        message: 'Workflow scheduler misfire',
        severity: 'warning',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Scheduled workflow did not execute as planned.',
        solution: 'Check scheduler status, manually compensate execution.',
        steps: [
          'Check if scheduler service is running',
          'View scheduler logs to confirm trigger records',
          'Manually trigger missed workflows',
          'Check system time accuracy',
        ],
        prevention: 'Use reliable scheduling service, configure misfire handling strategy.',
      },
      {
        code: 'WORKFLOW_DEAD_LETTER_QUEUE_FULL',
        message: 'Dead letter queue full',
        severity: 'error',
        category: 'F. System & Permissions',
        location: 'Page: Any tool → Area: Error panel',
        cause: 'Failed workflow messages accumulated, dead letter queue reached capacity limit.',
        solution: 'Clean dead letter queue, analyze failure causes.',
        steps: [
          'View dead letter queue accumulation status',
          'Batch clean or archive old dead letters',
          'Analyze common failure patterns in dead letters',
          'Reprocess after fixing root cause',
        ],
        prevention: 'Monitor dead letter queue depth, set alerts and automatic cleanup.',
      },
      
        {
          code: 'MEMORY_PRESSURE_CRITICAL',
          message: 'System memory pressure critical',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'Available system RAM has dropped below safe thresholds, risking OOM kills.',
          solution: 'Close applications, reduce workload, or restart the system.',
          steps: [
            'Save all current work',
            'Close unused browser tabs and applications',
            'Reduce image resolution or batch size',
            'Restart the application or system'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'GPU_OUT_OF_MEMORY'],
          prevention: 'Monitor memory usage; set automatic warnings at 80% usage.',
        },
        {
          code: 'CPU_THROTTLING',
          message: 'CPU thermal throttling detected',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'CPU temperature exceeded safe limits and was downclocked.',
          solution: 'Improve cooling or reduce CPU-intensive tasks.',
          steps: [
            'Check CPU temperature in system monitor',
            'Clean dust from fans and heatsinks',
            'Close CPU-intensive background apps',
            'Use cooling pad or improve ventilation'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Ensure adequate cooling; avoid sustained 100% CPU loads.',
        },
        {
          code: 'DISK_FULL',
          message: 'Disk space is full',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The storage device has no free space left for writes.',
          solution: 'Free up disk space or expand storage.',
          steps: [
            'Delete temporary files and caches',
            'Move large files to external storage',
            'Empty recycle bin/trash',
            'Expand disk partition if possible'
          ],
          relatedCodes: ['EXPORT_FAILED', 'LOCAL_STORAGE_FULL'],
          prevention: 'Monitor disk usage; set alerts at 85% capacity.',
        },
        {
          code: 'DISK_QUOTA_EXCEEDED',
          message: 'User disk quota exceeded',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The user has exceeded their allocated disk quota on the server.',
          solution: 'Delete files or request a quota increase.',
          steps: [
            'Review and delete unnecessary files',
            'Archive old data to offline storage',
            'Contact admin to request quota increase',
            'Retry operation'
          ],
          relatedCodes: ['DISK_FULL', 'EXPORT_FAILED'],
          prevention: 'Track per-user quotas; notify users at 80% usage.',
        },
        {
          code: 'FILE_DESCRIPTOR_LIMIT',
          message: 'Too many open files',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The process reached the maximum number of open file descriptors.',
          solution: 'Close unused files or increase the file descriptor limit.',
          steps: [
            'Identify and close leaking file handles',
            'Increase ulimit -n value',
            'Restart the process',
            'Review code for unclosed streams'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW', 'BACKEND_UNAVAILABLE'],
          prevention: 'Use try-finally blocks for file handles; monitor fd usage.',
        },
        {
          code: 'SELINUX_DENIED',
          message: 'SELinux policy denied operation',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'SELinux blocked a file access or network bind due to policy violation.',
          solution: 'Adjust SELinux context or create an exception policy.',
          steps: [
            'Check audit logs for AVC denials',
            'Run semanage to add exception',
            'Or temporarily set permissive mode',
            'Apply permanent policy module if needed'
          ],
          relatedCodes: ['PERMISSION_DENIED'],
          prevention: 'Package SELinux policy modules with the application.',
        },
        {
          code: 'APPARMOR_DENIED',
          message: 'AppArmor profile denied operation',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'AppArmor blocked a system call or file access outside the allowed profile.',
          solution: 'Update AppArmor profile or switch to complain mode.',
          steps: [
            'Check syslog for AppArmor denials',
            'Update profile to allow required paths',
            'Or run in complain mode to identify needs',
            'Reload AppArmor profile'
          ],
          relatedCodes: ['SELINUX_DENIED', 'PERMISSION_DENIED'],
          prevention: 'Ship tested AppArmor profiles with the application.',
        },
        {
          code: 'DOCKER_CONTAINER_OOM',
          message: 'Docker container killed by OOM',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The container exceeded its memory limit and was terminated by the OOM killer.',
          solution: 'Increase container memory limit or optimize memory usage.',
          steps: [
            'Increase docker run --memory limit',
            'Optimize application memory footprint',
            'Enable swap for container if acceptable',
            'Monitor memory trends'
          ],
          relatedCodes: ['MEMORY_PRESSURE_CRITICAL', 'DEVICE_MEMORY_LOW'],
          prevention: 'Set memory limits with headroom; monitor container metrics.',
        },
        {
          code: 'KUBERNETES_POD_EVICTED',
          message: 'Kubernetes pod was evicted',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The pod was evicted due to node pressure (disk, memory, or PID limits).',
          solution: 'Address node pressure or add cluster capacity.',
          steps: [
            'Check node conditions with kubectl describe node',
            'Clean up node disk/images',
            'Scale cluster nodes',
            'Re-schedule pod to healthy node'
          ],
          relatedCodes: ['DOCKER_CONTAINER_OOM', 'DISK_FULL'],
          prevention: 'Set resource requests/limits; use pod disruption budgets.',
        },
        {
          code: 'KUBERNETES_IMAGE_PULL_FAILED',
          message: 'Kubernetes image pull failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The container image could not be pulled due to registry auth or network issues.',
          solution: 'Check image name, registry credentials, and network.',
          steps: [
            'Verify image tag exists in registry',
            'Check imagePullSecrets configuration',
            'Confirm network access to registry',
            'Retry deployment'
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'NETWORK_DISCONNECTED'],
          prevention: 'Use image pull secrets; mirror images to local registry.',
        },
        {
          code: 'KUBERNETES_CRASH_LOOP',
          message: 'Pod stuck in CrashLoopBackOff',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The container repeatedly crashes on startup, exceeding the restart threshold.',
          solution: 'Check container logs and fix the underlying error.',
          steps: [
            'View pod logs with kubectl logs',
            'Check for missing environment variables',
            'Verify config files are mounted',
            'Fix application startup error'
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'DOCKER_CONTAINER_OOM'],
          prevention: 'Implement health checks; validate config before startup.',
        },
        {
          code: 'KUBERNETES_RESOURCE_LIMIT',
          message: 'Pod exceeded Kubernetes resource limit',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'CPU or memory usage exceeded the configured resource limits.',
          solution: 'Increase resource limits or optimize resource usage.',
          steps: [
            'Edit deployment to raise limits',
            'Profile application for hotspots',
            'Optimize memory/CPU usage',
            'Re-deploy with new limits'
          ],
          relatedCodes: ['DOCKER_CONTAINER_OOM', 'CPU_THROTTLING'],
          prevention: 'Benchmark workloads to set accurate limits.',
        },
        {
          code: 'INODE_EXHAUSTED',
          message: 'Filesystem inode limit exhausted',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'Too many small files have exhausted the filesystem inode table.',
          solution: 'Delete small files or reformat with more inodes.',
          steps: [
            'Find and delete empty/small files',
            'Consolidate files into archives',
            'Reformat filesystem with higher inode count',
            'Move data to new partition'
          ],
          relatedCodes: ['DISK_FULL', 'EXPORT_FAILED'],
          prevention: 'Monitor inode usage; archive small files regularly.',
        },
        {
          code: 'SWAP_EXHAUSTED',
          message: 'System swap space exhausted',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'Physical RAM and swap are both full, causing severe performance degradation.',
          solution: 'Kill memory-hungry processes or add swap space.',
          steps: [
            'Identify top memory consumers',
            'Kill non-essential processes',
            'Add swap file if on Linux',
            'Restart system if unresponsive'
          ],
          relatedCodes: ['MEMORY_PRESSURE_CRITICAL', 'DEVICE_MEMORY_LOW'],
          prevention: 'Configure adequate swap; monitor memory usage trends.',
        },
        {
          code: 'PERMISSION_DENIED_FILE',
          message: 'File permission denied',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Any tool → Area: file save/load',
          cause: 'The user does not have read/write permission for the target file or directory.',
          solution: 'Change file permissions or run with appropriate privileges.',
          steps: [
            'Check file ownership and permissions',
            'Use chmod/chown to fix permissions',
            'Run application with correct user',
            'Select a writable directory'
          ],
          relatedCodes: ['SELINUX_DENIED', 'APPARMOR_DENIED'],
          prevention: 'Check directory writability before file operations.',
        },
        {
          code: 'PERMISSION_DENIED_CAMERA',
          message: 'Camera access permission denied',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: Any tool → Area: camera input',
          cause: 'The browser or OS denied camera access.',
          solution: 'Grant camera permission in browser or system settings.',
          steps: [
            'Click allow when browser prompts',
            'Check browser site permissions',
            'Check OS privacy settings for camera',
            'Retry camera access'
          ],
          relatedCodes: ['PERMISSION_DENIED_FILE'],
          prevention: 'Guide users through permission granting before camera use.',
        },
        {
          code: 'PERMISSION_DENIED_MICROPHONE',
          message: 'Microphone access permission denied',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: TTS Export → Area: voice recording',
          cause: 'The browser or OS denied microphone access.',
          solution: 'Grant microphone permission in browser or system settings.',
          steps: [
            'Click allow when browser prompts',
            'Check browser site permissions',
            'Check OS privacy settings for microphone',
            'Retry recording'
          ],
          relatedCodes: ['PERMISSION_DENIED_CAMERA'],
          prevention: 'Request microphone permission only when needed.',
        },
        {
          code: 'BROWSER_POPUP_BLOCKED',
          message: 'Popup window was blocked',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The browser blocked a popup or new window.',
          solution: 'Allow popups for this site.',
          steps: [
            'Check browser popup blocker icon',
            'Allow popups for current site',
            'Retry the action that opened popup',
            'Disable popup blocker if needed'
          ],
          relatedCodes: ['EXPORT_FAILED'],
          prevention: 'Use modal dialogs instead of popups where possible.',
        },
        {
          code: 'CLIPBOARD_ACCESS_DENIED',
          message: 'Clipboard access denied',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The browser denied clipboard access due to insecure context or user preference.',
          solution: 'Use HTTPS or interact with the page first.',
          steps: [
            'Ensure page is served over HTTPS',
            'Click on the page before copying',
            'Use keyboard shortcut Ctrl+C as fallback',
            'Check browser clipboard permissions'
          ],
          relatedCodes: ['BROWSER_POPUP_BLOCKED', 'PERMISSION_DENIED_FILE'],
          prevention: 'Require user interaction before clipboard operations; use HTTPS.',
        },
        {
          code: 'SERVICE_WORKER_REGISTRATION_FAILED',
          message: 'Service Worker registration failed',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The browser could not register the Service Worker due to path or MIME type issues.',
          solution: 'Check sw.js path and server MIME type configuration.',
          steps: [
            'Verify sw.js is accessible at root path',
            'Check server serves JS with correct MIME type',
            'Clear site data and re-register',
            'Retry registration'
          ],
          relatedCodes: ['PERFORMANCE_SERVICE_WORKER_UPDATE_FAILED'],
          prevention: 'Serve sw.js from root with correct Content-Type.',
        },
        {
          code: 'INDEXEDDB_CORRUPTED',
          message: 'IndexedDB database is corrupted',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The browser\'s IndexedDB storage was corrupted, possibly by disk errors.',
          solution: 'Delete and recreate the IndexedDB database.',
          steps: [
            'Open DevTools → Application → IndexedDB',
            'Delete corrupted database',
            'Refresh page to recreate',
            'Re-import any lost data'
          ],
          relatedCodes: ['CONFIG_CORRUPTED', 'LOCAL_STORAGE_FULL'],
          prevention: 'Regularly export critical data; handle DB errors gracefully.',
        },
        {
          code: 'INDEXEDDB_QUOTA_EXCEEDED',
          message: 'IndexedDB quota exceeded',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The stored data exceeds the browser\'s origin storage quota.',
          solution: 'Delete old data or use external storage.',
          steps: [
            'Export and delete old projects',
            'Clear image caches',
            'Use file system API for large files',
            'Retry operation'
          ],
          relatedCodes: ['LOCAL_STORAGE_FULL', 'DISK_QUOTA_EXCEEDED'],
          prevention: 'Monitor storage quota; prompt users to archive old data.',
        },
        {
          code: 'WEBGL_NOT_SUPPORTED',
          message: 'WebGL is not supported',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The browser or device does not support WebGL, required for some image operations.',
          solution: 'Use a modern browser or enable hardware acceleration.',
          steps: [
            'Switch to Chrome, Firefox, or Edge',
            'Enable hardware acceleration in browser settings',
            'Update graphics drivers',
            'Retry operation'
          ],
          relatedCodes: ['DEVICE_MEMORY_LOW'],
          prevention: 'Detect WebGL support early; show fallback options.',
        },
        {
          code: 'WEBGPU_NOT_SUPPORTED',
          message: 'WebGPU is not supported',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Page: Face Maker / Style Transfer',
          cause: 'The browser does not yet support WebGPU.',
          solution: 'Use a browser with WebGPU support or fallback to WebGL.',
          steps: [
            'Update to latest Chrome/Edge Canary',
            'Enable WebGPU flag if available',
            'Fallback to WebGL or CPU path',
            'Retry operation'
          ],
          relatedCodes: ['WEBGL_NOT_SUPPORTED'],
          prevention: 'Feature-detect WebGPU and provide graceful fallback.',
        },
        {
          code: 'NOTIFICATION_PERMISSION_DENIED',
          message: 'Notification permission denied',
          severity: 'info',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'User denied notification permission or OS has Do Not Disturb enabled.',
          solution: 'Request permission again or check OS settings.',
          steps: [
            'Check browser notification settings',
            'Check OS Do Not Disturb mode',
            'Guide user to allow notifications',
            'Retry permission request'
          ],
          relatedCodes: ['PERFORMANCE_PUSH_NOTIFICATION_BLOCKED'],
          prevention: 'Request notifications after user completes valuable action.',
        },
        {
          code: 'BATTERY_SAVER_ENABLED',
          message: 'Battery saver mode may affect performance',
          severity: 'info',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The device is in battery saver mode, throttling CPU and background tasks.',
          solution: 'Disable battery saver or plug in the device.',
          steps: [
            'Plug in power adapter',
            'Disable battery saver in system settings',
            'Reduce workload',
            'Retry operation'
          ],
          relatedCodes: ['CPU_THROTTLING'],
          prevention: 'Warn users when battery saver may impact generation tasks.',
        },
        {
          code: 'OFFLINE_MODE_DETECTED',
          message: 'Device is in offline mode',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The device has no network connectivity.',
          solution: 'Restore network connection or use offline-capable features.',
          steps: [
            'Check Wi-Fi or Ethernet connection',
            'Toggle airplane mode off',
            'Restart router if needed',
            'Use offline tools if available'
          ],
          relatedCodes: ['NETWORK_DISCONNECTED'],
          prevention: 'Implement offline detection and graceful degradation.',
        },
        {
          code: 'CORS_POLICY_BLOCKED',
          message: 'CORS policy blocked request',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The browser blocked a cross-origin request due to missing CORS headers.',
          solution: 'Configure server CORS headers or use a proxy.',
          steps: [
            'Add Access-Control-Allow-Origin header',
            'Include necessary preflight headers',
            'Use backend proxy for external APIs',
            'Retry request'
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'NETWORK_DISCONNECTED'],
          prevention: 'Configure proper CORS on all API endpoints.',
        },
        {
          code: 'PROXY_AUTHENTICATION_REQUIRED',
          message: 'Proxy authentication required',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The network proxy requires credentials that were not provided.',
          solution: 'Configure proxy credentials in system or browser settings.',
          steps: [
            'Check system proxy settings',
            'Enter proxy username and password',
            'Contact network admin for credentials',
            'Retry connection'
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'CORS_POLICY_BLOCKED'],
          prevention: 'Document proxy requirements for enterprise deployments.',
        },
        {
          code: 'FIREWALL_BLOCKED',
          message: 'Firewall blocked connection',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'A network firewall is blocking outgoing or incoming connections.',
          solution: 'Whitelist the application or port in firewall rules.',
          steps: [
            'Check OS firewall settings',
            'Add exception for application or port',
            'Contact network admin',
            'Retry connection'
          ],
          relatedCodes: ['PROXY_AUTHENTICATION_REQUIRED', 'NETWORK_DISCONNECTED'],
          prevention: 'Document required ports and domains for IT teams.',
        },
        {
          code: 'TIME_SYNC_ERROR',
          message: 'System clock is out of sync',
          severity: 'warning',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The system time is incorrect, causing SSL/TLS certificate validation failures.',
          solution: 'Synchronize system clock with NTP.',
          steps: [
            'Check system time settings',
            'Enable automatic time sync',
            'Sync with time.nist.gov or pool.ntp.org',
            'Retry connection'
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE', 'API_KEY_EXPIRED'],
          prevention: 'Enable automatic time synchronization on all devices.',
        },
        {
          code: 'DNS_RESOLUTION_FAILED',
          message: 'DNS resolution failed',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'The domain name could not be resolved to an IP address.',
          solution: 'Check DNS settings or use alternative DNS server.',
          steps: [
            'Check internet connectivity',
            'Switch to 8.8.8.8 or 1.1.1.1 DNS',
            'Flush DNS cache',
            'Retry after DNS propagation'
          ],
          relatedCodes: ['NETWORK_DISCONNECTED', 'BACKEND_UNAVAILABLE'],
          prevention: 'Use reliable DNS servers; implement retry with IP fallback.',
        },
        {
          code: 'TEMP_DIRECTORY_UNWRITABLE',
          message: 'Temporary directory is not writable',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The application cannot write to the system temp directory.',
          solution: 'Fix temp directory permissions or change temp path.',
          steps: [
            'Check temp directory exists',
            'Verify write permissions',
            'Set TMPDIR environment variable',
            'Restart application'
          ],
          relatedCodes: ['PERMISSION_DENIED_FILE', 'DISK_FULL'],
          prevention: 'Validate temp directory on startup with a test write.',
        },
        {
          code: 'PROCESS_SPAWN_FAILED',
          message: 'Failed to spawn child process',
          severity: 'critical',
          category: 'F. System & Permissions',
          location: 'Page: Backend / Server',
          cause: 'The OS denied process creation due to resource limits or missing executable.',
          solution: 'Check executable path and system resource limits.',
          steps: [
            'Verify binary exists and is executable',
            'Check ulimit for max user processes',
            'Free system memory',
            'Retry operation'
          ],
          relatedCodes: ['FILE_DESCRIPTOR_LIMIT', 'MEMORY_PRESSURE_CRITICAL'],
          prevention: 'Verify binaries at install; monitor process limits.',
        },
        {
          code: 'SECURITY_POLICY_VIOLATION',
          message: 'Content Security Policy blocked resource',
          severity: 'error',
          category: 'F. System & Permissions',
          location: 'Global / All pages',
          cause: 'A script, style, or other resource was blocked by the Content-Security-Policy header.',
          solution: 'Update CSP headers or load resources from allowed origins.',
          steps: [
            'Check browser console for CSP violation details',
            'Add resource origin to CSP allowlist',
            'Use nonce or hash for inline scripts',
            'Retry after updating headers'
          ],
          relatedCodes: ['CORS_POLICY_BLOCKED'],
          prevention: 'Define accurate CSP headers during deployment.',
        },],
    },
    {
      id: '0~9',
      name: '0~9. HTTP Status Codes',
      description: 'HTTP status codes returned by the backend or API service',
      errors: [
        {
          code: '400_BAD_REQUEST',
          message: '400 Bad Request',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Request parameters are incorrect or incomplete.',
          solution: 'Check request parameters.',
          steps: [
            'Check whether the uploaded file format is correct',
            'Check whether request parameters conform to the API documentation',
            'Modify parameters and retry',
          ],
          relatedCodes: ['401_UNAUTHORIZED', '422_UNPROCESSABLE_ENTITY'],
          prevention: 'Ensure all required parameters are filled in correctly; confirm uploaded files meet the format requirements.',
        },
        {
          code: '401_UNAUTHORIZED',
          message: '401 Unauthorized',
          severity: 'critical',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'API Key is invalid or has expired.',
          solution: 'Replace with a valid API Key.',
          steps: [
            'Open "Settings → API"',
            'Replace the Key',
            'Save and retry',
          ],
          relatedCodes: ['API_KEY_EXPIRED', '403_FORBIDDEN'],
          prevention: 'Regularly check the API Key\'s validity; test whether the Key is valid in advance through LLM Hub.',
        },
        {
          code: '403_FORBIDDEN',
          message: '403 Forbidden',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'The Key does not have permission to access the resource, or the content was intercepted by the safety filter.',
          solution: 'Check Key permissions or modify content.',
          steps: [
            'Confirm the Key has permission to access the current model/service',
            'If content was intercepted, modify the prompt and retry',
          ],
          relatedCodes: ['401_UNAUTHORIZED', 'PROMPT_BLOCKED'],
          prevention: 'Ensure the Key has sufficient permissions; avoid using sensitive vocabulary in prompts.',
        },
        {
          code: '404_NOT_FOUND',
          message: '404 Not Found',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'The requested resource does not exist or the URL is incorrect.',
          solution: 'Check the URL or resource path.',
          steps: [
            'Check whether the API Base URL is correct',
            'Confirm the backend service is running',
            'Check whether the requested resource exists',
          ],
          relatedCodes: ['BACKEND_UNAVAILABLE'],
        },
        {
          code: '422_UNPROCESSABLE_ENTITY',
          message: '422 Unprocessable Entity',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Request format is correct but content is semantically incorrect.',
          solution: 'Check request content.',
          steps: [
            'Check whether the uploaded file is corrupted',
            'Check whether request parameters conform to the API specification',
            'Modify and retry',
          ],
          relatedCodes: ['400_BAD_REQUEST'],
        },
        {
          code: '429_TOO_MANY_REQUESTS',
          message: '429 Too Many Requests',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Request frequency is too high, exceeding the rate limit.',
          solution: 'Slow down request frequency.',
          steps: [
            'Reduce request frequency',
            'Wait a while and retry',
            'Consider switching to a provider with higher rate limits',
          ],
          relatedCodes: ['API_RATE_LIMIT'],
          prevention: 'When using an API Key with strict rate limits, it is recommended to disable AI concurrency; avoid repeatedly starting multiple workflows in a short time.',
        },
        {
          code: '500_INTERNAL_ERROR',
          message: '500 Internal Server Error',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'An internal exception occurred in the backend service.',
          solution: 'Retry later or contact the backend administrator.',
          steps: [
            'Wait a few minutes',
            'Reduce request scale and retry',
            'If the problem persists, contact the backend administrator',
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Reduce request scale (image size); avoid submitting large tasks when the server is under high load.',
        },
        {
          code: '502_BAD_GATEWAY',
          message: '502 Bad Gateway',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Reverse proxy cannot connect to the backend server.',
          solution: 'Check backend service status.',
          steps: [
            'Confirm the backend process is running',
            'Check whether the port is occupied',
            'Check backend logs',
            'Restart the backend service',
          ],
          relatedCodes: ['503_SERVICE_UNAVAILABLE', 'BACKEND_UNAVAILABLE'],
          prevention: 'When deploying locally, confirm the backend process is running; check reverse proxy configuration.',
        },
        {
          code: '503_SERVICE_UNAVAILABLE',
          message: '503 Service Unavailable',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Backend service is temporarily unavailable.',
          solution: 'Retry later.',
          steps: [
            'Wait a few minutes and retry',
            'Check backend service status',
            'Contact the backend administrator',
          ],
          relatedCodes: ['502_BAD_GATEWAY', 'BACKEND_UNAVAILABLE'],
          prevention: 'Avoid operating during server maintenance windows; reduce request frequency during high load.',
        },
        {
          code: '504_GATEWAY_TIMEOUT',
          message: '504 Gateway Timeout',
          severity: 'error',

        category: '0~9. HTTP Status Codes',
          location: 'Global / All pages',
          cause: 'Reverse proxy or load balancer timed out waiting for the backend response.',
          solution: 'Increase timeout setting or retry later.',
          steps: [
            'Increase timeout setting in Settings → API',
            'Reduce request scale',
            'Retry later',
          ],
          relatedCodes: ['API_TIMEOUT', '500_INTERNAL_ERROR'],
        },
      {
        code: '400_BAD_REQUEST_BODY',
        message: 'Request body format error (400)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Request body is not valid JSON, or missing required fields.',
        solution: 'Check request body format, ensure it is valid JSON.',
        steps: [
          'Confirm Content-Type is application/json',
          'Use JSON validator to check request body',
          'Cross-reference API documentation for required fields',
          'Check field types match',
        ],
        prevention: 'Use client SDK to auto-generate requests, avoid manual construction.',
      },
      {
        code: '401_TOKEN_EXPIRED',
        message: 'Token expired (401)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Authentication token has exceeded validity period.',
        solution: 'Refresh token, or use long-lived token.',
        steps: [
          'Call refresh token endpoint to get new token',
          'Check token validity period configuration',
          'Implement automatic refresh mechanism',
          'Use refresh_token to exchange for new access_token',
        ],
        prevention: 'Implement automatic token refresh, update before expiration.',
      },
      {
        code: '403_RESOURCE_FORBIDDEN',
        message: 'Access to resource forbidden (403)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Has authentication but insufficient permissions for specific resource.',
        solution: 'Apply for resource access permissions, or switch to authorized account.',
        steps: [
          'Confirm current user identity',
          'Check resource access control list',
          'Contact resource owner for authorization',
          'Use account with permissions to operate',
        ],
        prevention: 'Design fine-grained permission model, perform permission checks in advance.',
      },
      {
        code: '404_ENDPOINT_REMOVED',
        message: 'API endpoint removed (404)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Accessed API path has been deleted or renamed in latest version.',
        solution: 'Consult API changelog, use new endpoint.',
        steps: [
          'Consult API version changelog',
          'Confirm if endpoint was renamed',
          'Upgrade to API version that supports this endpoint',
          'Modify code to use new endpoint path',
        ],
        prevention: 'Follow API version update announcements, use versioned API paths.',
      },
      {
        code: '406_NOT_ACCEPTABLE',
        message: 'Cannot provide acceptable content (406)',
        severity: 'warning',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Request Accept header does not match formats server can provide.',
        solution: 'Modify Accept header, or request server to support that format.',
        steps: [
          'Check Accept header in request',
          'Confirm supported response formats on server',
          'Modify Accept to server-supported format',
          'Contact dev team if specific format is required',
        ],
        prevention: 'Client requests include multiple acceptable formats.',
      },
      {
        code: '408_REQUEST_TIMEOUT',
        message: 'Request timeout (408)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server timed out waiting for complete request.',
        solution: 'Check network connection, reduce request body size, or increase timeout.',
        steps: [
          'Check network connection stability',
          'Reduce request body size',
          'Increase client request timeout settings',
          'Use chunked transfer for large request bodies',
        ],
        prevention: 'Maintain stable network, use chunked or streaming transfer for large requests.',
      },
      {
        code: '409_RESOURCE_CONFLICT',
        message: 'Resource conflict (409)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Request conflicts with current resource state, such as concurrent modification of same resource.',
        solution: 'Get latest resource state and retry, or implement optimistic locking.',
        steps: [
          'Re-fetch latest resource state',
          'Merge conflicting modifications',
          'Use If-Match header for optimistic locking',
          'Retry request',
        ],
        prevention: 'Use optimistic or pessimistic locking to avoid concurrent conflicts.',
      },
      {
        code: '410_RESOURCE_GONE',
        message: 'Resource permanently deleted (410)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Requested resource has been permanently deleted and will not be restored.',
        solution: 'Stop requesting this resource, update references to new resource.',
        steps: [
          'Confirm resource was permanently deleted',
          'Find alternative resource',
          'Update all places referencing this resource',
          'Notify user resource is unavailable',
        ],
        prevention: 'Provide migration guides and alternatives when deleting resources.',
      },
      {
        code: '412_PRECONDITION_FAILED',
        message: 'Precondition failed (412)',
        severity: 'warning',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Preconditions such as If-Match/If-None-Match in request not satisfied.',
        solution: 'Get latest resource state, update conditions and retry.',
        steps: [
          'Re-fetch resource ETag or Last-Modified',
          'Update conditional headers in request',
          'Retry request',
          'Check logic if conditions keep failing',
        ],
        prevention: 'Always fetch latest resource state before modifications.',
      },
      {
        code: '416_RANGE_NOT_SATISFIABLE',
        message: 'Requested range not satisfiable (416)',
        severity: 'warning',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Requested Range header exceeds actual resource size.',
        solution: 'Check resource size, adjust Range.',
        steps: [
          'Get actual resource size (Content-Length)',
          'Adjust Range header within valid range',
          'Use full resource request as fallback',
          'Implement adaptive chunked download',
        ],
        prevention: 'Confirm total resource size before chunked download.',
      },
      {
        code: '422_VALIDATION_ERROR',
        message: 'Request semantic error (422)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Request format is correct, but content semantics do not satisfy business rules.',
        solution: 'Correct request content according to error prompt.',
        steps: [
          'View detailed validation errors in response body',
          'Fix field values that do not comply with rules',
          'Confirm business rule constraints',
          'Resend request',
        ],
        prevention: 'Client performs complete business rule validation before submission.',
      },
      {
        code: '423_RESOURCE_LOCKED',
        message: 'Resource locked (423)',
        severity: 'warning',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Resource currently locked by other operation, temporarily inaccessible.',
        solution: 'Wait for lock release and retry, or force release lock.',
        steps: [
          'Check resource lock status',
          'Wait for locking operation to complete',
          'Force release if lock has timed out',
          'Retry request',
        ],
        prevention: 'Set reasonable lock timeout, provide lock status query interface.',
      },
      {
        code: '424_FAILED_DEPENDENCY',
        message: 'Failed dependency (424)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Current operation depends on prerequisite operation that failed.',
        solution: 'Check and fix prerequisite operation, then retry.',
        steps: [
          'View dependent operation from error prompt',
          'Check prerequisite operation failure cause',
          'Fix prerequisite operation',
          'Re-execute in correct order',
        ],
        prevention: 'Design idempotent operations, ensure clear dependency relationships.',
      },
      {
        code: '429_RETRY_AFTER_MISSING',
        message: '429 response missing Retry-After header',
        severity: 'warning',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server returned 429 but did not provide Retry-After time.',
        solution: 'Use exponential backoff strategy and retry.',
        steps: [
          'Implement exponential backoff retry strategy',
          'Wait 1 second first time',
          'Double wait time after each failure',
          'Set maximum wait time cap',
        ],
        prevention: 'Client implements intelligent backoff retry mechanism.',
      },
      {
        code: '451_UNAVAILABLE_FOR_LEGAL_REASONS',
        message: 'Unavailable for legal reasons (451)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Content blocked due to copyright, regional restrictions and other legal reasons.',
        solution: 'Change content source, or contact legal department.',
        steps: [
          'Confirm legal status of content',
          'Find alternative content sources',
          'Contact legal team to confirm compliance',
          'Appeal if content was mistakenly blocked',
        ],
        prevention: 'Ensure all content has legal usage authorization.',
      },
      {
        code: '505_HTTP_VERSION_NOT_SUPPORTED',
        message: 'HTTP version not supported (505)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server does not support HTTP protocol version used in request.',
        solution: 'Use HTTP version supported by server (typically HTTP/1.1).',
        steps: [
          'Check HTTP version used in request',
          'Downgrade to HTTP/1.1',
          'Confirm server supports HTTP/2',
          'Update server software',
        ],
        prevention: 'Client defaults to HTTP/1.1, server supports multiple versions.',
      },
      {
        code: '507_INSUFFICIENT_STORAGE',
        message: 'Insufficient storage (507)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Server disk space is full, unable to process request.',
        solution: 'Clean server storage, or expand disk.',
        steps: [
          'Check server disk usage',
          'Clean logs and temporary files',
          'Delete unnecessary old data',
          'Expand disk or add storage',
        ],
        prevention: 'Monitor disk usage rate, set alerts and automatic cleanup.',
      },
      {
        code: '508_LOOP_DETECTED',
        message: 'Infinite loop detected (508)',
        severity: 'error',

        category: '0~9. HTTP Status Codes',        location: 'Page: Any tool → Area: Error panel',
        cause: 'Request processing detected infinite redirect or loop.',
        solution: 'Check redirect configuration, break the loop.',
        steps: [
          'Check server redirect rules',
          'Confirm no circular redirects',
          'Use absolute URLs to avoid relative path issues',
          'Limit maximum redirect count',
        ],
        prevention: 'Redirect configurations use absolute paths, limit maximum jump count.',
      },

      
        {
          code: '100_CONTINUE',
          message: 'Continue (100)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server has received the request headers and the client should proceed to send the request body.',
          solution: 'Proceed with sending the request body.',
          steps: [
            'Send the remainder of the request',
            'Expect final response after body transmission',
            'Handle normally in HTTP clients'
          ],
          prevention: 'HTTP clients handle 100-continue automatically.',
        },
        {
          code: '101_SWITCHING_PROTOCOLS',
          message: 'Switching Protocols (101)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server agrees to switch protocols as requested by the Upgrade header.',
          solution: 'Complete the protocol upgrade handshake.',
          steps: [
            'Send protocol upgrade request',
            'Verify server supports target protocol',
            'Switch to WebSocket or HTTP/2',
            'Resume communication'
          ],
          prevention: 'Verify protocol support before requesting upgrade.',
        },
        {
          code: '102_PROCESSING',
          message: 'Processing (102)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server has received and is processing the request, but no response is available yet.',
          solution: 'Wait for the final response.',
          steps: [
            'Maintain connection open',
            'Wait for follow-up response',
            'Do not resend request'
          ],
          relatedCodes: ['100_CONTINUE'],
          prevention: 'Implement timeout handling for long-running requests.',
        },
        {
          code: '103_EARLY_HINTS',
          message: 'Early Hints (103)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server is likely to send a final response with the header fields included in the informational response.',
          solution: 'Preload linked resources optimistically.',
          steps: [
            'Parse Link headers from 103 response',
            'Preload CSS/JS resources',
            'Wait for final 200 response',
            'Render page'
          ],
          relatedCodes: ['200_OK'],
          prevention: 'Servers should send accurate early hints to avoid wasted preloads.',
        },
        {
          code: '200_OK',
          message: 'OK (200)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The request has succeeded.',
          solution: 'No action needed; process the response normally.',
          steps: [
            'Parse response body',
            'Update UI with results',
            'Cache response if applicable'
          ],
          prevention: 'Standard success response; no prevention needed.',
        },
        {
          code: '201_CREATED',
          message: 'Created (201)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The request has succeeded and a new resource has been created.',
          solution: 'Process the newly created resource.',
          steps: [
            'Read Location header for new resource URI',
            'Fetch created resource if needed',
            'Update UI to reflect creation'
          ],
          relatedCodes: ['200_OK'],
          prevention: 'Validate creation input to avoid duplicate resources.',
        },
        {
          code: '202_ACCEPTED',
          message: 'Accepted (202)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The request has been accepted for processing but the processing has not been completed.',
          solution: 'Poll the status endpoint or wait for callback.',
          steps: [
            'Record the operation ID',
            'Poll status endpoint periodically',
            'Or wait for webhook callback',
            'Update UI when processing completes'
          ],
          relatedCodes: ['102_PROCESSING'],
          prevention: 'Implement idempotent operations for async processing.',
        },
        {
          code: '204_NO_CONTENT',
          message: 'No Content (204)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server successfully processed the request and is not returning any content.',
          solution: 'Update UI state without expecting a response body.',
          steps: [
            'Confirm operation succeeded',
            'Update local state',
            'Do not attempt to parse empty body'
          ],
          relatedCodes: ['200_OK'],
          prevention: 'Ensure client handles empty bodies gracefully.',
        },
        {
          code: '206_PARTIAL_CONTENT',
          message: 'Partial Content (206)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server is delivering only part of the resource due to a Range header.',
          solution: 'Assemble partial chunks into complete resource.',
          steps: [
            'Store received byte range',
            'Request remaining ranges if needed',
            'Assemble complete file',
            'Verify integrity'
          ],
          relatedCodes: ['416_RANGE_NOT_SATISFIABLE'],
          prevention: 'Request valid ranges; handle assembly correctly.',
        },
        {
          code: '301_MOVED_PERMANENTLY',
          message: 'Moved Permanently (301)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The requested resource has been permanently moved to a new URL.',
          solution: 'Update bookmarks and code to use the new URL.',
          steps: [
            'Read Location header for new URL',
            'Update stored URL references',
            'Retry request to new URL',
            'Monitor for further redirects'
          ],
          relatedCodes: ['302_FOUND'],
          prevention: 'Update client code when APIs change endpoints.',
        },
        {
          code: '302_FOUND',
          message: 'Found (302)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The resource temporarily resides under a different URL.',
          solution: 'Follow the redirect but keep original URL for future requests.',
          steps: [
            'Read Location header',
            'Follow redirect with same method if safe',
            'Do not update permanent bookmarks',
            'Retry original URL later'
          ],
          relatedCodes: ['301_MOVED_PERMANENTLY'],
          prevention: 'Implement robust redirect following in HTTP client.',
        },
        {
          code: '304_NOT_MODIFIED',
          message: 'Not Modified (304)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The resource has not been modified since the version specified by If-None-Match or If-Modified-Since.',
          solution: 'Use cached version of the resource.',
          steps: [
            'Serve from local cache',
            'Do not re-download content',
            'Update cache metadata',
            'Proceed with cached data'
          ],
          relatedCodes: ['200_OK'],
          prevention: 'Implement proper caching headers and ETag handling.',
        },
        {
          code: '307_TEMPORARY_REDIRECT',
          message: 'Temporary Redirect (307)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The resource temporarily resides under a different URL; the request method must not change.',
          solution: 'Repeat the request to the URL given in the Location header.',
          steps: [
            'Read Location header',
            'Repeat request with same HTTP method',
            'Do not update permanent references',
            'Retry original URL later'
          ],
          relatedCodes: ['302_FOUND'],
          prevention: 'Handle 307 without method change in HTTP client.',
        },
        {
          code: '308_PERMANENT_REDIRECT',
          message: 'Permanent Redirect (308)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The resource has been permanently moved to a new URL; the request method must not change.',
          solution: 'Update references and repeat request to new URL.',
          steps: [
            'Read Location header',
            'Update stored URLs permanently',
            'Repeat request with same method',
            'Monitor for issues'
          ],
          relatedCodes: ['301_MOVED_PERMANENTLY'],
          prevention: 'Update client code when API endpoints permanently move.',
        },
        {
          code: '400_INVALID_PARAMETER',
          message: 'Invalid parameter (400)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'A specific request parameter failed validation.',
          solution: 'Correct the invalid parameter and retry.',
          steps: [
            'Check error response for parameter name',
            'Review API docs for valid values',
            'Correct parameter value',
            'Retry request'
          ],
          relatedCodes: ['400_BAD_REQUEST', '422_VALIDATION_ERROR'],
          prevention: 'Client-side validate parameters before submission.',
        },
        {
          code: '402_PAYMENT_REQUIRED',
          message: 'Payment Required (402)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'Payment is required to access this resource or API.',
          solution: 'Add payment method or purchase credits.',
          steps: [
            'Check account billing status',
            'Add payment method',
            'Purchase API credits or subscription',
            'Retry request'
          ],
          relatedCodes: ['401_UNAUTHORIZED'],
          prevention: 'Monitor billing dashboard; set low-balance alerts.',
        },
        {
          code: '405_METHOD_NOT_ALLOWED',
          message: 'Method Not Allowed (405)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The HTTP method is not supported for the requested resource.',
          solution: 'Use an allowed HTTP method.',
          steps: [
            'Check Allow header for permitted methods',
            'Switch to GET, POST, PUT, etc. as appropriate',
            'Update client code',
            'Retry with correct method'
          ],
          relatedCodes: ['404_NOT_FOUND'],
          prevention: 'Follow API documentation for correct HTTP methods.',
        },
        {
          code: '407_PROXY_AUTH_REQUIRED',
          message: 'Proxy Authentication Required (407)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The client must first authenticate itself with the proxy.',
          solution: 'Provide proxy authentication credentials.',
          steps: [
            'Configure proxy username and password',
            'Include Proxy-Authorization header',
            'Check proxy settings',
            'Retry request'
          ],
          relatedCodes: ['401_UNAUTHORIZED', 'PROXY_AUTHENTICATION_REQUIRED'],
          prevention: 'Configure proxy credentials in application settings.',
        },
        {
          code: '411_LENGTH_REQUIRED',
          message: 'Length Required (411)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server refuses to accept the request without a defined Content-Length.',
          solution: 'Include Content-Length header in request.',
          steps: [
            'Calculate request body size',
            'Add Content-Length header',
            'Or use chunked encoding if supported',
            'Retry request'
          ],
          relatedCodes: ['400_BAD_REQUEST'],
          prevention: 'Always include Content-Length or use chunked transfer.',
        },
        {
          code: '413_PAYLOAD_TOO_LARGE',
          message: 'Payload Too Large (413)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The request entity is larger than limits defined by the server.',
          solution: 'Reduce payload size or compress data.',
          steps: [
            'Reduce file size or batch size',
            'Compress request body',
            'Split into multiple requests',
            'Retry with smaller payload'
          ],
          relatedCodes: ['400_BAD_REQUEST', 'FILE_TOO_LARGE'],
          prevention: 'Check size limits before uploading; compress large payloads.',
        },
        {
          code: '414_URI_TOO_LONG',
          message: 'URI Too Long (414)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The URI requested by the client is longer than the server is willing to interpret.',
          solution: 'Use POST with body parameters instead of long query strings.',
          steps: [
            'Move parameters to request body',
            'Use POST instead of GET',
            'Shorten parameter values',
            'Retry request'
          ],
          relatedCodes: ['400_BAD_REQUEST'],
          prevention: 'Avoid extremely long URLs; use POST for complex queries.',
        },
        {
          code: '415_UNSUPPORTED_MEDIA_TYPE',
          message: 'Unsupported Media Type (415)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The media format of the requested data is not supported by the server.',
          solution: 'Convert data to a supported format.',
          steps: [
            'Check API docs for supported Content-Types',
            'Convert file to supported format',
            'Update Content-Type header',
            'Retry upload'
          ],
          relatedCodes: ['400_BAD_REQUEST', 'FILE_FORMAT_UNSUPPORTED'],
          prevention: 'Validate file format against API supported types before upload.',
        },
        {
          code: '417_EXPECTATION_FAILED',
          message: 'Expectation Failed (417)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server cannot meet the requirements specified in the Expect request-header field.',
          solution: 'Remove or adjust the Expect header.',
          steps: [
            'Remove Expect header from request',
            'Simplify request requirements',
            'Retry without expectation',
            'Check server capabilities'
          ],
          relatedCodes: ['400_BAD_REQUEST'],
          prevention: 'Only use Expect headers when server explicitly supports them.',
        },
        {
          code: '418_IM_A_TEAPOT',
          message: 'I am a teapot (418)',
          severity: 'info',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'Easter egg status code indicating the server refuses to brew coffee because it is a teapot.',
          solution: 'No action needed; this is a joke response.',
          steps: [
            'Acknowledge the joke',
            'Do not attempt to brew coffee',
            'Use appropriate endpoint for actual requests'
          ],
          prevention: 'Not applicable; this is a humorous Easter egg.',
        },
        {
          code: '421_MISDIRECTED_REQUEST',
          message: 'Misdirected Request (421)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The request was directed at a server that is not able to produce a response.',
          solution: 'Retry the request or connect to a different server.',
          steps: [
            'Retry request',
            'Check DNS resolves to correct server',
            'Contact admin if persistent',
            'Use alternative endpoint'
          ],
          relatedCodes: ['502_BAD_GATEWAY'],
          prevention: 'Ensure proper load balancer and DNS configuration.',
        },
        {
          code: '426_UPGRADE_REQUIRED',
          message: 'Upgrade Required (426)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server refuses to perform the request using the current protocol.',
          solution: 'Upgrade to the required protocol version.',
          steps: [
            'Check Upgrade header in response',
            'Switch to TLS/1.3 or HTTP/2',
            'Retry with upgraded protocol',
            'Update client libraries'
          ],
          relatedCodes: ['505_HTTP_VERSION_NOT_SUPPORTED'],
          prevention: 'Keep client libraries updated to support modern protocols.',
        },
        {
          code: '428_PRECONDITION_REQUIRED',
          message: 'Precondition Required (428)',
          severity: 'warning',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The origin server requires the request to be conditional to prevent lost update problems.',
          solution: 'Include If-Match or If-Unmodified-Since header.',
          steps: [
            'Fetch current resource ETag',
            'Include If-Match header with ETag',
            'Retry conditional request',
            'Handle 412 if resource changed'
          ],
          relatedCodes: ['412_PRECONDITION_FAILED'],
          prevention: 'Always use conditional requests for state-modifying operations.',
        },
        {
          code: '431_REQUEST_HEADER_FIELDS_TOO_LARGE',
          message: 'Request Header Fields Too Large (431)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server is unwilling to process the request because its header fields are too large.',
          solution: 'Reduce cookie size, authorization header, or custom headers.',
          steps: [
            'Remove unnecessary cookies',
            'Shorten authorization token',
            'Remove large custom headers',
            'Retry request'
          ],
          relatedCodes: ['400_BAD_REQUEST'],
          prevention: 'Keep headers minimal; use body for large data.',
        },
        {
          code: '500_INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error (500)',
          severity: 'critical',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
          solution: 'Retry after a short delay; contact support if persistent.',
          steps: [
            'Wait 30 seconds',
            'Retry the request',
            'Check server status page',
            'Contact support if error persists'
          ],
          relatedCodes: ['502_BAD_GATEWAY', '503_SERVICE_UNAVAILABLE'],
          prevention: 'Server-side error; monitor logs and health metrics.',
        },
        {
          code: '501_NOT_IMPLEMENTED',
          message: 'Not Implemented (501)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server does not support the functionality required to fulfill the request.',
          solution: 'Use an alternative endpoint or method.',
          steps: [
            'Check API documentation',
            'Use supported endpoint',
            'Contact API provider for feature availability',
            'Implement workaround'
          ],
          relatedCodes: ['405_METHOD_NOT_ALLOWED'],
          prevention: 'Follow API documentation and version compatibility guides.',
        },
        {
          code: '506_VARIANT_ALSO_NEGOTIATES',
          message: 'Variant Also Negotiates (506)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The server has an internal configuration error with transparent content negotiation.',
          solution: 'Contact server administrator.',
          steps: [
            'Check server configuration',
            'Disable content negotiation if misconfigured',
            'Contact admin',
            'Retry later'
          ],
          relatedCodes: ['500_INTERNAL_SERVER_ERROR'],
          prevention: 'Properly configure content negotiation on server.',
        },
        {
          code: '510_NOT_EXTENDED',
          message: 'Not Extended (510)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'Further extensions to the request are required for the server to fulfill it.',
          solution: 'Provide required policy or extension information.',
          steps: [
            'Check response for required extensions',
            'Add required policy headers',
            'Retry with extended request',
            'Contact admin if unclear'
          ],
          relatedCodes: ['501_NOT_IMPLEMENTED'],
          prevention: 'Follow server policy documentation for required extensions.',
        },
        {
          code: '599_NETWORK_CONNECT_TIMEOUT',
          message: 'Network Connect Timeout Error (599)',
          severity: 'error',
          category: '0~9. HTTP Status Codes',
          location: 'Page: Any tool → Area: network request',
          cause: 'The proxy server timed out while connecting to the upstream server.',
          solution: 'Check upstream server availability and network path.',
          steps: [
            'Check upstream server status',
            'Verify network path',
            'Increase proxy timeout',
            'Retry request'
          ],
          relatedCodes: ['504_GATEWAY_TIMEOUT', '502_BAD_GATEWAY'],
          prevention: 'Monitor upstream connectivity; configure appropriate timeouts.',
        },],
    },
  ],
};
