import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Steps } from 'antd';
import { useCallback, useState } from 'react';
import StepsForm0 from './components/StepsForm0';
import type { SpecData } from './components/StepsForm1';
import StepsForm1 from './components/StepsForm1';
import StepsForm2 from './components/StepsForm2';
import StepsForm3 from './components/StepsForm3';
import StepsForm4 from './components/StepsForm4';
import './create.less';

const { Step } = Steps;

export interface StepFormProps {
  currentChange: (current: number) => void;
}

export default () => {
  const [specs, setSpecs] = useState<SpecData[]>([]);
  const [current, setCurrent] = useState(4);

  const changeCurrent = useCallback((val: number) => {
    setCurrent((v) => v + val);
  }, []);

  return (
    <PageContainer title={false} className="commodity-create">
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
        <ProCard>
          {current === 0 && <StepsForm0 currentChange={changeCurrent} />}
          {current === 1 && <StepsForm1 currentChange={changeCurrent} onConfirm={setSpecs} />}
          {current === 2 && <StepsForm2 currentChange={changeCurrent} specs={specs} />}
          {current === 3 && <StepsForm3 currentChange={changeCurrent} />}
          {current === 4 && <StepsForm4 currentChange={changeCurrent} />}
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
