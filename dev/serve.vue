<script>
import Vue from "vue";
import VirtualScroll from "@/virtual-scroll.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    VirtualScroll,
  },

  data() {
    return {
      items: [],
    };
  },

  created() {
    for (let i = 0; i < 20; i++) {
      this.items.push({
        id: i,
        text: `Line ${i + 1}`,
      });
    }
  },
});
</script>

<template>
  <div id="app">
    <virtual-scroll :items="items" id="id" :overflow="5" :item-height="60">
      <template v-slot="{ item }">
        {{ item.text }}
      </template>
    </virtual-scroll>
  </div>
</template>
