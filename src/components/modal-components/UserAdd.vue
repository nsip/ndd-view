<template>
    <div id="modal">

        <span id="prefix-user"></span>
        <span id="value-user">creating a new user</span>

        <span id="prefix-set-uname">uname:</span>
        <input id="value-set-uname" type="text" v-model="valUname">

        <span id="prefix-set-email">email:</span>
        <input id="value-set-email" type="text" v-model="valEmail">

        <span id="prefix-set-pwd">password:</span>
        <input id="value-set-pwd" type="text" v-model="valPassword">

        <button id="btn-confirm" @click="resolve({ uname: valUname, email: valEmail, password: valPassword })">confirm</button>
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

const valUname = ref("")
const valEmail = ref("")
const valPassword = ref("")

let mounted = false;

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
let leftColumn2 = '120px'
let leftColumn3 = '210px'
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
    left: v-bind('leftColumn1');
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

/* 3rd line */

#prefix-set-email {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow3');
    margin-top: 2px;
    font-size: large;
    font-style: italic;
}

#value-set-email {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow3');
    margin-top: 0px;
    font-size: 10;
}

/* 4th line */

#prefix-set-pwd {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow4');
    margin-top: 2px;
    font-size: large;
    font-style: italic;
}

#value-set-pwd {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow4');
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