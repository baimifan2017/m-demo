import { request } from '../utils';

/** 获取任务抬头信息信息任务 */
export async function getApprovalHeaderVO(id: string, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/getApprovalHeaderVO/${id}?rand=${Date.now()}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 获取当前审批任务的决策信息 */
export async function findNextNodes(id: string, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/findNextNodes/${id}?rand=${Date.now()}`;
  return request({
    url,
    method: 'GET',
  });
}

/** 获取当前流程实例的流程历史信息 */
export async function getProcessTrackVOById(
  instanceId: string,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVOById?rand=${Date.now()}`;
  return request({
    url,
    method: 'POST',
    params: { instanceId },
  });
}

/** 通过 taskId 获取当前流程实例的流程历史信息 */
export async function getProcessTrackVOByTaskId(
  taskId: string,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVOByTaskId?rand=${Date.now()}`;
  return request({
    url,
    method: 'POST',
    params: { taskId },
  });
}

/** 下一步回调 */
export async function getSelectedNodesInfo(params: any, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/getSelectedNodesInfo?rand=${Date.now()}`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

/** 完成 */
export async function completeTask(data: any, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/defaultFlowBase/completeTaskNew`;
  return request({
    url,
    method: 'POST',
    data,
  });
}

/** 转办 */
export async function taskTurnToDo(
  taskId: string,
  userId: string,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/taskTurnToDo`;
  return request({
    url,
    method: 'POST',
    data: { taskId, userId },
  });
}

/** 委托 */
export async function taskTrustToDo(
  taskId: string,
  userId: string,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/taskTrustToDo`;
  return request({
    url,
    method: 'POST',
    data: { taskId, userId },
  });
}

/** 驳回 */
export async function reject(id: string, opinion: string, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/reject/${id}/${opinion}`;
  return request({
    url,
    method: 'POST',
  });
}

/** 终止流程 */
export async function endTask(instanceId: string, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowInstance/end/${instanceId}`;
  return request({
    url,
    method: 'POST',
  });
}

/** 签收 */
export async function signTask(id: string, userId: string, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowTask/claim/${id}/${userId}`;
  return request({
    url,
    method: 'POST',
  });
}

/** 获取全部组织机构 */
export async function listAllOrgs(serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowDefination/listAllOrgs`;
  return request({
    url,
    method: 'POST',
  });
}

/** 获取全部组织机构 */
export async function listUserByOrg(
  organizationId: string,
  quickSearchValue: string,
  pageInfo: any,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowDefination/listUserByOrg`;
  return request({
    url,
    method: 'POST',
    data: { organizationId, includeSubNode: true, quickSearchValue, pageInfo },
  });
}

/** 委托审阅处理 */
export async function taskTrustToReturn(
  taskId: string,
  opinion: string,
  serviceHost?: string,
  gateway?: string,
) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/fflowTask/taskTrustToReturn`;
  return request({
    url,
    method: 'POST',
    data: { taskId, opinion },
  });
}

/** 获取流程历史 */
export async function getFlowHistoryInfo(params: any, serviceHost?: string, gateway?: string) {
  serviceHost = serviceHost ? `${serviceHost}/` : '';
  const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVO?rand=${Date.now()}`;
  return request({
    url,
    method: 'GET',
    params,
  });
}
