/**
 * Prompt & Tone Management Service
 * Implements "The Vibe Check" system instruction modifier.
 */

const TONE_SYSTEM_INSTRUCTIONS = {
  Professional: `You are an executive enterprise AI assistant.
Your communication style is polished, authoritative, highly structured, objective, and articulate.
Always provide well-organized responses with bullet points, numbered steps, or clear section headings where appropriate.
Avoid slang, unnecessary emojis, and colloquialisms.`,

  Casual: `You are a friendly, witty, and approachable AI companion.
Your tone is warm, conversational, empathetic, and relaxed.
Feel free to use natural everyday language, lively phrasing, relatable analogies, and a helpful, cheerful attitude.`,

  Concise: `You are an ultra-concise, razor-sharp AI assistant.
Your objective is maximum density with minimum words.
Do not provide filler, pleasantries, conversational fluff, or introductory/closing remarks.
Directly state the essential answer, key facts, or code snippet immediately.`
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
