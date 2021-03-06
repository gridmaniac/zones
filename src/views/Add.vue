<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>
        <v-text-field
          label="Ссылка на изображение"
          v-if="!image"
          v-model="image"
          @input="onAddImage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Add",

  data: () => ({
    image: null,
  }),

  methods: {
    onAddImage() {
      this.$router.push(
        encodeURIComponent(
          JSON.stringify({
            url: this.image,
          })
        )
      );
    },
  },
};
</script>

