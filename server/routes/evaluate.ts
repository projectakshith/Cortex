import { Router, Request, Response } from 'express';
import axios from 'axios';
import model from '../lib/gemini';

const router = Router();

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'https://cortex-l1wi.onrender.com';

const PROMPTS: Record<string, string> = {
  brutalist: `You are an expert accessibility engineer and UI designer. The provided React/Tailwind code has been mathematically proven to cause high cognitive overload and visual strain in human users. Your job is to refactor this code to drop the cognitive load to zero.

RULES:
1. Strip out all chaotic CSS, unnecessary drop-shadows, rounded corners, and low-contrast gradients.
2. Rewrite the UI using a brutalist, high-contrast, minimalist aesthetic (stark white backgrounds, heavy black borders, black text, and pure red #dd2b37 for primary accents).
3. Flatten 'div-hell' by removing unnecessary nested wrappers.
4. Output ONLY the raw code. Do not include markdown formatting (like \`\`\`html), explanations, or conversational text. Start directly with the first HTML/JSX tag.`,

  minimal: `You are a minimalist UI engineer. Refactor the provided code to be as clean and simple as possible.

RULES:
1. Use only white backgrounds, light gray borders, and dark gray text.
2. Remove all decorative elements — no shadows, no gradients, no animations.
3. Use generous whitespace and a single sans-serif font.
4. Output ONLY the raw code. No markdown, no explanations. Start directly with the first HTML/JSX tag.`,

  accessible: `You are an accessibility-first UI engineer. Refactor the provided code to meet WCAG AA standards.

RULES:
1. Ensure all text has at least 4.5:1 contrast ratio.
2. All interactive elements must have visible focus states and ARIA labels.
3. Use semantic HTML elements (button, nav, main, section) instead of generic divs.
4. Output ONLY the raw code. No markdown, no explanations. Start directly with the first HTML/JSX tag.`
};

router.post('/evaluate-ui', async (req: Request, res: Response): Promise<void> => {
  const { raw_code, image_base64, style = 'brutalist' } = req.body;

  if (!raw_code || !image_base64) {
    res.status(400).json({ error: 'missing fields' });
    return;
  }

  try {
    const response = await axios.post(`${PYTHON_BACKEND_URL}/api/analyze`, {
      code: raw_code,
      image_base64: image_base64
    });

    const data = response.data;
    let refactoredCode = data.refactored_code;

    if (data.friction_score > 40) {
      const prompt = PROMPTS[style] || PROMPTS.brutalist;
      const result = await model.generateContent([
        { text: prompt },
        { text: raw_code }
      ]);
      refactoredCode = result.response.text();
    }

    res.json({
      original_score: data.friction_score,
      status: data.status,
      message: data.message,
      clean_code: refactoredCode,
      brain_regions: {
        visual_cortex: { score: data.friction_score / 100 },
        prefrontal: { score: (data.friction_score * 0.8) / 100 }
      }
    });
  } catch (err: any) {
    console.error('Neural Sync Error:', err.message);
    res.status(500).json({ error: 'Neural Engine synchronization failed' });
  }
});

export default router;
