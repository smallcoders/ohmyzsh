import { queryPurpose, addPurpose, delPurpose } from '@/services/banking-product';
import { Input, message } from 'antd';
import { number } from 'echarts';
import { isDate } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';
export default (props: { value?: string; onChange?: any }) => {
  const [purpose, setPurpose] = useState<any[]>([]);
  const inputRef = useRef<InputRef>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const getPurpose = async (input: string) => {
    try {
      const data = await Promise.all([queryPurpose()]);
      setPurpose(data?.[0]?.result || []);
      if (input) {
        data?.[0]?.result?.forEach((i) => {
          if (i.name === input) {
            setPropsVal(i.id);
          }
        });
      }
    } catch (error) {
      message.error('数据初始化错误');
    }
  };
  const setPropsVal = (id: number) => {
    console.log('setPropsVal', id, props.value);
    let selected = props.value?.split(',') || [];
    const ids = id.toString();
    if (selected.includes(ids)) {
      selected = selected?.filter((i) => i !== ids);
    } else {
      selected?.push(id);
    }
    props.onChange(selected?.join(','));
  };
  useEffect(() => {
    getPurpose();
  }, []);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue) {
      addPurpose({ name: inputValue }).then((res) => {
        if (res.code === 0) {
          getPurpose(inputValue);
          setInputVisible(false);
          setInputValue('');
          message.success('新增贷款用途成功');
        } else {
          message.error('新增贷款用途失败');
        }
      });
    } else {
      setInputVisible(false);
    }
  };
  const remove = (id) => {
    delPurpose({ id }).then((res) => {
      if (res.code === 0) {
        message.success('删除贷款用途成功');
        getPurpose();
        console.log(props?.value, id);
        if (props?.value?.split(',')?.includes(id.toString())) {
          props?.onChange(
            props.value
              ?.split(',')
              .filter((i) => i !== id.toString())
              ?.join(',') || '',
          );
        }
      } else {
        message.error('删除贷款用途失败');
      }
    });
  };
  return (
    <div className="loan-use">
      {purpose?.map((item) => {
        return (
          <div
            className={
              props.value?.split(',').includes(item.id.toString())
                ? 'loan-use-item selected'
                : 'loan-use-item'
            }
          >
            <img
              src={require('@/assets/banking_loan/selected.png')}
              alt=""
              className="selected-img-selected"
            />
            <img
              src={require('@/assets/banking_loan/delete.png')}
              alt=""
              className="selected-img-delete"
              onClick={() => {
                remove(item.id);
              }}
            />
            <div
              className="label"
              title={item.name}
              onClick={() => {
                setPropsVal(item.id);
              }}
            >
              {item.name}
            </div>
          </div>
        );
      })}
      <div className="loan-use-item add">
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="large"
            className="tag-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <div onClick={showInput}>+自定义用途</div>
        )}
      </div>
    </div>
  );
};
