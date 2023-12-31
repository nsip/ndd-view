<template>
    <a class="float" id="bookmark" :title="hintSubscription" :class="styleSubscription" @click="Subscribe()" v-if="doSubscribe">
        <font-awesome-icon icon="bookmark" class="floating" />
    </a>
    <a class="float" id="plus" title="add new item" @click="ToCMS('new')" v-if="doNew">
        <font-awesome-icon icon="plus" class="floating" />
    </a>
    <!-- <a :href="URL_CMS + '?name=' + selItem + '&kind=' + selType + '&auth=' + loginToken" target="_blank" class="float"> -->
    <a class="float" id="pen" :title="hintEdit" @click="ToCMS('edit')" v-if="doEdit">
        <font-awesome-icon icon="pen" class="floating" />
    </a>
    <a class="float" id="times" :title="hintDelete" @click="PopupModal()" v-if="doDelete">
        <font-awesome-icon icon="times" class="floating" />
    </a>
    <a class="float" id="download" :title="hintDownload" @click="Dump()" v-if="doDump">
        <font-awesome-icon icon="download" class="floating" />
    </a>
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { Mode, ModalOn, selType, selItem, selEntity, selCollection, delRemoveItem, LoadCurrentList, lsSubscribed, putSubscribe, getDump } from "@/share/share";
import { isEmpty, download_file } from "@/share/util";
import { Domain, URL_CMS } from "@/share/ip";
import CCModal from '@/components/shared/CCModal.vue'

const { cookies } = useCookies();

// for UI
const doNew = computed(() => Mode.value == 'normal')
const doSubscribe = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doEdit = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doDelete = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doDump = computed(() => Mode.value == 'normal')

const Y_BtnSubscribe = ref('250px')
const Y_BtnEdit = ref('180px')
const Y_BtnDelete = ref('110px')
const Y_BtnDownload = ref('40px')

const Y_BtnNew = computed(() => {
    if (selType.value.length == 0 ||
        (selType.value == 'entity' && isEmpty(selEntity)) ||
        (selType.value == 'collection' && isEmpty(selCollection))) {
        return Y_BtnDelete.value
    }
    return "320px"
})

// NEW, EDIT ///////////////////////////////////////////////////////////////

const ToCMS = async (flag: string) => {

    switch (flag) {

        case 'new':
            // *** no longer use 'URL with auth' ***
            // location.replace(`${URL_CMS}?kind=${selType.value}&auth=${loginToken.value}`);

            // use 'entity' as kind if no selection
            const kind = selType.value.length == 0 ? 'entity' : selType.value;

            // *** 'kind', now in cookie ***
            cookies.set("kind", kind, "1d", "/", "." + Domain, false, "Lax");
            cookies.set("name", ``, "1d", "/", "." + Domain, false, "Lax");
            break;

        case 'edit':
            // *** no longer use 'URL with auth' ***
            // location.replace(`${URL_CMS}?name=${selItem.value}&kind=${selType.value}&auth=${loginToken.value}`);

            // *** 'kind','name' now in cookie ***
            cookies.set("kind", `${selType.value}`, "1d", "/", "." + Domain, false, "Lax");
            cookies.set("name", `${selItem.value}`, "1d", "/", "." + Domain, false, "Lax");
            break;

        default:
            alert(`flag @${flag} is not allowed, can only be 'new' or 'edit'`)
            return
    }

    location.replace(`${URL_CMS}`)
};

// DELETE ///////////////////////////////////////////////////////////////

const delName = computed(() => selType.value == "entity" ? selEntity.Entity : selCollection.Entity)

// *** use "confirm-cancel" modal ***
const PopupModal = async () => {
    if (ModalOn.value) {
        return
    }
    ModalOn.value = true
    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: `Delete '${delName.value}' permanently?`,
                fontsize: "13px",
                width: "20%",
                height: "10%",
            },
        })) === 'confirm') {
            {
                const de = await delRemoveItem(delName.value)
                if (de.error != null) {
                    notify({
                        title: "Error: Delete Item",
                        text: de.error,
                        type: "error"
                    })
                    ModalOn.value = false
                    return
                }
                notify({
                    title: "Deleted OK",
                    text: `dictionary item '${delName.value}' is removed permanently`,
                    type: "success"
                })
                await LoadCurrentList("entity", "existing");
                await LoadCurrentList("collection", "existing");
                selEntity.Reset();
                selCollection.Reset();
            }
        }
    } catch (e) {
        switch (e) {
            case 'cancel':
                break
        }
    }
    ModalOn.value = false
}

// SUBSCRIBE style
const sub_style = ref("subscribed-style");
const unsub_style = ref("unsubscribed-style");
const styleSubscription = computed(() => {
    let subscribed = false;
    lsSubscribed.value.forEach((val) => {
        if (val == selItem.value) {
            subscribed = true;
        }
    });
    return subscribed ? sub_style.value : unsub_style.value;
})

// Title for Hint
const hintSubscription = computed(() => {
    let subscribed = false;
    lsSubscribed.value.forEach((val) => {
        if (val == selItem.value) {
            subscribed = true;
        }
    });
    return subscribed ? `unsubscribe '${selItem.value}'` : `subscribe '${selItem.value}'`
})
const hintEdit = computed(() => `edit '${selItem.value}'`)
const hintDelete = computed(() => `delete '${selItem.value}'`)
const hintDownload = computed(() => `download all items`)

const Subscribe = async () => {
    // alert(selType.value)

    let name = "";
    switch (selType.value) {
        case "entity":
            name = selEntity.Entity;
            break;
        case "collection":
            name = selCollection.Entity;
            break;
        default:
            alert(`select one item before subscribing`);
            return;
    }
    const de = await putSubscribe(name, selType.value);
    if (de.error != null) {
        notify({
            title: "Error: Subscribe",
            text: de.error,
            type: "error"
        })
        return
    }

    notify({
        title: "Subscription",
        text: de.data ? `[${name}] is subscribed` : `[${name}] is unsubscribed`,
        type: "success"
    })

    // reload list for changing item color
    LoadCurrentList("entity", "existing");
    LoadCurrentList("collection", "existing");
};

const Dump = async () => {
    const de = await getDump(selType.value, "existing")
    if (de.error != null) {
        notify({
            title: "Error: Download All",
            text: de.error,
            type: "error"
        })
        return
    }
    const url = de.data
    download_file(url, "dump-dic.zip");
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float {
    position: fixed;
    width: 60px;
    height: 60px;
    right: 40px;
    bottom: 0px;
    background-color: #bbb;
    color: #fff;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
    opacity: 90%;
}

.float:hover {
    background-color: #0c9;
    cursor: pointer;
    opacity: 100%;
}

.floating {
    margin-top: 22px;
    color: white;
}

#bookmark {
    bottom: v-bind(Y_BtnSubscribe);
}

#bookmark:hover {
    background-color: #0c9;
}

#plus {
    bottom: v-bind(Y_BtnNew);
}

#plus:hover {
    background-color: #0c9;
}

#pen {
    bottom: v-bind(Y_BtnEdit);
}

#pen:hover {
    background-color: #0c9;
}

#times {
    bottom: v-bind(Y_BtnDelete);
}

#times:hover {
    background-color: rgb(221, 82, 44);
}

#download {
    bottom: v-bind(Y_BtnDownload);
}

#download:hover {
    background-color: rgb(110, 158, 240);
}

/* dynamically used styles for bookmark */

.subscribed-style {
    background-color: #0c9;
}

.subscribed-style:hover {
    background-color: #bbb;
}

.unsubscribed-style {
    background-color: #bbb;
}

.unsubscribed-style:hover {
    background-color: #0c9;
}
</style>
