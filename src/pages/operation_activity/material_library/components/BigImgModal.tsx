import { Image } from 'antd';
import { Modal } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import type MaterialLibrary from '@/types/material-library';

const sc = scopedClasses('material-library');

type Props = {
  cancelImg: () => void;
  visible: boolean;
  imgInfo: MaterialLibrary.Content;
};

const MoveGroupModal = ({ cancelImg, visible, imgInfo }: Props) => {
  return (
    <>
      <Modal
        width={900}
        visible={visible}
        wrapClassName={sc('big-img-modal')}
        destroyOnClose
        centered
        maskClosable={false}
        onCancel={cancelImg}
        footer={null}
      >
        <div className="viewImg">
          <Image
            className="img"
            width={'100%'}
            height={500}
            style={{ objectFit: 'contain' }}
            preview={false}
            src={imgInfo.photoUrl}
          />
        </div>
        <div className="img-info">
          <div>尺寸 : {imgInfo.photoWidth + '*' + imgInfo.photoHeight}</div>
          <div>创建人 : {imgInfo.createUser}</div>
          <div>创建时间 : {imgInfo.createTime}</div>
        </div>
      </Modal>
    </>
  );
};

export default MoveGroupModal;
