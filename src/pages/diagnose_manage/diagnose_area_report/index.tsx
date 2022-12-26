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

const sc = scopedClasses('service-config-diagnose-manage');

const DColumn: React.FC = () => {
	const access = useAccess()
	const [edge, setEdge] = useState<Edge>(Edge.DAY);
	// 页面权限
	// const permissions = {
	// 	[Edge.DAY]: 'PQ_AM_ZXJL',
	// }
	// useEffect(() => {
	// 	for (const key in permissions) {
	// 		const permission = permissions[key]
	// 		if (Object.prototype.hasOwnProperty.call(access, permission)) {
	// 			setEdge(key as any)
	// 			break
	// 		}
	// 	}
	// }, [])

	const selectButton = (): React.ReactNode => {
		const handleEdgeChange = (e: RadioChangeEvent) => {
			setEdge(e.target.value);
		};
		return (
			<Radio.Group value={edge} onChange={handleEdgeChange}>
				<Radio.Button value={Edge.DAY}>日报表</Radio.Button>
				<Radio.Button value={Edge.MONTH}>月报表</Radio.Button>
			</Radio.Group>
		);
	};

	return (
		<PageContainer className={sc('container')}>
			{selectButton()}
			{edge === Edge.DAY && <DayReport />}
			{edge === Edge.MONTH && <MonthReport />}
		</PageContainer>
	);
};

export default DColumn;
