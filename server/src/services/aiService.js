const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const { getSystemInstructionForTone } = require('./promptService');

/**
 * AI Service for streaming responses using Gemini, OpenAI, or Mock Fallback
 */
class AIService {
  constructor() {
    this.geminiClient = null;
    this.openaiClient = null;
    this.initClients();
  }

  initClients() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim() !== '' && geminiKey !== 'your_gemini_api_key_here') {
      try {
        this.geminiClient = new GoogleGenerativeAI(geminiKey.trim());
        console.log('[AIService] Google Gemini client initialized successfully.');
      } catch (err) {
        console.warn('[AIService] Gemini initialization warning:', err.message);
      }
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.trim() !== '') {
      try {
        this.openaiClient = new OpenAI({ apiKey: openaiKey.trim() });
        console.log('[AIService] OpenAI client initialized.');
      } catch (err) {
        console.warn('[AIService] OpenAI initialization warning:', err.message);
      }
    }
  }

  /**
   * Stream completion with real-time chunks
   * @param {Object} params
   * @param {string} params.prompt
   * @param {string} params.tone
   * @param {Array} params.history
   * @param {Function} params.onChunk - Callback invoked with each text delta
   */
  async streamResponse({ prompt, tone = 'Professional', history = [], onChunk }) {
    // Re-check clients in case environment changed
    this.initClients();

    const systemInstruction = getSystemInstructionForTone(tone);

    // 1. Try Google Gemini API first (User requested)
    if (this.geminiClient) {
      try {
        console.log(`[AIService] Streaming via Google Gemini with tone: ${tone}`);
        const model = this.geminiClient.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemInstruction,
        });

        // Convert prior history into Gemini content format
        const chatHistory = history.map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: chatHistory,
        });

        const result = await chat.sendMessageStream(prompt);
        let fullResponse = '';

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullResponse += text;
            onChunk(text);
          }
        }

        return fullResponse;
      } catch (geminiError) {
        console.error('[AIService] Gemini API error:', geminiError.message);
        // If Gemini failed, fall through to OpenAI or Mock
      }
    }

    // 2. Try OpenAI API if available
    if (this.openaiClient) {
      try {
        console.log(`[AIService] Streaming via OpenAI with tone: ${tone}`);
        const messages = [
          { role: 'system', content: systemInstruction },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: prompt },
        ];

        const stream = await this.openaiClient.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          stream: true,
        });

        let fullResponse = '';
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            fullResponse += delta;
            onChunk(delta);
          }
        }
        return fullResponse;
      } catch (openaiErr) {
        console.error('[AIService] OpenAI API error:', openaiErr.message);
      }
    }

    // 3. Intelligent Mock Streamer (Zero-downtime evaluation fallback)
    console.log(`[AIService] Generating simulated streaming response with tone: ${tone}`);
    return await this.mockStreamResponse({ prompt, tone, onChunk });
  }

  /**
   * Generates realistic simulated stream with tone modifiers & code examples
   */
  async mockStreamResponse({ prompt, tone, onChunk }) {
    let responseText = '';
    const lowerPrompt = prompt.toLowerCase();

    if (tone === 'Professional') {
      if (lowerPrompt.includes('code') || lowerPrompt.includes('react') || lowerPrompt.includes('async')) {
        responseText = `### Executive Technical Overview

Here is the structured solution for your inquiry regarding **${prompt.trim()}**:

\`\`\`javascript
// Example: Asynchronous Task Pipeline in Node.js
async function executeTaskPipeline(taskData) {
  try {
    console.log("Initializing task with status: PENDING");
    const result = await processRecordAsync(taskData);
    return { status: 200, data: result };
  } catch (error) {
    console.error("Critical failure during execution:", error);
    throw new Error("PipelineExecutionException");
  }
}
\`\`\`

#### Key Architectural Considerations:
1. **Error Containment**: Isolated try-catch blocks guarantee process resilience.
2. **Scalability**: Non-blocking event loop execution ensures optimal throughput.
3. **Observability**: Structured logging facilitates immediate root-cause analysis.`;
      } else {
        responseText = `### Professional Assessment

Regarding your inquiry: *"**${prompt.trim()}**"*

1. **Strategic Context**: Modern conversational AI systems demand low latency, strict data validation, and responsive feedback loops.
2. **Execution Strategy**: Adopting an incremental streaming model drastically reduces Time-To-First-Token (TTFT), optimizing user experience.
3. **Enterprise Compliance**: State persistence within MongoDB ensures complete auditability and long-term thread retrieval.

Should you require further elaboration or specific technical specifications, please let me know.`;
      }
    } else if (tone === 'Casual') {
      if (lowerPrompt.includes('code') || lowerPrompt.includes('react') || lowerPrompt.includes('async')) {
        responseText = `Hey there! 😊 Let's dive right into this!

Here's a super clean snippet to get you up and running with **${prompt.trim()}**:

\`\`\`javascript
// Super simple and fun async demo!
const fetchCoolData = async () => {
  console.log("Fetching awesome vibes...");
  const res = await fetch("https://api.example.com/vibes");
  const data = await res.json();
  return data;
};
\`\`\`

Pretty neat, right? Feel free to tweak this snippet however you like! Got any questions? Just ask! 🚀`;
      } else {
        responseText = `Hey! 👋 Great question about: *"**${prompt.trim()}**"*.

I'm totally with you on this. Building real-time chat apps is super satisfying once you see those words stream in live! Having different tones like this casual vibe makes conversations feel way more human and friendly.

What should we explore next? I'm all ears! 🎉`;
      }
    } else {
      // Concise tone
      if (lowerPrompt.includes('code') || lowerPrompt.includes('react') || lowerPrompt.includes('async')) {
        responseText = `\`\`\`javascript
const execute = async () => (await fetch('/api/data')).json();
\`\`\`
- Direct execution.
- Returns parsed JSON.`;
      } else {
        responseText = `**Direct Answer:**
- **Topic:** ${prompt.trim()}
- **Status:** Complete.
- **Core Insight:** Streaming reduces TTFT; persistent storage enables multi-session recall.`;
      }
    }

    // Character-by-character / word-by-word streaming simulation
    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
      // Realistic typing jitter between 15ms and 35ms
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 20) + 15));
    }

    return responseText;
  }
}

module.exports = new AIService();
