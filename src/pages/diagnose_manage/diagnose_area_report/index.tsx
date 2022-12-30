/* eslint-disable */
import { Radio, RadioChangeEvent } from 'antd';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState, useEffect } from 'react';
import DataColumn from '@/types/data-column.d';
import './index.less';
import DayReport from './components/dayReport';
import MonthReport from './components/monthReport';
import { Access, useAccess } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
enum Edge {
	DAY = 0, // 日报表
	MONTH = 1 //月报表
}

const sc = scopedClasses('report-day-and-month');

const DColumn: React.FC = () => {
	const access = useAccess()
	const [edge, setEdge] = useState<Edge>(0);
	// 页面权限
	useEffect(() => {
		for (const key in permissions) {
		  const permission = permissions[key]
		  // permission 看这个属性，是否再access中存在，存在为true
		  if (Object.prototype.hasOwnProperty.call(access, permission)) {
			console.log('key',key)
			setEdge(key as any)
			break
		  }
		}
	}, [])
	const edges = {
		[Edge.DAY]: '日报表', // 日报表
		[Edge.MONTH]: '月报表', // 月报表
	}
	const permissions = {
		[Edge.DAY]: 'PQ_DM_QYBB_DAY', // 日报表
		[Edge.MONTH]: 'PQ_DM_QYBB_MONTH', // 月报表
	  }

	const selectButton = (): React.ReactNode => {
		const handleEdgeChange = (e: RadioChangeEvent) => {
			setEdge(e.target.value);
		};
		return (
			<Radio.Group value={edge} onChange={handleEdgeChange}>
				{
					Object.keys(edges).map((p, index) => {
						return <Access accessible={access?.[permissions[p]]}><Radio.Button value={p}>{edges[p]}</Radio.Button></Access>
					})
				}
			</Radio.Group>
		);
	};

	return (
		<PageContainer className={sc('container')}>
			{selectButton()}
			{edge == 0 && <DayReport />}
			{edge == 1 && <MonthReport />}
		</PageContainer>
	);
};

export default DColumn;
