
import { request } from 'umi';

// 招投标 分页
export async function getBidPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/tenderingBidding/page', {
        method: 'post',
        data,
    });
}


// 招投标 详情 id
export async function getBidDetail(params?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/tenderingBidding/queryDetailById', {
        method: 'get',
        params,
    });
}

// 招投标 上下架
//id	是	isShelves	是	false
export async function onOffShelvesById(params?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/tenderingBidding/onOffShelvesById', {
        method: 'post',
        params,
    });
}

//删除 招投标 id
export async function deleteBid(params?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/tenderingBidding/deleteById', {
        method: 'delete',
        params,
    });
}
// 内容
// 文章列表
export async function getArticlePage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/article/page/query', {
        method: 'post',
        data,
    });
}
export async function getArticleRiskCount(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/article/query/count', {
        method: 'post',
        data,
    });
}



// 文章详情
export async function getArticleDetail(id: string) {
    return request<any>(`/antelope-industrial/mng/article/detail/${id}`, {
        method: 'get',
    });
}

// 文章详情浏览信息
export async function getArticleStatisticPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/page/query/statistic/by/articleId', {
        method: 'post',
        data,
    });
}

// 新增文章
export async function addArticle(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/article/add', {
        method: 'post',
        data,
    });
}

// 风险审核
export async function auditArticle(content: string) {
    return request<any>(`/antelope-industrial/mng/article/audit`, {
        method: 'post',
        data:{
            content
        }
    });
}

// 编辑文章
export async function editArticle(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/article/edit', {
        method: 'post',
        data,
    });
}

// 删除文章
export async function deleteArticle(id: string) {
    return request<any>(`/antelope-industrial/mng/article/delete/${id}`, {
        method: 'post',
    });
}

// 文章上下架接口
export async function onOffShelvesArticle(id: string, articleStatus: number) {
    return request<any>(`/antelope-industrial/mng/article/up-or-down/${id}/${articleStatus}`, {
        method: 'post',
    });
}

// 置顶/取消置顶
//id	是	isTopping	true：置顶；false：取消置顶
export async function isTopArticle(data?: { [key: string]: any }) {
    return request<any>(`/antelope-industrial/mng/article/topping-or-not`, {
        method: 'post',
        data
    });
}


// 获取全部内容类型
export async function getArticleType() {
    return request<any>(`/antelope-industrial/mng/get/all/article/types`, {
        method: 'get',
    });
}

// 获取全部标签
export async function getArticleTags() {
    return request<any>(`/antelope-industrial/mng/get/all/labels`, {
        method: 'get',
    });
}


// 标签
// 标签列表
export async function getTagPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/page/query/labels', {
        method: 'post',
        data,
    });
}

//标签详情
export async function getTagDetail(id: string) {
    return request<any>(`/antelope-industrial/mng/get/by/id/${id}`, {
        method: 'get',
    });
}

// 标签详情-关联用户
export async function getTagUserPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/linked/user/page/query', {
        method: 'post',
        data,
    });
}

// 标签详情-关联内容
export async function getTagContentPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/linked/article/page/query', {
        method: 'post',
        data,
    });
}
// 新增标签
export async function addTag(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/add/label', {
        method: 'post',
        data,
    });
}

// 编辑标签
export async function editTag(data?: { [key: string]: any }) {
    return request<any>('/antelope-industrial/mng/edit/label', {
        method: 'post',
        data,
    });
}

// 删除标签
export async function deleteTag(id: string) {
    return request<any>(`/antelope-industrial/mng/delete/label/${id}`, {
        method: 'post',
    });
}

// 推荐位管理 - 列表
export async function recommendForUserPage (data?: any) {
   return request<any>('/antelope-industrial/mng/recommendForUser/page', {
    method: 'post',
    data,
    headers: {
      'rpc-tag': 'local-dev'
    }
  });
}
// 新增推荐位
export async function addRecommendForUserPage(data?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/add', {
    method: 'post',
    data,
  });
}
// 修改推荐位（是否启用，推荐位和标签的
export async function editRecommendForUserPage(data?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/edit', {
    method: 'post',
    data,
  });
}
// 推荐位详情
export async function detailRecommendForUserPage(params?: any) {
  return request<any>('/antelope-industrial/mng/recommendForUser/detail', {
    method: 'get',
    params,
  });
}

// 用户浏览详情
export function getUserDetailBrowse(data?: any) {
  return request<any>('/antelope-industrial/mng/userDetail', {
    method: 'post',
    data,
  });
}
//会议管理
// 会议管理-分页查询
export async function getMeetingPage(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/page', {
        method: 'post',
        data,
    });
}

// 会议详情
export async function detailMeetingForUserPage(params?: any) {
    return request<any>('/antelope-business/mng/meeting/detail', {
      method: 'get',
      params,
    });
  }

// 会议管理-删除会议
export async function deleteMeeting(meetingId?: any) {
    return request<any>(`/antelope-business/mng/meeting/del?meetingId=${meetingId}`, {
      method: 'DELETE',
    });
  }

 //会议管理-会议上架
export async function onShelfMeeting(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/onShelf', {
      method: 'put',
      data,
    });
  }

//会议管理-会议下架
export async function offShelfMeeting(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/offShelf', {
      method: 'put',
      data,
    });
  }

 //会议管理-权重设置
export async function weightMeeting(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/weight', {
      method: 'put',
      data,
    });
  }

// 会议管理-暂存/提交
export async function saveMeeting(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/save', {
        method: 'post',
        data,
    });
}

//会议设置-保存设置
export async function queryMeetingPageList(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/enrollPage'),{
        method:'post',
        data
    }
}

// 会议管理-报名列表导出
export async function exportMeetingData(params?: any) {
    return request<any>('/antelope-business/mng/meeting/enrollExport', {
      method: 'get',
      params,
    });
  }

//会议设置-保存设置
export async function saveMeetingConfig(data?: { [key: string]: any }) {
    return request<any>('/antelope-business/mng/meeting/saveConfig'),{
        method:'post',
        data
    }
}

// 会议设置-查询设置
export async function queryMeetingConfig(params?: any) {
    return request<any>('/antelope-business/mng/meeting/detailConfig', {
      method: 'get',
      params,
    });
  }