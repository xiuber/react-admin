import React, {useEffect} from 'react';
import {Input, Select} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import {getComponents, getStores} from './dataSource';
import DraggableComponent from './DraggableComponent';
import './style.less';

export default config({
    connect: state => {
        return {
            stores: state.componentStore.stores,
            store: state.componentStore.store,
            categories: state.componentStore.categories,
            category: state.componentStore.category,
            components: state.componentStore.components,
        };
    },
})(function ComponentStore(props) {
    const {
        stores,
        store,
        categories,
        category,
        components,
        action: {
            dragPage: dragPageAction,
            componentStore: storeAction,
        },
    } = props;

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
                    <div styleName="category">
                        {components.map(baseCategory => {
                            const {id, title, components = []} = baseCategory;

                            return (
                                <div key={id} id={`baseCategory_${id}`}>
                                    <div styleName='baseCategory'>{title}</div>
                                    {components.map(category => {
                                        return (
                                            <div
                                                key={category.id}
                                                id={`componentCategory_${id}`}
                                                styleName="subCategory"
                                            >
                                                {category.title}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        <div style={{height: 1000, background: 'red'}}></div>
                    </div>
                    <div styleName="components">
                        {components.map(baseCategory => {
                            const {id: bId, components = []} = baseCategory;
                            return components.map(category => {
                                const {id, subTitle, components = []} = category;
                                return (
                                    <div key={`${bId}_${id}`}>
                                        <div styleName="componentCategory">{subTitle}</div>
                                        {components.map(item => <DraggableComponent key={item.id} data={item}/>)}
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
