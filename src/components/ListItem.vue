<template>
    <div class="list_type_sel">
        <!-- same 'name', auto single selection -->
        <input class="selection" type="radio" name="kind" value="entity" v-model="selType" checked />
        <label>entity</label>
        <input class="selection" type="radio" name="kind" value="collection" v-model="selType" />
        <label>collection</label>
    </div>
    <ul v-if="selType == 'entity'" class="list-ent">
        <li v-for="(item, idx) in lsEnt" :key="idx" :title="item" class="ellip" :class="style(item)" @click="Refresh(item, 'existing')">
            {{ item }}
        </li>
    </ul>
    <ul v-if="selType == 'collection'" class="list-col">
        <li v-for="(item, idx) in lsCol" :key="idx" :title="item" class="ellip" :class="style(item)" @click="Refresh(item, 'existing')">
            {{ item }}
        </li>
    </ul>
</template>

<script setup lang="ts">

import { selItem, lsEnt, lsCol, lsSubscribed, LoadCurrentList, Refresh, selType } from "@/share/share";

let mounted = false;
onMounted(async () => {
    selType.value = "entity"
    await LoadCurrentList("entity", "existing")
    await LoadCurrentList("collection", "existing")
    mounted = true;
})

watchEffect(async () => {
    const t = selType.value;
    if (mounted) {
        if (t.length > 0) {
            await LoadCurrentList(t, "existing")
            switch (t) {
                case "entity":
                    await Refresh(lsEnt.value[0], 'existing')
                    break
                case "collection":
                    await Refresh(lsCol.value[0], 'existing')
                    break
            }
        }
    }
})

const default_style = ref("default-style");
const sel_style = ref("selected-style");
const sub_style = ref("subscribed-style");

const style = (name: string) => {
    const selected = selItem.value == name;
    let subscribed = false;

    // for (let i = 0; i < lsSubscribed.value.length; i++) {
    //     if (lsSubscribed.value[i] == name) {
    //         subscribed = true
    //     }
    // }

    lsSubscribed.value.forEach((val) => {
        if (val == name) {
            subscribed = true;
        }
    });

    if (selected && subscribed) {
        return sel_style.value + " " + sub_style.value;
    } else if (selected) {
        return sel_style.value;
    } else if (subscribed) {
        return sub_style.value;
    } else {
        return default_style.value;
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list_type_sel {
    float: left;
    font-size: normal;
    margin-left: 2%;
    margin-top: 1%;
    margin-bottom: -2%;
    /* background-color:burlywood; */
}

ul.list-ent::-webkit-scrollbar,
ul.list-col::-webkit-scrollbar {
    display: none;
}

ul.list-ent,
ul.list-col {
    background-color: rgb(240, 240, 240);
    width: 90%;
    max-height: 90%;
    margin-left: 5px;
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
    border: 0 none #ccc;
    /* border-right: 2px solid #ccc; */
    border-radius: 10px;
    /* border-color: rgb(230, 230, 230); */
    padding-top: 8px;
    padding-bottom: 8px;
}

ul.list-ent li.ellip,
ul.list-col li.ellip {
    /* background-color: rgb(230, 230, 230); */
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: -5%;
    padding-top: 0.5%;
}

/* ******************************************* */

/* selected */
.selected-style {
    font-weight: bold;
    font-style: italic;
}

.selected-style:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

/* subscribed */
.subscribed-style {
    color: green;
    font-weight: bold;
}

.subscribed-style:hover {
    text-decoration: underline;
    cursor: pointer;
}

/* default */
.default-style {
    color: black;
}

.default-style:hover {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>
