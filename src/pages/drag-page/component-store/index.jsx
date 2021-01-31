import React, {useState, useEffect, useRef} from 'react';
import {Input, Select, Empty} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import {getComponents, getStores} from './dataSource';
import DraggableComponent from './DraggableComponent';
import {scrollElement, elementIsVisible, filterTree} from '../util';
import {debounce} from 'lodash';
import './style.less';

export default config({
    connect: state => {
        return {
            stores: state.componentStore.stores,
            store: state.componentStore.store,
            categories: state.componentStore.categories,
            category: state.componentStore.category,
            components: state.componentStore.components,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function ComponentStore(props) {
    const {
        stores,
        store,
        categories,
        category,
        components,
        activeSideKey,
        action: {
            dragPage: dragPageAction,
            componentStore: storeAction,
        },
    } = props;

    const [allComponents, setAllComponents] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const categoryRef = useRef(null);
    const componentRef = useRef(null);
    const componentSpaceRef = useRef(null);

    useEffect(() => {
        (async () => {
            const stores = await getStores();
            storeAction.setStores(stores);

            if (stores?.length) {
                await handleStoreChange(stores[0].value);
            }
        })();
    }, []);

    // 设置组件列表底部站位高度
    useEffect(() => {
        if (!components?.length || !componentSpaceRef.current) return;

        const elements = Array.from(document.querySelectorAll('.componentCategory'));

        if (!elements?.length) return;

        const element = elements[elements.length - 1];
        const elementRect = element.getBoundingClientRect();
        const {height} = elementRect;

        componentSpaceRef.current.style.height = `calc(100% - ${height}px)`;

    }, [components, componentSpaceRef.current]);


    const handleComponentScroll = debounce(() => {
        const all = document.querySelectorAll('.componentCategory');
        for (const ele of Array.from(all)) {
            const {visible} = elementIsVisible(componentRef.current, ele);
            if (visible) {
                const subCategoryId = ele.getAttribute('data-subCategoryId');

                const element = document.getElementById(`subCategory_${subCategoryId}`);
                scrollElement(categoryRef.current, element);

                storeAction.setCategory(subCategoryId);
                return;
            }
        }
    }, 100);

    async function fetchComponents(category) {
        const components = await getComponents(category);
        storeAction.setComponents(components);
        setAllComponents(components);
    }

    async function handleStoreChange(value) {
        storeAction.setStore(value);
        setSearchValue('');
        if (categoryRef.current) categoryRef.current.scrollTop = 0;
        if (componentRef.current) componentRef.current.scrollTop = 0;
        handleComponentScroll();
        await fetchComponents(value);
    }

    const handleSearch = debounce((value) => {
        const result = filterTree(
            allComponents,
            node => {
                let {title = '', subTitle = ''} = node;

                title = title.toLowerCase();
                subTitle = subTitle.toLowerCase();
                const val = value ? value.toLowerCase() : '';

                return title.includes(val)
                    || subTitle.includes(val);
            },
        );

        storeAction.setComponents(result);
    }, 300);

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件
                </div>
            }
        >
            <div styleName="root">
                <header>
                    <Select
                        style={{width: '100%', marginBottom: 4}}
                        placeholder="选择组件分类"
                        value={store}
                        onChange={handleStoreChange}
                        options={stores}
                    />
                    <Input
                        allowClear
                        placeholder="请输入关键词搜索组件"
                        value={searchValue}
                        onChange={e => {
                            const {value} = e.target;

                            setSearchValue(value);
                            handleSearch(value);
                        }}
                    />
                </header>
                {!components?.length ? (
                    <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Empty description="暂无组件"/>
                    </main>
                ) : (
                    <main>
                        <div styleName="category" ref={categoryRef}>
                            {components.map(baseCategory => {
                                const {id: baseCategoryId, title, children = []} = baseCategory;

                                return (
                                    <div key={baseCategoryId} id={`baseCategory_${baseCategoryId}`}>
                                        <div styleName='baseCategory'>{title}</div>
                                        {children.map(item => {
                                            const {id: subCategoryId} = item;
                                            const isActive = subCategoryId === category;

                                            return (
                                                <div
                                                    key={subCategoryId}
                                                    id={`subCategory_${subCategoryId}`}
                                                    styleName={`subCategory ${isActive ? 'active' : ''}`}
                                                    onClick={() => {
                                                        const element = document.getElementById(`componentCategory_${subCategoryId}`);
                                                        scrollElement(componentRef.current, element, true);

                                                        // 等待组件滚动完，否则 三角标志会跳动
                                                        setTimeout(() => {
                                                            storeAction.setCategory(subCategoryId);
                                                        }, 300);
                                                    }}
                                                >
                                                    {item.title}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <div styleName="components" ref={componentRef} onScroll={handleComponentScroll}>
                            {components.map(baseCategory => {
                                const {id: baseCategoryId, children = []} = baseCategory;
                                return children.map(category => {
                                    const {id: subCategoryId, subTitle, children = []} = category;
                                    return (
                                        <div
                                            className="componentCategory"
                                            key={`${baseCategoryId}_${subCategoryId}`}
                                            data-subCategoryId={subCategoryId}
                                        >
                                            <div
                                                id={`componentCategory_${subCategoryId}`}
                                                styleName="componentCategory"
                                            >
                                                {subTitle}
                                            </div>
                                            {children.map(item => {
                                                return (
                                                    <div
                                                        id={`component_${item.id}`}
                                                        onClick={() => {
                                                            const element = document.getElementById(`subCategory_${subCategoryId}`);
                                                            scrollElement(categoryRef.current, element);
                                                            storeAction.setCategory(subCategoryId);
                                                        }}
                                                    >
                                                        <DraggableComponent key={item.id} data={item}/>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                });
                            })}
                            <div ref={componentSpaceRef}/>
                        </div>
                    </main>
                )}
            </div>
        </Pane>
    );
});
