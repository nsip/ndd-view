<template>
    <div v-if="isNotEmpty(selEntity.Definition)">
        <div class="area">
            <span class="category">Definition:</span>
            <span class="content" v-html="selEntity.Definition"></span>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
import { selEntity } from "@/share/share";
import { isNotEmpty } from "@/share/util";
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
</style>
