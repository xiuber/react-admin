import {store} from 'src/models';

export default {
    editableContents: [
        {
            selector: options => {
                const {node} = options;
                return `th.id_${node.id}`;
            },
            propsField: 'title',
            onClick: e => options => {
                console.log('onClick column');
                const {node, dragPageAction} = options;
                const {nodeSelectType} = store.getState().dragPage;
                if (nodeSelectType === 'meta') {
                    if ((e.metaKey || e.ctrlKey)) {
                        e.stopPropagation();
                        // 单纯选中节点，不进行其他操作
                        dragPageAction.setSelectedNodeId(node.id);
                    }
                }

                // 单击模式
                if (nodeSelectType === 'click') {
                    e.stopPropagation();
                    dragPageAction.setSelectedNodeId(node.id);
                }
            },
        },
    ],
    render: false,
    dropAccept: 'Column',
    dropInTo: ['Table', 'Column'],
    componentDisplayName: ({node}) => {
        const title = node.props?.title || '';

        return `Column ${title}`;
    },
    fields: [
        {label: '名称', field: 'title', type: 'string'},
        {label: '字段名', field: 'dataIndex', type: 'string'},
        {label: '宽度', field: 'width', type: 'unit'},
        {
            label: '列对齐方式', field: 'align', type: 'radio-group', defaultValue: 'left', version: '',
            options: [
                {value: 'left', label: '左对齐'},
                {value: 'right', label: '右对齐'},
                {value: 'center', label: '居中对齐'},
            ],
            desc: '设置列的对齐方式',
        },
        {
            label: '自动省略',
            category: '选项',
            categoryOrder: 4,
            field: 'ellipsis',
            type: 'boolean',
            defaultValue: false,
            version: 'showTitle: 4.3.0',
            desc: '超过宽度将自动省略，暂不支持和排序筛选一起使用。\\n设置为 true 或 { showTitle?: boolean } 时，表格布局将变成 tableLayout=\'fixed\'。',
        },
        {label: '排序', category: '选项', field: 'sorter', type: 'boolean', defaultValue: false},
        {
            label: '默认排序', appendField: 'sorter', field: 'defaultSortOrder', type: 'radio-group', version: '',
            options: [
                {value: 'ascend', label: '升序'},
                {value: 'descend', label: '降序'}],
            desc: '默认排序顺序',
        },

//         {label:'设置列的对齐方式',field:'align',type:'enum',defaultValue:'left',version:'',options:[{value:'left',label:'left'},{value:'right',label:'right'},{value:'center',label:'center'}],desc:'设置列的对齐方式'},
//         {label:'列样式类名',field:'className',type:'string',version:'',desc:'列样式类名'},
//         {label:'表头列合并,设置为 0 时，不渲染',field:'colSpan',type:'number',version:'',desc:'表头列合并,设置为 0 时，不渲染'},
//         {label:'列数据在数据项中对应的路径，支持通过数组查询嵌套路径',field:'dataIndex',type:'enum',version:'',options:[{value:'string',label:'string'},{value:'string[]',label:'string[]'}],desc:'列数据在数据项中对应的路径，支持通过数组查询嵌套路径'},
//         {label:'默认筛选值',field:'defaultFilteredValue',type:'string[]',version:'',desc:'默认筛选值'},
//         {label:'默认排序顺序',field:'defaultSortOrder',type:'enum',version:'',options:[{value:'ascend',label:'ascend'},{value:'descend',label:'descend'}],desc:'默认排序顺序'},
//         {label:'超过宽度将自动省略，暂不支持和排序筛选一起使用。\\n设置为 true 或 { showTitle?: boolean } 时，表格布局将变成 tableLayout=\\'fixed\\'。',field:'ellipsis',type:'enum',defaultValue:'false',version:'showTitle: 4.3.0',options:[{value:'boolean',label:'boolean'},{value:'{ showTitle?: boolean }',label:'{ showTitle?: boolean }'}],desc:'超过宽度将自动省略，暂不支持和排序筛选一起使用。\\n设置为 true 或 { showTitle?: boolean } 时，表格布局将变成 tableLayout=\\'fixed\\'。'},
// {label:'可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互',field:'filterDropdown',type:'enum',version:'',options:[{value:'ReactNode',label:'ReactNode'},{value:'(props: FilterDropdownProps) => ReactNode',label:'(props: FilterDropdownProps) => ReactNode'}],desc:'可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互'},
// {label:'用于控制自定义筛选菜单是否可见',field:'filterDropdownVisible',type:'boolean',version:'',desc:'用于控制自定义筛选菜单是否可见'},
// {label:'标识数据是否经过过滤，筛选图标会高亮',field:'filtered',type:'boolean',defaultValue:false,version:'',desc:'标识数据是否经过过滤，筛选图标会高亮'},
// {label:'筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组',field:'filteredValue',type:'string[]',version:'',desc:'筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组'},
// {label:'自定义 filter 图标。',field:'filterIcon',type:'enum',defaultValue:'false',version:'',options:[{value:'ReactNode',label:'ReactNode'},{value:'(filtered: boolean) => ReactNode',label:'(filtered: boolean) => ReactNode'}],desc:'自定义 filter 图标。'},
// {label:'是否多选',field:'filterMultiple',type:'boolean',defaultValue:true,version:'',desc:'是否多选'},
// {label:'表头的筛选菜单项',field:'filters',type:'object[]',version:'',desc:'表头的筛选菜单项'},
// {label:'（IE 下无效）列是否固定，可选 true (等效于 left) left right',field:'fixed',type:'enum',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'string',label:'string'}],desc:'（IE 下无效）列是否固定，可选 true (等效于 left) left right'},
// {label:'React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性',field:'key',type:'string',version:'',desc:'React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性'},
// {label:'生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并',field:'render',type:'function(text, record, index) {}',version:'',desc:'生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并'},
// {label:'响应式 breakpoint 配置列表。未设置则始终可见。',field:'responsive',type:'Breakpoint[]',version:'4.2.0',desc:'响应式 breakpoint 配置列表。未设置则始终可见。'},
// {label:'自定义单元格渲染时机',field:'shouldCellUpdate',type:'(record, prevRecord) => boolean',version:'4.3.0',desc:'自定义单元格渲染时机'},
// {label:'表头显示下一次排序的 tooltip 提示, 覆盖 table 中 showSorterTooltip',field:'showSorterTooltip',type:'enum',defaultValue:'true',version:'',options:[{value:'boolean',label:'boolean'},{value:'Tooltip props',label:'Tooltip props'}],desc:'表头显示下一次排序的 tooltip 提示, 覆盖 table 中 showSorterTooltip'},
// {label:'支持的排序方式，覆盖 Table 中 sortDirections， 取值为 ascend descend',field:'sortDirections',type:'Array',defaultValue:'[ascend, descend]',version:'',desc:'支持的排序方式，覆盖 Table 中 sortDirections， 取值为 ascend descend'},
// {label:'排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true',field:'sorter',type:'enum',version:'',options:[{value:'function',label:'function'},{value:'boolean',label:'boolean'}],desc:'排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true'},
// {label:'排序的受控属性，外界可用此控制列的排序，可设置为 ascend descend false',field:'sortOrder',type:'enum',version:'',options:[{value:'boolean',label:'boolean'},{value:'string',label:'string'}],desc:'排序的受控属性，外界可用此控制列的排序，可设置为 ascend descend false'},
// {label:'列头显示文字（函数用法 3.10.0 后支持）',field:'title',type:'enum',version:'',options:[{value:'ReactNode',label:'ReactNode'},{value:'({ sortOrder, sortColumn, filters }) => ReactNode',label:'({ sortOrder, sortColumn, filters }) => ReactNode'}],desc:'列头显示文字（函数用法 3.10.0 后支持）'},
// {label:'列宽度（指定了也不生效？）',field:'width',type:'enum',version:'',options:[{value:'string',label:'string'},{value:'number',label:'number'}],desc:'列宽度（指定了也不生效？）'},
// {label:'设置单元格属性',field:'onCell',type:'function(record, rowIndex)',version:'',desc:'设置单元格属性'},
// {label:'本地模式下，确定筛选的运行函数',field:'onFilter',type:'function',version:'',desc:'本地模式下，确定筛选的运行函数'},
// {label:'自定义筛选菜单可见变化时调用',field:'onFilterDropdownVisibleChange',type:'function(visible) {}',version:'',desc:'自定义筛选菜单可见变化时调用'},
// {label:'设置头部单元格属性',field:'onHeaderCell',type:'function(column)',version:'',desc:'设置头部单元格属性'}
    ],
};

