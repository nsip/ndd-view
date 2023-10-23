<template>
    <div v-if="isNotEmpty(selEntity.OtherStandards)">
        <div class="area">
            <span class="category">Other Standards:</span>
            <span class="content-flex">
                <div v-for="(item, idx) in selEntity.OtherStandards" :key="idx">
                    <hr v-if="idx != selEntity.OtherStandards.length && idx != 0" class="sub-sep-line" />

                    <div v-if="isNotEmpty(item.Standard)" class="cat-val-flex">
                        <span class="sub-cat">Standard:</span>
                        <span class="sub-val">{{ item.Standard }}</span>
                    </div>

                    <div v-if="isNotEmpty(item.Link)" class="cat-val-flex">
                        <span class="sub-cat">Link:</span>
                        <div class="sub-val">
                            <div v-for="(subitem, i) in item.Link" :key="i">
                                <span>{{ subitem }}</span>
                                <br />
                            </div>
                        </div>
                    </div>

                    <div v-if="isNotEmpty(item.Path)" class="cat-val-flex">
                        <span class="sub-cat">Path:</span>
                        <div class="sub-val">
                            <div v-for="(subitem, i) in item.Path" :key="i">
                                <span>{{ subitem }}</span>
                                <br />
                            </div>
                        </div>
                    </div>

                    <div v-if="isNotEmpty(item.Definition)" class="cat-val-flex">
                        <span class="sub-cat">Definition:</span>
                        <span class="sub-val" v-html="item.Definition"></span>
                    </div>

                    <div v-if="isNotEmpty(item.Commentary)" class="cat-val-flex">
                        <span class="sub-cat">Commentary:</span>
                        <span class="sub-val" v-html="item.Commentary"></span>
                    </div>
                </div>
            </span>
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
    width: 20%;
    font-size: 18px;
    font-weight: bold;
    margin-left: 2%;
    font-family: Arial Narrow, sans-serif;
}

.content-flex {
    /* background-color: rgb(255, 255, 255); */
    margin-top: 2.5%;
    margin-left: -15%;
    width: 100%;
    font-weight: normal;
    display: flex;
    flex-direction: column;
}

.cat-val-flex {
    display: flex;
    flex-direction: row;
    margin-bottom: 1%;
}

.sub-cat {
    text-align: left;
    font-weight: bold;
    font-size: 16px;
    width: 25%;
    /* background-color: rgb(172, 180, 178); */
    cursor: default;
    font-family: Arial Narrow, sans-serif;
}

.sub-val {
    /* background-color: rgb(0, 230, 220); */
    text-align: left;
    color: black;
    width: 100%;
    margin-left: -90px;
    font-size: 15px;
}

.sub-sep-line {
    color: darkgray;
}
</style>
