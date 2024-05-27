<template>
    <div>
        <div class="cmt-area">
            <section id="isso-thread" :data-title="dataIssoTitle" :data-isso-id="dataIssoId"></section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataIssoTitle, dataIssoId } from "@/share/share"
</script>

<style scoped>
.cmt-area {
    width: auto;
    margin-top: 20px;
}
</style>