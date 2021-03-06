<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Zones msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Zones from "@/components/Zones.vue";

export default {
  name: "Home",
  components: {
    Zones
  }
};
</script>
