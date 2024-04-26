<template>
    <div v-if="isNotEmpty(selEntity)" class="class">
        <span v-for="(item, idx) in selClsPath" :key="idx">
            <span class="ea" :class="item == selItem ? 'selected' : ''" @click="itemClick(item, 'existing')"> {{ item }}</span>
            <span v-if="idx < selClsPath.length - 1"> / </span>
        </span>
        <span v-if="selChildren?.length > 0"> / </span>
        <select v-if="selChildren?.length > 0" ref="childSelect" @change="switchSelect($event)">
            <option value="-1" class="firstOpt">--- subclass ---</option>
            <option v-for="(item, idx) in selChildren" :key="idx">{{ item }}</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { selClsPath, selChildren, Refresh, selEntity, selItem, SetSelItem } from "@/share/share";
import { isNotEmpty } from "@/share/util";

const childSelect = ref(null);

const switchSelect = (event: any) => {
    if (event.target.value != "-1") {
        itemClick(event.target.value, "existing");

        const select = childSelect.value as HTMLSelectElement | null;
        if (select != null) {
            select.selectedIndex = 0;
        }
    }
};

const itemClick = async (item: string, phase: string) => {
    SetSelItem(item)
    await Refresh(phase)
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.class {
    max-height: 1.5vh;
    min-height: 1.5vh;
    margin-left: 1%;
    margin-top: 10px;
    margin-bottom: 1%;
    font-style: italic;
    font-size: normal;
    color: rgb(120, 120, 120);
    text-align: left;
}

.ea:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.selected {
    font-weight: bold;
    text-decoration: underline;
    color: black;
}

.firstOpt {
    text-align: center;
}
</style>
