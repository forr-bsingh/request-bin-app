<template>
  <div
    class="row-fluid"
    v-b-tooltip.bottom="'This message will self-destruct in ' + counter.max + ' seconds.'"
  >
    <b-progress
      :variant="alert.variant"
      :max="counter.max"
      :value="counter.init"
      :height="counter.progress"
    ></b-progress>
    <b-alert
      :show="counter.init"
      dismissible
      fade
      :variant="alert.variant"
      @dismissed="counter.init = 0"
      @dismiss-count-down="counterChange"
    >
      <p class="message">{{ alert.message }}</p>
      <n-link
        v-if="alert.link !== ''"
        :to="alert.link"
        :class="link"
        :event="alert.link === '' ? '' : 'click'"
      >
        <h6>Click here to go there.</h6>
      </n-link>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: "AlertBox",
  created() {
    this.$nuxt.$on("show-alert", this.showAlert);
  },
  data() {
    return {
      alert: {
        message: "",
        link: "",
        variant: "info",
      },
      counter: {
        max: 10,
        init: 0,
        progress: "0px",
      },
      link: {
        "text-center": true
      }
    };
  },
  methods: {
    showAlert: function (alert) {
      this.alert = alert;
      this.counter.progress = "2px";
      this.counter.init = this.counter.max;
    },
    counterChange(counter) {
      this.counter.init = counter;
      if (this.counter.init === 0) {
        this.counter.progress = "0px";
      }
    },
  },
};
</script>

<style>
.message {
  margin: 5px 5px 5px;
  font-size: 16px;
  align-items: center;
  word-break: break-all;
  padding: 0 20px;
  font-family: Source Code Pro, monospace;
}
</style>