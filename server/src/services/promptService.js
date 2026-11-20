/**
 * Prompt & Tone Management Service
 * Implements "The Vibe Check" system instruction modifier.
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
 * Builds a clean prompt title from the first message
 * @param {string} prompt
 * @returns {string}
 */
const generateTitleFromPrompt = (prompt) => {
  if (!prompt) return 'New Conversation';
  const clean = prompt.trim().replace(/[\r\n]+/g, ' ');
  return clean.length > 40 ? `${clean.substring(0, 37)}...` : clean;
};

module.exports = {
  TONE_SYSTEM_INSTRUCTIONS,
  getSystemInstructionForTone,
  generateTitleFromPrompt,
};
