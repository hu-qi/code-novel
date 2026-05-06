/**
 * LLM Client - 大语言模型客户端
 *
 * @class
 */

const __llm_config = Symbol('LLM config');
const __request_id = Symbol('Request ID');

class LLMClient {
    /**
     * @param {Object} config - 配置
     * @param {string} config.apiKey - API 密钥
     * @param {string} config.baseURL - API 地址
     * @param {string} config.model - 模型名称
     */
    constructor(config) {
        this._events = {};

        this[__llm_config] = {
            apiKey: config.apiKey,
            baseURL: config.baseURL || 'https://api.huqi.host/v1',
            model: config.model || 'deepseek-v3.2'
        };

        this[__request_id] = 0;
    }

    /**
     * 发送聊天请求
     *
     * @param {string[]} messages - 消息列表
     * @param {Object} [options] - 选项
     * @return {Promise<string>} - 响应文本
     */
    async chat(messages, options = {}) {
        const requestId = ++this[__request_id];

        this.__notify('request', { requestId, messages });

        try {
            const response = await fetch(
                `${this[__llm_config].baseURL}/chat/completions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this[__llm_config].apiKey}`
                    },
                    body: JSON.stringify({
                        model: this[__llm_config].model,
                        messages: messages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        })),
                        temperature: options.temperature || 0.7,
                        max_tokens: options.maxTokens || 2048
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`LLM API Error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

            this.__notify('response', { requestId, content });

            return content;
        } catch (error) {
            this.__notify('error', { requestId, error });
            throw error;
        }
    }

    /**
     * 故事转代码提示词
     *
     * @param {string} storyText - 故事文本
     * @return {string[]} - 提示词消息
     */
    static storyToCodePrompt(storyText) {
        return [
            {
                role: 'system',
                content: `你是一个代码生成专家。请将用户提供的故事描述转换为可运行的 JavaScript/TypeScript 代码。

映射规则：
- 人物 → 类（class）
- 技能 → 方法（method）
- 场景 → 函数或模块
- 情节 → 执行流程

请生成简洁、符合 TechQuery 代码风格的代码。`
            },
            {
                role: 'user',
                content: `请将以下故事转换为代码：

${storyText}`
            }
        ];
    }

    /**
     * 代码转故事提示词
     *
     * @param {string} codeText - 代码文本
     * @return {string[]} - 提示词消息
     */
    static codeToStoryPrompt(codeText) {
        return [
            {
                role: 'system',
                content: `你是一个故事创作专家。请将用户提供的代码转换为一个生动的故事描述。

映射规则：
- 类 → 人物
- 方法 → 技能/行为
- 属性 → 特征
- 调用关系 → 人物互动

请用生动的语言描述代码的故事性。`
            },
            {
                role: 'user',
                content: `请将以下代码转换为故事：

\`\`\`javascript
${codeText}
\`\`\``
            }
        ];
    }

    /**
     * 观察变化
     *
     * @param {Object} keyHandler - 键值处理器
     */
    observe(keyHandler) {
        for (let key in keyHandler)
            this.on(key, keyHandler[key]);
    }

    __notify(event, data) {
        const handlers = this._events[event] || [];
        handlers.forEach(handler => handler(data));
    }

    on(event, handler) {
        (this._events[event] = this._events[event] || []).push(handler);
        return this;
    }

    off(event, handler) {
        const handlers = this._events[event] || [];
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
        return this;
    }
}

export { LLMClient };