<template>
    <div @click="$refs.fileInput.click()">
        <input
            style="display: none"
            type="file"
            @change="onFileSelected"
            ref="fileInput"
            :multiple="options.multiple"
            :accept="options.accept.join(',')"
        />
        <slot @click="$refs.fileInput.click()" />
    </div>
</template>

<script>
export default {
    name: 'addFile',
    emits: ['onUploadFiles'],
    props: {
        options: {
            type: Object,
            default: () => {
                return {
                    multiple: true,
                    accept: ['.jpeg', '.jpg', '.png', '.*'],
                };
            },
        },
    },

    methods: {
        onFileSelected(e) {
            const selectedFiles = Array.from(e.target.files);
            this.$emit('onUploadFiles', selectedFiles);
            this.$refs.fileInput.value = '';
        },
    },
};
</script>
