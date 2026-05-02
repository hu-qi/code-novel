/**
 * Code Novel - 代码即小说
 *
 * Transform stories into code, or code into stories
 *
 * @module code-novel
 * @author TechQuery
 */

export { StoryParser } from './story/parser/story-parser.js';
export { CharacterMapper } from './story/character/character-mapper.js';
export { PlotAnalyzer } from './story/plot/plot-analyzer.js';
export { CodeGenerator } from './code/generator/code-generator.js';
export { StoryCodeBridge } from './engine/bridge/story-code-bridge.js';
export { LLMClient } from './engine/llm-client.js';

/**
 * @typedef {Object} Story
 * @property {string} title - 故事标题
 * @property {Character[]} characters - 人物列表
 * @property {Plot[]} plots - 情节列表
 * @property {string} setting - 场景设定
 */

/**
 * @typedef {Object} Character
 * @property {string} name - 人物名称
 * @property {string} description - 人物描述
 * @property {string[]} skills - 技能列表
 * @property {string[]} friends - 朋友列表
 */

/**
 * @typedef {Object} Plot
 * @property {string} name - 情节名称
 * @property {string} description - 情节描述
 * @property {string[]} characters - 参与人物
 * @property {string} sequence - 执行顺序
 */

/**
 * @typedef {Object} CodeStructure
 * @property {string} className - 类名
 * @property {Object} properties - 属性
 * @property {string[]} methods - 方法
 * @property {string[]} imports - 导入
 */