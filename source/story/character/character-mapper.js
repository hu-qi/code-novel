/**
 * Character Mapper - 人物到代码的映射
 *
 * @class
 */

class CharacterMapper {
    /**
     * 映射规则
     *
     * @static
     * @return {Object}
     */
    static get mapping() {
        return {
            name: 'className',
            description: 'docComment',
            skills: 'methods',
            friends: 'dependencies'
        };
    }

    /**
     * 人物转类
     *
     * @param {Object} character - 人物对象
     * @return {Object} - 类定义
     */
    map(character) {
        return {
            className: this.__toPascalCase(character.name),
            docComment: this.__generateDocComment(character),
            properties: this.__extractProperties(character),
            methods: this.__extractMethods(character),
            dependencies: this.__findDependencies(character)
        };
    }

    /**
     * 转换为 PascalCase
     *
     * @private
     * @param {string} name - 名称
     * @return {string}
     */
    __toPascalCase(name) {
        return name.split(/[\s-_]+/).map(
            word => word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
    }

    /**
     * 生成文档注释
     *
     * @private
     * @param {Object} character - 人物
     * @return {string}
     */
    __generateDocComment(character) {
        return `/**
 * ${character.name}
 *
 * ${character.description || 'A character in the story'}
 */`;
    }

    /**
     * 提取属性
     *
     * @private
     * @param {Object} character - 人物
     * @return {Object[]}
     */
    __extractProperties(character) {
        const properties = [];

        if (character.description) {
            properties.push({
                name: 'description',
                type: 'string',
                value: `"${character.description}"`
            });
        }

        return properties;
    }

    /**
     * 提取方法
     *
     * @private
     * @param {Object} character - 人物
     * @return {Object[]}
     */
    __extractMethods(character) {
        if (!character.skills) return [];

        return character.skills.map(skill => ({
            name: this.__toCamelCase(skill),
            description: skill,
            parameters: [],
            returnType: 'void'
        }));
    }

    /**
     * 转换为 camelCase
     *
     * @private
     * @param {string} name - 名称
     * @return {string}
     */
    __toCamelCase(name) {
        const pascal = this.__toPascalCase(name);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }

    /**
     * 查找依赖
     *
     * @private
     * @param {Object} character - 人物
     * @return {string[]}
     */
    __findDependencies(character) {
        return character.friends || [];
    }
}

export { CharacterMapper };