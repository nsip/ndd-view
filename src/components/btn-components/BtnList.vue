<template>
    <a class="float" id="download" title="download all" @click="dump()">
        <font-awesome-icon icon="download" class="floating" />
    </a>
</template>

<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { ModalOn, getDump, selType } from "@/share/share";
import eventBus from '@/share/util'

const dump = async () => {
    const r = await getDump(selType.value, "existing")
    alert(r.data)

    // http://api.data-dictionary.test/download/dump-entity.zip
    
}

const PopupModal = async () => {
    if (ModalOn.value) {
        return
    }
    ModalOn.value = true

    // try {

    //     const result = await renderOverlay(UserAddModal) as any
    //     // console.log(":::", result)

    //     const de = await postUserNew(result.uname, result.email, result.password)
    //     if (de.error != null) {
    //         notify({
    //             title: "Error: Create New User",
    //             text: de.error,
    //             type: "error"
    //         })
    //         ModalOn.value = false
    //         return
    //     }

    //     notify({
    //         title: `${result.uname} is created`,
    //         text: "",
    //         type: "success"
    //     })

    // } catch (e) {
    //     switch (e) {
    //         case 'cancel':
    //             console.log('cancel')
    //             break
    //     }
    // }

    // /// refresh user list table from other component...
    // eventBus.emit('reload-table', 'from BtnAdmin');
    ///

    ModalOn.value = false
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float {
    position: fixed;
    width: 60px;
    height: 60px;
    left: 20%;
    bottom: 40px;
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
</style>
