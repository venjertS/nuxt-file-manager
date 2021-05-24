<template>
    <file-manager />
</template>
<script>

export default {
    name: 'FileManagerPage',
    layout: 'filemanager',
    components: {
        FileManager: () => import('@/components/FileManager/FileManager'),
    },
};
</script>
<style lang="scss"></style>
