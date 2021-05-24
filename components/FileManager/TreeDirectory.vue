<template>
    <div class="tree-directory">
        <div class="tree-directory__scroll">
            <TreeDirectoryItem
                v-for="item in treeDir"
                :key="item.name"
                :level="item.name"
                :name="item.name"
                :childs="item.childs"
                :options="item.options"
                :activeDir="activeDir"
                @onChangeActiveDir="onChangeActiveDir"
            />
        </div>
    </div>
</template>
<script>

export default {
    name: 'TreeDirectory',
    components: {
        TreeDirectoryItem: () =>
            import('@/components/FileManager/TreeDirectoryItem'),
    },
    props: {
        activeDir: String,
        treeDir: Array,
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
.tree-directory {
    width: 300px;
    z-index: 0;

    padding: 15px 20px;
    background: $main-background;
    border-radius: 10px;
    box-shadow: 0px 5px 20px -5px rgba(0, 0, 0, 0.1);
    &__scroll {
        padding-left: 10px;
        overflow: auto;
        min-height: 100%;

        &::-webkit-scrollbar {
            height: 12px;
            width: 12px;
            background-color: $wrp-background;
        }
        &::-webkit-scrollbar-thumb {
            background-color: $main-background;
            border: 3px solid $wrp-background;
        }
    }
}
</style>
