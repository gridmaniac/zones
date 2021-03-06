<template>
  <v-container fill-height>
    <v-row
      align="center"
      justify="center"
    >
      <v-col>
        <v-file-input
          label="Загрузить изображение"
          v-if="!image"
          v-model="file"
          @change="onImageLoad"
          accept="image/*"
          append-icon="mdi-camera"
        />
        <v-card dark style="line-height:0">
          <div
            class="zones"
            ref="zones"
            v-if="!!image"
            @mousemove="mouseMove"
            @mousedown="mouseDown"
          >
            <img
              draggable="false"
              :src="image"
              @mouseup="mouseUp"
            />
            <div class="zone" 
              :style="{
                left: newZone.x + 'px',
                top: newZone.y + 'px',
                width: newZone.width + 'px',
                height: newZone.height + 'px',
              }"
              v-if="isAdding"
            >
            </div>
            <div class="list">
              <div class="zone" 
                :style="{
                  left: zone.x + 'px',
                  top: zone.y + 'px',
                  width: zone.width + 'px',
                  height: zone.height + 'px',
                }"
                v-bind:key="zone.id"
                v-for="zone in zones"
                @mousedown.stop="goTo(zone.link)"
              ></div>
            </div>
          </div>
        </v-card>
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
      link: ''
    },
    baseWidth: 0,
    isAdding: false,
    zones: []
  }),

  methods: {
    async onImageLoad () {
      const toBase64 = async function (file) {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = e => {
            resolve(e.target.result)
          }
          reader.readAsDataURL(file)
        })
      }

      this.image = await toBase64(this.file)

      this.$nextTick(() => {
        this.baseWidth = this.getZonesRect().width
      })
    },
    mouseDown (e) {
      if (this.isAdding) return

      const { clientX, clientY } = e
      const pos = this.getRelPos(clientX, clientY)

      this.isAdding = true
      this.newZone.x = pos.x
      this.newZone.y = pos.y
      this.newZone.width = 0
      this.newZone.height = 0
    },
    mouseMove (e) {
      const { clientX, clientY } = e
      const pos = this.getRelPos(clientX, clientY)

      this.newZone.width = pos.x - this.newZone.x
      this.newZone.height = pos.y - this.newZone.y
    },
    mouseUp () {
      this.isAdding = false
      this.newZone.id = this.zones.length
      this.newZone.link = prompt('Добавить ссылку')
      if (!this.newZone.link) return
      this.zones.push({...this.newZone})
    },
    getRelPos (sourceX, sourceY) {
      const { x, y } = this.getZonesRect()
      return {
        x: sourceX - x,
        y: sourceY - y
      }
    },
    getZonesRect () {
      return this.$refs.zones.getBoundingClientRect()
    },
    goTo (link) {
      window.open(link, '_blank')
    },
    onResize () {
      const { width } = this.getZonesRect()
      const ratio = width / this.baseWidth
      this.zones.forEach((z, i) => {
        this.zones[i].x *= ratio
        this.zones[i].y *= ratio
        this.zones[i].width *= ratio
        this.zones[i].height *= ratio
      })
      this.baseWidth = width
    }
  },

  mounted () {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
};
</script>

<style>
  .zones {
    position: relative;
    user-select: none;
  }

  .zones > img {
    width: 100%;
  }

  .zone {
    position: absolute;
    border: 2px solid #0fc;
    background: rgba(51, 204, 204, 0.7);
    cursor: pointer;
  }

  .zones .list {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
