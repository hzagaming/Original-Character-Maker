from pathlib import Path
import json
import sys

from PIL import Image
from rembg import new_session, remove


def collect_quality(output_path: Path) -> dict:
    with Image.open(output_path).convert("RGBA") as image:
        width, height = image.size
        alpha = image.getchannel("A")
        bbox = alpha.getbbox()
        pixels = list(alpha.getdata())

    total_pixels = max(width * height, 1)
    visible_pixels = sum(1 for value in pixels if value > 0)
    opaque_pixels = sum(1 for value in pixels if value >= 245)

    bbox_ratio = 0.0
    if bbox:
        bbox_width = max(bbox[2] - bbox[0], 0)
        bbox_height = max(bbox[3] - bbox[1], 0)
        bbox_ratio = (bbox_width * bbox_height) / total_pixels

    return {
        "width": width,
        "height": height,
        "non_transparent_ratio": round(visible_pixels / total_pixels, 6),
        "opaque_ratio": round(opaque_pixels / total_pixels, 6),
        "bbox": list(bbox) if bbox else None,
        "bbox_ratio": round(bbox_ratio, 6),
    }


def main() -> int:
    if len(sys.argv) not in (3, 4):
        print("Usage: rembg_remove.py <input_path> <output_path> [model_name]", file=sys.stderr)
        return 1

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    model_name = sys.argv[3] if len(sys.argv) == 4 else "isnet-anime"

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    session = new_session(model_name=model_name)
    output_path.write_bytes(remove(input_path.read_bytes(), session=session))
    payload = {
        "output_path": str(output_path),
        "model": model_name,
        "quality": collect_quality(output_path),
    }
    print(json.dumps(payload, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
