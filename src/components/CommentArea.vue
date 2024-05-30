<template>
    <div>
        <div class="cmt-area" :hidden="selEntity.Entity.length == 0 && selCollection.Entity.length == 0">
            <section id="isso-thread" :data-title="dataIssoTitle" :data-isso-id="dataIssoId"></section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataIssoTitle, dataIssoId, UpdateIssoLoading, selEntity, selCollection } from "@/share/share"

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