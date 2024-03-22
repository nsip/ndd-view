<template>
    <div id="ent-content">
        <ItemName />
        <OtherNames />
        <ItemDef />
        <ItemSIF />
        <OtherStds />
        <LegalDefs />
        <ItemSensi />
        <ItemCols />
        <MetaData />
    </div>
</template>

<script setup lang="ts">
import ItemName from "@/components/sub-entity/1-name.vue";
import OtherNames from "@/components/sub-entity/2-other-names.vue";
import ItemDef from "@/components/sub-entity/3-def.vue";
import ItemSIF from "@/components/sub-entity/4-sif.vue";
import OtherStds from "@/components/sub-entity/5-other-stds.vue";
import LegalDefs from "@/components/sub-entity/6-legal-def.vue";
import ItemSensi from "@/components/sub-entity/7-sensitivity.vue";
import ItemCols from "@/components/sub-entity/8-collections.vue";
import MetaData from "@/components/sub-entity/9-meta.vue";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ent-content {
    overflow-y: scroll;
    scrollbar-width: none;
}
</style>
