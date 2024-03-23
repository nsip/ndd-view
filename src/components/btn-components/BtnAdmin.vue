<template>
    <a class="float" id="plus" @click="Modal()" title="add new user">
        <font-awesome-icon icon="plus" class="floating" />
    </a>
</template>

<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { postUserNew } from "@/share/share";
import UserAddModal from '@/components/modal-components/UserAdd.vue'
import eventBus from '@/share/util'

const Modal = async () => {

    try {

        const result = await renderOverlay(UserAddModal) as any
        // console.log(":::", result)

        const de = await postUserNew(result.uname, result.email, result.password)
        if (de.error != null) {
            notify({
                title: "Error: Create New User",
                text: de.error,
                type: "error"
            })
            return
        }

        notify({
            title: `${result.uname} is created`,
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

    /// refresh user list table from other component...
    eventBus.emit('reload-table', 'from BtnAdmin');
    ///
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float {
    position: fixed;
    width: 60px;
    height: 60px;
    right: 40px;
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
