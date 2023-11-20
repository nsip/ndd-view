<template>
    <a class="float" id="check" @click="Approve()" v-if="showBtnApproval">
        <font-awesome-icon icon="check" class="floating" />
    </a>
    <a class="float" id="times" @click="PopupModal()" v-if="showBtnReject">
        <font-awesome-icon icon="times" class="floating" />
    </a>
</template>
 
<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import CCModal from '@/components/shared/CCModal.vue'
import { isEmpty } from "@/share/util"
import eventBus from '@/share/util'
import {
    selType,
    selEntity,
    selCollection,
    putApprove,
    getList,
    LoadCurrentList,
    delReject,
    Mode,
    ModalOn
} from "@/share/share";

const showBtnApproval = computed(() => Mode.value == 'approval' && (!isEmpty(selEntity) || !isEmpty(selCollection)))
const showBtnReject = computed(() => Mode.value == 'approval' && (!isEmpty(selEntity) || !isEmpty(selCollection)))

// APPROVE /////////////////////////////////////////////////////////////////////////

const Approve = async () => {

    const name = selType.value == "entity" ? selEntity.Entity : selCollection.Entity;

    // check New item OR Updated item to be approved
    // DO NOT USE 'lsEnt', 'lsCol', get list from coldb 'existing'

    let flagCreate = true;

    {
        const de = await getList(selType.value, "existing")
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
        const msg = flagCreate ? 'new item' : 'modified item'
        const de = await putApprove(name, selType.value)
        if (de.error != null) {
            notify({
                title: `Error: Approval ${msg}`,
                text: de.error,
                type: "error"
            })
            return
        }

        notify({
            title: `Approval`,
            text: `${name} is approved to dictionary`,
            type: "success"
        })
    }

    await LoadCurrentList("entity", "inbound");
    await LoadCurrentList("collection", "inbound");
    selEntity.Reset();
    selCollection.Reset();
    eventBus.emit('check-submission', 'from BtnApproval');
};

// REJECT /////////////////////////////////////////////////////////////////////////

const rejName = computed(() => selType.value == "entity" ? selEntity.Entity : selCollection.Entity)

// *** use "confirm-cancel" modal ***
const PopupModal = async () => {
    if (ModalOn.value) {
        return
    }
    ModalOn.value = true
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
                const de = await delReject(rejName.value, selType.value)
                if (de.error != null) {
                    notify({
                        title: "Error: Reject Item",
                        text: de.error,
                        type: "error"
                    })
                    ModalOn.value = false
                    return
                }
                notify({
                    title: "Reject Done",
                    text: `candidate item ${rejName} has been rejected`,
                    type: "success"
                })

                // 'inbound' db-col for candidates list
                await LoadCurrentList("entity", "inbound");
                await LoadCurrentList("collection", "inbound");
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
    ModalOn.value = false
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
    bottom: 110px;
}

#check:hover {
    background-color: rgb(34, 172, 29);
}

#times {
    bottom: 40px;
}

#times:hover {
    background-color: rgb(221, 82, 44);
}
</style>
