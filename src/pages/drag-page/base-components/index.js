import {v4 as uuid} from 'uuid';
import base from './base';

export default [
    {title: '默认', children: base},
].map(item => ({...item, id: uuid()}));
