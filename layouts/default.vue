<template>
    <div class="app-wrp">

        <div class="content-wrp">

            <Nuxt />
        </div>
    </div>
</template>

<script>
export default {

};
</script>

<style lang="scss">
.app-wrp {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .content-wrp {
        display: flex;
        flex-grow: 1;
        max-width: 100vw;
        overflow-x: hidden;
        .content {
            padding: 15px 30px;
            width: calc(100vw - 300px);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
