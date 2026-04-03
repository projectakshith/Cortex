import re

def clean_llm_output(text: str) -> str:
    if not text:
        return ""
    
    code_block_match = re.search(r'```[a-zA-Z]*\n(.*?)```', text, flags=re.DOTALL)
    
    if code_block_match:
        cleaned_text = code_block_match.group(1)
    else:
        cleaned_text = text.replace('```html', '') \
                           .replace('```jsx', '') \
                           .replace('```tsx', '') \
                           .replace('```', '')

    return cleaned_text.strip()