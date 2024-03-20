<template>
    <div v-if="isNotEmpty(selEntity.Metadata)" class="area">
        <span class="category">Metadata:</span>
        <span class="content-flex">
            <div v-for="(item, idx) in [selEntity.Metadata]" :key="idx">

                <div v-if="isNotEmpty(item.Identifier)" class="cat-val-flex">
                    <span class="sub-cat">Identifier:</span>
                    <span class="sub-val">{{ item.Identifier }}</span>
                </div>

                <div v-if="isNotEmpty(item.Type)" class="cat-val-flex">
                    <span class="sub-cat">Type:</span>
                    <span class="sub-val">{{ item.Type }}</span>
                </div>

                <div v-if="isNotEmpty(item.SuperClass)" class="cat-val-flex">
                    <span class="sub-cat">SuperClass:</span>
                    <span class="sub-val">{{ item.SuperClass }}</span>
                </div>

                <div v-if="isNotEmpty(item.IsAttributeOf)" class="cat-val-flex">
                    <span class="sub-cat">Is Attribute Of:</span>
                    <div class="sub-val">
                        <div v-for="(subitem, i) in item.IsAttributeOf" :key="i">
                            <span>{{ subitem }}</span>
                            <br />
                        </div>
                    </div>
                </div>

                <div v-if="isNotEmpty(item.CrossRefEntities)" class="cat-val-flex">
                    <span class="sub-cat">Cross Reference Entities:</span>
                    <div class="sub-val">
                        <div v-for="(subitem, i) in item.CrossRefEntities" :key="i">
                            <span>{{ subitem }}</span>
                            <br />
                        </div>
                    </div>
                </div>

                <div v-if="isNotEmpty(attrs)" class="cat-val-flex">
                    <span class="sub-cat">Expected Attributes*:</span>
                    <div class="sub-val">
                        <div v-for="(subitem, i) in attrs" :key="i">
                            <span>{{ subitem }}</span>
                            <br />
                        </div>
                    </div>
                </div>

            </div>
        </span>
    </div>
</template>

<script setup lang="ts">

import { selEntity, attributes } from "@/share/share";
import { isNotEmpty } from "@/share/util";

const attrs = ref();
watchEffect(async () => {
    attrs.value = await attributes();
});

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
</style>
