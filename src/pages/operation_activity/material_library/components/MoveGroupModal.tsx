import { Space, Radio, message, message as antdMessage } from 'antd';
import React, { useState } from 'react';
import { Modal } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import type { RadioChangeEvent } from 'antd';
import type MaterialLibrary from '@/types/material-library';
import { moveGroup } from '@/services/material-library';
const sc = scopedClasses('material-library');

type Props = {
  cancelMove: () => void;
  moveSuccess: () => void;
  visible: boolean;
  data: MaterialLibrary.List[];
  selectImg: number[];
  imgId: number | undefined;
  type: string;
};

const MoveGroupModal = ({
  cancelMove,
  visible,
  data,
  selectImg,
  moveSuccess,
  imgId,
  type,
}: Props) => {
  const [value, setValue] = useState(null);
  // 移动
  const changeMove = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  // 确定
  const handleOk = async () => {
    try {
      const { code } = await moveGroup({
        materialIds: type === 'single' ? [imgId] : selectImg,
        groupsId: value,
      });
      if (code === 0) {
        message.success('移动分组成功！');
        setValue(null);
        moveSuccess();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  return (
    <>
      <Modal
        title="移动至"
        visible={visible}
        wrapClassName={sc('move-group-modal')}
        destroyOnClose
        centered
        maskClosable={false}
        onCancel={() => {
          cancelMove();
          setValue(null);
        }}
        onOk={handleOk}
      >
        <Radio.Group onChange={changeMove} buttonStyle="solid">
          <Space direction="vertical">
            {data.map((item: MaterialLibrary.List) => {
              return (
                <Radio.Button className="move-group" key={item.id} value={item.id}>
                  {item.groupName}
                  {value === item.id && (
                    <img
                      style={{ position: 'absolute', right: 24, top: 16 }}
                      src={require('@/assets/operate_data/template/select.png')}
                    />
                  )}
                </Radio.Button>
              );
            })}
          </Space>
        </Radio.Group>
      </Modal>
    </>
  );
};

export default MoveGroupModal;
