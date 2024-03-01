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

        <span id="prefix-reset-pwd">reset password:</span>
        <input type="text" id="value-reset-pwd" v-model="valNewPwd" :placeholder="valNewPwdPH" :title="valNewPwdPH">

        <button id="btn-confirm" @click="resolve({ admin: valAdmin, active: valActive, delete: valDelete, pwd: valNewPwd })">confirm</button>
        <button id="btn-cancel" @click="reject('cancel')">cancel</button>

    </div>
</template>

<script setup lang="ts">

import { useOverlayMeta } from '@unoverlays/vue'
import { getPwdRule } from '@/share/share'

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

onMounted(() => {
    document.body.style.pointerEvents = "none";
    document.getElementById("modal")!.style.pointerEvents = "auto";
})

onUnmounted(() => {
    document.body.style.pointerEvents = "auto";
})

///////////////////////////////////////////////////////

// for invoker confirm using

const valAdmin = ref(props.admin)
const valActive = ref(props.active)
const valDelete = ref(props.delete)
const valNewPwd = ref('')
const valNewPwdPH = ref('')

// let mounted = false;

onMounted(async () => {
    const de = await getPwdRule();
    if (de.error != null) {
        alert(`${de.error}`)
        return
    }
    valNewPwdPH.value = de.data;

    // mounted = true;
})

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
const leftColumn1 = '30px'
const leftColumn2 = '120px'
const leftColumn3 = '190px'

const topRow1 = '10px'
const topRow2 = '45px'
const topRow3 = '80px'
const topRow4 = '115px'
const topRow5 = '150px'

// for buttons
const rightColumn1 = '15px'
const rightColumn2 = '80px'
const bottomRow1 = '15px'

</script>

<style scoped>
#modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 235px;
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
    font-family: Trebuchet MS, sans-serif;
}

#value-user {
    position: absolute;
    left: v-bind('leftColumn2');
    top: v-bind('topRow1');
    margin-top: 5px;
    font-size: large;
    font-style: italic;
    font-weight: bold;
    color: grey;
}

/* 2nd line */

#prefix-set-admin {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow2');
    margin-top: 2px;
    font-size: large;
    font-family: Trebuchet MS, sans-serif;
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
    font-family: Trebuchet MS, sans-serif;
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
    font-family: Trebuchet MS, sans-serif;
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

/* 5th line */

#prefix-reset-pwd {
    position: absolute;
    left: v-bind('leftColumn1');
    top: v-bind('topRow5');
    margin-top: 2px;
    font-size: normal;
    font-family: Trebuchet MS, sans-serif;
}

#value-reset-pwd {
    position: absolute;
    left: v-bind('leftColumn3');
    top: v-bind(topRow5);
    margin-top: 0px;
    font-size: 11;
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