/**
 * Plot Analyzer - 情节分析器
 *
 * @class
 */

class PlotAnalyzer {
    /**
     * 分析情节
     *
     * @param {Plot[]} plots - 情节列表
     * @return {Object} - 分析结果
     */
    analyze(plots) {
        return {
            sequence: this.__buildSequence(plots),
            flow: this.__analyzeFlow(plots),
            complexity: this.__calculateComplexity(plots)
        };
    }

    /**
     * 构建执行序列
     *
     * @private
     * @param {Plot[]} plots - 情节列表
     * @return {string[]}
     */
    __buildSequence(plots) {
        return plots.map(plot => plot.name);
    }

    /**
     * 分析流程类型
     *
     * @private
     * @param {Plot[]} plots - 情节列表
     * @return {string}
     */
    __analyzeFlow(plots) {
        const hasBranches = plots.some(
            plot => plot.description?.includes('如果') ||
                   plot.description?.includes('选择')
        );

        const hasLoops = plots.some(
            plot => plot.description?.includes('重复') ||
                   plot.description?.includes('循环')
        );

        if (hasLoops) return 'loop';
        if (hasBranches) return 'branch';
        return 'sequence';
    }

    /**
     * 计算复杂度
     *
     * @private
     * @param {Plot[]} plots - 情节列表
     * @return {number}
     */
    __calculateComplexity(plots) {
        let score = plots.length;

        plots.forEach(plot => {
            if (plot.characters?.length > 2) score += 1;
            if (plot.description?.length > 100) score += 1;
        });

        return Math.min(score, 10);
    }

    /**
     * 情节转代码结构
     *
     * @param {Plot} plot - 情节
     * @return {Object} - 代码结构
     */
    plotToCodeStructure(plot) {
        return {
            functionName: this.__toFunctionName(plot.name),
            parameters: plot.characters || [],
            body: plot.description,
            sequence: plot.sequence
        };
    }

    /**
     * 转换为函数名
     *
     * @private
     * @param {string} name - 名称
     * @return {string}
     */
    __toFunctionName(name) {
        return name.split(/[\s-_]+/)
            .map(word => word.charAt(0).toLowerCase() + word.slice(1))
            .join('');
    }
}

export { PlotAnalyzer };