<template>
  <v-container fill-height class="py-10">
    <v-row align="center" justify="center">
      <v-col>
        <v-card dark style="line-height: 0">
          <div
            class="zones"
            ref="zones"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
          >
            <img draggable="false" :src="image" @mouseup="mouseUp" />
            <div
              class="zone"
              :style="{
                left: newZone.x + 'px',
                top: newZone.y + 'px',
                width: newZone.width + 'px',
                height: newZone.height + 'px',
              }"
              v-if="isAdding"
            ></div>
            <div class="list">
              <div
                class="zone"
                :style="{
                  left: zone.x + 'px',
                  top: zone.y + 'px',
                  width: zone.width + 'px',
                  height: zone.height + 'px',
                }"
                v-bind:key="zone.id"
                v-for="zone in zones"
                @click="goTo(zone.link)"
              >
                <div class="delete-zone" @click="deleteZone(zone.id)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 455.111 455.111"
                    style="enable-background: new 0 0 455.111 455.111"
                    xml:space="preserve"
                  >
                    <circle
                      style="fill: #e24c4b"
                      cx="227.556"
                      cy="227.556"
                      r="227.556"
                    />
                    <path
                      style="fill: #d1403f"
                      d="M455.111,227.556c0,125.156-102.4,227.556-227.556,227.556c-72.533,0-136.533-32.711-177.778-85.333  c38.4,31.289,88.178,49.778,142.222,49.778c125.156,0,227.556-102.4,227.556-227.556c0-54.044-18.489-103.822-49.778-142.222  C422.4,91.022,455.111,155.022,455.111,227.556z"
                    />
                    <path
                      style="fill: #ffffff"
                      d="M331.378,331.378c-8.533,8.533-22.756,8.533-31.289,0l-72.533-72.533l-72.533,72.533  c-8.533,8.533-22.756,8.533-31.289,0c-8.533-8.533-8.533-22.756,0-31.289l72.533-72.533l-72.533-72.533  c-8.533-8.533-8.533-22.756,0-31.289c8.533-8.533,22.756-8.533,31.289,0l72.533,72.533l72.533-72.533  c8.533-8.533,22.756-8.533,31.289,0c8.533,8.533,8.533,22.756,0,31.289l-72.533,72.533l72.533,72.533  C339.911,308.622,339.911,322.844,331.378,331.378z"
                    />
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                    <g></g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </v-card>
        <v-snackbar
          color="deep-purple accent-4"
          elevation="24"
          v-model="linkCopiedSnackbar"
        >
          Скопировано в буфер обмена</v-snackbar
        >
        <v-toolbar color="#101010">
          <v-spacer></v-spacer>
          <v-btn tile @click="copyLink">Скопировать ссылку на проект</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile @click="goTo('/')">Создать новый проект</v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Zones",

  data: () => ({
    file: null,
    image: null,
    newZone: {
      id: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      link: "",
    },
    baseWidth: 0,
    isAdding: false,
    zones: [],
    linkCopiedSnackbar: false,
  }),

  methods: {
    mouseDown(e) {
      if (this.isAdding) return;

      const { clientX, clientY } = e;
      const pos = this.getRelPos(clientX, clientY);

      this.isAdding = true;
      this.newZone.x = pos.x;
      this.newZone.y = pos.y;
      this.newZone.width = 0;
      this.newZone.height = 0;
    },
    mouseMove(e) {
      const { clientX, clientY } = e;
      const pos = this.getRelPos(clientX, clientY);

      this.newZone.width = pos.x - this.newZone.x;
      this.newZone.height = pos.y - this.newZone.y;
    },
    mouseUp() {
      this.isAdding = false;
      this.newZone.id = this.zones.length;
      this.newZone.link = prompt("Добавить ссылку");
      if (!this.newZone.link) return;
      this.zones.push({ ...this.newZone });

      this.save();
    },
    save() {
      const url = `/${encodeURIComponent(
        JSON.stringify({
          url: this.image,
          zones: this.zones,
          baseWidth: this.baseWidth,
        })
      )}`;

      window.history.pushState({}, "zones", url);
    },
    getRelPos(sourceX, sourceY) {
      const { x, y } = this.getZonesRect();
      return {
        x: sourceX - x,
        y: sourceY - y,
      };
    },
    getZonesRect() {
      return this.$refs.zones.getBoundingClientRect();
    },
    goTo(link) {
      window.open(link, "_blank");
      this.isAdding = false;
    },
    onResize() {
      const { width } = this.getZonesRect();
      const ratio = width / this.baseWidth;
      this.zones.forEach((z, i) => {
        this.zones[i].x *= ratio;
        this.zones[i].y *= ratio;
        this.zones[i].width *= ratio;
        this.zones[i].height *= ratio;
      });
      this.baseWidth = width;
      this.save();
    },
    deleteZone(id) {
      const idx = this.zones.findIndex((x) => x.id === id);
      this.zones.splice(idx, 1);
      this.save();
    },
    copyLink() {
      var dummy = document.createElement("input"),
        text = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);

      this.linkCopiedSnackbar = true;
    },
  },

  mounted() {
    const { url, zones, baseWidth } = JSON.parse(this.$route.params.data);
    this.image = url;

    this.$nextTick(() => {
      const { width } = this.getZonesRect();
      this.baseWidth = width;

      if (baseWidth) {
        const ratio = width / baseWidth;
        this.zones.forEach((z, i) => {
          this.zones[i].x *= ratio;
          this.zones[i].y *= ratio;
          this.zones[i].width *= ratio;
          this.zones[i].height *= ratio;
        });
      }
    });

    this.zones = zones || [];

    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style>
.zones {
  position: relative;
  user-select: none;
  /* max-height: 80vh; */
  /* overflow: hidden; */
}

.zones > img {
  width: 100%;
}

.zone {
  position: absolute;
  border: 2px solid #0fc;
  background: rgba(51, 204, 204, 0.5);
  cursor: pointer;
}

.zones .list {
  position: absolute;
  left: 0;
  top: 0;
}

.delete-zone {
  position: absolute;
  width: 1em;
  height: 1em;
  right: -0.5em;
  top: -0.5em;
  z-index: 1;
  display: none;
}

.zone:hover .delete-zone {
  display: block;
}
</style>
