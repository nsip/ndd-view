<template>
    <DotLoader class="centered-element" />
</template>

<script lang="ts" setup>
import { DotLoader } from "vue3-spinner";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.centered-element {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: auto;
}
</style>
