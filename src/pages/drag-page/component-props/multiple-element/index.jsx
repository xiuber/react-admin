import React, {useMemo} from 'react';
import {isComponentConfig} from 'src/pages/drag-page/util';
import {getElement} from 'src/pages/drag-page/component-props/form-element';
import {Select} from 'antd';
import {v4 as uuid} from 'uuid';

const MultipleElement = props => {
    const {
        fieldOption,
        node,
        value,
        onChange,
        ...others
    } = props;
    const {type} = fieldOption;

    const valueType = typeof value;
    const typeOption = type.find(item => item.value === valueType);

    let currentType = type[0].value;

    if (typeOption) {
        currentType = typeOption.value;
    }

    if (isComponentConfig(value)) {
        currentType = 'ReactNode';
    }

    const Ele = useMemo(() => {
        let type = currentType;

        if (currentType === 'object') {
            type = typeOption;
        }
        return getElement({...fieldOption, type, node});
    }, [currentType]);

    return (
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
            <Select
                style={{flex: '0 0 80px', marginRight: 4}}
                value={currentType}
                onChange={val => {
                    let nextValue = undefined;

                    // 当前切换成 组件节点
                    if (val === 'ReactNode') {
                        const children = value ? [{id: uuid(), componentName: 'Text', props: {text: value}}]
                            : [{id: uuid(), componentName: 'DragHolder'}];

                        nextValue = {
                            id: uuid(),
                            componentName: 'div',
                            children,
                        };
                        return onChange(nextValue);
                    }

                    // 切换成 对象
                    if (val === 'object') {
                        return onChange({});
                    }

                    // 以前是组件节点，现在切换成其他
                    if (isComponentConfig(value)) {
                        const iframeDocument = document.getElementById('dnd-iframe').contentDocument;
                        if (!iframeDocument) return onChange(nextValue);

                        const ele = iframeDocument.querySelector(`[data-component-id="${value.id}"]`);
                        if (!ele || (
                            ele.childNodes?.length === 1
                            && Array.from(ele.childNodes[0].classList).includes('DragHolder')
                        )) return onChange(nextValue);

                        nextValue = ele.innerText;
                        return onChange(nextValue);
                    }

                    return onChange(nextValue);
                }}
                options={type}
            />
            <div style={{flex: 1}}>
                <Ele value={value} onChange={onChange}  {...others}/>
            </div>
        </div>
    );
};

MultipleElement.propTypes = {};

export default MultipleElement;
