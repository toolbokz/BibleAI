// src/services/api/llamaService.ts

import axios from 'axios';
import { LLAMA_API_KEY, LLAMA_API_URL } from '@env';
import { ChatMessage } from '../../types';

class LlamaService {
    private apiKey: string;
    private apiUrl: string;
    private model: string = 'meta-llama/Meta-Llama-3-70B-Instruct';

    constructor() {
        this.apiKey = LLAMA_API_KEY;
        this.apiUrl = LLAMA_API_URL || 'https://api.together.xyz/v1';
    }

    async generateResponse(
        messages: ChatMessage[],
        language: string = 'en'
    ): Promise<string> {
        try {
            const systemPrompt = this.getSystemPrompt(language);

            const formattedMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            ];

            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: formattedMessages,
                    max_tokens: 1024,
                    temperature: 0.7,
                    top_p: 0.9,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Llama API Error:', error);
            throw new Error('Failed to generate AI response');
        }
    }

    private getSystemPrompt(language: string): string {
        const basePrompt = `You are a knowledgeable and compassionate Bible study assistant. Your role is to:
- Help users understand Biblical texts and their meanings
- Provide historical and cultural context
- Answer theological questions with wisdom and respect
- Offer spiritual guidance based on Biblical principles
- Be respectful of different Christian denominations and interpretations
- Cite specific Bible verses when relevant
- Respond in a warm, encouraging, and non-judgmental manner

Always maintain accuracy in Biblical references and be clear when offering interpretations versus established doctrine.`;

        const languageInstruction = language !== 'en'
            ? `\n\nIMPORTANT: Respond in ${this.getLanguageName(language)} language.`
            : '';

        return basePrompt + languageInstruction;
    }

    private getLanguageName(code: string): string {
        const languages: { [key: string]: string } = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'ru': 'Russian'
        };
        return languages[code] || 'English';
    }

    async streamResponse(
        messages: ChatMessage[],
        language: string,
        onChunk: (chunk: string) => void
    ): Promise<void> {
        try {
            const systemPrompt = this.getSystemPrompt(language);

            const formattedMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            ];

            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: formattedMessages,
                    max_tokens: 1024,
                    temperature: 0.7,
                    stream: true
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'stream'
                }
            );

            response.data.on('data', (chunk: Buffer) => {
                const lines = chunk.toString().split('\n').filter(line => line.trim());
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                onChunk(content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Llama Streaming Error:', error);
            throw new Error('Failed to stream AI response');
        }
    }
}

export default new LlamaService();