import { request } from 'umi';

export async function getDemandContacts() {
  return request(
    '/antelope-science/mng/demand/contact/list',{
      method: 'GET',
    }
  )
}

export async function getDemandContactUpdate(data: {
  id: number
  contactName: string
  phone: string
}) {
  return request(
    '/antelope-science/mng/demand/contact/update', {
      method: 'put',
      data,
    }
  )
}
