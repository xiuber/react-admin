import JSON5 from 'json5';
import {cloneDeep} from 'lodash';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import {isNode, loopNode} from '../node-util';
import {getComponent, isFunctionString, getFieldOption} from '../util';
import inflection from 'inflection';
import {getComponentConfig} from 'src/pages/drag-page/component-config';

export default function schemaToCode(schema) {
    schema = cloneDeep(schema);

    // 导入
    const imports = new Map();
    const states = [];

    loopNode(schema, node => {
        generateImport(node?.componentName);
    });

    function generateJsx() {
        const loop = node => {
            let {componentName, props, wrapper, children} = node;

            if (componentName === 'DragHolder') return '';

            // 处理当前节点上的包装节点
            if (wrapper?.length) {
                wrapper = cloneDeep(wrapper);
                parseWrapper(wrapper, node, loop);
                if (wrapper?.length) {
                    wrapper[0].children = [{...node, wrapper: null}];

                    const nextNode = wrapper.reduce((prev, wrapperNode) => {
                        wrapperNode.children = [prev];

                        return wrapperNode;
                    });

                    return loop(nextNode);
                }
            }

            if (componentName === 'Table.Column') return '';

            if (componentName === 'Text') {
                const {text, isDraggable, ...others} = props;

                if (!Object.keys(others).length) return text;

                componentName = 'span';
                props = others;
            }

            const names = componentName.split('.');

            let name = names.length === 1 ? names[0] : names[1];

            // 子节点
            let childrenJsx = children?.length ? children.map(item => {
                return loop(item);
            }).filter(item => !!item).join('\n') : undefined;

            const propsStr = parseProps(props, node, loop).join(' ');

            if (childrenJsx) return `<${name} ${propsStr}>${childrenJsx}</${name}>`;

            return `<${name} ${propsStr}/>`;
        };

        return loop(schema);
    }

    function parseWrapper(wrapper, node, loop) {
        // TODO Message Notification Modal 等处理，content 有肯能是组件
        const messageIndex = wrapper.findIndex(item => item.componentName === 'Message');
        if (messageIndex !== -1) {
            const [messageNode] = wrapper.splice(messageIndex, 1);
            const messageProps = messageNode.props;
            const {type = 'success', ...others} = messageProps;
            const propsArr = parseProps(others, messageNode, loop);

            const propsStr = propsArr.map(item => {
                const index = item.indexOf('=');
                const key = item.substring(0, index);
                let value = item.substring(index + 1);
                if (value.startsWith('{')) value = value.slice(1, -1);

                return `${key}: ${value}`;
            }).join(',');

            if (!node.props) node.props = {};
            node.props.onClick = `() => message.${type}({${propsStr}})`;
            const options = {name: 'message'};
            const objSets = imports.get('antd');
            if (!objSets) {
                const set = new Set();
                set.add(options);
                imports.set('antd', set);
            } else {
                objSets.add(options);
            }
        }
    }

    function parseProps(props, node, loopNode) {
        if (!props) return [];

        const nodeConfig = getComponentConfig(node?.componentName);
        const beforeToCode = nodeConfig?.hooks?.beforeToCode;
        beforeToCode && beforeToCode(node);

        const componentProps = cloneDeep(props);
        const loop = (obj, cb) => {
            if (typeof obj !== 'object' || obj === null) return;

            if (Array.isArray(obj)) {
                obj.forEach(item => loop(item, cb));
            } else {
                Object.entries(obj)
                    .forEach(([key, value]) => {
                        if (typeof value === 'object' && !isNode(value)) {
                            loop(value, cb);
                        } else {
                            cb(obj, key, value);
                        }
                    });
            }
        };

        loop(componentProps, (obj, key, value) => {
            const fieldOption = getFieldOption(node, key) || {};
            const {functionType, defaultValue} = fieldOption;

            // 删除默认值
            if (JSON.stringify(defaultValue) === JSON.stringify(value)) {
                Reflect.deleteProperty(obj, key);
                return;
            }

            const val = parsePropsValue(value, loopNode);

            if (functionType) {
                obj[key] = `{() => ${val.slice(1, -1)}}`;
            } else {
                obj[key] = val;
            }
        });

        return Object.entries(componentProps)
            .map(([key, value]) => {
                if (value === undefined) return '';

                if (typeof value === 'object') {
                    let val = `${key}={${JSON5.stringify(value)}}`;
                    val = val.replace(/'{/g, '');
                    val = val.replace(/}'/g, '');
                    val = val.replace(/"{/g, '');
                    val = val.replace(/}"/g, '');
                    return val;
                }
                if (typeof value === 'string' && !value.startsWith('{')) return `${key}="${value}"`;
                if (typeof value === 'string' && value.startsWith('{')) return `${key}=${value}`;
                return `${key}={${value}}`;
            });
    }

    function parsePropsValue(value, loop) {
        // state 数据
        if (typeof value === 'string' && value.startsWith('state.')) {
            const stateVar = value.replace('state.', '');
            states.push(stateVar);
            return `{${stateVar}}`;
        }

        // 节点
        if (isNode(value) || (Array.isArray(value) && value.every(item => isNode(item)))) {
            if (Array.isArray(value)) {
                return `{[
                ${value.map(item => {
                    return loop(item);
                }).join(',')}
                ]}`;
            } else {
                return `{${loop(value)}}`;
            }
        }

        if (isFunctionString(value)) {
            return `{${value.replace('state.', '')}}`;
        }

        if (typeof value === 'string') return value;

        return value;
    }

    /**
     * store the components to the 'imports' map which was used
     *
     * @param {*} componentName component name like 'Button'
     */
    function generateImport(componentName) {
        // ignore the empty string
        if (!componentName) return;

        let options = getComponent({componentName});
        let {packageName} = options;

        if (packageName) {
            packageName = packageName.split('.')[0];
            const objSets = imports.get(packageName);

            if (!objSets) {
                const set = new Set();
                set.add(options);
                imports.set(packageName, set);
            } else {
                objSets.add(options);
            }
        }
    }

    /**
     * constrcut the import string
     */
    function importString() {
        const importStrings = [];
        const subImports = [];
        for (const [packageName, pkgSet] of imports) {
            const set1 = new Set();
            const set2 = new Set();

            for (const pkg of pkgSet) {
                // 导出名
                let exportName = pkg.exportName || pkg.name;

                // 子组件名
                let subName = pkg.subName;

                // 组件名
                let componentName = pkg.name;

                if (pkg.subName) {
                    subImports.push(`const ${componentName} = ${exportName}.${subName};`);
                }
                if (componentName !== exportName && !pkg.subName) {
                    exportName = `${exportName} as ${componentName}`;
                }

                // 非解构方式
                const destructuring = pkg?.dependence?.destructuring === undefined || pkg?.dependence?.destructuring;
                if (!destructuring) {
                    set1.add(exportName);
                } else {
                    // 解构方式
                    set2.add(exportName);
                }
            }
            const set1Str = [...set1].join(',');
            let set2Str = [...set2].join(',');
            const dot = set1Str && set2Str ? ',' : '';
            if (set2Str) {
                set2Str = `{${set2Str}}`;
            }
            importStrings.push(`import ${set1Str} ${dot} ${set2Str} from '${packageName}'`);
        }
        // 去重
        return Array.from(new Set(importStrings.concat('\n', subImports)));
    }

    const jsx = generateJsx();

    const code = `
        import React ${states.length ? ',{useState}' : ''} from 'react';
        ${importString().join('\n')}

        export default function Index(props) {
            ${states.map(key => `const [${key}, set${inflection.camelize(key)}] = useState()`).join('\n')}
            return (
            ${jsx}
            );
        }
    `;

    return prettier.format(code, {parser: 'babel', plugins: [parserBabel]});
}
