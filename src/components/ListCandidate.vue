<template>
    <h4 v-if="lsEnt4Submit.length > 0" class="title-entity">Entity:</h4>
    <ul v-if="lsEnt4Submit.length > 0" class="list-entity">
        <li v-for="(item, idx) in lsEnt4Submit" :key="idx" :title="item" class="ellip" :class="selItem == item ? sel_style : unsel_style" @click="itemClick(item, 'inbound')">
            {{ item }}
        </li>
    </ul>
    <h4 v-if="lsCol4Submit.length > 0" class="title-collection">Collection:</h4>
    <ul v-if="lsCol4Submit.length > 0" class="list-collection">
        <li v-for="(item, idx) in lsCol4Submit" :key="idx" :title="item" class="ellip" :class="selItem == item ? sel_style : unsel_style" @click="itemClick(item, 'inbound')">
            {{ item }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { selItem, lsEnt4Submit, lsCol4Submit, Refresh, LoadList4Sub, globalMsg, SetSelItem } from "@/share/share";

const sel_style = ref("selected-style");
const unsel_style = ref("unselected-style");

onMounted(async () => {
    await LoadList4Sub('entity')
    await LoadList4Sub('collection')

    globalMsg.value = `Dictionary has ${lsEnt4Submit.value.length} pending entity items, ${lsCol4Submit.value.length} pending collection items`
});

const itemClick = async (item: string, phase: string) => {
    await SetSelItem(item, phase)
    await Refresh(phase)
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-entity,
.title-collection {
    float: left;
    margin-left: 5%;
    margin-top: 4%;
    font-style: italic;
}

ul.list-entity::-webkit-scrollbar,
ul.list-collection::-webkit-scrollbar {
    display: none;
}

ul.list-entity,
ul.list-collection {
    /* background-color: rgb(240, 240, 100); */
    width: 82%;
    max-height: 90%;
    margin-left: 2%;
    margin-top: -3%;
    /* display: inline-block; */
    overflow: scroll;
    /* scrollbar-width: none; */
    font-size: 14px;
    font-weight: normal;
    font-family: Trebuchet MS, sans-serif;
    list-style: none;
    float: left;
    border-style: solid;
    border-width: thin;
    /* border-color: rgb(230, 230, 230); */
}

ul.list-entity li.ellip,
ul.list-collection li.ellip {
    /* background-color: rgb(230, 230, 230); */
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: -5%;
    padding-top: 0.5%;
}

/* ******************************************* */

.selected-style {
    font-weight: bold;
}

.selected-style:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.unselected-style {
    color: black;
}

.unselected-style:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>
