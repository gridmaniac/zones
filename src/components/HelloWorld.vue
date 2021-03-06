<template>
  <v-container>
    <div
      class="zones"
      ref="zones"
    >
      <img
        draggable="false"
        src="https://api.time.com/wp-content/uploads/2015/02/cats.jpg?quality=85&w=1024&h=512&crop=1"
        @mousemove="mouseMove"
        @mousedown="mouseDown"
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
  </v-container>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    newZone: {
      id: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      link: ''
    },
    isAdding: false,
    zones: []
  }),

  methods: {
    mouseDown (e) {
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
      this.newZone.link = prompt('Add link')
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
    }
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
