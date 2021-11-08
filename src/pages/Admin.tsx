import React from 'react';
// import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { Card, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { useModel } from 'umi';

export default (): React.ReactNode => {
  // const { user } = useModel('useAuthModel', (model: { user: any; signin: any; }) => ({ user: model.user, signin: model.signin }));

  // useEffect(() => {
  //   console.log('user', user)
  // }, [])
  return (
    <PageHeaderWrapper content={'This page can only be viewed by admin'}>
      <Card>
        <Alert
          message={'Faster and stronger heavy-duty components have been released.'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
      </Card>
      <p style={{ textAlign: 'center', marginTop: 24 }}>
        Want to add more pages? Please refer to eewqewqewqewqew
        <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
          use block
        </a>
        。
      </p>
    </PageHeaderWrapper>
  );
};
