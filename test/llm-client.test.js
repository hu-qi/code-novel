/**
 * LLM Client Tests
 *
 * @module test/llm-client.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LLMClient } from '../source/engine/llm-client.js';

describe('LLMClient', () => {
    /** @type {LLMClient} */
    let client;

    const mockConfig = {
        apiKey: 'test-api-key',
        baseURL: 'https://api.test.com/v1',
        model: 'test-model'
    };

    beforeEach(() => {
        client = new LLMClient(mockConfig);
    });

    describe('constructor', () => {
        it('should set default values', () => {
            const defaultClient = new LLMClient({ apiKey: 'key' });

            expect(defaultClient[Symbol.for('LLM config')]).toBeDefined();
        });

        it('should use provided config', () => {
            const customClient = new LLMClient({
                apiKey: 'custom-key',
                baseURL: 'https://custom.com',
                model: 'custom-model'
            });

            expect(customClient[Symbol.for('LLM config')].apiKey).toBe('custom-key');
            expect(customClient[Symbol.for('LLM config')].baseURL).toBe('https://custom.com');
            expect(customClient[Symbol.for('LLM config')].model).toBe('custom-model');
        });
    });

    describe('storyToCodePrompt', () => {
        it('should return system and user messages', () => {
            const prompt = LLMClient.storyToCodePrompt('test story');

            expect(prompt).toHaveLength(2);
            expect(prompt[0].role).toBe('system');
            expect(prompt[1].role).toBe('user');
        });

        it('should include story text in user message', () => {
            const story = 'A brave knight fights a dragon';
            const prompt = LLMClient.storyToCodePrompt(story);

            expect(prompt[1].content).toContain(story);
        });

        it('should include mapping rules in system message', () => {
            const prompt = LLMClient.storyToCodePrompt('test');

            expect(prompt[0].content).toContain('人物 → 类');
            expect(prompt[0].content).toContain('技能 → 方法');
        });
    });

    describe('codeToStoryPrompt', () => {
        it('should return system and user messages', () => {
            const prompt = LLMClient.codeToStoryPrompt('const x = 1;');

            expect(prompt).toHaveLength(2);
            expect(prompt[0].role).toBe('system');
            expect(prompt[1].role).toBe('user');
        });

        it('should include code in user message', () => {
            const code = 'class Knight {}';
            const prompt = LLMClient.codeToStoryPrompt(code);

            expect(prompt[1].content).toContain(code);
        });

        it('should include mapping rules in system message', () => {
            const prompt = LLMClient.codeToStoryPrompt('test');

            expect(prompt[0].content).toContain('类 → 人物');
            expect(prompt[0].content).toContain('方法 → 技能');
        });
    });

    describe('observe', () => {
        it('should register event handlers', () => {
            const handler = vi.fn();
            const config = client[Symbol.for('LLM config')];

            client.observe({ test: handler });

            expect(config.test).toContain(handler);
        });

        it('should allow multiple handlers for same event', () => {
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            const config = client[Symbol.for('LLM config')];

            client.observe({ test: handler1 });
            client.observe({ test: handler2 });

            expect(config.test).toHaveLength(2);
        });
    });
});