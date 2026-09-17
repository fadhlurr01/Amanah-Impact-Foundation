import { translations } from '../translations';

export async function translateText(text: string, targetLang: string): Promise<string> {
  // Try static translations first
  if (translations[targetLang] && translations[targetLang][text]) {
    return translations[targetLang][text];
  }

  // Fallback to Gemini API
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    
    if (!response.ok) throw new Error('Translation failed');
    
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on failure
  }
}
