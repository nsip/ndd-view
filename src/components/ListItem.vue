<template>
    <div>
        <input class="search-box" type="text" id="search" name="search" placeholder="searching..." v-model="aim" ref="searchInput" />
        <button class="search-btn" @click="Search()">
            <font-awesome-icon icon="search" />
        </button>
    </div>

    <div class="list_type_sel">
        <!-- same 'name', auto single selection -->
        <span class="cat-input" v-for="choice in choices">
            <input v-model="selCat" type="radio" name="cat" :value="choice" @change="select" />
            <label class="rb-lbl">{{ choice }}</label>
        </span>
        <hr>
    </div>

    <ul v-if="selCat == 'entity'" class="list-ent">
        <li v-for="(item, idx) in lsEnt4Dic" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
            {{ item }}
        </li>
    </ul>
    <ul v-if="selCat == 'collection'" class="list-col">
        <li v-for="(item, idx) in lsCol4Dic" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
            {{ item }}
        </li>
    </ul>
</template>

<script setup lang="ts">

import { selItem, lsEnt4Dic, lsCol4Dic, lsSubscribed, LoadList4Dic, Refresh, selCat, aim, Search } from "@/share/share";

const searchInput = ref();

let mounted = false;
onMounted(async () => {
    selCat.value = "entity"
    await LoadList4Dic("entity")
    await LoadList4Dic("collection")
    searchInput.value.focus()
    mounted = true;
})

watchEffect(async () => {
    const cat = selCat.value;
    if (mounted) {
        if (cat.length > 0) {
            await LoadList4Dic(cat)
            switch (cat) {
                case "entity":
                    await itemClick(lsEnt4Dic.value[0], 'existing')
                    break
                case "collection":
                    await itemClick(lsCol4Dic.value[0], 'existing')
                    break
            }
        }
    }
})

const itemClick = async (item: string, phase: string) => {
    selItem.value = item
    await Refresh(phase)
}

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

const choices = reactive([
    "entity",
    "collection"
]);

const select = () => { };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list_type_sel {
    float: left;
    font-size: normal;
    margin-left: 2%;
    margin-top: 1vh;
    margin-bottom: 2vh;
    height: 1.5vh;
    width: 90%;
    text-align: left;
    /* background-color:burlywood; */
}

ul.list-ent::-webkit-scrollbar,
ul.list-col::-webkit-scrollbar {
    display: none;
}

ul.list-ent,
ul.list-col {
    background-color: rgb(240, 240, 240);
    width: 20vw;
    height: 75vh;
    margin-left: 5px;
    margin-top: 0.5vh;
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

.search-box {
    float: left;
    width: 80%;
    padding: 5px 0px 5px 10px;
    margin-left: 2%;
    margin-top: 2%;
    background-color: rgb(230, 230, 230);
}

.search-btn {
    float: left;
    width: 10%;
    margin-left: 2%;
    margin-top: 2%;
    padding: 5px 5px 5px 5px;
    font-size: 14px;
}

hr {
    margin-top: 2%;
    margin-bottom: -1%;
}

.cat-input {
    font-weight: bold;
}

.rb-lbl {
    margin-right: 5px;
}
</style>
