// services/groqApi.ts

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface GroqResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface GroqStreamResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            role?: string;
            content?: string;
        };
        finish_reason: string | null;
    }>;
}

interface SendMessageResponse {
    content: string;
    role: 'assistant';
}

interface GroqError {
    error: {
        message: string;
        type: string;
        code: string;
    };
}

type GroqModel =
    | 'llama3-8b-8192'
    | 'llama3-70b-8192'
    | 'llama-3.1-8b-instant'
    | 'llama-3.1-70b-versatile'
    | 'llama-3.2-1b-preview'
    | 'llama-3.2-3b-preview'
    | 'mixtral-8x7b-32768'
    | 'gemma-7b-it';

interface ChatCompletionOptions {
    model?: GroqModel;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    stream?: boolean;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

class GroqAPI {
    private apiKey: string;
    private defaultModel: GroqModel;

    constructor(apiKey: string, defaultModel: GroqModel = 'llama3-70b-8192') {
        this.apiKey = apiKey;
        this.defaultModel = defaultModel;
    }

    /**
     * Send a message and get a complete response
     */
    async sendMessage(
        message: string,
        conversationHistory: Message[] = [],
        options?: ChatCompletionOptions
    ): Promise<SendMessageResponse> {
        try {
            const messages: Message[] = [
                ...conversationHistory,
                { role: 'user', content: message }
            ];

            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: options?.model || this.defaultModel,
                    messages: messages,
                    temperature: options?.temperature ?? 0.7,
                    max_tokens: options?.max_tokens ?? 2048,
                    top_p: options?.top_p ?? 1,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData: GroqError = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data: GroqResponse = await response.json();
            return {
                content: data.choices[0].message.content,
                role: 'assistant'
            };
        } catch (error) {
            console.error('Groq API Error:', error);
            throw error;
        }
    }

    /**
     * Stream a message response chunk by chunk
     */
    async streamMessage(
        message: string,
        conversationHistory: Message[] = [],
        onChunk: (chunk: string, fullContent: string) => void,
        options?: ChatCompletionOptions
    ): Promise<SendMessageResponse> {
        try {
            const messages: Message[] = [
                ...conversationHistory,
                { role: 'user', content: message }
            ];

            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: options?.model || this.defaultModel,
                    messages: messages,
                    temperature: options?.temperature ?? 0.7,
                    max_tokens: options?.max_tokens ?? 2048,
                    top_p: options?.top_p ?? 1,
                    stream: true
                })
            });

            if (!response.ok) {
                const errorData: GroqError = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Response body is not readable');
            }

            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed: GroqStreamResponse = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content || '';
                            if (content) {
                                fullContent += content;
                                onChunk(content, fullContent);
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                        }
                    }
                }
            }

            return { content: fullContent, role: 'assistant' };
        } catch (error) {
            console.error('Groq Stream Error:', error);
            throw error;
        }
    }

    /**
     * Change the default model
     */
    setDefaultModel(model: GroqModel): void {
        this.defaultModel = model;
    }

    /**
     * Get the current default model
     */
    getDefaultModel(): GroqModel {
        return this.defaultModel;
    }
}

export default GroqAPI;
export type { Message, GroqModel, SendMessageResponse, ChatCompletionOptions };