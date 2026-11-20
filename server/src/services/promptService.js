/**
 * Prompt & Tone Management Service
 * Implements "The Vibe Check" system instruction modifier
 * and contextual AI conversation title generation (ChatGPT / Gemini style).
 */

const TONE_SYSTEM_INSTRUCTIONS = {
  Professional: `You are an executive enterprise AI assistant.
Your communication style is articulate, polished, objective, authoritative, and structured.
Always provide well-organized responses with bullet points, numbered steps, or clear section headings where appropriate.
Do not use emojis or colloquial slang under any circumstances.`,

  Casual: `You are an approachable, conversational AI companion.
Your tone is warm, natural, and helpful.
Use clean, everyday language and clear explanations.
Do not use emojis under any circumstances.`,

  Concise: `You are an ultra-concise AI assistant.
Your goal is maximum density with minimum words.
Do not provide greetings, pleasantries, conversational fluff, or filler text.
Output only the essential answer or code snippet directly.
Do not use emojis under any circumstances.`
};

/**
 * Returns system instruction modifier based on user tone selection
 * @param {string} tone - 'Professional' | 'Casual' | 'Concise'
 * @returns {string}
 */
const getSystemInstructionForTone = (tone = 'Professional') => {
  const normalizedTone = tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase();
  return TONE_SYSTEM_INSTRUCTIONS[normalizedTone] || TONE_SYSTEM_INSTRUCTIONS.Professional;
};

/**
 * Heuristic topic extractor that turns raw questions into neat 2-4 word titles
 */
const formatContextualFallbackTitle = (rawPrompt) => {
  if (!rawPrompt) return 'New Conversation';

  let cleaned = rawPrompt.toLowerCase().trim();

  // Greetings check
  if (/^(hi|hii|hiii|hello|hey|good\s+(morning|evening|afternoon)|howdy)/i.test(cleaned)) {
    if (cleaned.includes('gemini') || cleaned.includes('ai') || cleaned.includes('what can you do') || cleaned.includes('who are you')) {
      return 'Assistant Introduction';
    }
    if (cleaned.split(/\s+/).length <= 4) {
      return 'General Greeting';
    }
  }

  // Common filler patterns to strip
  const stopPhrases = [
    /^(can you\s+)?(please\s+)?(tell me\s+)?(what is\s+|what are\s+|explain\s+|describe\s+|how to\s+|how does\s+)/i,
    /^(give me\s+)?(write\s+(a\s+|some\s+)?)/i,
    /\b(in details|in detail|briefly|step by step|please)\b/gi,
  ];

  for (const regex of stopPhrases) {
    cleaned = cleaned.replace(regex, '').trim();
  }

  // Capitalize remaining words into Title Case
  const words = cleaned
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  if (words.length === 0) return 'General Inquiry';

  const titleCased = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return titleCased.length > 32 ? `${titleCased.substring(0, 30)}...` : titleCased;
};

/**
 * Generates context-based title using Gemini/AI when available
 * or heuristic extraction, exactly like ChatGPT & Gemini.
 */
const generateTitleFromPrompt = async (prompt, geminiClient = null) => {
  if (!prompt || !prompt.trim()) return 'New Conversation';
  const clean = prompt.trim();

  // If Gemini API is available, generate a contextual 2-4 word title
  if (geminiClient) {
    try {
      const model = geminiClient.getGenerativeModel({ model: 'gemini-flash-lite-latest' });
      const response = await model.generateContent(
        `Summarize this user question into a concise 2 to 4 word title for a chat sidebar (like ChatGPT/Gemini). Return ONLY the title, no quotes, no punctuation, no emojis:\n"${clean}"`
      );
      const aiTitle = response.response.text()?.trim().replace(/["\n\r.]/g, '');
      if (aiTitle && aiTitle.length >= 3 && aiTitle.length <= 36) {
        return aiTitle;
      }
    } catch {
      // Fall through to heuristic if API fails or rate-limits
    }
  }

  return formatContextualFallbackTitle(clean);
};

module.exports = {
  TONE_SYSTEM_INSTRUCTIONS,
  getSystemInstructionForTone,
  generateTitleFromPrompt,
  formatContextualFallbackTitle,
};
