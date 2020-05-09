<template>
  <div
    ref="container"
    :style="{
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`,
    }"
  >
    <div
      v-for="(item, index) in visibleItems"
      :key="id ? item[id] : index"
      :style="{ height: `${itemHeight}px` }"
    >
      <slot :item="item" :index="index"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "virtual-scroll", // vue component name

  props: {
    items: {
      type: Array,
      required: true,
    },

    itemHeight: {
      type: Number,
      required: true,
    },

    id: {
      type: String,
      default: "",
    },

    overflow: {
      type: Number,
      default: 5,
    },
  },

  data() {
    return {
      offsetTop: 0,
      screenHeight: 0,
      scrollY: 0,
    };
  },

  created() {
    this.setScreenHeight();

    window.addEventListener("resize", this.setScreenHeight);
    window.addEventListener("scroll", this.setScrollY);
  },

  mounted() {
    this.setOffsetTop();
  },

  updated() {
    this.setOffsetTop();
  },

  computed: {
    showBefore() {
      if (this.indexStart < this.overflow) {
        return this.indexStart;
      } else {
        return this.overflow;
      }
    },

    showAfter() {
      if (this.items.length - this.indexEnd < this.overflow) {
        return this.items.length - this.indexEnd;
      } else {
        return this.overflow;
      }
    },

    indexStart() {
      if (this.scrollY <= this.offsetTop) {
        return 0;
      } else {
        const indexStart = Math.ceil(
          (this.scrollY - this.offsetTop) / this.itemHeight
        );

        if (indexStart >= this.items.length) {
          return this.items.length;
        }

        return indexStart;
      }
    },

    indexEnd() {
      const indexEnd = this.indexStart + this.canSee;

      if (indexEnd >= this.items.length) {
        return this.items.length;
      }

      return indexEnd;
    },

    realIndexStart() {
      if (
        this.scrollY >
        this.offsetTop +
          this.items.length * this.itemHeight +
          this.overflow * this.itemHeight
      ) {
        return this.items.length;
      }

      return this.indexStart - this.showBefore;
    },

    realIndexEnd() {
      if (
        this.scrollY + this.screenHeight <=
        this.offsetTop - this.overflow * this.itemHeight
      ) {
        return 0;
      }

      return this.indexEnd + this.showAfter;
    },

    paddingTop() {
      return this.realIndexStart * this.itemHeight;
    },

    paddingBottom() {
      const paddingBottom =
        this.items.length * this.itemHeight -
        this.visibleItems.length * this.itemHeight -
        this.paddingTop;

      if (paddingBottom < 0) {
        return 0;
      }

      return paddingBottom;
    },

    canSee() {
      const canSee = Math.floor(this.screenHeight / this.itemHeight);
      let hidden = 0;

      if (this.scrollY < this.offsetTop - this.screenHeight) {
        return 0;
      }

      if (this.scrollY < this.offsetTop) {
        hidden += Math.floor((this.offsetTop - this.scrollY) / this.itemHeight);
      }

      return canSee - hidden;
    },

    visibleItems() {
      let visibleItems = this.items.slice(
        this.realIndexStart,
        this.realIndexEnd
      );

      return visibleItems;
    },
  },

  methods: {
    setOffsetTop() {
      let element = this.$refs.container;
      let top = 0;

      do {
        top += element.offsetTop;
        element = element.offsetParent;
      } while (element.offsetParent !== null);

      this.offsetTop = top;
    },

    setScreenHeight() {
      this.screenHeight = window.innerHeight;
    },

    setScrollY() {
      this.scrollY = window.scrollY;
    },
  },
};
</script>
