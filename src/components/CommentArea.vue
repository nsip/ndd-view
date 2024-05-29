<template>
    <div>
        <div class="cmt-area" :hidden="selItem == ''">
            <section id="isso-thread" :data-title="dataIssoTitle" :data-isso-id="dataIssoId"></section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataIssoTitle, dataIssoId, UpdateIssoLoading, selItem } from "@/share/share"

onBeforeMount(() => {
    UpdateIssoLoading()
})

</script>

<style scoped>
.cmt-area {
    width: auto;
    margin-top: 20px;
}
</style>