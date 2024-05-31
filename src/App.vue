<template>
    <header>
        <PageTitle />
    </header>

    <main v-if="display">

        <div class="tab">
            <h5 class="msg-bar">{{ globalMsg }}</h5>
            <button class="tab-links" @click="showTabContent" v-if="loginAsAdmin">{{ choices[3] }}</button>
            <button class="tab-links" @click="showTabContent" v-if="loginAsAdmin">{{ choices[2] }}</button>
            <button class="tab-links" @click="showTabContent" v-if="loginAsAdmin && hasPending">{{ choices[1] }}</button>
            <button class="tab-links" id="tab-default" @click="showTabContent">{{ choices[0] }}</button>
        </div>

        <div v-if="mTabShown.get(choices[0])" class="tab-content">
            <div id="container">
                <div id="left">
                    <ListItem />
                </div>
                <div id="right">
                    <ClassNav />
                    <div id="dic-content-area">
                        <EntityContent />
                        <CollectionContent />
                    </div>
                    <CommentArea id="cmt-area" />
                    <BtnView />
                </div>
            </div>
        </div>

        <div v-if="mTabShown.get(choices[1])" class="tab-content">
            <div id="container">
                <div id="left">
                    <ListCandidate />
                </div>
                <div id="right">
                    <EntityContent />
                    <CollectionContent />
                    <BtnApproval />
                </div>
            </div>
        </div>

        <div v-if="mTabShown.get(choices[2])" class="tab-content">
            <UserAdmin />
            <BtnAdmin />
        </div>

        <div v-if="mTabShown.get(choices[3])" class="tab-content">
            <BtnMaintain />
        </div>

    </main>

    <notifications position="top center" :speed="2000" :duration="6000" :closeOnClick="false" />
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { notify } from "@kyvg/vue3-notification";
import { loginUser, loginAuth, loginToken, loginAsAdmin, getSelfName, getSelfAdminStatus, selMode, selCat, selEntity, selCollection, aim, UpdatePendingStatus, hasPending, globalMsg, selItem } from "@/share/share";
import eventBus from '@/share/util';
import PageTitle from "@/components/PageTitle.vue";
import ClassNav from "@/components/sub-entity/ClassNav.vue";
import ListItem from "@/components/ListItem.vue";
import ListCandidate from "@/components/ListCandidate.vue";
import EntityContent from "@/components/EntityContent.vue";
import CollectionContent from "@/components/CollectionContent.vue";
import BtnView from "@/components/btn-components/BtnView.vue";
import BtnApproval from "@/components/btn-components/BtnApproval.vue";
import BtnAdmin from "@/components/btn-components/BtnAdmin.vue";
import BtnMaintain from "@/components/btn-components/BtnMaintain.vue";
import UserAdmin from "@/components/UserAdmin.vue";
import CommentArea from "./components/CommentArea.vue";

const { cookies } = useCookies();
const Height = ref((window.innerHeight * 0.93).toString() + "px");
const display = ref(false)

const choices = reactive([
    'Dictionary',
    'Approval',
    'Admin',
    'Maintain'
]);

// tab content shown flag, key is tab-text
const mTabShown = ref(new Map([
    [choices[0], false],
    [choices[1], false],
    [choices[2], false],
    [choices[3], false],
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
    console.log("[App.vue] selected category:", selCat.value)
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
        eventBus.on('default-tab', async (msg) => {
            await setDefaultTab("tab-default")
        })

        await UpdatePendingStatus()
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
    selItem.value = ""
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
    /* Content has its own scroll */
    /* overflow-y: scroll; */
    display: flex;
    flex-direction: column;
}

#dic-content-area {
    overflow-y: scroll;
    scrollbar-width: none;
    height: 60vh;
}

#cmt-area {
    overflow-y: scroll;
    scrollbar-width: none;
    bottom: 0;
    width: 100%;
    height: 26vh;
    margin-top: 5px;
    margin-bottom: 6px;
    background-color: #e0eff7;
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

.msg-bar {
    float: left;
    text-align: left;
    padding-left: 2vh;
    transform: translateY(-50%);
    position: relative;
    font-style: italic;
    font-weight: bold;
}
</style>
