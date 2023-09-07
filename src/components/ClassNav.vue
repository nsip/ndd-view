<template>
    <div class="class">
        <span v-for="(item, idx) in selClsPath" :key="idx">
            <span class="ea" @click="Refresh(item, 'existing')"> {{ item }}</span>
            <span v-if="idx < selClsPath.length - 1"> / </span>
        </span>
        <span v-if="selChildren.length > 0"> / </span>
        <select v-if="selChildren.length > 0" ref="childSelect" @change="switchSelect($event)">
            <option value="-1" class="firstOpt">--- subclass ---</option>
            <option v-for="(item, idx) in selChildren" :key="idx">{{ item }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { selClsPath, selChildren, Refresh } from "@/share/share";

const childSelect = ref(null);

const switchSelect = (event: any) => {
    if (event.target.value != "-1") {
        Refresh(event.target.value, "existing");

        const select = childSelect.value as HTMLSelectElement | null;
        if (select != null) {
            select.selectedIndex = 0;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.class {
    margin-left: 1%;
    margin-top: 10px;
    margin-bottom: 1%;
    float: left;
    font-style: italic;
    font-size: smaller;
    color: rgb(120, 120, 120);
}

.ea:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.firstOpt {
    text-align: center;
}
</style>
