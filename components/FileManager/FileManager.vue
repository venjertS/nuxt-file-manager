<template>
    <div class="filemanager">
        <div class="filemanager-wrp">
            <tree-dir
                :activeDir="activeDir"
                :treeDir="treeDir"
                @onChangeActiveDir="onChangeActiveDir"
            />
            <div class="filemanager-content-wrp">
                <file-manager-bar
                    :activeDir="activeDir"
                    @onChangeActiveDir="onChangeActiveDir"
                    @onOpenPopupCreateNewDir="onOpenPopupCreateNewDir"
                    @onUploadFiles="onUploadFiles"
                    @onUpdateFileManager="onUpdateFileManager"
                />
                <div class="filemanager-search">
                    <input
                        type="text"
                        class="form-control w-100"
                        placeholder="Поиск..."
                        v-model="searchQuery"
                    />
                </div>
                <div
                    class="filemanager-action"
                    v-if="contentDirItems && contentDirItems.length > 0"
                >
                    <div>
                        <button
                            class="btn btn-primary"
                            @click="onOpenPopupRename"
                            v-if="selectItems.length === 1"
                        >
                            Переименовать
                        </button>
                        <button
                            v-if="selectItems.length > 0"
                            class="btn btn-danger"
                            @click="onDeleteSelectedItems"
                        >
                            Удалить ({{ selectItems.length }})
                        </button>
                    </div>
                    <div>
                        <button
                            class="btn btn-primary"
                            @click="onSelectedAllItems"
                        >
                            Выделить все
                        </button>
                        <button
                            v-if="selectItems.length > 0"
                            class="btn btn-primary"
                            @click="setSelectItems([])"
                        >
                            Снять выделение ({{ selectItems.length }})
                        </button>
                    </div>
                </div>
                {{ treeError }}
                <content-dir
                    :activeDir="activeDir"
                    :contentDir="contentDirItems"
                    @onClickDir="onClickDir"
                    @onClickFile="onClickFile"
                />
                <file-manager-info
                    v-if="contentDirItems && contentDirItems.length > 0"
                    :contentDir="contentDirItems"
                    :selectItems="selectItems"
                />
            </div>
        </div>

        <div class="filemanager-popup" v-if="popupCreateDir">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>Новая папка</h3>
                    <button
                        class="popup-close btn btn-link"
                        @click="popupCreateDir = false"
                    >
                        Закрыть
                    </button>
                </div>
                <div class="popup-body">
                    <input
                        ref="newDirName"
                        type="text"
                        class="form-control w-100"
                        placeholder="Введите название папки"
                        value="Новая папка"
                        @keyup.enter="onCreateNewDir"
                    />
                </div>

                <div class="popup-footer">
                    <button
                        class="btn btn-primary w-100"
                        @click="onCreateNewDir"
                    >
                        Создать папку
                    </button>
                </div>
            </div>
        </div>
        <div class="filemanager-popup" v-if="popupRename">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>Переименование</h3>
                    <button
                        class="popup-close btn btn-link"
                        @click="popupRename = false"
                    >
                        Закрыть
                    </button>
                </div>
                <div class="popup-body">
                    <input
                        ref="newName"
                        type="text"
                        class="form-control w-100"
                        placeholder="Введите новое имя"
                        @keyup.enter="onRename"
                    />
                </div>
                <div class="popup-footer">
                    <button class="btn btn-primary w-100" @click="onRename">
                        Переименовать
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'FileManager',
    components: {
        treeDir: () => import('@/components/FileManager/TreeDirectory'),
        contentDir: () => import('@/components/FileManager/ContentDirectory'),
        fileManagerBar: () => import('@/components/FileManager/FileManagerBar'),
        fileManagerInfo: () =>
            import('@/components/FileManager/FileManagerInfo'),
    },
    data() {
        return {
            activeDir: '',
            searchQuery: '',
            popupCreateDir: false,
            popupRename: false,
        };
    },
    computed: {
        ...mapGetters({
            treeDir: 'filemanager/tree',
            treeError: 'filemanager/treeError',
            contentDir: 'filemanager/contentDir',
            contentDirError: 'filemanager/contentDirError',
            createDirError: 'filemanager/createDirError',
            selectItems: 'filemanager/selectItems',
        }),
        contentDirItems() {
            if (this.contentDir) {
                return this.contentDir.filter((item) => {
                    if (
                        this.searchQuery &&
                        !item.name
                            .toLowerCase()
                            .includes(this.searchQuery.toLowerCase())
                    ) {
                        return null;
                    }

                    const fullPath = this.activeDir
                        ? this.activeDir + '\\' + item.name
                        : item.name;

                    item.selected =
                        this.selectItems.filter((item) => item === fullPath)
                            .length > 0
                            ? true
                            : false;
                    return item;
                });
            }
            return null;
        },
    },
    watch: {
        async activeDir(newActiveDir, oldActiveDir) {
            await this.getContentDirectory(newActiveDir);
            if (this.contentDirError.statusCode > 200) {
                alert(this.contentDirError.message);
                this.activeDir = oldActiveDir;
            }
            localStorage.setItem('activeDir', this.activeDir);
            this.setSelectItems([]);
        },
        contentDir() {
            this.setSelectItems([]);
        },
    },
    mounted() {
        this.activeDir = localStorage.getItem('activeDir') || '';
        this.getTreeDirectory();
        this.getContentDirectory(this.activeDir);
    },
    methods: {
        ...mapMutations({
            setSelectItems: 'filemanager/setSelectItems',
        }),
        ...mapActions({
            getTreeDirectory: 'filemanager/getTreeDirectory',
            getContentDirectory: 'filemanager/getContentDirectory',

            createDirectory: 'filemanager/createDirectory',
            uploadFiles: 'filemanager/uploadFiles',
            deleteSelectedItems: 'filemanager/delete',
            rename: 'filemanager/rename',
        }),
        onClickDir(item) {
            const fullPath = this.activeDir
                ? this.activeDir + '\\' + item.name
                : item.name;
            this.activeDir = fullPath;
        },
        onClickFile(item) {
            console.log('onClickFile', item);
        },
        onChangeActiveDir(newActiveDir) {
            this.activeDir = newActiveDir;
        },

        onUpdateFileManager() {
            this.getTreeDirectory();
            this.getContentDirectory(this.activeDir);
        },

        async onUploadFiles(selectedFiles) {
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('activeDir', this.activeDir);
                selectedFiles.forEach((item) => {
                    formData.append(`files`, item, item.name);
                });

                await this.uploadFiles(formData);
                this.getTreeDirectory();
                this.getContentDirectory(this.activeDir);
            }
        },

        onSelectedAllItems() {
            const allItemsActiveDir = [];
            this.contentDirItems.forEach((item) => {
                allItemsActiveDir.push(
                    this.activeDir
                        ? this.activeDir + '\\' + item.name
                        : item.name
                );
            });
            this.setSelectItems(allItemsActiveDir);
        },
        async onDeleteSelectedItems() {
            if (
                window.confirm(
                    `Вы действительно желаете удалить ${this.selectItems.length} элементов`
                )
            ) {
                await this.deleteSelectedItems(this.selectItems);
                this.getTreeDirectory();
                this.getContentDirectory(this.activeDir);
            }
        },

        onOpenPopupRename() {
            this.popupRename = true;
            const itemNname = this.selectItems[0].split('\\').pop();
            setTimeout(() => {
                this.$refs.newName.value = itemNname;
                this.$refs.newName.focus();

                if (navigator.userAgent.indexOf('MSIE') > 0) {
                    if (document.selection.createRange()) {
                        moveStart('character', 0);
                        moveEnd('character', itemNname.lastIndexOf('.'));
                        select();
                    }
                } else {
                    this.$refs.newName.setSelectionRange(
                        0,
                        itemNname.lastIndexOf('.')
                    );
                }
            });
        },
        async onRename() {
            if (this.$refs.newName.value === '') {
                window.alert('Укажите название');
                return false;
            }
            const nameFormat = new RegExp(
                /^[a-zA-Zа-яА-Я0-9-_\.'][a-zA-Zа-яА-Я0-9-_\.' ]+[a-zA-Zа-яА-Я0-9-_\.']?$/u
            );
            if (!nameFormat.test(this.$refs.newName.value.trim())) {
                window.alert('Неверное название');
                return false;
            }
            await this.rename({
                oldPath: this.selectItems[0],
                newPath: this.activeDir
                    ? this.activeDir + '\\' + this.$refs.newName.value
                    : this.$refs.newName.value,
            });
            this.popupRename = false;
            this.$refs.newName.value = '';
            this.getTreeDirectory();
            this.getContentDirectory(this.activeDir);
        },

        onOpenPopupCreateNewDir() {
            this.popupCreateDir = true;
            setTimeout(() => {
                this.$refs.newDirName.select();
            });
        },
        async onCreateNewDir() {
            if (this.$refs.newDirName.value === '') {
                window.alert('Укажите название категории');
                return false;
            }
            const nameFormat = new RegExp(
                /^[0-9a-zA-Zа-яА-Я-_\.'][0-9a-zA-Zа-яА-Я-_\.' ]+[0-9a-zA-Zа-яА-Я-_\.']?$/u
            );
            console.log(nameFormat.test(this.$refs.newDirName.value));
            if (!nameFormat.test(this.$refs.newDirName.value.trim())) {
                window.alert('Неверное название категории');
                return false;
            }
            await this.createDirectory({
                activeDir: this.activeDir,
                newDirName: this.$refs.newDirName.value,
            });
            if (this.createDirError.statusCode > 200) {
                alert(this.createDirError.message);
                return false;
            }
            this.popupCreateDir = false;
            this.$refs.newDirName.value = '';
            this.getTreeDirectory();
            this.getContentDirectory(this.activeDir);
        },
    },
};
</script>
<style lang="scss">
@import '@/assets/css/color.scss';
.filemanager {
    display: flex;
    height: 100%;
    .filemanager-search {
        margin-bottom: 10px;
    }
    .filemanager-action {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .filemanager-wrp {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 30px;
        flex-grow: 1;

        .filemanager-content-wrp {
            display: flex;
            flex-direction: column;
            max-width: 100%;
            overflow: hidden;
        }
    }

    .filemanager-popup {
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        .popup-content {
            background: $wrp-background;
            border-radius: 10px;
            min-width: 360px;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: 10px 0px;
            .popup-close {
                position: absolute;
                top: 0px;
                right: 0px;
            }
            .popup-header {
                padding: 15px 30px;
                h3 {
                    margin: 0px;
                }
            }
            .popup-body {
                padding: 15px 30px;
            }
            .popup-footer {
                padding: 15px 30px;
            }
        }
    }

    .btn {
        border: none;
        border-radius: 4px;
        background: transparent;
        padding: 10px 10px;
        color: $main-color;
        fill: $main-color;
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        text-align: center;
        &[disabled='disabled'] {
            opacity: 0.3;
        }
    }
    .btn-primary {
        background: $main-background;
    }
    .btn-danger {
        background: $main-background;
    }

    .form-control {
        border: none;
        border-radius: 4px;
        padding: 10px;
        color: $main-color;
        background: $main-background;

        &:focus {
            outline: none;
        }
    }
    .w-100 {
        width: 100%;
    }
}
</style>
