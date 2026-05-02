/**
 * Story Parser - 故事解析器
 *
 * @class
 */

const __llm_client = Symbol('LLM client');
const __character_mapper = Symbol('Character mapper');
const __plot_analyzer = Symbol('Plot analyzer');

class StoryParser {
    /**
     * @param {LLMClient} llmClient - LLM 客户端
     */
    constructor(llmClient) {
        this[__llm_client] = llmClient;
        this[__character_mapper] = null;
        this[__plot_analyzer] = null;
    }

    /**
     * 设置角色映射器
     *
     * @param {CharacterMapper} mapper - 角色映射器
     * @return {this}
     */
    setCharacterMapper(mapper) {
        this[__character_mapper] = mapper;
        return this;
    }

    /**
     * 设置情节分析器
     *
     * @param {PlotAnalyzer} analyzer - 情节分析器
     * @return {this}
     */
    setPlotAnalyzer(analyzer) {
        this[__plot_analyzer] = analyzer;
        return this;
    }

    /**
     * 解析故事文本
     *
     * @param {string} storyText - 故事文本
     * @return {Promise<Story>} - 解析后的故事对象
     */
    async parse(storyText) {
        const prompt = StoryParser.__buildParsePrompt(storyText);
        const response = await this[__llm_client].chat(prompt);

        return this.__parseResponse(response);
    }

    /**
     * 构建解析提示词
     *
     * @private
     * @param {string} storyText - 故事文本
     * @return {string[]}
     */
    static __buildParsePrompt(storyText) {
        return [
            {
                role: 'system',
                content: `请分析以下故事，提取结构化信息。返回 JSON 格式：

{
  "title": "故事标题",
  "characters": [
    {
      "name": "人物名",
      "description": "描述",
      "skills": ["技能1", "技能2"],
      "friends": ["朋友1"]
    }
  ],
  "plots": [
    {
      "name": "情节名",
      "description": "描述",
      "characters": ["人物名"],
      "sequence": "执行顺序描述"
    }
  ],
  "setting": "场景设定"
}`
            },
            {
                role: 'user',
                content: storyText
            }
        ];
    }

    /**
     * 解析响应
     *
     * @private
     * @param {string} response - LLM 响应
     * @return {Story}
     */
    __parseResponse(response) {
        try {
            // 提取 JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const data = JSON.parse(jsonMatch[0]);

            // 映射角色
            if (this[__character_mapper] && data.characters) {
                data.characters = data.characters.map(
                    char => this[__character_mapper].map(char)
                );
            }

            return data;
        } catch (error) {
            throw new Error(`Story parsing failed: ${error.message}`);
        }
    }
}

export { StoryParser };