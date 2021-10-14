import modelExtend from 'dva-model-extend';

const model = {
  reducers: {
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
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
    updateState(state: any, { payload }: any) {
      const { list, pagination } = payload;
      const { pagination: originPagination = {} } = state || {};
      return {
        ...state,
        list,
        pagination: {
          ...originPagination,
          ...pagination,
        },
      };
    },
  },
});

export default {
  modelExtend,
  model,
  pageModel,
};
