<template>
    <div v-if="isNotEmpty(selEntity.Entity)">
        <div class="area">
            <span class="category">Name:</span>
            <span class="content">{{ selEntity.Entity }}</span>
            <button v-if="selMode == 'dictionary' || selMode == 'approval'" id="edit-btn" @click="PopupModal()">
                <font-awesome-icon icon="pen" />
            </button>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { selEntity, editItemName, selMode, Refresh, LoadList4Sub } from "@/share/share";
import { isNotEmpty } from "@/share/util";
import NameUpdateModal from '@/components/modal-components/NameUpdate.vue'

const oriName = (name: string) => {
    if (selMode.value == 'approval') {
        if (name.includes(')=>')) {
            const parts = name.split('=>')
            return parts[0].slice(0, parts[0].lastIndexOf('('))
        } else {
            const o = name.lastIndexOf('(')
            const c = name.lastIndexOf(')')
            const v = name.slice(o + 1, c)
            if (!isNaN(Number(v))) {
                return name.slice(0, o)
            }
        }
    }
    return name
}

const idFromSubFullName = (name: string) => {
    if (selMode.value == 'approval') {
        if (name.includes(')=>')) {
            const parts = name.split('=>')
            const o = parts[0].lastIndexOf('(')
            const c = parts[0].lastIndexOf(')')
            return parts[0].slice(o + 1, c)
        } else {
            const o = name.lastIndexOf('(')
            const c = name.lastIndexOf(')')
            const v = name.slice(o + 1, c)
            if (!isNaN(Number(v))) {
                return v
            }
        }
    }
    return ''
}

const PopupModal = async () => {

    let oldName = oriName(selEntity.Entity)

    try {
        const result = await renderOverlay(NameUpdateModal, {
            props: {
                uname: oldName,
            },
        }) as any
        // console.log(":::", result)
        const de = await editItemName(oldName, result.newName, selMode.value == 'approval', 'entity')
        if (de.error != null) {
            notify({
                title: "Error: Edit Entity Name",
                text: de.error,
                type: "error"
            })
            return
        }
        notify({
            title: `${oldName} is updated as ${result.newName}`,
            text: "",
            type: "success"
        })

        await LoadList4Sub('entity')
        await LoadList4Sub('collection')

        const id = idFromSubFullName(selEntity.Entity)
        const newSubFullName = `${oldName}(${id})=>${result.newName}(${id})`
        await Refresh(newSubFullName, "inbound")

    } catch (e) {
        switch (e) {
            case 'cancel':
                console.log('cancel')
                break
        }
    }
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
