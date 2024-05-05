<template>
    <div v-if="isNotEmpty(selCollection.Entities)">
        <div class="area">
            <span class="category">Entities:</span>
            <span class="content">
                <span v-for="(item, idx) in selCollection.Entities" :key="idx">
                    <span :class="ModeOnDictionary() ? 'clickable' : ''" @click="itemClick(item)">{{ item }}</span>
                    <br />
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { selCollection, SetSelItem, Refresh, SetSelCat, ModeOnDictionary } from "@/share/share";
import { isNotEmpty } from "@/share/util";

const itemClick = async (item: string) => {
    if (ModeOnDictionary()) {
        await SetSelItem(item, 'existing'); // jump to 'entity category' to display 'entity item'
        await Refresh('existing')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.area {
    padding: 15px 0px 15px 10px;
    font-size: 17px;
    font-family: Arial, Helvetica, sans-serif, monospace;
    background-color: rgb(230, 230, 230);
    display: flex;
    flex-direction: row;
}

.category {
    text-align: left;
    width: 25%;
    font-size: 18px;
    font-weight: bold;
    margin-left: 2%;
    font-family: Arial Narrow, sans-serif;
}

.content {
    color: black;
    margin: 0px 0px 0px -50px;
    width: 100%;
    font-weight: normal;
    text-align: left;
    font-size: 15px;
}

.clickable {
    color: blue;
}

.clickable:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>
