<template>
    <div v-if="isNotEmpty(selCollection.Entity)">
        <div class="area">
            <span class="category">Name:</span>
            <span class="content">{{ selCollection.Entity }}</span>
            <button v-if="ModeOnDictionary()" id="edit-btn" @click="Modal()">
                <font-awesome-icon icon="pen" />
            </button>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { selCollection, putEditItemName, IsItemEditable, UpdatePendingStatus, ModeOnDictionary, ModeOnApproval } from "@/share/share";
import { isNotEmpty } from "@/share/util";
import NameUpdateModal from '@/components/modal-components/NameUpdate.vue'

const Modal = async () => {

    if (ModeOnDictionary()) {
        if (!await IsItemEditable(selCollection.Entity)) {
            notify({
                title: "",
                text: `[ ${selCollection.Entity} ] is pending, cannot do further edit until approved or rejected`,
                type: "warn"
            })
            return
        }
    }

    try {
        const result = await renderOverlay(NameUpdateModal, {
            props: {
                uname: selCollection.Entity,
            },
        }) as any
        // console.log(":::", result)

        if ((result.newName as string).trim().length == 0) {
            notify({
                title: "Error: Empty Collection Name",
                text: "",
                type: "error"
            })
            return
        }

        const de = await putEditItemName(selCollection.Entity, result.newName, ModeOnApproval(), 'collection')
        if (de.error != null) {
            notify({
                title: "Error: Edit Entity Name",
                text: de.error,
                type: "error"
            })
            return
        }
        notify({
            title: `${selCollection.Entity} is updated as ${result.newName}`,
            text: "",
            type: "success"
        })

    } catch (e) {
        switch (e) {
            case 'cancel':
                console.log('cancel')
                break
        }
    }

    await UpdatePendingStatus();
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.area {
    padding: 15px 0px 15px 10px;
    font-size: 17px;
    font-family: Arial, Helvetica, sans-serif, monospace;
    background-color: rgb(230, 230, 230);
    display: flex;
    flex-direction: row;
}

.category {
    text-align: left;
    width: 25%;
    font-size: 18px;
    font-weight: bold;
    margin-left: 2%;
    font-family: Arial Narrow, sans-serif;
}

.content {
    color: black;
    margin: 0px 0px 0px -50px;
    width: 100%;
    font-weight: bold;
    text-align: left;
    font-size: 15px;
}

#edit-btn {
    margin-right: 0.5vw;
}
</style>
