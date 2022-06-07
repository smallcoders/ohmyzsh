import React, { useState, useRef, useMemo, useEffect } from 'react';
import { AutoComplete, Spin } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import debounce from 'lodash/debounce';
// import './self-auto-complete.less';

const sc = scopedClasses('self-auto-complete');

export default (props: any) => {
  const {
    className = '',
    dropdownClassName = '',
    style = {},
    placeholder = '',
    debounceTimeout = 800,
    searchWordsLength,
    onSearch = () => new Promise((resolve) => resolve(true)),
    onChange,
    initOptions,
    ...rest
  } = props || {};

  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const requestRef = useRef(0);

  const handleSearch = useMemo(() => {
    return debounce(async (value: string) => {
      setOptions([]);
      if (searchWordsLength && value.length < searchWordsLength) return;
      requestRef.current += 1;
      const requestId = requestRef.current;
      setLoading(true);
      const optionRes = await onSearch?.(value);
      if (requestId !== requestRef.current) return;
      setOptions(optionRes || []);
      setLoading(false);
    }, debounceTimeout);
  }, [searchWordsLength, debounceTimeout]);

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  useEffect(() => {
    setOptions(initOptions || []);
  }, [initOptions]);

  return (
    <AutoComplete
      className={`${sc()} ${className}`}
      dropdownClassName={dropdownClassName}
      style={style}
      placeholder={placeholder}
      filterOption={false}
      options={options}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      {...rest}
    />
  );
};
