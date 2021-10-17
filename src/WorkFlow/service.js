var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { request } from '../utils';
/** 获取任务抬头信息信息任务 */
export function getApprovalHeaderVO(id, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/getApprovalHeaderVO/${id}?rand=${Date.now()}`;
        return request({
            url,
            method: 'GET',
        });
    });
}
/** 获取当前审批任务的决策信息 */
export function findNextNodes(id, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/findNextNodes/${id}?rand=${Date.now()}`;
        return request({
            url,
            method: 'GET',
        });
    });
}
/** 获取当前流程实例的流程历史信息 */
export function getProcessTrackVOById(instanceId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVOById?rand=${Date.now()}`;
        return request({
            url,
            method: 'POST',
            params: { instanceId },
        });
    });
}
/** 通过 taskId 获取当前流程实例的流程历史信息 */
export function getProcessTrackVOByTaskId(taskId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVOByTaskId?rand=${Date.now()}`;
        return request({
            url,
            method: 'POST',
            params: { taskId },
        });
    });
}
/** 下一步回调 */
export function getSelectedNodesInfo(params, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/getSelectedNodesInfo?rand=${Date.now()}`;
        return request({
            url,
            method: 'GET',
            params,
        });
    });
}
/** 完成 */
export function completeTask(data, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/defaultFlowBase/completeTaskNew`;
        return request({
            url,
            method: 'POST',
            data,
        });
    });
}
/** 转办 */
export function taskTurnToDo(taskId, userId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/taskTurnToDo`;
        return request({
            url,
            method: 'POST',
            data: { taskId, userId },
        });
    });
}
/** 委托 */
export function taskTrustToDo(taskId, userId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/taskTrustToDo`;
        return request({
            url,
            method: 'POST',
            data: { taskId, userId },
        });
    });
}
/** 驳回 */
export function reject(id, opinion, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/reject/${id}/${opinion}`;
        return request({
            url,
            method: 'POST',
        });
    });
}
/** 终止流程 */
export function endTask(instanceId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowInstance/end/${instanceId}`;
        return request({
            url,
            method: 'POST',
        });
    });
}
/** 签收 */
export function signTask(id, userId, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowTask/claim/${id}/${userId}`;
        return request({
            url,
            method: 'POST',
        });
    });
}
/** 获取全部组织机构 */
export function listAllOrgs(serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowDefination/listAllOrgs`;
        return request({
            url,
            method: 'POST',
        });
    });
}
/** 获取全部组织机构 */
export function listUserByOrg(organizationId, quickSearchValue, pageInfo, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowDefination/listUserByOrg`;
        return request({
            url,
            method: 'POST',
            data: { organizationId, includeSubNode: true, quickSearchValue, pageInfo },
        });
    });
}
/** 委托审阅处理 */
export function taskTrustToReturn(taskId, opinion, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/fflowTask/taskTrustToReturn`;
        return request({
            url,
            method: 'POST',
            data: { taskId, opinion },
        });
    });
}
/** 获取流程历史 */
export function getFlowHistoryInfo(params, serviceHost, gateway) {
    return __awaiter(this, void 0, void 0, function* () {
        serviceHost = serviceHost ? `${serviceHost}/` : '';
        const url = `${serviceHost}${gateway}/flow-service/flowInstance/getProcessTrackVO?rand=${Date.now()}`;
        return request({
            url,
            method: 'GET',
            params,
        });
    });
}
