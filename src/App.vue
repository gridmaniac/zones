<template>
  <v-app>
    <!-- <v-app-bar app color="gray" dark>
      <div class="text-h4">Zones</div>
    </v-app-bar> -->

    <v-main>
      <Zones />
    </v-main>
  </v-app>
</template>

<script>
import Zones from "./components/Zones";

export default {
  name: "App",

  components: {
    Zones
  },

  data: () => ({
    //
  })
};
</script>
