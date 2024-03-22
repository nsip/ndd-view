<template>
    <a v-if="doApproval" class="float" id="check" @click="Approve()">
        <font-awesome-icon icon="check" class="floating" />
    </a>
    <a v-if="doEdit" class="float" id="pen" title="edit" @click="toCMS('edit', selCat, selItem, 'inbound')">
        <font-awesome-icon icon="pen" class="floating" />
    </a>
    <a v-if="doReject" class="float" id="times" @click="PopupModal()">
        <font-awesome-icon icon="times" class="floating" />
    </a>
    <Loader id="loader" v-if="loading" />
</template>

<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import CCModal from '@/components/modal-components/CCModal.vue'
import Loader from "@/components/shared/Loader.vue"
import { isEmpty, sleep, toCMS, download_file, isUrl } from "@/share/util"
import eventBus from '@/share/util'
import {
    selMode,
    selCat,
    selEntity,
    selCollection,
    putApprove,
    getList,
    LoadList4Dic,
    LoadList4Sub,
    delReject,
    selItem
} from "@/share/share";

const loading = ref(false);

const doApproval = computed(() => selMode.value == 'Approval' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doEdit = computed(() => selMode.value == 'Approval' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const doReject = computed(() => selMode.value == 'Approval' && (!isEmpty(selEntity) || !isEmpty(selCollection)))

// APPROVE /////////////////////////////////////////////////////////////////////////

const Approve = async () => {

    const cat = selCat.value
    const name = cat == 'entity' ? selEntity.Entity : selCollection.Entity;

    // check to be approved item is New OR Updated
    // DO NOT USE 'lsEnt', 'lsCol', get list from coldb 'existing'

    let flagCreate = true;
    {
        const de = await getList(cat, "existing")
        if (de.error != null) {
            notify({
                title: "Error: Get Existing List",
                text: de.error,
                type: "error"
            })
            return
        }
        const lsExisting = de.data as string[];
        lsExisting.forEach((val) => {
            if (val == name) {
                flagCreate = false;
            }
        });
        // alert(`flagCreate flag: ${flagCreate}`)
    }

    // do approve
    {
        // waiting... 1
        loading.value = true
        document.body.style.pointerEvents = "none"

        let validation_ok = true;

        const msg = flagCreate ? 'new item' : 'modified item'
        const de = await putApprove(name, cat)
        if (de.error != null) {

            if (isUrl(de.error, "http:", "https:")) {

                // only testing now
                // {
                //     const de_download = await getFile(de.error);
                //     console.log(de_download.data);
                // }

                download_file(de.error, "report.log");

                notify({
                    title: "Approved with Validation Issue",
                    text: "refer to downloaded report for issues",
                    type: "warn"
                })
                validation_ok = false;

            } else {

                notify({
                    title: `Approval Failed on ${msg}`,
                    text: de.error,
                    type: "error"
                })

                // release waiting...3
                document.body.style.pointerEvents = "auto";
                loading.value = false
                return
            }
        }

        // waiting... 2
        await sleep(3000)
        document.body.style.pointerEvents = "auto";
        loading.value = false

        if (validation_ok) {
            notify({
                title: `Approval`,
                text: `${name} is approved to dictionary`,
                type: "success"
            })
        }
    }

    await LoadList4Sub('entity');
    await LoadList4Sub('collection');
    await LoadList4Dic('entity');
    await LoadList4Dic('collection');

    selEntity.Reset();
    selCollection.Reset();
    eventBus.emit('check-submission', 'from BtnApproval');
};

// REJECT /////////////////////////////////////////////////////////////////////////

const rejName = computed(() => selCat.value == 'entity' ? selEntity.Entity : selCollection.Entity)

// *** use "confirm-cancel" modal ***
const PopupModal = async () => {

    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: `Reject candidate '${rejName.value}' ?`,
                fontsize: "13px",
                width: "20%",
                height: "10%",
            },
        })) === 'confirm') {
            {
                const de = await delReject(rejName.value, selCat.value)
                if (de.error != null) {
                    notify({
                        title: "Error: Reject Item",
                        text: de.error,
                        type: "error"
                    })
                    return
                }
                notify({
                    title: "Reject Done",
                    text: `candidate item ${rejName} has been rejected`,
                    type: "success"
                })

                // 'inbound' db-col for candidates list
                await LoadList4Sub('entity');
                await LoadList4Sub('collection');
                await LoadList4Dic('entity');
                await LoadList4Dic('collection');
                selEntity.Reset();
                selCollection.Reset();
                eventBus.emit('check-submission', 'from BtnReject');
            }
        }
    } catch (e) {
        switch (e) {
            case 'cancel':
                break
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float {
    position: fixed;
    width: 60px;
    height: 60px;
    right: 40px;
    bottom: 110px;
    background-color: #bbb;
    color: #fff;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
    opacity: 90%;
}

.float:hover {
    background-color: rgb(34, 172, 29);
    cursor: pointer;
    opacity: 100%;
}

.floating {
    margin-top: 22px;
    color: white;
}

#check {
    bottom: 180px;
}

#check:hover {
    background-color: rgb(34, 172, 29);
}

#pen {
    bottom: 110px;
}

#pen:hover {
    background-color: rgb(90, 51, 243);
}

#times {
    bottom: 40px;
}

#times:hover {
    background-color: rgb(221, 82, 44);
}
</style>
