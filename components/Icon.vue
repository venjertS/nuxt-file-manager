<template>
    <svg class="iconSvg" :width="width + 'px'" :height="height + 'px'">
        <use :xlink:href="icon_file_path + '#' + icon_name" />
    </svg>
</template>

<script>
export default {
    name: 'Icon',
    data() {
        return {
            icon_file_path: '',
        };
    },
    props: {
        icon_name: {
            type: String,
            required: true,
        },
        icon_file: {
            type: String,
        },
        width: {
            type: [Number, String],
            default: 11,
        },
        height: {
            type: [Number, String],
            default: 11,
        },
        color: {
            type: [String],
        },
    },
    created() {
        this.getIcoFile();
    },
    methods: {
        async getIcoFile() {
            const icoSvgSprite = await import(
                `@/assets/${
                    !this.icon_file ? 'icoSvgSprite' : this.icon_file
                }.svg`
            );
            this.icon_file_path = icoSvgSprite.default;
        },
    },
};
</script>
