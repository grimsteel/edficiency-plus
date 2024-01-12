<template>
    <div class="divider"></div>
    <div class="container">
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p class="col-md-4 mb-0 text-muted">By <a href="https://github.com/grimsteel" class="text-muted">Siddhant Kameswar</a> and <a href="https://ruhangupta.com" class="text-muted">Ruhan Gupta</a></p>

    <a href="/" class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
      <img class="bi me-2" width="40" height="40" :src="EDFIcon">
    </a>

    <ul class="nav col-md-4 justify-content-end">
        <a href="#"><button class="btn btn-outline-primary get-edf">Get the extension →</button></a>
    </ul>
  </footer>
</div>
</template>
<script setup>
import EDFIcon from "../assets/icon-128.png";
</script>