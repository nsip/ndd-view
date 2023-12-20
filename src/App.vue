<template>
    <header>
        <PageTitle />
    </header>

    <main v-if="display">

        <div class="tab">
            <button class="tab-links" @click="showTabContent">admin</button>
            <button class="tab-links" @click="showTabContent">approval</button>
            <button class="tab-links" id="tab-default" @click="showTabContent">dictionary</button>
        </div>

        <div v-if="mTabShown.get('dictionary')" class="tab-content">
            <div id="container">
                <div id="left">
                    <ListItem />
                </div>
                <div id="right">
                    <ClassNav />
                    <EntityContent />
                    <CollectionContent />
                    <BtnView v-if="!ModalOn" />
                </div>
            </div>
        </div>

        <div v-if="mTabShown.get('approval')" class="tab-content">
            <div id="container">
                <div id="left">
                    <ListCandidate />
                </div>
                <div id="right">
                    <EntityContent />
                    <CollectionContent />
                    <BtnApproval v-if="!ModalOn" />
                </div>
            </div>
        </div>

        <div v-if="mTabShown.get('admin')" class="tab-content">
            <UserAdmin />
            <BtnAdmin v-if="!ModalOn" />
        </div>

    </main>

    <notifications position="top center" :speed="2000" :duration="6000" :closeOnClick="false" />
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { notify } from "@kyvg/vue3-notification";
import { loginUser, loginAuth, loginToken, loginAsAdmin, getSelfName, getSelfAdminStatus, selMode, selType, selEntity, selCollection, ModalOn, aim } from "@/share/share";
import PageTitle from "@/components/PageTitle.vue";
import ClassNav from "@/components/sub-entity/ClassNav.vue";
import ListItem from "@/components/ListItem.vue";
import ListCandidate from "@/components/ListCandidate.vue";
import EntityContent from "@/components/EntityContent.vue";
import CollectionContent from "@/components/CollectionContent.vue";
import BtnView from "@/components/btn-components/BtnView.vue";
import BtnApproval from "@/components/btn-components/BtnApproval.vue";
import UserAdmin from "@/components/UserAdmin.vue";
import BtnAdmin from "@/components/btn-components/BtnAdmin.vue"

const { cookies } = useCookies();
const Height = ref((window.innerHeight * 0.93).toString() + "px");
const display = ref(false)

// tab content shown flag, key is tab-text
const mTabShown = ref(new Map([
    ["dictionary", false],
    ["approval", false],
    ["admin", false],
]));

onMounted(async () => {

    // *** from url string. (no longer used) ***
    // const pAuth = window.location.href.indexOf("auth=");
    // const auth = decodeURI(window.location.href.substring(pAuth + 5));
    // loginToken.value = auth;
    // loginAuth.value = "Bearer " + auth;

    // *** from cookie ***
    console.log(`${window.location.hostname} + ---> + ${cookies.keys()}`)

    const token = cookies.get("token")
    loginToken.value = token;
    loginAuth.value = "Bearer " + token;

    // *** if token is null, check sign-in page is domain page or IP page,
    // *** only domain page can send correct token

    // console.log("[App.vue] Token:", window.location.hostname, " -- ", cookies.get("token"))
    console.log("[App.vue] selected type:", selType.value)
    console.log("[App.vue] selected entity name:", selEntity.Entity)
    console.log("[App.vue] selected collection name:", selCollection.Entity)

    if (loginAuth.value.length < 128) {

        notify({
            title: "Error",
            text: "Invalid Auth Info",
            type: "error"
        })
        display.value = false

    } else {

        {
            const de = await getSelfName();
            if (de.error != null) {
                notify({
                    title: "Error: Cannot Get Self User Name",
                    text: de.error,
                    type: "error"
                })
                display.value = false
                return
            }
            loginUser.value = de.data
        }
        {
            const de = await getSelfAdminStatus();
            if (de.error != null) {
                notify({
                    title: "Error: Cannot Get Self Admin Status",
                    text: de.error,
                    type: "error"
                })
                display.value = false
                return
            }
            loginAsAdmin.value = de.data
        }

        display.value = true

        await setDefaultTab("tab-default")
    }
});

const setDefaultTab = async (id: string) => {
    let ranDefault = false
    const iid = window.setInterval(() => {
        if (display.value && !ranDefault) {
            document.getElementById(id)!.click();
            ranDefault = true
        }
    }, 50)
    window.setTimeout(() => {
        if (display.value && ranDefault) {
            window.clearInterval(iid)
        }
    }, 1000)
}

const showTabContent = async (evt: MouseEvent) => {

    const id = (evt.target! as HTMLElement).textContent
    console.log(id)

    mTabShown.value.forEach((flag, tab) => {
        mTabShown.value.set(tab, tab == id ? true : false)
    });

    let tab_links = document.getElementsByClassName("tab-links");
    for (let i = 0; i < tab_links.length; i++) {
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }
    (evt.currentTarget! as HTMLElement).className += " active";

    // set selected mode
    selMode.value = id!;

    // extra clear work when click tab
    selEntity.Reset()
    selCollection.Reset()
    aim.value = ""
}

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

html,
body {
    margin-top: 0.5vh;
    overflow: hidden
}

header {
    height: 5vh;
}

#container {
    width: 100vw;
    height: v-bind("Height");
    display: flex;
}

#left {
    width: 25vw;
    height: 90vh;
    background-color: rgb(240, 240, 240);
    /* List has its own scroll */
}

#right {
    width: 75vw;
    height: 90vh;
    margin-left: 0.5%;
    margin-right: 1.5%;
    background-color: rgb(240, 240, 240);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
}

/* Style the tab */
.tab {
    overflow: hidden;
    border: 1px solid #ccc;
    background-color: #f1f1f1;
    height: 5vh;
}

/* Style the buttons inside the tab */
.tab button {
    background-color: inherit;
    float: right;
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
