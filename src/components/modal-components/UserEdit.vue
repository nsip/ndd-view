<template>
    <div id="modal">

        <span id="prefix-user">user:</span>
        <span id="value-user">{{ props.uname }}</span>

        <span id="prefix-set-admin">admin:</span>
        <select id="value-set-admin" v-model="valAdmin">
            <option :value="true" :selected="props.admin">Yes</option>
            <option :value="false" :selected="!props.admin">No</option>
        </select>
        <span id="note-set-admin">(can approve submitted item, etc.)</span>

        <span id="prefix-set-active">active:</span>
        <select id="value-set-active" v-model="valActive">
            <option :value="true" :selected="props.active">Yes</option>
            <option :value="false" :selected="!props.active">No</option>
        </select>
        <span id="note-set-active">(user active status)</span>

        <span id="prefix-delete">delete:</span>
        <select id="value-delete" v-model="valDelete">
            <option :value="true" :selected="props.delete">Yes</option>
            <option :value="false" :selected="!props.delete">No</option>
        </select>
        <span id="note-delete">(delete an inactive user)</span>

        <button id="btn-confirm" @click="resolve({ admin: valAdmin, active: valActive, delete: valDelete })">confirm</button>
        <button id="btn-cancel" @click="reject('cancel')">cancel</button>

    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta } from '@unoverlays/vue'

const props = defineProps({
    uname: String,
    admin: Boolean,
    active: Boolean,
    delete: Boolean,
})

// Define the events used in the component(optional)
// This allows you to use hints in components
// defineEmits(['cancel', 'confirm', 'update:visible'])

// Get Overlay information from useOverlayMeta
const { visible, resolve, reject } = useOverlayMeta({
    // Animation duration to avoid premature destruction of components
    // Only use component in template and no need to define
    animation: 100
})

///////////////////////////////////////////////////////

// for invoker confirm using

const valAdmin = ref(props.admin)
const valActive = ref(props.active)
const valDelete = ref(props.delete)

// let mounted = false;

// onMounted(async () => {
//     valAdmin.value = props.admin
//     valActive.value = props.active
//     mounted = true;
// })

// modal show event
// watch(
//     () => props.visible,
//     (newValue, oldValue) => {
//         if (newValue == true && oldValue == false) {
//             valAdmin.value = props.admin
//             valActive.value = props.active
//             console.log('show modal')
//         }
//     }
// )

///////////////////////////////////////////////////////

// *** style variables ***

// for labels, etc.
let leftColumn1 = '30px'
let leftColumn2 = '120px'
let leftColumn3 = '190px'
let topRow1 = '10px'
let topRow2 = '45px'
let topRow3 = '80px'
let topRow4 = '115px'

// for buttons
let rightColumn1 = '15px'
let rightColumn2 = '80px'
let bottomRow1 = '15px'

</script>

<style scoped>
#modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 200px;
    background-color: rgb(230, 230, 230);
    opacity: 0.95;
    border-radius: 20px;
}

/* 1st line */

#prefix-user {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow1');
    margin-top: 5px;
    font-size: large;
}

#value-user {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow1');
    margin-top: 5px;
    font-size: medium;
    font-style: italic;
    font-weight: bold;
}

/* 2nd line */

#prefix-set-admin {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow2');
    margin-top: 2px;
    font-size: large;
}

#value-set-admin {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow2');
    margin-top: 0px;
    font-size: 10;
}

#note-set-admin {
    position: absolute;
    left: v-bind('leftColumn3');
    top: v-bind('topRow2');
    margin-top: 5px;
    font-size: small;
    font-style: italic;
}

/* 3rd line */

#prefix-set-active {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow3');
    margin-top: 2px;
    font-size: large;
}

#value-set-active {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow3');
    margin-top: 0px;
    font-size: 10;
}

#note-set-active {
    position: absolute;
    left: v-bind('leftColumn3');
    top: v-bind('topRow3');
    margin-top: 5px;
    font-size: small;
    font-style: italic;
}

/* 4th line */

#prefix-delete {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow4');
    margin-top: 2px;
    font-size: large;
}

#value-delete {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow4');
    margin-top: 0px;
    font-size: 10;
}

#note-delete {
    position: absolute;
    left: v-bind('leftColumn3');
    top: v-bind('topRow4');
    margin-top: 5px;
    font-size: small;
    font-style: italic;
}

/* button */

#btn-cancel {
    background-color: rgb(225, 226, 224);
    position: absolute;
    right: v-bind('rightColumn2');
    bottom: v-bind('bottomRow1');
}

#btn-confirm {
    background-color: rgb(225, 226, 224);
    position: absolute;
    right: v-bind('rightColumn1');
    bottom: v-bind('bottomRow1');
}
</style>