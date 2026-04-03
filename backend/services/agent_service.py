import re
import base64
from io import BytesIO
from PIL import Image
from backend.core.llm_client import model
from backend.utils.text import clean_llm_output

SYSTEM_PROMPT = """You are an expert accessibility engineer and UI designer building interfaces for high-performance aerospace systems (like SpaceX or Linear).
The provided React/Tailwind code has been analyzed by a neural simulation model and is causing high cognitive overload and visual strain in human users. 
Your job is to refactor this code to drop the cognitive load to near zero.

RULES:
1. Strip out all chaotic CSS, unnecessary drop-shadows, rounded corners, conflicting colors, and low-contrast gradients.
2. Rewrite the UI using a high-performance, dark-mode aerospace aesthetic.
3. Use pitch-black backgrounds (bg-black or bg-neutral-950), ultra-thin deep grey borders (border-neutral-800).
4. Use pure white or gray text. Use pure Neon Cyan (text-[#00F0FF]) for safe data/active states, and sharp Alert Red (text-[#FF2A2A]) for critical warnings. Keep decorations to an absolute minimum.
5. Flatten 'div-hell' by removing unnecessary nested wrappers. Ensure the component remains strictly functional and maintains its original purpose.
6. Output ONLY the raw React/Tailwind code. Do not include markdown formatting (like ```jsx), explanations, or conversational text. Start directly with the first HTML/JSX tag."""

def process_base64_image(base64_string: str) -> Image.Image:
    image_data = re.sub('^data:image/.+;base64,', '', base64_string)
    image_bytes = base64.b64decode(image_data)
    return Image.open(BytesIO(image_bytes)).convert("RGB")

async def refactor_ui_code(raw_code: str, image_base64: str) -> str:

    prompt_text = f"{SYSTEM_PROMPT}\n\nHere is the exact code to refactor:\n{raw_code}"
    
    try:
        ui_image = process_base64_image(image_base64)
        response = await model.generate_content_async([prompt_text, ui_image])
        
    except Exception as e:
        print(f"Warning - Vision processing skipped/failed: {e}")
        response = await model.generate_content_async(prompt_text)
        
    return clean_llm_output(response.text)