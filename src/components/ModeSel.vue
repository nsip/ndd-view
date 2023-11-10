<template>
    <div class="page_mode">

        <!-- same 'name', auto single selection -->

        <input class="selection" type="radio" name="mode" value="" checked @click="select('normal')" />
        <label>normal</label>

        <input v-if="loginAsAdmin && !isSubmitListEmpty" class="selection" type="radio" name="mode" value="" @click="select('approval')" />
        <label v-if="loginAsAdmin && !isSubmitListEmpty">approval</label>

        <input v-if="loginAsAdmin" class="selection" type="radio" name="mode" value="" @click="select('admin')" />
        <label v-if="loginAsAdmin">admin</label>

    </div>
</template>

<script setup lang="ts">

import { loginAsAdmin, Mode, selType, selEntity, selCollection, aim, selClsPath, selChildren, isSubmitListEmpty } from "@/share/share";

const select = (mode: string) => {

    Mode.value = mode;

    // console.log(Mode.value);

    (() => {
        selEntity.Reset();
        selCollection.Reset();
        selClsPath.value = [];
        selChildren.value = [];
        aim.value = "";
    })();

    switch (mode) {
        case "normal":
            selType.value = "entity";
            break;
        case "approval":
            selType.value = "entity";
            break;
        case "admin":
            selType.value = "";
            break;
    }
};
</script>

<style scoped>
.page_mode {
    float: right;
    margin-bottom: 1%;
    margin-right: 1%;
}
</style>
