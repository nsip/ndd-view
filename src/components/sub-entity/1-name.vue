<template>
    <div v-if="isNotEmpty(selEntity.Entity)">
        <div class="area">
            <span class="category">Name:</span>
            <span class="content">{{ selEntity.Entity }}</span>
            <button v-if="selMode == 'Dictionary' || selMode == 'Approval'" id="edit-btn" @click="Modal()">
                <font-awesome-icon icon="pen" />
            </button>
        </div>
        <hr />
    </div>
</template>

<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { selEntity, editItemName, selMode, Refresh, LoadList4Sub, selItem, IsItemEditable, PeekID } from "@/share/share";
import { isNotEmpty } from "@/share/util";
import NameUpdateModal from '@/components/modal-components/NameUpdate.vue'

const oriName = (name: string) => {
    if (selMode.value == 'Approval') {
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
    if (selMode.value == 'Approval') {
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

const Modal = async () => {

    let oldName = oriName(selEntity.Entity)

    if (selMode.value == 'Dictionary') {
        if (!await IsItemEditable(oldName)) {
            notify({
                title: "",
                text: `[ ${oldName} ] is pending, cannot do further edit until approved or rejected`,
                type: "warn"
            })
            return
        }
    }

    try {
        const result = await renderOverlay(NameUpdateModal, {
            props: {
                uname: oldName,
            },
        }) as any
        // console.log(":::", result)

        if ((result.newName as string).trim().length == 0) {
            notify({
                title: "Error: Empty Entity Name",
                text: "",
                type: "error"
            })
            return
        }

        const de = await editItemName(oldName, result.newName, selMode.value == 'Approval', 'entity')
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

        let id = idFromSubFullName(selEntity.Entity)
        if (id.trim().length == 0) {
            id = await PeekID(selEntity.Entity)
        }

        console.log("1", id, " - ", selEntity.Entity)

        let newSubFullName = ""
        if (id.length > 0) {
            newSubFullName = `${oldName}(${id})=>${result.newName}(${id})`
        } else {
            newSubFullName = result.newName
        }
        if (selMode.value == 'Approval') {

            console.log("2", newSubFullName)

            selItem.value = newSubFullName
        }
        await Refresh("inbound")

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
