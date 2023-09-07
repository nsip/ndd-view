<template>
    <a class="float" id="bookmark" :title="hintSubscription" :class="styleSubscription" @click="subscribe()" v-if="btnSubscribe">
        <font-awesome-icon icon="bookmark" class="floating" />
    </a>
    <a class="float" id="plus" title="add new item" @click="ToCMS('new')" v-if="btnNew">
        <font-awesome-icon icon="plus" class="floating" />
    </a>
    <!-- <a :href="URL_CMS + '?name=' + selItem + '&kind=' + selType + '&auth=' + loginToken" target="_blank" class="float"> -->
    <a class="float" id="pen" :title="hintEdit" @click="ToCMS('edit')" v-if="btnEdit">
        <font-awesome-icon icon="pen" class="floating" />
    </a>
    <a class="float" id="times" :title="hintDelete" @click="popupModal()" v-if="btnDel">
        <font-awesome-icon icon="times" class="floating" />
    </a>
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { useNotification } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { Mode, ModalOn, selType, selItem, selEntity, selCollection, delRemoveItem, LoadCurrentList, lsSubscribed, putSubscribe } from "@/share/share";
import { isEmpty } from "@/share/util";
import { Domain, URL_CMS } from "@/share/ip";
import CCModal from '@/components/shared/CCModal.vue'

const { cookies } = useCookies();
const notification = useNotification()

// for UI
const btnNew = computed(() => Mode.value == 'normal')
const btnEdit = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const btnDel = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const btnSubscribe = computed(() => Mode.value == 'normal' && (!isEmpty(selEntity) || !isEmpty(selCollection)))

const bottomBtnNew = computed(() => {
    if (selType.value.length == 0 ||
        (selType.value == 'entity' && isEmpty(selEntity)) ||
        (selType.value == 'collection' && isEmpty(selCollection))) {
        return "40px"
    }
    return "250px"
})
const bottomBtnEdit = computed(() => '110px')
const bottomBtnDel = computed(() => '40px')
const bottomBtnSubscribe = computed(() => '180px')

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
const popupModal = async () => {
    if (ModalOn.value) {
        return
    }
    ModalOn.value = true
    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: `Delete '${delName.value}' permanently?`,
                width: "20%",
                height: "10%",
            },
        })) === 'confirm') {
            {
                const de = await delRemoveItem(delName.value)
                if (de.error != null) {
                    notification.notify({
                        title: "Error: Delete Item",
                        text: de.error,
                        type: "error"
                    })
                    ModalOn.value = false
                    return
                }
                notification.notify({
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

const subscribe = async () => {
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
        notification.notify({
            title: "Error: Subscribe",
            text: de.error,
            type: "error"
        })
        return
    }

    notification.notify({
        title: "Subscription",
        text: de.data ? `[${name}] is subscribed` : `[${name}] is unsubscribed`,
        type: "success"
    })

    // reload list for changing item color
    LoadCurrentList("entity", "existing");
    LoadCurrentList("collection", "existing");
};

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
    bottom: v-bind(bottomBtnSubscribe);
}

#bookmark:hover {
    background-color: #0c9;
}

#plus {
    bottom: v-bind(bottomBtnNew);
}

#plus:hover {
    background-color: #0c9;
}

#pen {
    bottom: v-bind(bottomBtnEdit);
}

#pen:hover {
    background-color: #0c9;
}

#times {
    bottom: v-bind(bottomBtnDel);
}

#times:hover {
    background-color: rgb(221, 82, 44);
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
