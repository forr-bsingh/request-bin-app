<template>
  <div>
    <div class="row-fluid">
      <div class="opblock opblock-summary">
        <div class="opblock-summary-method">
          {{ content.name }}
        </div>
        <div class="opblock-summary-path">
          <n-link :to="content.url"> {{ content.url }}</n-link>
        </div>
        <div class="opblock-summary-description">
          <button class="btn-delete" @click="deleteBin(content.name)" v-b-tooltip.hover.bottom="'Click to delete bin'"></button>
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
  methods: {
    deleteBin(name) {
      this.$axios
        .$delete(`/api/bins/${name}`)
        .then((response) => {
          $nuxt.$emit('reset-ui')
          $nuxt.$emit('update-bin-list')
        })
        .catch((error) => {
          $nuxt.$emit('reset-ui')
          this.showError(error.response.data.message)
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    },
  },
}
</script>

<style></style>
