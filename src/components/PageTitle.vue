<template>
    <div>
        <span class="title">National Education Data Dictionary</span>
        <button class="btn-exit" title="logout?" @click="PopupModal()">Exit</button>
        <span class="user-name">{{ loginUser }}</span>
        <hr class="sep" />
    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { notify } from "@kyvg/vue3-notification";
import { loginUser, putLogout } from "@/share/share";
import { URL_SIGN } from "@/share/ip"
import CCModal from '@/components/modal-components/CCModal.vue'

// *** use "confirm-cancel" modal to logout ***
const PopupModal = async () => {
    try {
        if (String(await renderOverlay(CCModal, {
            props: {
                text: "Logout ?",
                fontsize: "14px",
                width: "10%",
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

.user-name {
    float: right;
    margin-top: 0.3%;
    margin-right: 0.8%;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: bold;
}

.btn-exit {
    float: right;
    margin-top: 0.2%;
    margin-right: 1%;
    padding: 2px 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: #7a7e81;
    color: #fff;
    transition: background-color 0.3s ease;
}

.sep {
    margin-top: 0.2%;
}
</style>
