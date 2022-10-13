import CourseManage from "@/types/service-config-course-manage";
import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import Dragger from "antd/lib/upload/Dragger";
const accept = '.xls,.xlsx';
export default () => {
    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'error') {
            return;
        }

        if (info.file.status === 'done') {
            const uploadResponse = info?.file?.response;
            if (uploadResponse?.code === 0) {
                message.success(`上传成功`);
            } else {
                message.error(`上传失败，原因:{${uploadResponse.message}}`);
            }
        }
    };

    const beforeUpload = (file: RcFile) => {
        return new Promise((resolve, reject) => {
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
        itemRender:()=>{},
        action: '/antelope-pay/mng/iflytek/flow/sync',
        onChange: handleChange,
        beforeUpload: beforeUpload,
        onDrop: (e: React.DragEvent) => {
            try {
                const fileList = (e.dataTransfer.files as FileList) || [];
                for (let index = 0; index < fileList.length; index++) {
                    const file = fileList[index];
                    const lastName = file.name.split('.');
                    const accepts = accept.split(',');
                    if (!accepts.includes('.' + lastName[lastName.length - 1])) {
                        message.error(`${file.name}不符合标准，已忽略`);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
    };
    return <div style={{
        height: '100%', width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Dragger {...uploadProps} accept={accept} style={{padding: 20}}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">支持上传图片格式xls，xlxs类型的课件</p>
        </Dragger>
    </div>
}