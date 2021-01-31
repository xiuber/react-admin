import React, {useEffect, useRef} from 'react';
import {Input, Select} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import {getComponents, getStores} from './dataSource';
import DraggableComponent from './DraggableComponent';
import {scrollElement, usePrevious} from '../util';
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

    const categoryRef = useRef(null);
    const componentRef = useRef(null);

    useEffect(() => {
        (async () => {
            const stores = await getStores();
            storeAction.setStores(stores);

            if (stores?.length) {
                await handleStoreChange(stores[0].value);
            }
        })();
    }, []);

    async function fetchComponents(category) {
        const components = await getComponents(category);
        storeAction.setComponents(components);
    }

    async function handleStoreChange(value) {
        storeAction.setStore(value);
        await fetchComponents(value);
    }

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
                        placeholder="请输入关键词搜索组件"
                    />
                </header>
                <main>
                    <div styleName="category" ref={categoryRef}>
                        {components.map(baseCategory => {
                            const {id: baseCategoryId, title, components = []} = baseCategory;

                            return (
                                <div key={baseCategoryId} id={`baseCategory_${baseCategoryId}`}>
                                    <div styleName='baseCategory'>{title}</div>
                                    {components.map(item => {
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
                                                    storeAction.setCategory(subCategoryId);
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
                    <div styleName="components" ref={componentRef}>
                        {components.map(baseCategory => {
                            const {id: baseCategoryId, components = []} = baseCategory;
                            return components.map(category => {
                                const {id: subCategoryId, subTitle, components = []} = category;
                                return (
                                    <div key={`${baseCategoryId}_${subCategoryId}`}>
                                        <div
                                            id={`componentCategory_${subCategoryId}`}
                                            styleName="componentCategory"
                                        >
                                            {subTitle}
                                        </div>
                                        {components.map(item => {
                                            return (
                                                <div
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
                    </div>
                </main>
            </div>
        </Pane>
    );
});
