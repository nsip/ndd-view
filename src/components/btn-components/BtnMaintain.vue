<template>

    <a class="float" id="upload-csv" @click="upload_csv" title="upload csv file to update dictionary">
        <font-awesome-icon icon="file-upload" class="floating" />
        <input type="file" name="file" id="fileInputCSV" style="display: none;">
    </a>

    <a class="float" id="upload-json" @click="upload_json" title="upload zip package to recover dictionary">
        <font-awesome-icon icon="upload" class="floating" />
        <input type="file" name="file" id="fileInputJSON" style="display: none;">
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
import { patchReCom, patchValidation, globalMsg, postUpload2Recover } from '@/share/share';
import MsgModal from '@/components/modal-components/MsgModal.vue'
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { notify } from "@kyvg/vue3-notification";
import { sleep } from "@/share/util";
import Loader from "@/components/shared/Loader.vue"
import CCModal from '@/components/modal-components/CCModal.vue'

const loading = ref(false);
const fileInputJSON = ref();
const fileInputCSV = ref();

onMounted(async () => {

    globalMsg.value = `Select Button to Do Uploading for Restoring, or Whole Backend Data Validation, or Reconstruct Whole Backend Dictionary Data`;

    // -- open file dialog -- //

    fileInputJSON.value = document.getElementById('fileInputJSON') as HTMLInputElement;
    // Add an event listener to the file input element
    fileInputJSON.value.addEventListener('change', async (event: Event) => {

        // const input = event.target as HTMLInputElement;
        // const files = input.files;
        // const file: File | undefined = files?.[0];

        const file: File | undefined = fileInputJSON.value.files?.[0];
        if (file) {
            console.log('Selected file:', file);
            try {
                if (String(await renderOverlay(CCModal, {
                    props: {
                        text: `Overwrite ALL Current Dictionary & Discard ALL Pending Items?`,
                        fontsize: "13px",
                        width: "20%",
                        height: "10%",
                        color: 'red',
                    },
                })) === 'confirm') {
                    const de = await postUpload2Recover(file)
                    if (de.error != null) {
                        notify({
                            title: "Error: Recovery",
                            text: de.error,
                            type: "error"
                        })
                        return
                    }
                    notify({
                        title: "Recovery Successful",
                        text: 'All dictionary are recovered by uploaded package, All pending items are discarded',
                        type: "success"
                    })
                }
            } catch (e) {
                switch (e) {
                    case 'cancel':
                        break
                }
            }
        }
    });

    ///////////////////////////////////////////////

    fileInputCSV.value = document.getElementById('fileInputCSV') as HTMLInputElement;

    fileInputCSV.value.addEventListener('change', async (event: Event) => {

        const file: File | undefined = fileInputCSV.value.files?.[0];
        if (file) {
            console.log('Selected file:', file);
            try {
                if (String(await renderOverlay(CCModal, {
                    props: {
                        text: `Update Current Dictionary & Discard ALL Pending Items?`,
                        fontsize: "13px",
                        width: "20%",
                        height: "10%",
                        color: 'red',
                    },
                })) === 'confirm') {

                    alert('TODO:')

                    // const de = await postUpload2Recover(file)
                    // if (de.error != null) {
                    //     notify({
                    //         title: "Error: Recovery",
                    //         text: de.error,
                    //         type: "error"
                    //     })
                    //     return
                    // }
                    // notify({
                    //     title: "Recovery Successful",
                    //     text: 'All dictionary are recovered by uploaded package, All pending items are discarded',
                    //     type: "success"
                    // })
                }
            } catch (e) {
                switch (e) {
                    case 'cancel':
                        break
                }
            }
        }
    });

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

const upload_json = async () => {
    // clear previous selection
    fileInputJSON.value.value = ''
    // open file selection dialog for new selection
    fileInputJSON.value.click();
}

const upload_csv = async () => {
    // clear previous selection
    fileInputCSV.value.value = ''
    // open file selection dialog for new selection
    fileInputCSV.value.click();
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

#upload-csv {
    bottom: 250px;
}

#upload-csv:hover {
    background-color: rgb(30, 226, 240);
}

#upload-json {
    bottom: 180px;
}

#upload-json:hover {
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
