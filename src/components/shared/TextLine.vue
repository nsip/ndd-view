<template>
    <div class="strike">
        <span>{{ text }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    text: String,
    textAlign: String,
    textColor: String,
    lineHeight: String,
    lineColor: String,
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.strike {
    display: block;
    text-align: v-bind(textAlign);
    overflow: hidden;
    white-space: nowrap;
    margin-top: 1.5%;
    margin-left: 1%;
    margin-bottom: 1%;
    font-style: italic;
    color: v-bind(textColor);
}

.strike>span {
    position: relative;
    display: inline-block;
}

.strike>span:before,
.strike>span:after {
    content: "";
    position: absolute;
    top: 40%;
    width: 9999px;
    height: v-bind(lineHeight);
    background: v-bind(lineColor);
}

.strike>span:before {
    right: 90%;
    margin-right: 15px;
}

.strike>span:after {
    left: 90%;
    margin-left: 15px;
}
</style>
