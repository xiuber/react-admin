import React, {useState, useEffect, useRef} from 'react';
import {VariableSizeGrid as Grid} from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import config from 'src/commons/config-hoc';
import {Table} from 'antd';
import './VirtualTable.less';

function VirtualTable(props) {
    const {columns, scroll} = props;
    const [tableWidth, setTableWidth] = useState(0);
    const widthColumnCount = columns.filter(({width}) => !width).length;
    const mergedColumns = columns.map((column) => {
        if (column.width) {
            return column;
        }

        return {...column, width: Math.floor(tableWidth / widthColumnCount)};
    });
    const gridRef = useRef();
    const [connectObject] = useState(() => {
        const obj = {};
        Object.defineProperty(obj, 'scrollLeft', {
            get: () => null,
            set: (scrollLeft) => {
                if (gridRef.current) {
                    gridRef.current.scrollTo({
                        scrollLeft,
                    });
                }
            },
        });
        return obj;
    });

    const resetVirtualGrid = () => {
        gridRef.current.resetAfterIndices({
            columnIndex: 0,
            shouldForceUpdate: false,
        });
    };

    useEffect(() => resetVirtualGrid, [tableWidth]);

    const renderVirtualList = (rawData, {ref, onScroll}) => {
        const scrollbarSize = 0;
        ref.current = connectObject;
        const totalHeight = rawData.length * 54;
        return (
            <Grid
                ref={gridRef}
                className="virtual-grid"
                columnCount={mergedColumns.length}
                columnWidth={(index) => {
                    const {width} = mergedColumns[index];
                    return totalHeight > scroll.y && index === mergedColumns.length - 1
                        ? width - scrollbarSize - 1
                        : width;
                }}
                height={scroll.y}
                rowCount={rawData.length}
                rowHeight={() => 154}
                width={tableWidth}
                onScroll={({scrollLeft}) => {
                    onScroll({
                        scrollLeft,
                    });
                }}
            >
                {({columnIndex, rowIndex, style}) => (
                    <div
                        className={classNames('virtual-table-cell', {
                            'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
                        })}
                        style={style}
                    >
                        {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
                    </div>
                )}
            </Grid>
        );
    };

    return (
        <ResizeObserver
            onResize={({width}) => {
                setTableWidth(width);
            }}
        >
            <Table
                {...props}
                showHeader={false}
                className="virtual-table"
                columns={mergedColumns}
                pagination={false}
                components={{
                    body: renderVirtualList,
                }}
            />
        </ResizeObserver>
    );
} // Usage

const columns = [
    {
        title: 'A',
        dataIndex: 'key',
        render: (value) => {
            return (
                <div style={{width: 100, height: 200, background: 'green', margin: 10}}>
                    {value}
                </div>
            );
        },
    },
];
const data = Array.from(
    {
        length: 100000,
    },
    (_, key) => ({
        key,
    }),
);

export default config({
    path: '/vt',
})(() => {
    return (
        <div styleName="root" style={{padding: 16, background: 'red'}}>
            <VirtualTable
                columns={columns}
                dataSource={data}
                scroll={{
                    y: 300,
                }}
            />,
        </div>
    );
});
