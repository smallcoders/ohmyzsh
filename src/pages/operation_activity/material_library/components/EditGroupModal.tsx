import { useState } from 'react';
import { Form, Modal, Button } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('material-library');

type Props = {
  handleCancel: () => void;
  visible: boolean;
};
const EditGroupModal = ({ handleCancel, visible }: Props) => {
  const handleOk = () => {};
  return (
    <>
      <Modal
        width={800}
        title="管理分组"
        visible={visible}
        wrapClassName={sc('edit-group-modal')}
        destroyOnClose
        centered
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            完成
          </Button>,
        ]}
      >
        111
      </Modal>
    </>
  );
};

export default EditGroupModal;
