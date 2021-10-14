import modelExtend from 'dva-model-extend';
const model = {
  reducers: {
    updateState(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
};
const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: false,
      total: 0,
      current: 1,
      pageSize: 30,
    },
  },
  reducers: {
    updateState(state, { payload }) {
      const { list, pagination } = payload;
      const { pagination: originPagination = {} } = state || {};
      return Object.assign({}, state, {
        list,
        pagination: Object.assign({}, originPagination, pagination),
      });
    },
  },
});
export default {
  modelExtend,
  model,
  pageModel,
};
