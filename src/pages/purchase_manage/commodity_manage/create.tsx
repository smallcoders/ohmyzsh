import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Steps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import StepsForm0 from './components/StepsForm0';
import type { SpecData } from './components/StepsForm1';
import StepsForm1 from './components/StepsForm1';
import StepsForm2 from './components/StepsForm2';
import StepsForm3 from './components/StepsForm3';
import StepsForm4 from './components/StepsForm4';
import './create.less';

const { Step } = Steps;

export interface StepFormProps {
  id?: number | string;
  currentChange: (current: number) => void;
  changeLoading: (loading: boolean) => void;
}

export default () => {
  const [productId, setProductId] = useState<number | string>();
  const [loading, setloading] = useState(false);
  const [specs, setSpecs] = useState<SpecData[]>([]);
  const [current, setCurrent] = useState(0);

  const changeCurrent = useCallback((val: number) => {
    setCurrent((v) => v + val);
  }, []);

  const FormContent = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <StepsForm1
            id={productId}
            currentChange={changeCurrent}
            onConfirm={setSpecs}
            changeLoading={setloading}
          />
        );
      case 2:
        return (
          <StepsForm2
            id={productId}
            specs={specs}
            currentChange={changeCurrent}
            changeLoading={setloading}
          />
        );
      case 3:
        return (
          <StepsForm3 id={productId} currentChange={changeCurrent} changeLoading={setloading} />
        );
      case 4:
        return (
          <StepsForm4 id={productId} currentChange={changeCurrent} changeLoading={setloading} />
        );
      default:
        return (
          <StepsForm0
            setProductId={setProductId}
            currentChange={changeCurrent}
            changeLoading={setloading}
          />
        );
    }
  }, [changeCurrent, specs, current, productId]);

  return (
    <PageContainer loading={loading} title={false} className="commodity-create">
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard>
          <Steps current={current}>
            <Step title="商品基础信息" />
            <Step title="商品规格信息" />
            <Step title="商品价格信息" />
            <Step title="商品参数介绍" />
            <Step title="商品详情" />
          </Steps>
        </ProCard>
        <ProCard>{FormContent}</ProCard>
      </ProCard>
    </PageContainer>
  );
};
