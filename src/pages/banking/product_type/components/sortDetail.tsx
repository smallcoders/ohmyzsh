import type { Identifier } from 'dnd-core';
import type { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragOutlined } from '@ant-design/icons';

export interface CardProps {
  ItemTypes: string;
  id: any;
  children: React.ReactNode;
  index: number;
  moveDetail: (dragIndex: number, hoverIndex: number) => void;

  style?: React.CSSProperties;
}

interface DragItem {
  //拖动源的属性
  index: number;
  id: string;
  type: string;
}

export const SortDetail: FC<CardProps> = ({
  ItemTypes, //区别不同场景的拖拽组件
  id,
  children,
  index,
  moveDetail,
  style = {},
}) => {
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes,
    collect(monitor: any) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop: (item: any) => {
      if (item.index === index) return;
      moveDetail(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drop} data-handler-id={handlerId}>
      <div ref={preview} style={{ position: 'relative' }}>
        {children}
        <img
          ref={drag}
          src={require('@/assets/banking_loan/drag.png')}
          alt=""
          style={{ width: 24, position: 'absolute', right: -40, top: 4,cursor:'move'}}
        />
      </div>
    </div>
  );
};
