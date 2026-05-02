/**
 * Story Code Bridge - 故事与代码的桥接器
 *
 * @class
 * @extends EventEmitter
 */

const __story_parser = Symbol('Story parser');
const __code_generator = Symbol('Code generator');
const __model_observer = Symbol('Bridge observer');

class StoryCodeBridge extends EventEmitter {
    /**
     * @param {StoryParser} storyParser - 故事解析器
     * @param {CodeGenerator} codeGenerator - 代码生成器
     */
    constructor(storyParser, codeGenerator) {
        super();

        this[__story_parser] = storyParser;
        this[__code_generator] = codeGenerator;
        this[this.__model_observer] = {};
    }

    /**
     * 故事转代码
     *
     * @param {string} storyText - 故事文本
     * @return {Promise<string>} - 生成的代码
     */
    async storyToCode(storyText) {
        this.__notify('start', { type: 'storyToCode', input: storyText });

        try {
            // 解析故事
            const story = await this[__story_parser].parse(storyText);

            this.__notify('parsed', { story });

            // 生成代码
            const code = await this[__code_generator].generate(story);

            this.__notify('generated', { code });

            return code;
        } catch (error) {
            this.__notify('error', { error: error.message });
            throw error;
        }
    }

    /**
     * 代码转故事
     *
     * @param {string} codeText - 代码文本
     * @return {Promise<string>} - 生成的故事
     */
    async codeToStory(codeText) {
        this.__notify('start', { type: 'codeToStory', input: codeText });

        try {
            // 使用 LLM 直接转换
            const prompt = LLMClient.codeToStoryPrompt(codeText);
            const llmClient = this[__code_generator][Symbol('llm')];
            const story = await llmClient.chat(prompt);

            this.__notify('story', { story });

            return story;
        } catch (error) {
            this.__notify('error', { error: error.message });
            throw error;
        }
    }

    /**
     * 观察变化
     *
     * @param {Object} keyHandler - 键值处理器
     */
    observe(keyHandler) {
        const map = this[this.__model_observer];
        for (let key in keyHandler)
            (map[key] = map[key] || []).push(keyHandler[key]);
    }

    /**
     * 取消观察
     *
     * @param {Object} keyHandler - 键值处理器
     */
    unobserve(keyHandler) {
        const map = this[this.__model_observer];
        for (let key in keyHandler)
            if (map[key]) {
                const index = map[key].indexOf(keyHandler[key]);
                if (index > -1) map[key].splice(index, 1);
            }
    }

    /**
     * 通知观察者
     *
     * @private
     * @param {string} event - 事件名
     * @param {Object} data - 数据
     */
    __notify(event, data) {
        const handlers = this[this.__model_observer][event] || [];
        handlers.forEach(handler => handler(data));
        this.emit(event, data);
    }

    get __model_observer() {
        return __model_observer;
    }
}

export { StoryCodeBridge };