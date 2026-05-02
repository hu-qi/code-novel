#!/usr/bin/env node

/**
 * Code Novel CLI - 命令行工具
 *
 * @module bin/cli
 * @author TechQuery
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LLMClient } from '../source/engine/llm-client.js';
import { StoryParser } from '../source/story/parser/story-parser.js';
import { CharacterMapper } from '../source/story/character/character-mapper.js';
import { PlotAnalyzer } from '../source/story/plot/plot-analyzer.js';
import { CodeGenerator } from '../source/code/generator/code-generator.js';
import { StoryCodeBridge } from '../source/engine/bridge/story-code-bridge.js';

/**
 * @typedef {Object} CLIConfig
 * @property {string} apiKey - API 密钥
 * @property {string} baseURL - API 地址
 * @property {string} model - 模型名称
 * @property {string} mode - 模式：story-to-code | code-to-story
 * @property {string} input - 输入文件
 * @property {string} output - 输出文件
 */

const __program_name = 'code-novel';
const __version = '0.0.1';

/**
 * 打印帮助信息
 */
function printHelp() {
    console.log(`
${__program_name} v${__version} - 代码即小说

用法:
  code-novel [选项]

选项:
  --api-key <key>       API 密钥 (或设置环境变量 CODE_NOVEL_API_KEY)
  --base-url <url>      API 地址 (默认: https://api.huqi.host/v1)
  --model <name>        模型名称 (默认: deepseek-v3.2)
  --mode <mode>         模式: story-to-code | code-to-story
  --input, -i <file>    输入文件 (默认: 从 stdin 读取)
  --output, -o <file>   输出文件 (默认: 输出到 stdout)
  --help, -h            显示帮助
  --version, -v         显示版本

示例:
  # 故事转代码
  echo "从前有一个骑士..." | code-novel --mode story-to-code

  # 代码转故事
  code-novel --mode code-to-story -i input.js -o story.md

  # 使用环境变量
  export CODE_NOVEL_API_KEY=your-key
  echo "故事内容" | code-novel
`);
}

/**
 * 解析命令行参数
 *
 * @return {CLIConfig}
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        apiKey: process.env.CODE_NOVEL_API_KEY || '',
        baseURL: 'https://api.huqi.host/v1',
        model: 'deepseek-v3.2',
        mode: 'story-to-code',
        input: null,
        output: null
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--help':
            case '-h':
                printHelp();
                process.exit(0);
                break;

            case '--version':
            case '-v':
                console.log(`${__program_name} v${__version}`);
                process.exit(0);
                break;

            case '--api-key':
                config.apiKey = args[++i];
                break;

            case '--base-url':
                config.baseURL = args[++i];
                break;

            case '--model':
                config.model = args[++i];
                break;

            case '--mode':
                config.mode = args[++i];
                break;

            case '--input':
            case '-i':
                config.input = args[++i];
                break;

            case '--output':
            case '-o':
                config.output = args[++i];
                break;
        }
    }

    return config;
}

/**
 * 读取输入
 *
 * @param {string|null} inputFile - 输入文件
 * @return {Promise<string>}
 */
async function readInput(inputFile) {
    if (inputFile) {
        return readFileSync(inputFile, 'utf-8');
    }

    // 从 stdin 读取
    return new Promise((resolve, reject) => {
        let data = '';

        process.stdin.setEncoding('utf-8');

        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                data += chunk;
            }
        });

        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', reject);
    });
}

/**
 * 写入输出
 *
 * @param {string} output - 输出内容
 * @param {string|null} outputFile - 输出文件
 */
function writeOutput(output, outputFile) {
    if (outputFile) {
        writeFileSync(outputFile, output, 'utf-8');
        console.error(`输出已写入: ${outputFile}`);
    } else {
        console.log(output);
    }
}

/**
 * 主函数
 */
async function main() {
    const config = parseArgs();

    // 验证 API 密钥
    if (!config.apiKey) {
        console.error('错误: 请提供 API 密钥 (--api-key 或 CODE_NOVEL_API_KEY)');
        process.exit(1);
    }

    // 验证模式
    if (!['story-to-code', 'code-to-story'].includes(config.mode)) {
        console.error('错误: 模式必须是 story-to-code 或 code-to-story');
        process.exit(1);
    }

    try {
        // 初始化客户端
        const llmClient = new LLMClient({
            apiKey: config.apiKey,
            baseURL: config.baseURL,
            model: config.model
        });

        const storyParser = new StoryParser(llmClient)
            .setCharacterMapper(new CharacterMapper())
            .setPlotAnalyzer(new PlotAnalyzer());

        const codeGenerator = new CodeGenerator(llmClient);

        const bridge = new StoryCodeBridge(storyParser, codeGenerator);

        // 读取输入
        const input = await readInput(config.input);

        if (!input.trim()) {
            console.error('错误: 输入为空');
            process.exit(1);
        }

        // 执行转换
        let result;

        if (config.mode === 'story-to-code') {
            console.error('正在将故事转换为代码...');
            result = await bridge.storyToCode(input);
        } else {
            console.error('正在将代码转换为故事...');
            result = await bridge.codeToStory(input);
        }

        // 写入输出
        writeOutput(result, config.output);

    } catch (error) {
        console.error(`错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行
main();