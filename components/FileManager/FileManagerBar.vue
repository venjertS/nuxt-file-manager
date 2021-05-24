<template>
    <div class="filemanager-bar">
        <button class="btn btn-primary" @click="$emit('onUpdateFileManager')">
            <Icon
                :icon_file="'fileManager'"
                :icon_name="'refresh-page-option'"
                width="14"
                height="11"
            />
        </button>
        <button
            class="btn btn-primary"
            @click="onChangeActiveDir(prevPart)"
            :disabled="prevPart === null"
        >
            <Icon
                :icon_file="'fileManager'"
                :icon_name="'level-up'"
                width="14"
                height="11"
            />
        </button>
        <client-only>
            <div
                class="filemanager-adress"
                v-if="adressEdit === false"
                @click="onEditAdress"
                v-click-outside="onShutdownEditAdress"
            >
                <button
                    class="filemanager-adress__btn-part"
                    @click.stop="onChangeActiveDir('')"
                    :key="'btn-root'"
                >
                    Root
                </button>
                <template v-for="item in activeDirArray">
                    <span
                        class="filemanager-adress__sep-part"
                        :key="'sep-' + item.pathPart"
                        >\</span
                    >
                    <button
                        class="filemanager-adress__btn-part"
                        :key="'btn-' + item.pathPart"
                        @click.stop="onChangeActiveDir(item.pathPart)"
                    >
                        {{ item.namePart }}
                    </button>
                </template>
            </div>
            <div
                class="wrp_wide"
                v-else-if="adressEdit === true"
                v-click-outside="onShutdownEditAdress"
            >
                <input
                    type="text"
                    class="form-control w-100"
                    ref="activeDir"
                    :value="activeDir"
                    @keyup.enter="onChangeActiveDir($refs.activeDir.value)"
                />
            </div>
        </client-only>
        <button
            class="btn btn-primary"
            @click="$emit('onOpenPopupCreateNewDir')"
        >
            Новая папка
        </button>
        <upload-files :options="fileOptions" @onUploadFiles="onUploadFiles">
            <button class="btn btn-primary">Загрузить файл</button>
        </upload-files>
    </div>
</template>
<script>
export default {
    name: 'FileManagerBar',
    components: {
        uploadFiles: () => import('./UploadFiles'),
        Icon: () => import('@/components/Icon'),
    },
    props: {
        activeDir: {
            type: String,
        },
    },
    data() {
        return {
            adressEdit: false,
            prevPart: null,
            fileOptions: {
                multiple: true,
                accept: ['.jpeg', '.jpg', '.png'],
            },
        };
    },
    computed: {
        activeDirArray() {
            const partActiveDir = [];
            if (this.activeDir) {
                const activeDirArray = this.activeDir.split('\\');

                console.log('this.activeDir', this.activeDir);
                console.log('this.activeDir', this.activeDir.split('\\'));
                console.log('activeDirArray.length', activeDirArray.length);

                if (activeDirArray.length > 0) {
                    for (let i = 0; i < activeDirArray.length; i++) {
                        const prevPart = partActiveDir[i - 1]
                            ? partActiveDir[i - 1].pathPart + '\\'
                            : '';
                        partActiveDir.push({
                            namePart: activeDirArray[i],
                            pathPart: prevPart + activeDirArray[i],
                        });
                    }
                }
            }
            this.prevPart = partActiveDir[partActiveDir.length - 2]
                ? partActiveDir[partActiveDir.length - 2].pathPart
                : partActiveDir.length > 0
                ? ''
                : null;
            return partActiveDir;
        },
    },
    methods: {
        onShutdownEditAdress() {
            console.log('onClickOutside', this.adressEdit);
            this.adressEdit = false;
        },
        onEditAdress() {
            this.adressEdit = true;
            setTimeout(() => {
                this.$refs.activeDir.select();
            });
        },
        onOpenPopupCreateNewDir() {
            this.$emit('onOpenPopupCreateNewDir');
        },
        onUploadFiles(selectedFiles) {
            this.$emit('onUploadFiles', selectedFiles);
        },
        onChangeActiveDir(path) {
            this.adressEdit = false;
            this.$emit('onChangeActiveDir', path);
        },
    },
};
</script>
<style lang="scss">
@import '@/assets/css/color.scss';

.filemanager-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    .filemanager-adress {
        overflow: hidden;
        flex-grow: 1;
        border-radius: 4px;
        color: #eee;
        display: flex;
        background: #565663;
        align-items: center;
        justify-content: flex-end;
        &__sep-part {
            padding: 5px 4px;
            color: #ddd;
            display: inline-block;
        }

        &__btn-part {
            padding: 10px 10px;
            background: #565663;
            border: none;
            color: #eee;
            cursor: pointer;
            white-space: nowrap;
            &:last-child {
                margin-right: auto;
            }
            &:hover {
                background: #656574;
            }
        }
    }
    .wrp_wide {
        flex-grow: 1;
    }
}
</style>