/**
 * Plot Analyzer Tests
 *
 * @module test/plot-analyzer.test
 */

import { describe, it, expect } from 'vitest';
import { PlotAnalyzer } from '../source/story/plot/plot-analyzer.js';

describe('PlotAnalyzer', () => {
    /** @type {PlotAnalyzer} */
    let analyzer;

    beforeEach(() => {
        analyzer = new PlotAnalyzer();
    });

    describe('analyze', () => {
        it('should build sequence from plots', () => {
            const plots = [
                { name: 'Introduction' },
                { name: 'Conflict' },
                { name: 'Resolution' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.sequence).toEqual(['Introduction', 'Conflict', 'Resolution']);
        });

        it('should detect sequence flow', () => {
            const plots = [
                { name: 'Start' },
                { name: 'Middle' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.flow).toBe('sequence');
        });

        it('should detect branch flow when plot contains 如果', () => {
            const plots = [
                { name: 'Decision', description: '如果选择左边' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.flow).toBe('branch');
        });

        it('should detect branch flow when plot contains 选择', () => {
            const plots = [
                { name: 'Choice', description: '用户需要做出选择' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.flow).toBe('branch');
        });

        it('should detect loop flow when plot contains 重复', () => {
            const plots = [
                { name: 'Loop', description: '重复执行任务' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.flow).toBe('loop');
        });

        it('should detect loop flow when plot contains 循环', () => {
            const plots = [
                { name: 'Cycle', description: '进入循环' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.flow).toBe('loop');
        });

        it('should calculate complexity based on plot count', () => {
            const plots = [
                { name: 'Plot 1' },
                { name: 'Plot 2' },
                { name: 'Plot 3' }
            ];

            const result = analyzer.analyze(plots);

            expect(result.complexity).toBe(3);
        });

        it('should increase complexity for multiple characters', () => {
            const plots = [
                { name: 'Plot', characters: ['A', 'B', 'C'] }
            ];

            const result = analyzer.analyze(plots);

            expect(result.complexity).toBeGreaterThan(1);
        });

        it('should cap complexity at 10', () => {
            const plots = Array(20).fill({ name: 'Plot', description: 'x'.repeat(200) });

            const result = analyzer.analyze(plots);

            expect(result.complexity).toBe(10);
        });
    });

    describe('plotToCodeStructure', () => {
        it('should convert plot name to function name', () => {
            const plot = { name: 'Battle Scene' };

            const result = analyzer.plotToCodeStructure(plot);

            expect(result.functionName).toBe('battleScene');
        });

        it('should extract characters as parameters', () => {
            const plot = {
                name: 'Battle',
                characters: ['Knight', 'Dragon']
            };

            const result = analyzer.plotToCodeStructure(plot);

            expect(result.parameters).toEqual(['Knight', 'Dragon']);
        });

        it('should include description as body', () => {
            const plot = {
                name: 'Battle',
                description: 'The knight fights the dragon'
            };

            const result = analyzer.plotToCodeStructure(plot);

            expect(result.body).toBe('The knight fights the dragon');
        });

        it('should handle empty plot', () => {
            const plot = { name: 'Empty' };

            const result = analyzer.plotToCodeStructure(plot);

            expect(result.functionName).toBe('empty');
            expect(result.parameters).toEqual([]);
            expect(result.body).toBeUndefined();
        });
    });
});