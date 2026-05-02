/**
 * Code Novel App - 主应用
 *
 * @module ui/app
 */

import Editor from '@monaco-editor/react';
import { LLMClient } from '../engine/llm-client.js';
import { StoryParser } from '../story/parser/story-parser.js';
import { CharacterMapper } from '../story/character/character-mapper.js';
import { PlotAnalyzer } from '../story/plot/plot-analyzer.js';
import { CodeGenerator } from '../code/generator/code-generator.js';
import { StoryCodeBridge } from '../engine/bridge/story-code-bridge.js';

/**
 * @typedef {Object} AppConfig
 * @property {string} apiKey - API 密钥
 * @property {string} baseURL - API 地址
 * @property {string} model - 模型名称
 */

class CodeNovelApp {
    /**
     * @param {AppConfig} config - 配置
     */
    constructor(config) {
        this.__mode = 'storyToCode';
        this.__inputValue = '';
        this.__outputValue = '';

        this.__initClient(config);
        this.__initBridge();
        this.__render();
        this.__bindEvents();
    }

    /**
     * 初始化客户端
     *
     * @private
     * @param {AppConfig} config - 配置
     */
    __initClient(config) {
        this.__llmClient = new LLMClient({
            apiKey: config.apiKey,
            baseURL: config.baseURL,
            model: config.model
        });

        this.__storyParser = new StoryParser(this.__llmClient)
            .setCharacterMapper(new CharacterMapper())
            .setPlotAnalyzer(new PlotAnalyzer());

        this.__codeGenerator = new CodeGenerator(this.__llmClient);
    }

    /**
     * 初始化桥接器
     *
     * @private
     */
    __initBridge() {
        this.__bridge = new StoryCodeBridge(
            this.__storyParser,
            this.__codeGenerator
        );

        // 观察转换过程
        this.__bridge.observe({
            start: (data) => this.__showStatus('开始转换...'),
            parsed: (data) => this.__showStatus('故事解析完成'),
            generated: (data) => this.__showStatus('代码生成完成'),
            error: (data) => this.__showStatus(`错误: ${data.error}`, 'error')
        });
    }

    /**
     * 渲染界面
     *
     * @private
     */
    __render() {
        const app = document.getElementById('app');

        app.innerHTML = `
            <div class="container mx-auto px-4 py-8 max-w-7xl">
                <!-- Header -->
                <header class="text-center mb-8">
                    <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Code Novel
                    </h1>
                    <p class="text-gray-400 mt-2">代码即小说 · 故事即代码</p>
                </header>

                <!-- Mode Selector -->
                <div class="flex justify-center gap-4 mb-8">
                    <button id="btn-story-to-code"
                            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                        📖 故事 → 代码
                    </button>
                    <button id="btn-code-to-story"
                            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                        💻 代码 → 故事
                    </button>
                </div>

                <!-- Main Content -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Input Panel -->
                    <div class="bg-gray-800 rounded-xl p-4">
                        <h2 class="text-lg font-semibold mb-4" id="input-title">📖 输入故事</h2>
                        <div id="input-editor" class="h-96 rounded-lg overflow-hidden"></div>
                    </div>

                    <!-- Output Panel -->
                    <div class="bg-gray-800 rounded-xl p-4">
                        <h2 class="text-lg font-semibold mb-4">💻 生成的代码</h2>
                        <div id="output-editor" class="h-96 rounded-lg overflow-hidden"></div>
                    </div>
                </div>

                <!-- Status -->
                <div id="status" class="text-center mt-6 text-gray-400">
                    就绪
                </div>

                <!-- Generate Button -->
                <div class="flex justify-center mt-6 gap-4">
                    <button id="btn-generate"
                            class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition transform hover:scale-105">
                        🚀 生成
                    </button>
                    <button id="btn-copy"
                            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition">
                        📋 复制
                    </button>
                </div>
            </div>
        `;

        this.__initEditors();
    }

    /**
     * 初始化编辑器
     *
     * @private
     */
    __initEditors() {
        // Input Editor
        this.__inputEditor = Editor.create({
            value: this.__getInputPlaceholder(),
            language: 'markdown',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'off',
            wordWrap: 'on',
            scrollBeyondLastLine: false
        });

        this.__inputEditor.onDidChangeModelContent(() => {
            this.__inputValue = this.__inputEditor.getValue();
        });

        document.getElementById('input-editor').appendChild(
            this.__inputEditor.getDomNode()
        );

        // Output Editor
        this.__outputEditor = Editor.create({
            value: '// 生成的代码将显示在这里',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            readOnly: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false
        });

        document.getElementById('output-editor').appendChild(
            this.__outputEditor.getDomNode()
        );
    }

    /**
     * 获取输入占位符
     *
     * @private
     * @return {string}
     */
    __getInputPlaceholder() {
        if (this.__mode === 'storyToCode') {
            return `输入你的故事...

例如：
从前有一个勇敢的骑士，他名叫亚瑟。亚瑟有一把神奇的宝剑，可以斩断一切邪恶。他有一个忠实的助手，一只聪明的猫叫米奥。亚瑟的使命是保护王国的和平。`;
        } else {
            return `输入你的代码...

例如：
class Knight {
    constructor(name) {
        this.name = name;
        this.sword = new Sword();
    }

    attack() {
        return this.sword.swing();
    }
}`;
        }
    }

    /**
     * 绑定事件
     *
     * @private
     */
    __bindEvents() {
        const btnStoryToCode = document.getElementById('btn-story-to-code');
        const btnCodeToStory = document.getElementById('btn-code-to-story');
        const btnGenerate = document.getElementById('btn-generate');
        const btnCopy = document.getElementById('btn-copy');
        const inputTitle = document.getElementById('input-title');

        btnStoryToCode.addEventListener('click', () => {
            this.__mode = 'storyToCode';
            btnStoryToCode.className = 'px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition';
            btnCodeToStory.className = 'px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition';
            inputTitle.textContent = '📖 输入故事';
            this.__inputEditor.updateOptions({ language: 'markdown' });
            this.__inputEditor.setValue(this.__getInputPlaceholder());
        });

        btnCodeToStory.addEventListener('click', () => {
            this.__mode = 'codeToStory';
            btnCodeToStory.className = 'px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition';
            btnStoryToCode.className = 'px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition';
            inputTitle.textContent = '💻 输入代码';
            this.__inputEditor.updateOptions({ language: 'javascript' });
            this.__inputEditor.setValue(this.__getInputPlaceholder());
        });

        btnGenerate.addEventListener('click', () => this.__handleGenerate());
        btnCopy.addEventListener('click', () => this.__handleCopy());
    }

    /**
     * 处理生成
     *
     * @private
     */
    async __handleGenerate() {
        const inputValue = this.__inputEditor.getValue().trim();

        if (!inputValue) {
            this.__showStatus('请输入内容', 'error');
            return;
        }

        try {
            let result;

            if (this.__mode === 'storyToCode') {
                result = await this.__bridge.storyToCode(inputValue);
                this.__outputEditor.updateOptions({ language: 'javascript' });
            } else {
                result = await this.__bridge.codeToStory(inputValue);
                this.__outputEditor.updateOptions({ language: 'markdown' });
            }

            this.__outputEditor.setValue(result);
            this.__showStatus('生成完成！', 'success');
        } catch (error) {
            this.__outputEditor.setValue(`// 错误: ${error.message}`);
            this.__showStatus(`生成失败: ${error.message}`, 'error');
        }
    }

    /**
     * 处理复制
     *
     * @private
     */
    async __handleCopy() {
        const outputValue = this.__outputEditor.getValue();

        try {
            await navigator.clipboard.writeText(outputValue);
            this.__showStatus('已复制到剪贴板！', 'success');
        } catch (error) {
            this.__showStatus('复制失败', 'error');
        }
    }

    /**
     * 显示状态
     *
     * @private
     * @param {string} message - 消息
     * @param {string} [type='info'] - 类型
     */
    __showStatus(message, type = 'info') {
        const status = document.getElementById('status');
        const colors = {
            info: 'text-gray-400',
            error: 'text-red-400',
            success: 'text-green-400'
        };
        status.className = `${colors[type] || colors.info} text-center mt-6`;
        status.textContent = message;
    }
}

// 启动应用
const config = {
    apiKey: 'sk-HrMQ3DhFceIdRrQakdXKjFyxF5Fow1QInXRKgRgaHDUaMzIK',
    baseURL: 'https://api.huqi.host/v1',
    model: 'deepseek-v3.2'
};

new CodeNovelApp(config);