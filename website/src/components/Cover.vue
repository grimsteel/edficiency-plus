<template>
    <div class="cover">
        <div class="cover-content">
            <a href="/" class="navbar-brand d-flex align-items-center ">
                <img style="width: 32px; height: 32px;" class="mr-2" :src="EDFIcon" alt="EDF+" />
                <span class="font-weight-bold" style="font-size: 1.5rem">Edficiency+</span>
            </a>
            <h1>Unlock Edficiency's <span style="color: #feda61">maximum potential.</span></h1>
            <div style="display: flex; justify-content: end;" class="align-items-baseline">
                <a href="#"><button class="btn lg-btn btn-outline-primary get-edf">Get the extension →</button></a>
            </div>
            <div class="scroll-down-icon">
                ↓
            </div>
        </div>
    </div>
</template>
<script setup>
import EDFIcon from "../assets/icon-128.png";
</script>

<style scoped>
.cover {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to right, #013c70, #2b2bff);
}

.cover-content {
    text-align: center;
    color: #fff;
}

h1 {
    font-size: 3rem;
    font-weight: bold;
}

.scroll-down-icon {
    font-size: 2rem;
    margin-top: 2rem;
}
</style>
