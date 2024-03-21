<template>

    <div class="container">

        <div>
            <input class="search-box" type="text" id="search" name="search" placeholder="searching..." v-model="aim" ref="searchInput" />
            <button class="search-btn" @click="Search()">
                <font-awesome-icon icon="search" />
            </button>
        </div>

        <div class="tab">
            <button class="tab-links-cat" id="tab-default-cat" @click="showTabContent">{{ choices[0] }}</button>
            <button class="tab-links-cat" @click="showTabContent">{{ choices[1] }}</button>
        </div>

        <div v-if="mTabShown.get(choices[0])" class="tab-content">
            <ul class="list-ent">
                <li v-for="(item, idx) in lsEnt4Dic" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
                    {{ item }}
                </li>
            </ul>
        </div>

        <div v-if="mTabShown.get(choices[1])" class="tab-content">
            <ul class="list-col">
                <li v-for="(item, idx) in lsCol4Dic" :key="idx" :title="item" class="ellip" :class="style(item)" @click="itemClick(item, 'existing')">
                    {{ item }}
                </li>
            </ul>
        </div>

    </div>

</template>

<script setup lang="ts">

import { selItem, lsEnt4Dic, lsCol4Dic, lsSubscribed, LoadList4Dic, Refresh, selCat, aim, Search } from "@/share/share";

const searchInput = ref();

const choices = reactive([
    'entity',
    'collection',
]);

// tab content shown flag, key is tab-text
const mTabShown = ref(new Map([
    [choices[0], false],
    [choices[1], false],
]));

const showTabContent = async (evt: MouseEvent) => {

    const id = (evt.target! as HTMLElement).textContent
    console.log(id)

    mTabShown.value.forEach((flag, tab) => {
        mTabShown.value.set(tab, tab == id ? true : false)
    });

    let tab_links = document.getElementsByClassName("tab-links-cat");
    for (let i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }
    (evt.currentTarget! as HTMLElement).className += " active";

    /////////////////////////

    selCat.value = id!;
}

const setDefaultTab = async (id: string) => {
    const iid = window.setInterval(() => {
        document.getElementById(id)!.click();
    }, 50)
    window.setTimeout(() => {
        window.clearInterval(iid)
    }, 1000)
}

let mounted = false;

onMounted(async () => {
    selCat.value = choices[0]
    await LoadList4Dic(choices[0])
    await LoadList4Dic(choices[1])
    await setDefaultTab("tab-default-cat")
    searchInput.value.focus()
    mounted = true;
})

watchEffect(async () => {
    const cat = selCat.value;
    if (mounted) {
        if (cat.length > 0) {
            await LoadList4Dic(cat)
            switch (cat) {
                case choices[0]:
                    await itemClick(lsEnt4Dic.value[0], 'existing')
                    break
                case choices[1]:
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
    height: 80vh;
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
    width: 89%;
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

/* Style the tab */
.tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
    height: 3vh;
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
</style>
