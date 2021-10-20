import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'Faster and stronger heavy-duty components have been released.'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        justtest
      </Card>
    </PageContainer>
  );
};
