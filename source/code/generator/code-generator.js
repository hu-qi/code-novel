/**
 * Code Generator - 代码生成器
 *
 * @class
 */

const __llm_client = Symbol('LLM client');
const __template_engine = Symbol('Template engine');

class CodeGenerator {
    /**
     * @param {LLMClient} llmClient - LLM 客户端
     */
    constructor(llmClient) {
        this[__llm_client] = llmClient;
        this[__template_engine] = new TemplateEngine();
    }

    /**
     * 生成代码
     *
     * @param {Story} story - 故事对象
     * @return {Promise<string>} - 生成的代码
     */
    async generate(story) {
        // 使用 LLM 生成
        const storyText = this.__storyToText(story);
        const prompt = LLMClient.storyToCodePrompt(storyText);
        const code = await this[__llm_client].chat(prompt);

        return this.__formatCode(code);
    }

    /**
     * 故事转文本
     *
     * @private
     * @param {Story} story - 故事对象
     * @return {string}
     */
    __storyToText(story) {
        let text = `# ${story.title}\n\n`;

        if (story.setting) {
            text += `## 场景\n${story.setting}\n\n`;
        }

        if (story.characters?.length) {
            text += `## 人物\n`;
            story.characters.forEach(char => {
                text += `- ${char.name}: ${char.description || ''}\n`;
            });
            text += '\n';
        }

        if (story.plots?.length) {
            text += `## 情节\n`;
            story.plots.forEach((plot, i) => {
                text += `${i + 1}. ${plot.name}\n   ${plot.description}\n`;
            });
        }

        return text;
    }

    /**
     * 格式化代码
     *
     * @private
     * @param {string} code - 代码
     * @return {string}
     */
    __formatCode(code) {
        // 移除 markdown 代码块标记
        return code.replace(/```(?:javascript|js|typescript|ts)?\n?/g, '').trim();
    }
}

/**
 * Template Engine - 模板引擎
 *
 * @class
 */
class TemplateEngine {
    /**
     * 渲染模板
     *
     * @param {string} template - 模板
     * @param {Object} data - 数据
     * @return {string}
     */
    render(template, data) {
        return template.replace(
            /\{\{(\w+)\}\}/g,
            (_, key) => data[key] ?? ''
        );
    }

    /**
     * 类模板
     *
     * @param {Object} classDef - 类定义
     * @return {string}
     */
    renderClass(classDef) {
        return `/**
 * ${classDef.className}
 *
${classDef.properties?.map(p => ` * @property {${p.type}} ${p.name}`).join('\n') || ' *'}
 */

export default class ${classDef.className} {
${classDef.properties?.map(p => `    ${p.name} = ${p.value};`).join('\n') || ''}
${classDef.methods?.map(m => `
    /**
     * ${m.description}
     *
     * @return {${m.returnType}}
     */
    ${m.name}(${m.parameters?.join(', ') || ''}) {
        // TODO: implement
    }`).join('\n') || ''}
}`;
    }
}

export { CodeGenerator };