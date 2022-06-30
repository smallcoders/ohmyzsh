import useQuery from '@/hooks/useQuery';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Steps } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import StepsForm0 from './components/StepsForm0';
import StepsForm1 from './components/StepsForm1';
import StepsForm2 from './components/StepsForm2';
import StepsForm3 from './components/StepsForm3';
import StepsForm4 from './components/StepsForm4';
import './create.less';

const { Step } = Steps;

export interface StepFormProps {
  id?: number | string;
  currentChange: (current: number) => void;
  setChanged: (isChanged: boolean) => void;
}

const { confirm } = Modal;

export default () => {
  const query = useQuery();
  const [productId, setProductId] = useState<number | string>();
  const [current, setCurrent] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  const showConfirm = useCallback((cb: () => void) => {
    confirm({
      title: '提示',
      content: '填写的信息尚未保存，确定离开此页面？',
      onOk() {
        cb();
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  }, []);

  const isEdit = useMemo(() => {
    return Boolean(query.id);
  }, [query]);
  const changeCurrent = useCallback((val: number) => {
    setCurrent((v) => v + val);
  }, []);

  const onStepClick = useCallback(
    (e: number) => {
      if (isEdit) {
        if (isChanged) {
          showConfirm(() => setCurrent(e));
        } else {
          setCurrent(e);
        }
      }
    },
    [isEdit, isChanged, showConfirm],
  );

  useEffect(() => {
    setIsChanged(false);
  }, [current]);

  const FormContent = useMemo(() => {
    switch (current) {
      case 1:
        return (
          <StepsForm1 id={productId} currentChange={changeCurrent} setChanged={setIsChanged} />
        );
      case 2:
        return (
          <StepsForm2 id={productId} currentChange={changeCurrent} setChanged={setIsChanged} />
        );
      case 3:
        return (
          <StepsForm3 id={productId} currentChange={changeCurrent} setChanged={setIsChanged} />
        );
      case 4:
        return (
          <StepsForm4 id={productId} currentChange={changeCurrent} setChanged={setIsChanged} />
        );
      default:
        return (
          <StepsForm0
            setProductId={setProductId}
            currentChange={changeCurrent}
            setChanged={setIsChanged}
          />
        );
    }
  }, [changeCurrent, current, productId]);

  useEffect(() => {
    if (query.id) {
      setProductId(query.id);
    }
  }, [query]);

  useEffect(() => {
    if (isChanged) {
      const fn = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', fn);

      return () => {
        window.removeEventListener('beforeunload', fn);
      };
    }

    return () => {};
  }, [isChanged]);

  return (
    <PageContainer title={false} className="commodity-create">
      <ProCard direction="column" ghost gutter={[0, 8]}>
        <ProCard>
          <Steps current={current}>
            <Step title="商品基础信息" onStepClick={onStepClick} />
            <Step title="商品规格信息" onStepClick={onStepClick} />
            <Step title="商品价格信息" onStepClick={onStepClick} />
            <Step title="商品参数介绍" onStepClick={onStepClick} />
            <Step title="商品详情" onStepClick={onStepClick} />
          </Steps>
        </ProCard>
        <ProCard>{FormContent}</ProCard>
      </ProCard>
    </PageContainer>
  );
};
