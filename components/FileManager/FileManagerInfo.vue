<template>
    <div class="filemanager-info" v-if="getCountFile || getCountDir">
        {{ getSizeSelected }} из {{ getSizeFiles }}
        <span v-if="getCountFile"> | файлов: {{getCountSelectedFile}} из {{ getCountFile }}</span>
        <span v-if="getCountDir"> | папок: {{getCountSelectedDir}} из {{ getCountDir }}</span>
    </div>
</template>
<script>
export default {
    name: "FileManagerInfo",
    props:{
        contentDir: Array,
        selectItems: Array
    },
    computed: {
        getCountDir() {
            return this.contentDir.filter(item => item.type === 'directory').length
        },
        getCountFile() {
            return this.contentDir.filter(item => item.type === 'file').length
        },
        getSizeFiles() {
            return this.getReadableFileSizeString(this.contentDir
                .reduce((total,item) => {               
                    if(item.type === 'file'){
                        return total + item.size;
                    }
                    return total
                }, 0))
        },
        getCountSelectedDir() {
            return this.contentDir.filter(item => {return item.type === "directory" && item.selected}).length
        },
        getCountSelectedFile() {
            return this.contentDir.filter(item => {return item.type === "file" && item.selected}).length
        },
        getSizeSelected() {return this.getReadableFileSizeString(this.contentDir
                .reduce((total,item) => {   
                    if(item.type === 'file' && item.selected === true){                        
                        return total + item.size;
                    }
                    return total
                }, 0))   
        }     
    },
    methods:{
        getReadableFileSizeString(fileSizeInBytes) {
            let i = -1;
            const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
            do {
                fileSizeInBytes = fileSizeInBytes / 1024;
                i++;
            } while (fileSizeInBytes > 1024);

            return Math.max(fileSizeInBytes, 0).toFixed(1) + byteUnits[i];
        } 
    }
}
</script>
<style lang="scss">
.filemanager-info{    
    padding: 15px 20px;
    background: #565663;
    border-radius: 10px;
    margin-top: 20px;
}
</style>