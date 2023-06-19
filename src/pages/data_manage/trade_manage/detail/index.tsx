import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd'
import { history } from "@@/core/history";
import './index.less';
  
export default () => {
  const record = JSON.parse(history.location.query?.record as string) || {};

  return (
    <PageContainer
      footer={[
        <>
          <Button size="large" onClick={() => history.goBack()}>
            返回
          </Button>
        </>
      ]}
    >
      <div className='trade-manage-info' >
        <div className='col'>
          <div className='col-label'>订单日期：</div>
          <div className='col-title'>{record?.orderDate || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>采购单号：</div>
          <div className='col-title'>{record?.orderNum || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>项目名称：</div>
          <div className='col-title'>{record?.projectName || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>合同主体：</div>
          <div className='col-title'>{record?.contractSubject || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>供应商名称：</div>
          <div className='col-title'>{record?.providerName || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>物料描述：</div>
          <div className='col-title'>{record?.materialDescription || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>数量：</div>
          <div className='col-title'>{record?.count || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>单位：</div>
          <div className='col-title'>{record?.unit || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>单价：</div>
          <div className='col-title'>{record?.taxPrice || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>价格单位：</div>
          <div className='col-title'>{record?.priceUnit || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>含税金额（元）：</div>
          <div className='col-title'>{record?.taxAmount || '--'}</div>
        </div>
        <div className='col'>
          <div className='col-label'>数据来源：</div>
          <div className='col-title'>{record?.dataSource || '--'}</div>
        </div>
      </div>
    </PageContainer>
  )
}
