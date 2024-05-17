<template>

    <div class="container">

        <div>
            <input class="search-box" type="text" id="search" name="search" placeholder="searching..." v-model="aim" ref="searchInput" />
            <button class="search-btn" @click="Search()">
                <font-awesome-icon icon="search" />
            </button>
        </div>

        <div class="area-tabs">
            <div class="tab">
                <button class="tab-links-cat" id="tab-cat-ent" @click="showTabContent">{{ choices[0] }}</button>
                <button class="tab-links-cat" id="tab-cat-col" @click="showTabContent">{{ choices[1] }}</button>
            </div>
            <div v-if="selCat == 'entity'" class="type-filter">
                <span v-for="opt in filterOptions">
                    &nbsp;
                    <input v-model="filter" type="radio" name="type" :value="opt" />
                    <label>{{ opt }}</label>
                </span>
            </div>
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

import { selItem, lsEnt4Dic, lsCol4Dic, lsSubscribed, LoadList4Dic, Refresh, selCat, aim, Search, globalMsg, SetSelItem, SetSelCat, selEntity, selCollection, CatOnEntity, CatOnCollection, getAllEntityType } from "@/share/share";
import eventBus from "@/share/util";

const searchInput = ref();

const filterOptions = reactive([
    'all',
    'abstract',
    'element',
    'object'
])
const filter = ref("all")

const choices = reactive([
    'entity',
    'collection',
]);

const lsEnt4DicFiltered = ref<string[]>([]);

let mItemMType: Map<string, any>

const showTabContent = async (evt: MouseEvent) => {

    // Tab Buttons Effect
    let tab_links = document.getElementsByClassName("tab-links-cat");
    for (let i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }
    (evt.currentTarget! as HTMLElement).className += " active";

    /////////////////////////

    const id = (evt.target! as HTMLElement).textContent
    if (id != selCat.value) {

        // Tab Changed, Selected Category Changed
        SetSelCat(id!);

        // Tab Changed, Selected Item Cleared.
        selEntity.Reset();
        selCollection.Reset();
    }
}

const setDefaultTab = async (id: string) => {
    const iid = window.setInterval(() => { document.getElementById(id)!.click(); }, 50)
    window.setTimeout(() => { window.clearInterval(iid) }, 1000)
}

let mounted = false;

onMounted(async () => {

    // prepare list
    await LoadList4Dic(choices[0])
    await LoadList4Dic(choices[1])

    // set default category tab & set selected category
    await setDefaultTab("tab-cat-ent")
    SetSelCat(choices[0])

    // focus search box
    searchInput.value.focus()

    // prepare jumping item selection, e.g. from 'collection' page content link to 'entity' page. Category should also changed.
    eventBus.on('cat-selection', async (cat) => {
        document.getElementById(cat as string)!.click(); // cat: 'tab-cat-ent', 'tab-cat-col'
    })

    // global message bar info
    globalMsg.value = `Dictionary has ${lsEnt4Dic.value.length} entity items, ${lsCol4Dic.value.length} collection items`

    // collect all Metadata.Type for each entity for filter
    const m = await getAllEntityType()
    // console.log(m.data)
    mItemMType = new Map(Object.entries(m.data))

    mounted = true;
})


watchEffect(async () => {

    const flt = filter.value

    lsEnt4DicFiltered.value = []
    switch (flt) {
        case 'all':
            lsEnt4DicFiltered.value = lsEnt4Dic.value
            break

        case 'abstract':
            lsEnt4Dic.value.forEach((ent: string) => {
                if (mItemMType.get(ent) == 'Abstract') {
                    lsEnt4DicFiltered.value.push(ent)
                }
            })
            break

        case 'element':
            lsEnt4Dic.value.forEach((ent: string) => {
                if (mItemMType.get(ent) == 'Element') {
                    lsEnt4DicFiltered.value.push(ent)
                }
            })
            break

        case 'object':
            lsEnt4Dic.value.forEach((ent: string) => {
                if (mItemMType.get(ent) == 'Object') {
                    lsEnt4DicFiltered.value.push(ent)
                }
            })
            break
    }
})

const itemClick = async (item: string, phase: string) => {
    await SetSelItem(item, phase)
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
