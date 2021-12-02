import { Steps } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-add-course.less';
import scopedClasses from '@/utils/scopedClasses';
import CourseInfo from './components/CourseInfo';
import CourseChapters from './components/CourseChapters';
import { history, useModel } from 'umi';
import { useRef } from 'react';
const sc = scopedClasses('service-config-add-course');
const { Step } = Steps;

const steps = [
  {
    title: '课程信息',
  },
  {
    title: '课程章节',
  },
];

export default () => {
  /**
   * 是否在编辑
   */
  const isEditing = !!history.location.query?.courseId;

  const courseInfoRef = useRef<any>();

  const { current, setCurrent } = useModel(
    'useCourseManageModel',
    (model: { current: number; setCurrent: React.Dispatch<React.SetStateAction<number>> }) => ({
      current: model.current,
      setCurrent: model.setCurrent,
    }),
  );

  return (
    <PageContainer
      header={{
        title: isEditing ? `课程编辑` : '添加课程',
      }}
      className={sc('container')}
    >
      <div className={sc('container-header')}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step
              key={item.title}
              title={item.title}
              onStepClick={(e) => {
                if (current !== e) {
                  if (e === 1) {
                    courseInfoRef?.current?.submit();
                  } else {
                    setCurrent(e);
                  }
                }
              }}
            />
          ))}
        </Steps>
      </div>
      <div className={sc('container-body')}>
        <div className="steps-content">
          {current === 0 && <CourseInfo cRef={courseInfoRef} />}
          {current === 1 && <CourseChapters />}
        </div>
      </div>
    </PageContainer>
  );
};
