<template>
    <a class="float" id="bookmark" :title="hintSubscription" :class="styleSubscription" @click="Subscribe()" v-if="doSubscribe">
        <font-awesome-icon icon="bookmark" class="floating" />
    </a>
    <a class="float" id="plus" title="add new item" @click="toCMS('new', selCat, selItem, 'existing')" v-if="doNew">
        <font-awesome-icon icon="plus" class="floating" />
    </a>
    <!-- <a :href="URL_CMS + '?name=' + selItem + '&cat=' + selCat + '&auth=' + loginToken" target="_blank" class="float"> -->
    <a class="float" id="pen" :title="hintEdit" @click="toCMS('edit', selCat, selItem, 'existing')" v-if="doEdit">
        <font-awesome-icon icon="pen" class="floating" />
    </a>
    <a class="float" id="times" :title="hintDelete" @click="PopupModal()" v-if="doDelete">
        <font-awesome-icon icon="times" class="floating" />
    </a>
    <a class="float" id="download" :title="hintDownload" @click="Dump()" v-if="doDump">
        <font-awesome-icon icon="download" class="floating" />
    </a>
    <Loader id="loader" v-if="loading" />
</template>

<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import Loader from "@/components/shared/Loader.vue"
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { selMode, selCat, selItem, selEntity, selCollection, delRemoveItem, LoadList4Dic, lsSubscribed, putSubscribe, getDump, loginAsAdmin } from "@/share/share";
import { isEmpty, download_file, sleep, toCMS } from "@/share/util";
import CCModal from '@/components/modal-components/CCModal.vue'

const loading = ref(false);

// for UI
const doNew = computed(() => selMode.value == 'Dictionary')
const doSubscribe = computed(() => selMode.value == 'Dictionary' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doEdit = computed(() => selMode.value == 'Dictionary' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doDelete = computed(() => loginAsAdmin.value && selMode.value == 'Dictionary' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doDump = computed(() => selMode.value == 'Dictionary')

const Y_BtnEdit = ref('250px')
const Y_BtnSubscribe = ref('180px')
const Y_BtnDelete = ref('110px')
const Y_BtnDownload = ref('40px')

const Y_BtnNew = computed(() => {
    if (selCat.value.length == 0 ||
        (selCat.value == 'entity' && isEmpty(selEntity)) ||
        (selCat.value == 'collection' && isEmpty(selCollection))) {
        return Y_BtnDelete.value
    }
    return "320px"
})

// DELETE ///////////////////////////////////////////////////////////////

const delName = computed(() => selCat.value == 'entity' ? selEntity.Entity : selCollection.Entity)

// *** use "confirm-cancel" modal ***
const PopupModal = async () => {

    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: `Delete '${delName.value}' permanently?`,
                fontsize: "13px",
                width: "20%",
                height: "10%",
            },
        })) === 'confirm') {

            // waiting...1
            loading.value = true
            document.body.style.pointerEvents = "none"
            await sleep(100)

            const de = await delRemoveItem(delName.value)
            if (de.error != null) {
                notify({
                    title: "Error: Delete Item",
                    text: de.error,
                    type: "error"
                })

                // release waiting...3
                document.body.style.pointerEvents = "auto";
                loading.value = false

                return
            }

            // waiting...2
            await sleep(10000)
            document.body.style.pointerEvents = "auto";
            loading.value = false

            notify({
                title: "Deleted OK",
                text: `dictionary item '${delName.value}' is removed permanently`,
                type: "success"
            })
            await LoadList4Dic('entity');
            await LoadList4Dic('collection');
            selEntity.Reset();
            selCollection.Reset();
        }

    } catch (e) {
        switch (e) {
            case 'cancel':
                break
        }
    }
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
const hintDownload = computed(() => `download all`)

const Subscribe = async () => {
    // alert(selCat.value)

    let name = "";
    switch (selCat.value) {
        case 'entity':
            name = selEntity.Entity;
            break;
        case 'collection':
            name = selCollection.Entity;
            break;
        default:
            alert(`select one item before subscribing`);
            return;
    }
    const de = await putSubscribe(name, selCat.value);
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
    await LoadList4Dic('entity');
    await LoadList4Dic('collection');
};

const Dump = async () => {
    const de = await getDump(selCat.value, "existing")
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
