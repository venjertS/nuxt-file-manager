<template>
    <div
        class="content-directory"
        :class="{ 'content-directory_sel-box-view': selectItems.length > 0 }"
    >
        <template v-if="contentDir">
            <div
                v-for="item in contentDir"
                :key="item.name"
                class="item"
                :class="{ item_select: item.selected }"
                @click="onClickItem(item)"
            >
                <div class="item__image">
                    <Icon
                        v-if="item.type === 'directory'"
                        :icon_file="'fileManager'"
                        :icon_name="'folder-white-shape'"
                        width="40"
                        height="40"
                    />
                    <Icon
                        v-else-if="
                            item.type === 'file' &&
                            !previewImgStatus &&
                            svgFileType.includes(item.ext.replace('.', ''))
                        "
                        :icon_file="'icoFileType'"
                        :icon_name="item.ext.replace('.', '')"
                        width="40"
                        height="40"
                    />
                    <img
                        v-else-if="
                            item.type === 'file' &&
                            allowImgExt.includes(
                                item.ext.replace('.', '').toLowerCase()
                            )
                        "
                        :src="item.pictures.small"
                        :alt="item.name"
                    />

                    <input
                        v-if="selectItemsStatus"
                        @click.stop="onSetSelectedItem(item)"
                        type="checkbox"
                        name="selectItems"
                        :checked="item.selected"
                    />
                </div>
                <div class="item__name">{{ item.name }}</div>
                <div class="item__filesize" v-if="item.type === 'file'">
                    {{ getReadableFileSizeString(item.size) }}
                </div>
                <div
                    class="item__dimensions"
                    v-if="
                        item.type === 'file' &&
                        allowImgExt.includes(
                            item.ext.replace('.', '').toLowerCase()
                        )
                    "
                >
                    {{ item.dimensions.width }}px x
                    {{ item.dimensions.height }}px
                </div>
            </div>
        </template>
        <template v-else> Loading... </template>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { svgFileType, allowImgExt } from '@/components/FileManager/setup';

export default {
    name: 'TreeDirectory',
    components: {
        Icon: () => import('@/components/Icon'),
    },
    props: {
        activeDir: {
            type: String,
            default: '',
        },
        contentDir: {
            type: Array || null,
            default: () => [],
        },
        selectItemsStatus: {
            type: Boolean,
            default: true,
        },
        previewImgStatus: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return { allowImgExt, svgFileType };
    },
    computed: {
        ...mapGetters({
            selectItems: 'filemanager/selectItems',
        }),
    },
    methods: {
        ...mapMutations({
            setSelectItems: 'filemanager/setSelectItems',
        }),
        onSetSelectedItem(item) {
            const fullPath = this.activeDir
                ? this.activeDir + '\\' + item.name
                : item.name;

            if (!this.selectItems.includes(fullPath)) {
                this.setSelectItems([...this.selectItems, fullPath]);
            } else {
                this.setSelectItems(
                    this.selectItems.filter((i) => i !== fullPath)
                );
            }
        },
        onClickItem(item) {
            if (this.selectItems.length > 0) {
                this.onSetSelectedItem(item);
                return;
            }

            if (item.type === 'directory') {
                this.$emit('onClickDir', item);
            } else if (item.type === 'file') {
                this.$emit('onClickFile', item);
            }
        },
        getReadableFileSizeString(fileSizeInBytes) {
            let i = -1;
            const byteUnits = [
                ' kB',
                ' MB',
                ' GB',
                ' TB',
                'PB',
                'EB',
                'ZB',
                'YB',
            ];
            do {
                fileSizeInBytes = fileSizeInBytes / 1024;
                i++;
            } while (fileSizeInBytes > 1024);

            return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
        },
    },
};
</script>
<style lang="scss">
@import '@/assets/css/color.scss';
.content-directory {
    display: grid;
    margin-bottom: auto;
    grid-template-columns:
        minmax(170px, 1fr) minmax(170px, 1fr)
        minmax(170px, 1fr);
    gap: 20px;
    &.content-directory_sel-box-view {
        .item {
            cursor: pointer;
            &__image {
                input[type='checkbox'] {
                    display: block;
                }
            }
        }
    }
    .item {
        background: #565663;
        padding: 10px;
        cursor: pointer;
        border-radius: 10px;
        &_select {
            background: $select-background;
        }
        &:hover {
            background: $select-background;
            .item__image {
                input[type='checkbox'] {
                    display: block;
                }
            }
        }
        &__image {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            height: 170px;
            line-height: 0;
            position: relative;

            img {
                max-width: 100%;
                max-height: 100%;
            }
            svg {
                fill: #ccc;
            }
            input[type='checkbox'] {
                display: none;
                position: absolute;
                top: 0px;
                left: 0px;
            }
        }
        &__name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &__filesize {
            color: #bbb;
        }
    }
}
</style>
