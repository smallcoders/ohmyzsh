import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { Steps, Button, Avatar } from 'antd';
// import StepsAvatar from '@/assets/svg/steps-avatar.svg'
import './verify-steps.less';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

type Props = {
  list: {
    title: ReactNode | string;
    description?: ReactNode | string;
    isShow?: boolean;
  }[];
  current?: number;
};

export default ({ list, current }: Props) => {
  const [realList, setRealList] = useState<any[]>([]);

  useEffect(() => {
    if (list.length > 6) {
      setRealList(list.slice(0, 6));
    } else {
      setRealList(list);
    }
  }, [list]);

  const getMore = () => {
    setRealList(list);
  };

  return (
    <div className="verify-steps-container">
      <Steps className="verify-steps-steps" direction="vertical" current={current}>
        {realList.map((el, index) => {
          const { isShow = true } = el || {};
          return isShow ? (
            <Steps.Step
              key={index}
              icon={<Avatar icon={<UserOutlined />} />}
              // icon={<StepsAvatar fill="#6680FF" />}
              title={el.title}
              description={el.description}
              className="verify-step-item"
            />
          ) : null;
        })}
      </Steps>
      {list.length > 6 && realList.length < list.length ? (
        <Button className="verify-step-more" type="link" onClick={getMore}>
          更多审核信息 <DownOutlined className="verify-step-arrow-down" />
        </Button>
      ) : null}
    </div>
  );
};
