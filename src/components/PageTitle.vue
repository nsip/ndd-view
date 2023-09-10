<template>
    <div>
        <span class="title"> National Education Data Dictionary </span>
        <button class="btn-as-link" title="logout?" @click="PopupModal()">{{ loginUser }}</button>
        <hr class="sep" />
    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { notify } from "@kyvg/vue3-notification";
import { loginUser, putLogout, ModalOn } from "@/share/share";
import { URL_SIGN } from "@/share/ip"
import CCModal from '@/components/shared/CCModal.vue'

// *** use "confirm-cancel" modal ***
const PopupModal = async () => {
    if (ModalOn.value) {
        return
    }
    ModalOn.value = true
    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: "Logout ?",
                width: "12%",
                height: "9%",
            },
        })) === 'confirm') {
            const de = await putLogout()
            if (de.error != null) {
                notify({
                    title: "Error: Logout",
                    text: de.error,
                    type: "error"
                })
                ModalOn.value = false
                return
            }
            location.replace(URL_SIGN);
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
.title {
    float: center;
    text-align: center;
    font-size: 160%;
    font-weight: bold;
}

.btn-as-link {
    float: right;
    margin-top: 0.4%;
    margin-right: 1%;
    background: none;
    border: none;
}

.sep {
    margin-top: 0.2%;
}
</style>
