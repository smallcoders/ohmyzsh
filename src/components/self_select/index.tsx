import { useEffect, useState } from 'react';
import { Col, message, Row } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';

const sc = scopedClasses('self-select');

interface Props {
  dictionary?: any[];
  value?: string[];
  onChange?: (values: string[]) => void;
  fieldNames?: { label: string; value: string };
  max?: number;
}

const SelfSelect = ({
  onChange,
  dictionary,
  value,
  max = 3,
  fieldNames = {
    label: 'title',
    value: 'value',
  },
}: Props) => {
  const label = fieldNames.label;
  const value_field = fieldNames.value;

  const [dictionaryObj, setDictionaryObj] = useState<{
    [prop: string]: any;
  }>([]);

  useEffect(() => {
    // 将可选的最后一层数据存储
    const dictionaryObjById = {};
    dictionary?.map((p) => {
      dictionaryObjById[p[value_field]] = p;
    });
    setDictionaryObj(dictionaryObjById);
  }, [dictionary]);

  const onClick = (clickId: string) => {
    console.log('clickId', clickId);
    const exist = value?.filter((p) => p !== clickId) || [];
    console.log('clickId', exist);
    if (exist.length === (value?.length || 0)) {
      if (value?.length === max) {
        message.info(`最多选择${max}个`);
        return;
      }
      onChange?.([...(value || []), clickId]);
      return;
    }
    onChange?.([...exist]);
  };

  return (
    <div className={sc()}>
      <Row gutter={10}>
        {dictionary?.map((i) => {
          const isSelected = value?.includes(i[value_field]);
          return (
            <Col
              onClick={() => onClick(i[value_field])}
              span={6}
              className={sc(isSelected ? 'item-values-tag-selected' : 'item-values-tag')}
              key={i[value_field]}
            >
              {i[label]}
            </Col>
          );
        })}
      </Row>
      <div className={sc('footer-left')}>
        {!value || value.length === 0 ? (
          <span className={sc('footer-left-placeholder')}>最多可选{max}种类型</span>
        ) : (
          value?.map((p) => (
            <div key={`selected-tag-${p}`} style={{ width: 88 }}>
              <span
                onClick={() => onClick(dictionaryObj?.[p]?.[value_field])}
                title={dictionaryObj?.[p]?.[label]}
              >
                {dictionaryObj?.[p]?.[label]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default SelfSelect;
