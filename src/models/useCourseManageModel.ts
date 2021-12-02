import CourseManage from '@/types/service-config-course-manage';
import { useState } from 'react';

export default function useCourseManageModel() {
  const [editingCourse, setEditingCourse] = useState<CourseManage.Content | undefined>();
  const [current, setCurrent] = useState(0);
  return {
    current,
    editingCourse,
    setEditingCourse,
    setCurrent,
  };
}
