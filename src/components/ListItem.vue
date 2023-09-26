<template>
    <div class="list_mode">
        <!-- same 'name', auto single selection -->
        <input class="selection" type="radio" name="kind" value="entity" v-model="selType" checked />
        <label>entity</label>
        <input class="selection" type="radio" name="kind" value="collection" v-model="selType" />
        <label>collection</label>
    </div>
    <ul v-if="selType == 'entity'" class="list-entity">
        <li v-for="(item, idx) in lsEntity" :key="idx" :title="item" class="ellip" :class="style(item)" @click="Refresh(item, 'existing')">
            {{ item }}
        </li>
    </ul>
    <ul v-if="selType == 'collection'" class="list-collection">
        <li v-for="(item, idx) in lsCollection" :key="idx" :title="item" class="ellip" :class="style(item)" @click="Refresh(item, 'existing')">
            {{ item }}
        </li>
    </ul>
</template>

<script setup lang="ts">

import { selItem, lsEntity, lsCollection, lsSubscribed, LoadCurrentList, Refresh, selType } from "@/share/share";

let mounted = false;

onMounted(async () => {
    selType.value = "entity"
    mounted = true;
})

watchEffect(async () => {
    const t = selType.value;
    if (mounted) {
        if (t.length > 0) {
            await LoadCurrentList(t, "existing")
            switch (t) {
                case "entity":
                    await Refresh(lsEntity.value[0], 'existing')
                    break
                case "collection":
                    await Refresh(lsCollection.value[0], 'existing')
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

LoadCurrentList("entity", "existing");
LoadCurrentList("collection", "existing");

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list_mode {
    float: left;
    font-size: large;
    margin-left: 2%;
    margin-bottom: 4%;
    margin-top: 1%;
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
    padding-top: 8px;
    padding-bottom: 8px;
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
