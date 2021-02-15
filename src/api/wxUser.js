import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/wx/list',
    method: 'get',
    params: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/wx/' + id,
    method: 'delete'
  })
}
