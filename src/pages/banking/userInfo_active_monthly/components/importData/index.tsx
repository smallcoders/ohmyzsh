import React, { useState } from "react";
import { Modal, message, Upload, Button, Space } from 'antd'
import type { UploadProps } from 'antd';
import { CloudUploadOutlined, FileTextOutlined, FileExclamationOutlined } from '@ant-design/icons';
import type { UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import './index.less'

const { Dragger } = Upload;

interface Import {
    visible: boolean;
    handleCancel: () => void
}
interface IUploadNum {
    successNum: number | undefined;
    failNum: number | undefined;
    filePath: string;
    progress?: string;
}

const template = {
    development: 'https://oss.lingyangplat.com/iiep-dev/977a9f99eeaa468bb0e1401606743ace.xlsx',
    production: 'https://oss-hefei-a2a.openstorage.cn/iiep-prod/a508e97a8e874ec39f54a6e9a1be039a.xlsx'
}

const ImportData: React.FC<Import> = (props) => {
    const { visible, handleCancel } = props
    const [uploadNum, setUploadNum] = useState<IUploadNum>({
        successNum: undefined,
        failNum: undefined,
        filePath: '',
        progress: 'false',
    });

    // 下载模板 dev: https://oss.lingyangplat.com/iiep-dev/977a9f99eeaa468bb0e1401606743ace.xlsx
    // test环境：https://oss.lingyangplat.com/iiep-test/50ef5b2ce9304e049695d0c3f7c78f7a.xlsx
    // preprod环境：https://oss.lingyangplat.com/iiep-prod/d9d69aeb101e40adadb2b872e92668e9.xlsx
    // prod环境：https://oss-hefei-a2a.openstorage.cn/iiep-prod/a508e97a8e874ec39f54a6e9a1be039a.xlsx
    const downloadTemplate = async () => {
        const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
        window.open(template[env], '_blank')
    }
    // 关闭弹窗
    const importCancel = () => {
        setUploadNum({ successNum: undefined, failNum: undefined, filePath: '', progress: 'false' });
        handleCancel()
    }
    // 重新导入
    const importAgain = () => {
        setUploadNum({ successNum: undefined, failNum: undefined, filePath: '' });
    }

    const handleChange = (info: UploadChangeParam) => {
        setUploadNum({
            ...uploadNum,
            progress: 'true',
        });
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'error') return;
        if (info.file.status === 'done') {
            try {
                const { result } = info.file.response;
                setUploadNum({
                    failNum: result.failNum,
                    successNum: result.successNum,
                    filePath: result.filePath,
                    progress: 'true',
                });
            } catch (error) {
                importAgain()
                message.error(`上传失败，原因:{${info.file.response.message}}`);
            }
        }
    };

    const accept = '.xlsx';
    const handleBeforeUpload = (file: RcFile) => {
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('上传的文件大小不得超过20M');
            return Upload.LIST_IGNORE;
        }
        try {
            const lastName = file.name.split('.');
            if (!accept.includes('.' + lastName[lastName.length - 1])) {
                message.error(`请上传以${accept}后缀名开头的文件`);
                return Upload.LIST_IGNORE;
            }
        } catch (error) {
            message.error('配置错误: ' + error);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        accept: '.xlsx',
        action: '/antelope-finance/active/mng/import',
        maxCount: 1,
        onRemove: () => false,
        onChange: handleChange,
        beforeUpload: handleBeforeUpload,
        progress: {
            strokeColor: {
                '0%': 'rgba(26, 102, 255)',
                '100%': 'rgba(26, 102, 255)',
            },
            strokeWidth: 8,
            format: (percent: number | undefined) => percent && `${parseFloat(percent.toFixed(2))}%`,
            showInfo: true,
        },
        showUploadList: {
            showRemoveIcon: false,
        },
    };

    return (
        <Modal
            className="supplier-uploads-file"
            title="导入"
            visible={visible}
            width={600}
            footer={false}
            maskClosable={false}
            destroyOnClose
            onCancel={importCancel}
        >
            {uploadNum.failNum === undefined ? (
                <div style={{ height: '180px' }}>
                    <div className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
                        <div style={{ marginBottom: '24px' }}>
                            请先下载
                            <span
                                style={{ color: 'rgba(143, 165, 255)', cursor: 'pointer' }}
                                onClick={downloadTemplate}
                            >
                                导入模版
                            </span>
                            ，按要求填写后上传
                        </div>
                    </div>
                    <Dragger {...uploadProps} className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
                        <p className="ant-upload-text">
                            <CloudUploadOutlined />
                            将文件拖拽到此处，或<span style={{ color: 'rgba(143, 165, 255)' }}>点击上传</span>
                        </p>
                        <p className="ant-upload-hint">支持 xlsx 格式，限20M以内</p>
                    </Dragger>
                </div>
            ) : uploadNum.failNum === 0 ? (
                <div className="resultSuccess">
                    <div className="icon">
                        <FileTextOutlined />
                    </div>
                    <div className="text1">导入成功,共{uploadNum.successNum}条</div>
                    <div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={importCancel}
                        >
                            完成
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="resultFail">
                    <div className="icon">
                        <FileExclamationOutlined />
                    </div>
                    <div className="text1">
                        共导入
                        {uploadNum.successNum !== undefined && uploadNum.failNum + uploadNum.successNum}
                        条，成功 {uploadNum.successNum}
                        条，失败 {uploadNum.failNum} 条
                    </div>
                    <div className="text2">
                        <span>您可以下载失败数据，修改后重新导入</span>
                        <a href={uploadNum.filePath}>下载失败数据</a>
                    </div>
                    <div>
                        <Space>
                            <Button
                                size="large"
                                onClick={importCancel}
                            >
                                取消
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={importAgain}
                            >
                                重新导入
                            </Button>
                        </Space>
                    </div>
                </div>
            )}
        </Modal>
    )
}


export default ImportData;