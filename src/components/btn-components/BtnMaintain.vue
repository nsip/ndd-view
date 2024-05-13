<template>
    <a class="float" id="upload" @click="upload" title="upload zip package to update dictionary data">
        <font-awesome-icon icon="upload" class="floating" />
    </a>
    <a class="float" id="check-square" @click="validate" title="validate backend data">
        <font-awesome-icon icon="check-square" class="floating" />
    </a>
    <a class="float" id="file-circle-check" @click="reconstruct" title="re-construct backend data">
        <font-awesome-icon icon="file-circle-check" class="floating" />
    </a>
    <Loader id="loader" v-if="loading" />
</template>

<script setup lang="ts">
import { FileText } from '@/share/share';
import { patchReCom, patchValidation, globalMsg } from '@/share/share';
import MsgModal from '@/components/modal-components/MsgModal.vue'
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { notify } from "@kyvg/vue3-notification";
import { sleep } from "@/share/util";
import Loader from "@/components/shared/Loader.vue"

const loading = ref(false);

onMounted(async () => {
    globalMsg.value = `Click Button To Do Whole Backend Data Validation OR Reconstruct Whole Data`
})

const validate = async () => {

    // waiting... 1
    loading.value = true
    document.body.style.pointerEvents = "none"

    const de = await patchValidation("")
    if (de.error != null) {
        if (de.error.toString().endsWith('log')) {
            const text = await FileText(de.error.toString())
            if (text.length > 0) {
                if (String(await renderOverlay(MsgModal, {
                    props: {
                        text: text,
                        fontsize: "15px",
                        width: "62%",
                        height: "56%",
                    },
                })) === 'confirm') {
                }
            }
        } else {
            notify({
                title: `Validation Failed`,
                text: de.error,
                type: "warn"
            })
        }
    } else {
        notify({
            title: `Validation Passed`,
            text: "",
            type: "success"
        })
    }

    // waiting... 2
    await sleep(200)
    document.body.style.pointerEvents = "auto";
    loading.value = false
}

const reconstruct = async () => {

    // waiting... 1
    loading.value = true
    document.body.style.pointerEvents = "none"

    const de = await patchReCom("")
    if (de.error != null) {
        notify({
            title: `Restructure Failed`,
            text: de.error,
            type: "warn"
        })
    } else {
        notify({
            title: `Restructure Finished`,
            text: "",
            type: "success"
        })
    }

    // waiting... 2
    await sleep(200)
    document.body.style.pointerEvents = "auto";
    loading.value = false
}

const upload = async () => {

    alert("TODO")

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

#upload {
    bottom: 190px;
}

#upload:hover {
    background-color: rgb(30, 226, 240);
}

#check-square {
    bottom: 110px;
}

#check-square:hover {
    background-color: rgb(43, 80, 243);
}

#file-circle-check {
    bottom: 40px;
}

#file-circle-check:hover {
    background-color: rgb(17, 202, 44);
}
</style>
