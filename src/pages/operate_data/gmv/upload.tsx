import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Result, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useState } from "react";
const accept = '.xls,.xlsx';
export default ({ visible, setVisible }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [stepObj, setStepObj] = useState<any>({
        total: 0,
        fail: 0,
        success: 0,
        step: 1
    })
    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'error') {
            return;
        }
        if (info.file.status === 'done') {
            const uploadResponse = info?.file?.response;
            if (uploadResponse?.code === 0) {
                message.success(`上传成功`);
                setStepObj({
                    step: (uploadResponse?.result?.fail || 0) > 0 ? 3 : 2,
                    fail: (uploadResponse?.result?.fail || 0),
                    success: (uploadResponse?.result?.success || 0),
                    total: (uploadResponse?.result?.success || 0) + (uploadResponse?.result?.fail || 0)
                })

            } else {
                message.error(`上传失败，原因:{${uploadResponse.message}}`);
            }
            setLoading(false)
        }
    };

    const beforeUpload = (file: RcFile) => {
        return new Promise((resolve, reject) => {
            const isLtLimit = file.size / 1024 / 1024 < 20;
            if (!isLtLimit) {
              message.error(`上传的文件大小不得超过20M`);
              return reject(false);
            }

            const lastName = file.name.split('.');
            const accepts = accept.split(',');
            console.log(lastName, lastName[lastName.length - 1]);
            if (!accepts.includes('.' + lastName[lastName.length - 1])) {
                message.error(`请上传以${accept}后缀名开头的文件`);
                return reject(false);
            }
            return resolve(true);
        });
    };
    const uploadProps = {
        name: 'file',
        multiple: true,
        action: `/antelope-pay/mng/iflytek/flow/sync?tag=${(new Date()).valueOf()}`,
        itemRender: ()=>{},
        onChange: handleChange,
        beforeUpload: beforeUpload,
        // onDrop: (e: React.DragEvent) => {
        //     try {
        //         const fileList = (e.dataTransfer.files as FileList) || [];
        //         for (let index = 0; index < fileList.length; index++) {
        //             const file = fileList[index];
        //             const lastName = file.name.split('.');
        //             const accepts = accept.split(',');
        //             if (!accepts.includes('.' + lastName[lastName.length - 1])) {
        //                 message.error(`${file.name}不符合标准，已忽略`);
        //             }
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // },
    };

    const resetStep = () => {
        setStepObj({
            step: 1,
            total: 0,
            fail: 0,
            success: 0
        })
    }

    return <Modal title="导入" visible={visible} footer={null} onCancel={() => {
        setVisible(false)
        resetStep()
    }}>
        {stepObj.step == 2 && <Result
            status="success"
            title={`导入成功，共${stepObj.total}条`}
            subTitle=""
            extra={[
                <Button type="primary" key="console" onClick={() => {
                    setVisible(false)
                    resetStep()
                }}>
                    完成
                </Button>,
            ]}
        />}
        {stepObj.step == 3 && <Result
            status="warning"
            title={`共导入${stepObj.total}，成功${stepObj.success}条，失败${stepObj.fail}条`}
            subTitle={<div>点此查看导入失败数据，<span>下载失败数据</span></div>}
            extra={[
                <Button key="console" onClick={() => {
                    setVisible(false)
                    resetStep()
                }}>
                    取消
                </Button>,
                <Button type="primary" key="buy" onClick={() => {
                    resetStep()
                }}>重新导入</Button>,
            ]}
        />}

        {stepObj.step == 1 && <div style={{
            height: '100%', width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div>
                <div>  您可以先下载<a href={'/antelope-pay/mng/iflytek/flow/download/template'}>导入模版</a>，按要求填写后上传 </div>
                <Upload {...uploadProps} accept={accept}>
                    <Button loading={loading} icon={<UploadOutlined />}>上传</Button>
                </Upload>
                <p className="ant-upload-hint">支持xls，xlsx类型的文件，限20M以内</p>
            </div>
        </div>}
    </Modal>
}