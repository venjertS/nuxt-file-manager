<template>
    <div class="tree-item">
        <div
            class="tree-item__icon"
            ref="toogleTreeitem"
            @click="options.open = !options.open"
        >
            <Icon
                icon_name="plus-black-symbol"
                width="7"
                height="36"
                v-if="childs.length > 0 && options.open === false"
            />
            <Icon
                icon_name="line"
                width="7"
                height="36"
                v-if="childs.length > 0 && options.open === true"
            />
        </div>
        <div class="tree-item__wrp">
            <div
                class="tree-item__info"
                :class="{ selected: selected }"
                @click="$emit('onChangeActiveDir', level)"
            >
                <Icon
                    :icon_file="'fileManager'"
                    :icon_name="ico"
                    width="12"
                    height="36"
                />
                <div class="tree-item__name">{{ name }}</div>
            </div>
            <div
                class="tree-item__childs"
                v-if="childs.length > 0 && options.open === true"
            >
                <TreeDirectoryItem
                    v-for="item in childs"
                    :level="level + '\\' + item.name"
                    :key="item.name"
                    :name="item.name"
                    :childs="item.childs"
                    :options="item.options"
                    :activeDir="activeDir"
                    @onChangeActiveDir="onChangeActiveDir"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'TreeDirectoryItem',
    components: {
        TreeDirectoryItem: () =>
            import('@/components/FileManager/TreeDirectoryItem'),
        Icon: () => import('@/components/Icon'),
    },
    props: {
        level: String,
        name: String,
        childs: Array,
        ico: {
            type: String,
            default: 'folder-white-shape',
        },
        activeDir: String,
        options: {
            type: Object,
            default: () => ({
                open: false,
            }),
        },
    },
    mounted() {
        if (this.activeDir.indexOf(this.level) === 0) {
            this.options.open = true;
        }
    },
    updated() {
        if (this.activeDir.indexOf(this.level) === 0) {
            this.options.open = true;
        }
    },
    computed: {
        selected() {
            return this.activeDir.replace(/\\$/, '') ===
                this.level.replace(/\\$/, '')
                ? true
                : false;
        },
    },
    methods: {
        onChangeActiveDir(newActiveDir) {
            this.$emit('onChangeActiveDir', newActiveDir);
        },
    },
};
</script>
<style lang="scss">
@import '@/assets/css/color.scss';
.tree-item {
    position: relative;
    display: flex;
    width: 100%;

    &__icon {
        width: 7px;
        margin-right: 9px;
        svg {
            fill: $main-color;
            margin-right: 5px;
            cursor: pointer;
            &:hover {
                fill: $main-color;
            }
        }
    }
    &__wrp {
        flex-grow: 1;
    }
    &__info {
        position: relative;
        height: 36px;
        display: flex;
        align-items: center;
        padding: 0px 25px 0px 0px;
        cursor: pointer;
        width: 100%;
        text-align: left;
        &:hover {
            &:before {
                content: '';
                position: absolute;
                top: 5px;
                left: -25px;
                right: 0px;
                bottom: 5px;
                border-radius: 3px;
                background: $wrp-background;
                z-index: -1;
            }
        }
        &.selected {
            &:before {
                content: '';
                position: absolute;
                top: 5px;
                left: -25px;
                right: 0px;
                bottom: 5px;
                border-radius: 3px;
                background: $select-background;
                z-index: -1;
            }
        }
        svg {
            fill: $main-color;
            margin-right: 5px;
            z-index: 1;
        }
    }
    &__name {
        position: relative;
        top: -1px;
    }

    &__childs {
        padding-left: 0px;
        position: relative;
        &:before {
            content: '';
            display: block;
            position: absolute;
            top: 0px;
            left: -13px;
            height: 100%;
            width: 1px;
            border-left: 1px #ddd dashed;
        }
    }
}
</style>
