<template>

    <div class="container">

        <div>
            <input class="search-box" type="text" id="search" name="search" placeholder="searching..." v-model="aim" ref="searchInput" />
            <button class="search-btn" @click="Search()">
                <font-awesome-icon icon="search" />
            </button>
        </div>

        <div class="area-tabs type-filter">
            <span v-for="opt in filterOptions">
                &nbsp;
                <input v-model="filter" type="radio" name="type" :value="opt" />
                <label :title="mNumOptions[opt].toString()">{{ opt }}</label>
            </span>
        </div>

        <div v-if="CatOnEntity()" class="tab-content">
            <ul class="list-ent">
                <li v-for="(item, idx) in lsEnt4DicFiltered" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
                    {{ item }}
                </li>
            </ul>
        </div>

        <div v-if="CatOnCollection()" class="tab-content">
            <ul class="list-col">
                <li v-for="(item, idx) in lsCol4Dic" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
                    {{ item }}
                </li>
            </ul>
        </div>

    </div>

</template>

<script setup lang="ts">

import { mItemMType, selItem, selType, lsEnt4Dic, lsCol4Dic, lsSubscribed, LoadList4Dic, Refresh, aim, Search, globalMsg, SetSelItem, SetSelCatType, selEntity, selCollection, CatOnEntity, CatOnCollection, getAllEntityType, UpdateIssoLoading, dataIssoId, dataIssoTitle } from "@/share/share";
import eventBus from "@/share/util";

const searchInput = ref();

const filterOptions = reactive([
    'abstract',
    'element',
    'object',
    'collection'
])
const filter = ref(filterOptions[0])

const lsEnt4DicFiltered = ref<string[]>([]);

interface mOptNum {
    [key: string]: number;
}
const mNumOptions = ref<mOptNum>({
    [filterOptions[0]]: 0,
    [filterOptions[1]]: 0,
    [filterOptions[2]]: 0,
    [filterOptions[3]]: 0,
})

let mounted = false;

onMounted(async () => {

    // prepare list
    await LoadList4Dic('entity')
    await LoadList4Dic('collection')

    // collect all Metadata.Type for each entity for filter
    const m = await getAllEntityType()
    // console.log(m.data)
    mItemMType.value = new Map(Object.entries(m.data))

    // focus search box
    searchInput.value.focus()

    // prepare jumping item selection, e.g. from 'collection' page content link to 'entity' page. Category should also changed.
    eventBus.on('SetSelCatType', async (pCatType) => {
        filter.value = selType.value // adjust radio button
    })

    // global message bar info
    globalMsg.value = `Dictionary has ${lsEnt4Dic.value.length} entity items, ${lsCol4Dic.value.length} collection items`

    // fill initial list
    lsEnt4DicFiltered.value = []
    lsEnt4Dic.value.forEach((ent: string) => {
        if ((mItemMType.value!.get(ent) as string).toLowerCase() == filter.value) {
            lsEnt4DicFiltered.value.push(ent)
        }
    })

    // initial list item amount
    mNumOptions.value[filter.value] = lsEnt4DicFiltered.value.length;

    // initial cat is 'entity', type is 'abstract'
    SetSelCatType('entity', filter.value)

    mounted = true;
})

watchEffect(async () => {

    // after searching, refresh filtered list
    const lsEnt = lsEnt4Dic.value
    const lsCol = lsCol4Dic.value

    const flt = filter.value

    if (mounted) {
        switch (flt) {

            case 'abstract':
            case 'element':
            case 'object':
                lsEnt4DicFiltered.value = []
                lsEnt4Dic.value.forEach((ent: string) => {
                    if ((mItemMType.value!.get(ent) as string).toLowerCase() == flt) {
                        lsEnt4DicFiltered.value.push(ent)
                    }
                })
                SetSelCatType('entity', flt)
                selEntity.Reset()
                selCollection.Reset()
                mNumOptions.value[flt] = lsEnt4DicFiltered.value.length;
                break

            case 'collection':
                SetSelCatType('collection', flt)
                selEntity.Reset()
                selCollection.Reset()
                mNumOptions.value[flt] = lsCol4Dic.value.length;
                break
        }
    }
})

const itemClick = async (item: string, phase: string) => {
    await SetSelItem(item, phase)
    await Refresh(phase)
    ///// ISSO Comment /////
    UpdateIssoLoading()
    dataIssoId.value = item;
    dataIssoTitle.value = item;
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
    height: 78vh;
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
    width: 88%;
    padding: 5px 0px 5px 10px;
    background-color: rgb(230, 230, 230);
}

.search-btn {
    float: right;
    width: 8%;
    padding: 5px 5px 5px 5px;
    font-size: 15px;
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

.container {
    display: flex;
    flex-direction: column;
    /* Stacks elements vertically */
}

.area-tabs {
    display: flex;
    /* justify-content: space-between; */
    background-color: #f1f1f1;
}

/* right most element keep right alignment */
.area-tabs div:nth-child(n) {
    margin-right: auto;
}

/* Style the tab */
.tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
    height: 4vh;
}

/* Style the buttons inside the tab */
.tab button {
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 11px;
    transition: 0.3s;
    font-size: 17px;
    height: 100%;
}

/* Change background color of buttons on hover */
.tab button:hover {
    background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
    background-color: #ccc;
}

/* Style the tab content */
.tab-content {
    padding: 1px 1px;
    border: 1px solid #ccc;
    border-top: none;
}

/* radio button for filter */
.type-filter {
    margin-top: 1.2vh;
}
</style>
