<template>
    <header v-if="display">
        <PageTitle />
        <ModeSel />
    </header>

    <main v-if="display">
        <ClassNav v-if="fClsNav" />
        <div v-if="fNormal || fApproval" id="container">
            <div id="left">
                <SearchFilter v-if="fSearchFilter" />
                <ListItem v-if="fListItem" />
                <ListCandidate v-if="fListCandidate" />
            </div>
            <div id="right">
                <EntityContent v-if="entityContent" />
                <CollectionContent v-if="collectionContent" />
                <BtnApproval />
                <BtnView />
            </div>
        </div>
        <div v-if="fAdmin">
            <UserAdmin />
            <BtnAdmin v-if="!ModalOn" />
        </div>
    </main>

    <footer v-if="display">
    </footer>

    <notifications position="top center" :speed="2000" :duration="6000" :closeOnClick="false" />
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { notify } from "@kyvg/vue3-notification";
import { loginUser, loginAuth, loginToken, loginAsAdmin, getSelfName, getUserInfoList, Mode, selType, selEntity, selCollection, ModalOn } from "@/share/share";
import PageTitle from "@/components/PageTitle.vue";
import ClassNav from "@/components/ClassNav.vue";
import ModeSel from "@/components/ModeSel.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import ListItem from "@/components/ListItem.vue";
import ListCandidate from "@/components/ListCandidate.vue";
import EntityContent from "@/components/EntityContent.vue";
import CollectionContent from "@/components/CollectionContent.vue";
import BtnView from "@/components/btn-components/BtnView.vue";
import BtnApproval from "@/components/btn-components/BtnApproval.vue";
import UserAdmin from "@/components/UserAdmin.vue";
import BtnAdmin from "@/components/btn-components/BtnAdmin.vue"

const { cookies } = useCookies();

const Height = ref((window.innerHeight * 0.95).toString() + "px");

const display = ref(false)
const fNormal = computed(() => Mode.value == 'normal')
const fApproval = computed(() => Mode.value == 'approval')
const fAdmin = computed(() => Mode.value == 'admin')
const fClsNav = computed(() => Mode.value == 'normal')
const fSearchFilter = computed(() => Mode.value == 'normal')
const fListItem = computed(() => Mode.value == 'normal')
const fListCandidate = computed(() => Mode.value == 'approval')
const entityContent = computed(() => selType.value == 'entity')
const collectionContent = computed(() => selType.value == 'collection')

let mounted = false;

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
            const de = await getUserInfoList(loginUser.value, "")
            if (de.error != null) {
                notify({
                    title: "Error: Cannot Get Self Info",
                    text: de.error,
                    type: "error"
                })
                display.value = false
                return
            }
            loginAsAdmin.value = de.data[0].role == 'admin' ? true : false
        }

        await new Promise((f) => setTimeout(f, 500));

        display.value = true

        Mode.value = "normal"
    }

    mounted = true
});

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
}

html,
body {
    margin: 0;
    height: 100%;
    overflow: hidden
}

#container {
    width: 100%;
    height: v-bind("Height");
    display: flex;
}

#left {
    width: 25%;
    height: 92%;
    margin-right: 1%;
    /* background-color: rgb(230, 230, 230); */
    /* List has its own scroll */
}

#right {
    width: 75%;
    height: 93%;
    margin-left: 0%;
    background-color: rgb(240, 240, 240);
    overflow-y: scroll;
}
</style>
