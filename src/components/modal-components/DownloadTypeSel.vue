<template>
    <div id="modal">

        <label id="notification">{{ props.notification }}</label>

        <label id="prefix-selection">Dump Type: </label>

        <div class="type-input">
            <span v-for="choice in choices">
                &nbsp;
                <input v-model="type" type="radio" name="type" :value="choice" @change="select" />
                <label>{{ choice }}</label>
            </span>
        </div>

        <button id="btn-confirm" @click="resolve(type)">confirm</button>
        <button id="btn-cancel" @click="reject('cancel')">cancel</button>

    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta } from '@unoverlays/vue'
import { reactive } from 'vue';

// Define the events used in the component(optional)
// This allows you to use hints in components
// defineEmits(['cancel', 'confirm', 'update:visible'])

// Get Overlay information from useOverlayMeta
const { visible, resolve, reject } = useOverlayMeta({
    // Animation duration to avoid premature destruction of components
    // Only use component in template and no need to define
    animation: 100
})

const choices = reactive([
    "JSON", "CSV"
])

const type = ref(choices[0]);

const select = () => { };

///////////////////////////////////////////////////////

// for invoker confirm using

const props = defineProps({
    notification: String
})

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
let leftColumn2 = '230px'
let topRow1 = '10px'
let topRow2 = '40px'
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
    width: 400px;
    height: 130px;
    background-color: rgb(200, 200, 200);
    opacity: 0.95;
    border-radius: 20px;
}

/* 1st line */

#notification {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow1');
    margin-top: 5px;
    font-size: normal;
}

/* 2nd line */

#prefix-selection {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow2');
    margin-top: 20px;
    font-size: large;
}

/* 3rd line */

.type-input {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow2');
    margin-top: 20px;
    font-size: large;
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