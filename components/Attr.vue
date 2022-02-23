<template>
  <div>
    <div class="row-fluid">
      <div class="row-fluid text-left">
        <div
          class="opblock opblock-summary clickable"
          @click="toggleThis"
          v-b-tooltip.hover
          title="Click to view usage"
        >
          <div class="request-details p5">
            {{ content.display }}
          </div>
        </div>
        <div v-bind:class="accordian" v-if="disableAccordian">
          <div
            v-if="content.description && content.description !== ''"
            class="opblock-summary p5"
          >
            <div class="request-details p5">Description:</div>
            <div class="p5">{{ content.description }}</div>
          </div>
          <div
            v-if="content.usage && content.usage !== ''"
            class="opblock-summary p5"
          >
            <div class="request-details p5">Usage:</div>
            <div class="p5">{{ content.usage }}</div>
          </div>
          <div
            v-if="content.examples && content.examples !== ''"
            class="opblock-summary p5"
          >
            <div class="request-details p5">Sample Response:</div>
            <div class="p5">{{ content.examples }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      isClosed: true,
    }
  },
  computed: {
    accordian: function () {
      return {
        closed: this.isClosed,
        opblock: !this.isClosed,
        'message-detail': !this.isClosed,
      }
    },
    disableAccordian: function () {
      return this.content.enabled
    },
  },
  methods: {
    toggleThis: function () {
      this.isClosed = !this.isClosed
    },
  },
}
</script>

<style></style>
