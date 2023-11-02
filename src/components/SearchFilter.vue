<template>
    <div class="search-div">
        <input class="search-box" type="text" id="search" name="search" placeholder="searching ..." v-model="aim" ref="searchInput" />
        <button class="search-btn" @click="Search()">
            <font-awesome-icon icon="search" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { aim, Search } from "@/share/share";

const searchInput = ref();
let mounted = false;

onMounted(async () => {
    searchInput.value.focus()
    mounted = true;
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-div {
    background-color: rgb(220, 220, 220);
    width: 100%;
    height: 50px;
}

.search-box {
    float: left;
    width: 80%;
    padding: 5px 0px 5px 10px;
    margin-left: 2%;
    margin-top: 2%;
    background-color: rgb(230, 230, 230);
}

.search-btn {
    float: left;
    width: 10%;
    margin-left: 2%;
    margin-top: 2%;
    padding: 5px 5px 5px 5px;
    font-size: 14px;
}

hr {
    margin-top: 2%;
    margin-bottom: -1%;
}
</style>
