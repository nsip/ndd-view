<template>
    <a class="float" id="check-square" @click="validate" title="validate backend data">
        <font-awesome-icon icon="check-square" class="floating" />
    </a>
    <a class="float" id="file-circle-check" @click="construct" title="re-construct backend data">
        <font-awesome-icon icon="file-circle-check" class="floating" />
    </a>
</template>

<script setup lang="ts">

const validate = async () => {
    alert('TODO: validation')
}

const construct = async () => {
    alert('TODO: construct')
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.float {
    position: fixed;
    width: 60px;
    height: 60px;
    right: 40px;
    bottom: 40px;
    background-color: #bbb;
    color: #fff;
    border-radius: 50px;
    text-align: center;
    box-shadow: 2px 2px 3px #999;
    opacity: 90%;
}

.float:hover {
    background-color: rgb(34, 172, 29);
    cursor: pointer;
    opacity: 100%;
}

.floating {
    margin-top: 22px;
    color: white;
}

#check-square {
    bottom: 110px;
}

#check-square:hover {
    background-color: rgb(43, 80, 243);
}

#file-circle-check {
    bottom: 40px;
}

#file-circle-check:hover {
    background-color: rgb(17, 202, 44);
}
</style>
