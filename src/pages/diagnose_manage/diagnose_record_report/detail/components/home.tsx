/* eslint-disable */
import { Table, message, Select, Tooltip } from 'antd';
const { Option } = Select;
import { MenuOutlined } from '@ant-design/icons';
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import DiagnoseManage from '@/types/service-config-diagnose-manage';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import DataColumn from '@/types/data-column';
import {
	editOrgList,
  } from '@/services/digital-application';
type DiagnoseResult = DiagnoseManage.Diagnose;
import { history, Access, useAccess } from 'umi';
import {
  getOrgTypeList,
  sortOrgType,
  removeOrgType
} from '@/services/diagnose-manage';
import { arrayMoveImmutable } from 'array-move';
import moment from 'moment';

const sc = scopedClasses('service-config-diagnose-manage');

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const TableList: React.FC = () => {
  const [resultObj, setResultObj] = useState<DiagnoseResult>({})

  const previewResult = async () => {
		setResultObj({
      "name": "111",
      "summary": "111",
      "recommendations": "",
      "remind": "",
      "defaultDiagnoseResult": false,
      "relations": null,
      "relatedRelation": null,
      "relatedServers": null,
      "relatedTechnicalManager": null,
      "offerings": "111",
      "offeringsFile": null,
      "offeringsFileName": "",
      "offeringsFilePath": ""
    })
	}
  useEffect(() => {
    previewResult()
  },[])


  return (
    <div className={sc('container')}>
      <div className='preview-wrap'>
					<h3>诊断报告概述</h3>
					<p>{resultObj && resultObj.summary || ''}</p>
					<h3>诊断目标建议</h3>
					<p>{resultObj && resultObj.recommendations || ''}</p>
					<h3>特殊提醒</h3>
					<p>{resultObj && resultObj.remind || ''}</p>
					<h3>服务方案</h3>
					<p>{resultObj && resultObj.offerings || ''}</p>
					<a href={resultObj.offeringsFilePath}>{resultObj.offeringsFileName}</a>
					<h3>推荐服务商</h3>
					<p>{resultObj&&resultObj.relatedServers&&resultObj.relatedServers.join(',') || ''}</p>
					<h3>推荐技术经理人</h3>
					<p>{resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.name || ''} {resultObj && resultObj.relatedTechnicalManager && resultObj.relatedTechnicalManager.phone || ''}</p>
					<h3>推荐金融产品</h3>
				</div>
      {/* <div className={sc('container-table-body')}>
        <Table
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          bordered
          rowKey="sort"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </div> */}
    </div>
  );
};

export default TableList;
