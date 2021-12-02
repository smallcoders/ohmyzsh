/**
 * 目前对table 表格 做了指定单元格的单行显示与展开
 * isEllipsis：true && width 必填 && scroll 必填
 *
 * */
import { Table } from 'antd';
import { useMemo } from 'react';
import './self-table.less';
const SelfTable = <T,>(props: { columns: any[]; pagination: any; [x: string]: any }) => {
  const { columns, pagination = false, ...rest } = props || {};

  // const [rowActiveIndex, setRowActiveIndex] = useState(null);
  // const onTableRow = useCallback((row, index) => {
  //   return {
  //     onMouseEnter: () => {
  //       setRowActiveIndex(index);
  //     },
  //     onMouseLeave: () => {
  //       setRowActiveIndex(null);
  //     },
  //   };
  // }, []);

  const getNewColumns = useMemo(() => {
    // 对columns 做处理
    // style={index === rowActiveIndex ? { width: item.width - 32 } : {
    //   overflow: 'hidden',
    //   whiteSpace: 'nowrap',
    //   textOverflow: 'ellipsis',
    //   wordBreak: 'keep-all',
    //   width: item.width - 32
    // }}
    return columns.map((item) => {
      const render = item.isEllipsis
        ? (_: any, record: T, index: number) => {
            return (
              <div className={'ellipsis-table'} style={{ width: item.width - 32 }}>
                {item.render ? item.render(_, record, index) : _}
              </div>
            );
          }
        : item.render;
      return {
        ...item,
        render,
      };
    });
  }, [columns]);

  return (
    <Table
      // onRow={onTableRow}
      columns={getNewColumns}
      pagination={pagination}
      {...rest}
    />
  );
};
export default SelfTable;
