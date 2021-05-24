import axios from '@/services/request.service';

export default {
    state: () => ({
        tree: [],
        contentDir: [],
        selectItems: [],

        treeError: {},
        contentDirError: {},
        createDirError: {},
        renameError: {},
    }),
    actions: {
        async getTreeDirectory({ commit }) {
            try {
                const { data } = await axios.post(
                    `filemanager/getTreeDirectory`,
                    {}
                );
                commit('fetchTreeDirectoryFail', {});
                commit('fetchTreeDirectorySuccess', data.treeDir);
            } catch (err) {
                commit('fetchTreeDirectoryFail', err.response.data);
            }
        },
        async getContentDirectory({ commit }, activeDir) {
            try {
                commit('fetchContentDirectorySuccess', null);
                const { data } = await axios.post(
                    `filemanager/getContentDirectory`,
                    {
                        activeDir,
                    }
                );
                console.log('getContentDirectory', data);
                commit('fetchContentDirectoryFail', {});
                commit('fetchContentDirectorySuccess', data.contentDir);
            } catch (err) {
                console.dir(err.response.data);
                commit('fetchContentDirectoryFail', err.response.data);
            }
        },
        async createDirectory({ commit }, payload) {
            try {
                const { data } = await axios.post(
                    `filemanager/createDirectory`,
                    payload
                );
                commit('fetchCreateDirectoryFail', {});
                commit('fetchCreateDirectoryFail', {});
            } catch (err) {
                commit('fetchCreateDirectoryFail', err.response.data);
            }
        },
        async delete({ commit }, selectItems) {
            try {
                const { data } = await axios.post(`filemanager/delete`, {
                    items: selectItems,
                });
                commit('fetchContentDirectoryFail', {});
                commit('setSelectItems', []);
            } catch (err) {
                commit('fetchContentDirectoryFail', err.response.data);
            }
        },
        async rename({ commit }, payload) {
            try {
                const { data } = await axios.post(
                    `filemanager/rename`,
                    payload
                );
                console.log('getContentDirectory', data);
                commit('fetchRenameFail', {});
            } catch (err) {
                commit('fetchRenameFail', err.response.data);
            }
        },
        async uploadFiles({ commit }, payload) {
            try {
                const { data } = await axios.post(
                    `filemanager/uploadFiles`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        onUploadProgress: uploadEvent => {
                            console.log(
                                'Upload progress: ' +
                                    Math.round(
                                        (uploadEvent.loaded /
                                            uploadEvent.total) *
                                            100
                                    ) +
                                    '%'
                            );
                        },
                    }
                );
                commit('uploadFilesFail', {});
            } catch (err) {
                commit('uploadFilesFail', err.response.data);
            }
        },
    },
    mutations: {
        fetchTreeDirectorySuccess(state, tree) {
            state.tree = tree;
        },
        fetchContentDirectorySuccess(state, content) {
            state.contentDir = content;
        },
        setSelectItems(state, selectItems) {
            state.selectItems = selectItems;
        },

        fetchTreeDirectoryFail(state, err) {
            state.treeError = err;
        },
        fetchContentDirectoryFail(state, err) {
            state.contentDirError = err;
        },
        fetchCreateDirectoryFail(state, err) {
            state.createDirError = err;
        },
        fetchRenameFail(state, err) {
            state.renameError = err;
        },
    },
    getters: {
        tree: state => state.tree,
        contentDir: state => state.contentDir,
        selectItems: state => state.selectItems,

        treeError: state => state.treeError,
        contentDirError: state => state.contentDirError,
        createDirError: state => state.createDirError,
        renameError: state => state.renameError,
    },
};
