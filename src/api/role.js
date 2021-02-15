import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data: data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/role/' + id,
    method: 'put',
    data: data
  })
}

export function deleteRole(id) {
  return request({
    url:'/role/' + id,
    method:'delete',
  })
}

export function fetchAllRoleList() {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}
