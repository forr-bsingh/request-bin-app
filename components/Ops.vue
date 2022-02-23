<template>
  <div>
    <div class="row-fluid">
      <div class="opblock" v-bind:class="opsBlock">
        <div class="opblock-summary" v-bind:class="disableAccordian ? 'clickable' : ''" @click="toggleThis">
          <div
            class="opblock-summary-method method text-center"
            v-bind:class="opsSummaryBlock"
          >
            {{ content.operation }}
          </div>
          <div class="opblock-summary-path">
            {{ buildRequestURL }}
          </div>
          <div class="opblock-summary-description">
            {{ buildMessage }}
          </div>
        </div>
        <div v-bind:class="accordian" v-if="disableAccordian">
          <div class="row-fluid text-left request-details">
            <div v-if="content.identifier && content.identifier !== ''">
              Identifier:
              <pre class="prettify p10">{{ content.identifier }}</pre>
            </div>
            <div v-if="content.headers && content.headers !== ''">
              Headers:
              <pre class="prettify p10">{{ content.headers }}</pre>
            </div>
            <div v-if="content.request && content.request !== ''">
              Request:
              <pre class="prettify p10">{{ content.request }}</pre>
            </div>
            <div v-if="content.response && content.response !== ''">
              Response:
              <pre class="prettify p10">{{ content.response }}</pre>
            </div>
            <div v-if="content.createdAt && content.createdAt !== ''">
              Timestamp (in UTC):
              <pre class="prettify p10">{{ content.createdAt }}</pre>
            </div>
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
    url: {
      type: String,
      default: '',
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
      return (
        this.content.headers !== '' ||
        this.content.request !== '' ||
        this.content.response !== ''
      )
    },
    buildRequestURL: function () {
      if (this.content.operation === 'POST') {
        return this.url
      } else if (this.content.operation === 'PUT') {
        return this.url + '/' + (this.content.request.id === undefined ? this.content.identifier : this.content.request.id)
      } else if (this.content.operation === 'PATCH') {
        return this.url + '/' + (this.content.request.id === undefined ? this.content.identifier : this.content.request.id)
      } else if (this.content.operation === 'DELETE') {
        return this.url + '/' + (this.content.request.id === undefined ? this.content.identifier : this.content.request.id)
      } else {
        if (
          this.content.request.id === undefined &&
          this.content.response.content !== undefined
        ) {
          return this.url
        }
        return (
          this.url + '/' + (this.content.request.id === undefined ? this.content.identifier : this.content.request.id)
        )
      }
    },
    buildMessage: function () {
      if (this.content.message === '0 second(s) ago') {
        if (this.content.operation === 'POST') {
          return 'post operation'
        } else if (this.content.operation === 'PUT') {
          return 'put operation'
        } else if (this.content.operation === 'PATCH') {
          return 'patch operation'
        } else if (this.content.operation === 'DELETE') {
          return 'delete operation'
        } else {
          if (
            this.content.request.id === undefined &&
            this.content.response.content !== undefined
          ) {
            return 'list operation'
          }
          return 'get operation'
        }
      } 
      return this.content.message;
    },
    opsBlock: function () {
      if (this.content.operation === 'POST') {
        return { 'opblock-post': true }
      } else if (this.content.operation === 'PUT') {
        return { 'opblock-put': true }
      } else if (this.content.operation === 'PATCH') {
        return { 'opblock-patch': true }
      } else if (this.content.operation === 'DELETE') {
        return { 'opblock-delete': true }
      } else {
        return { 'opblock-get': true }
      }
    },
    opsSummaryBlock: function () {
      if (this.content.operation === 'POST') {
        return { 'opblock-summary-method-post': true }
      } else if (this.content.operation === 'PUT') {
        return { 'opblock-summary-method-put': true }
      } else if (this.content.operation === 'PATCH') {
        return { 'opblock-summary-method-patch': true }
      } else if (this.content.operation === 'DELETE') {
        return { 'opblock-summary-method-delete': true }
      } else {
        return { 'opblock-summary-method-get': true }
      }
    },
  },
  methods: {
    toggleThis: function () {
      this.isClosed = !this.isClosed
    },
  },
}
</script>

<style>
</style>
