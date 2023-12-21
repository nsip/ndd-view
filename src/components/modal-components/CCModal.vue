<template>
    <div id="modal">
        <!-- <span id="prefix">{{ props.text }}</span> -->
        <span id="prefix" v-html="htmlText"></span>
        <button id="btn-confirm" @click="resolve('confirm')">confirm</button>
        <button id="btn-cancel" @click="reject('cancel')">cancel</button>
    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta } from '@unoverlays/vue'

const props = defineProps({
    text: String,
    fontsize: String,
    width: String,
    height: String,
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

const htmlText = computed(() => {
    let fs = '15px';
    if (props.fontsize != undefined && props.fontsize != null && props.fontsize.endsWith('px')) {
        fs = props.fontsize;
    }
    if (props.text != undefined) {
        let t = props.text.replace(/\n/g, '<br>')
        t = t.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        return `<p style="font-size: ${fs};">` + t + '</p>'
    }
})

onMounted(() => {
    document.body.style.pointerEvents = "none";
    document.getElementById("modal")!.style.pointerEvents = "auto";
})

onUnmounted(() => {
    document.body.style.pointerEvents = "auto";
})

///////////////////////////////////////////////////////

// for invoker confirm using

// *** style variables ***

// for labels, etc.
let leftColumn1 = '20px'
let topRow1 = '10px'

// for buttons
let rightColumn1 = '10px'
let rightColumn2 = '75px'
let bottomRow1 = '10px'

</script>

<style scoped>
#modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: v-bind('props.width');
    height: v-bind('props.height');
    background-color: rgb(150, 180, 180);
    opacity: 0.95;
    border-radius: 20px;
}

/* 1st line */

#prefix {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow1');
    font-size: large;
    font-family: Trebuchet MS, sans-serif;
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