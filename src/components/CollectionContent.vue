<template>
    <div id="col-content">
        <ItemName />
        <ItemDef />
        <URL />
        <MetaData />
        <ColEntities />
    </div>
</template>

<script setup lang="ts">
import ItemName from "@/components/sub-collection/1-name.vue";
import ItemDef from "@/components/sub-collection/2-def.vue";
import URL from "@/components/sub-collection/3-url.vue";
import MetaData from "@/components/sub-collection/4-meta.vue";
import ColEntities from "@/components/sub-collection/5-entities.vue";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#col-content {
    overflow-y: scroll;
}
</style>
