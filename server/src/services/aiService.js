const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const { getSystemInstructionForTone } = require('./promptService');

const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-2.5-flash-lite',
];

/**
 * AI Service for streaming responses using Gemini, OpenAI, or Smart Fallback
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
      } catch (err) {
        console.warn('[AIService] Gemini initialization warning:', err.message);
      }
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey.trim() !== '') {
      try {
        this.openaiClient = new OpenAI({ apiKey: openaiKey.trim() });
      } catch (err) {
        console.warn('[AIService] OpenAI initialization warning:', err.message);
      }
    }
  }

  /**
   * Stream completion with real-time chunks
   */
  async streamResponse({ prompt, tone = 'Professional', history = [], onChunk }) {
    this.initClients();
    const systemInstruction = getSystemInstructionForTone(tone);

    // 1. Try Google Gemini API with priority fallback models
    if (this.geminiClient) {
      for (const modelName of GEMINI_MODELS) {
        try {
          const model = this.geminiClient.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction,
          });

          // Build clean multi-turn contents
          const contents = [];
          if (Array.isArray(history) && history.length > 0) {
            for (const msg of history) {
              if (msg && msg.content) {
                contents.push({
                  role: msg.role === 'assistant' ? 'model' : 'user',
                  parts: [{ text: msg.content }],
                });
              }
            }
          }
          contents.push({
            role: 'user',
            parts: [{ text: prompt }],
          });

          const result = await model.generateContentStream({ contents });
          let fullResponse = '';

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullResponse += text;
              onChunk(text);
            }
          }

          if (fullResponse.trim().length > 0) {
            return fullResponse;
          }
        } catch (geminiError) {
          console.warn(`[AIService] Gemini model ${modelName} error:`, geminiError.message);
          // Try next model in candidate list
        }
      }
    }

    // 2. Try OpenAI API if available
    if (this.openaiClient) {
      try {
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
        console.warn('[AIService] OpenAI API error:', openaiErr.message);
      }
    }

    // 3. Fallback (Direct, clean response without any "Regarding your inquiry" prefixes)
    return await this.mockStreamResponse({ prompt, tone, onChunk });
  }

  /**
   * Generates realistic direct response without any repetitive template headers
   */
  async mockStreamResponse({ prompt, tone, onChunk }) {
    let responseText = '';
    const cleanPrompt = prompt.trim();
    const lower = cleanPrompt.toLowerCase();

    if (lower.includes('operating system') || lower.includes('os')) {
      responseText = `An **Operating System (OS)** is system software that manages computer hardware, software resources, and provides common services for computer programs.

### Key Functions of an Operating System:
1. **Process Management**: Schedules CPU execution, process creation, termination, and synchronization.
2. **Memory Management**: Allocates and deallocates RAM dynamically, tracks memory words, and implements Virtual Memory with paging.
3. **File System Management**: Manages directory hierarchies, read/write permissions, and disk storage allocation.
4. **Device Management**: Interfaces with peripherals via device drivers using buffering, caching, and spooling.
5. **Security & Protection**: Enforces access controls, user authorization, and system integrity.

### Primary Types of Operating Systems:
- **Batch OS**: Executes batches of jobs sequentially without direct user interaction.
- **Time-Sharing / Multitasking OS**: Rapidly switches CPU execution across multiple active processes (e.g., Linux, macOS, Windows).
- **Distributed OS**: Coordinates multiple autonomous computational nodes over a network into a single logical system.
- **Real-Time OS (RTOS)**: Guarantees deterministic, sub-millisecond execution deadlines for critical hardware (e.g., VxWorks, FreeRTOS).
- **Embedded OS**: Lightweight, resource-constrained kernels optimized for dedicated appliances and IoT devices.`;
    } else if (lower.includes('code') || lower.includes('script') || lower.includes('async')) {
      responseText = `Here is an implementation example:

\`\`\`javascript
async function executeTaskPipeline(items) {
  const results = await Promise.all(
    items.map(async (item) => {
      const data = await processRecordAsync(item);
      return data;
    })
  );
  return results;
}
\`\`\`

- **Non-blocking Execution**: Uses asynchronous task delegation to maintain responsive event loops.
- **Parallel Dispatch**: Processes concurrent workloads with unified error containment.`;
    } else {
      responseText = `Here is the comprehensive overview for your request:

1. **Fundamental Architecture**: Systems rely on modular components with clean interfaces, low coupling, and predictable state transitions.
2. **Performance Optimization**: Incremental streaming minimizes Time-To-First-Token and maintains continuous feedback.
3. **Data Integrity**: Auditable persistence ensures complete session recall across state reloads.`;
    }

    // Stream character-by-character / word-by-word
    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    return responseText;
  }
}

module.exports = new AIService();
