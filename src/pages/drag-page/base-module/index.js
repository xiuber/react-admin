import {v4 as uuid} from 'uuid';
import common from './common';
import {setDefaultOptions} from '../base-components';

export default [
    {title: '通用', children: common},
].map(item => {
    item.id = uuid();
    item.children = setDefaultOptions(item.children);
    return item;
});
