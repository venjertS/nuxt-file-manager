import axios from '@/services/request.service';

export default {
    state: () => ({
        tree: [],

        treeError: null,
        contentDir: [],
        contentDirError: {},
        createDirError: {},
        renameError: {},
        selectItems: [],
    }),
    actions: {
        async getTreeDirectory({ commit }) {
            try {
                const { data } = await axios.post(
                    `filemanager/getTreeDirectory`,
                    {}
                );
                console.log('getTreeDirectory', data.treeDir);
                commit('fetchTreeDirectorySuccess', data.treeDir);
            } catch (err) {
                commit('fetchTreeDirectoryFail', {
                    errType: `fetchTreeDirectoryFail fetch failed`,
                    err,
                });
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
                console.log('CreateDirectory', data);
            } catch (err) {
                console.dir(err.response.data);
                commit('fetchCreateDirectoryFail', err.response.data);
            }
        },
        async delete({ commit }, selectItems) {
            console.log('selectItems', {
                items: selectItems,
            });
            try {
                const { data } = await axios.post(`filemanager/delete`, {
                    items: selectItems,
                });
                console.log('getContentDirectory', data);
                commit('setSelectItems', []);
            } catch (err) {
                commit('fetchContentDirectoryFail', {
                    errType: `fetchContentDirectoryFail fetch failed`,
                    err,
                });
            }
        },
        async rename({ commit }, payload) {
            try {
                const { data } = await axios.post(
                    `filemanager/rename`,
                    payload
                );
                console.log('getContentDirectory', data);
            } catch (err) {
                commit('fetchRenameFail', {
                    errType: `fetchRenameFail fetch failed`,
                    err,
                });
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
                console.log('getContentDirectory', data);
            } catch (err) {
                commit('uploadFilesFail', {
                    errType: `uploadFilesFail fetch failed`,
                    err,
                });
            }
        },
    },
    mutations: {
        fetchTreeDirectorySuccess(state, tree) {
            state.tree = tree;
        },
        fetchTreeDirectoryFail(state, err) {
            state.treeError = err;
        },
        fetchContentDirectorySuccess(state, content) {
            state.contentDir = content;
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
        setSelectItems(state, selectItems) {
            console.log('selectItems', selectItems);
            state.selectItems = selectItems;
        },
    },
    getters: {
        tree: state => state.tree,
        treeError: state => state.treeError,
        contentDir: state => state.contentDir,
        contentDirError: state => state.contentDirError,
        createDirError: state => state.createDirError,
        renameError: state => state.renameError,
        selectItems: state => state.selectItems,
    },
};
