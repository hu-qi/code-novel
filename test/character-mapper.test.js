/**
 * Character Mapper Tests
 *
 * @module test/character-mapper.test
 */

import { describe, it, expect } from 'vitest';
import { CharacterMapper } from '../source/story/character/character-mapper.js';

describe('CharacterMapper', () => {
    /** @type {CharacterMapper} */
    let mapper;

    beforeEach(() => {
        mapper = new CharacterMapper();
    });

    describe('mapping', () => {
        it('should have correct mapping rules', () => {
            const mapping = CharacterMapper.mapping;

            expect(mapping.name).toBe('className');
            expect(mapping.description).toBe('docComment');
            expect(mapping.skills).toBe('methods');
            expect(mapping.friends).toBe('dependencies');
        });
    });

    describe('map', () => {
        it('should convert character name to PascalCase class name', () => {
            const result = mapper.map({ name: 'brave knight' });

            expect(result.className).toBe('BraveKnight');
        });

        it('should handle single word names', () => {
            const result = mapper.map({ name: 'Arthur' });

            expect(result.className).toBe('Arthur');
        });

        it('should handle names with hyphens', () => {
            const result = mapper.map({ name: 'iron-man' });

            expect(result.className).toBe('IronMan');
        });

        it('should generate doc comment', () => {
            const result = mapper.map({
                name: 'Knight',
                description: 'A brave warrior'
            });

            expect(result.docComment).toContain('Knight');
            expect(result.docComment).toContain('A brave warrior');
        });

        it('should extract description as property', () => {
            const result = mapper.map({
                name: 'Knight',
                description: 'A brave warrior'
            });

            expect(result.properties).toHaveLength(1);
            expect(result.properties[0].name).toBe('description');
            expect(result.properties[0].type).toBe('string');
        });

        it('should extract skills as methods', () => {
            const result = mapper.map({
                name: 'Knight',
                skills: ['Attack', 'Defend', 'Ride Horse']
            });

            expect(result.methods).toHaveLength(3);
            expect(result.methods[0].name).toBe('attack');
            expect(result.methods[1].name).toBe('defend');
            expect(result.methods[2].name).toBe('rideHorse');
        });

        it('should find dependencies from friends', () => {
            const result = mapper.map({
                name: 'Knight',
                friends: ['Wizard', 'Archer']
            });

            expect(result.dependencies).toEqual(['Wizard', 'Archer']);
        });

        it('should handle empty character', () => {
            const result = mapper.map({ name: 'Hero' });

            expect(result.className).toBe('Hero');
            expect(result.properties).toHaveLength(0);
            expect(result.methods).toHaveLength(0);
            expect(result.dependencies).toHaveLength(0);
        });
    });
});