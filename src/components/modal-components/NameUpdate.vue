<template>
    <div id="modal">

        <span id="prefix-user">old name: </span>
        <span id="value-user">{{ props.uname }}</span>

        <span id="prefix-set-uname">new name:</span>
        <input id="value-set-uname" type="text" v-model="valUname">

        <button id="btn-confirm" @click="resolve({ newName: valUname })">confirm</button>
        <button id="btn-cancel" @click="reject('cancel')">cancel</button>

    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta } from '@unoverlays/vue'

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

const props = defineProps({
    uname: String, // old name
})

const valUname = ref("") // input new name

onMounted(() => {
    document.body.style.pointerEvents = "none";
    document.getElementById("modal")!.style.pointerEvents = "auto";
})

onUnmounted(() => {
    document.body.style.pointerEvents = "auto";
})

///////////////////////////////////////////////////////

// *** style variables ***

// for labels, etc.
let leftColumn1 = '30px'
let leftColumn2 = '150px'
let topRow1 = '10px'
let topRow2 = '45px'
let topRow3 = '80px'

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
    height: 120px;
    background-color: rgb(200, 200, 200);
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

#prefix-set-uname {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow2');
    margin-top: 2px;
    font-size: large;
    font-style: italic;
}

#value-set-uname {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow2');
    margin-top: 0px;
    font-size: 10;
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