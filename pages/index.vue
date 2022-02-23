<template>
  <div class="container">
    <div class="row-fluid text-center">
      <Logo />
    </div>
    <div class="row-fluid">
      <h6>
        RequestBin gives you a URL that will collect requests made to it and let
        you inspect them in a human-friendly way.<br />
        Use RequestBin to see what your HTTP client is sending or to inspect and
        debug webhook requests.
      </h6>
    </div>
    <div class="row-fluid text-center opblock-tag">Create a RequestBin</div>
    <div class="row-fluid">
      <div class="row-fluid p10">
        <input
          class="p5"
          type="checkbox"
          name="autogenerate"
          v-model="autogenerate"
          @click="useAutogenerate"
          value="true"
        /><label for="autogenerate" class="text-right p10"
          >Auto Generate Name</label
        ><br />
        <input
          class="p10"
          v-if="!autogenerate"
          type="text"
          name="name"
          v-model="name"
          :disabled="autogenerate"
        />
      </div>
      <div class="row-fluid p10">
        <input
          class="p10"
          type="checkbox"
          name="defaultSchema"
          v-model="useSchema"
          @click="toggleSchema"
          value="true"
        />
        <label for="defaultSchema" class="text-right p10">Use schema</label>
        <TreeView
          v-if="useSchema"
          class="p10 text-left"
          v-model="schema"
          height="150px"
          :options="readOnly"
        ></TreeView>
      </div>
      <div class="row-fluid text-center p10">
        <button
          class="btn-create"
          @click="createBin(name, autogenerate, useSchema, schema)"
          v-b-tooltip.hover.bottom="'Click to create bin'"
        ></button>
        <n-link
          :to="schemaPage"
          v-if="useSchema"
          :event="!this.useSchema ? '' : 'click'"
        >
          <button
            class="btn-schema"
            v-b-tooltip.hover.bottom="'Click to edit schema'"
          ></button>
        </n-link>
      </div>
    </div>
    <div
      class="row-fluid text-center"
      v-if="message != ''"
      v-bind:class="msgBox"
    >
      <div>
        <div>
          <h5>{{ message }}</h5>
        </div>
        <div class="text-center" v-if="linkActive">
          <n-link
            v-if="linkTo != ''"
            :to="linkTo"
            :class="link"
            :event="!linkActive ? '' : 'click'"
            ><h6>Click here to go there.</h6></n-link
          >
        </div>
      </div>
    </div>
    <div class="message-list" v-if="inGodMode() && !bins.empty">
      <PagedContainer
        :page="bins"
        type="Bin"
        headerText="Current active bins"
        :pageRoute="currentPage"
        :listSize="listSize"
      />
    </div>
  </div>
</template>

<script>
import TreeView from '~/components/TreeView'
import PagedContainer from '~/components/PagedContainer'

export default {
  created() {
    this.$nuxt.$on('update-bin-list', this.reloadBins)
    this.$nuxt.$on('reset-ui', this.resetUI)
  },
  data() {
    return {
      name: '',
      autogenerate: true,
      useSchema:
        typeof this.$route.params.useSchema !== 'undefined'
          ? this.$route.params.useSchema
          : false,
      schema:
        typeof this.$route.params.schema !== 'undefined'
          ? JSON.parse(this.$route.params.schema)
          : {
              first_name: '{{Name.firstName()}}',
              last_name: '{{Name.lastName()}}',
              email_address:
                '${first_name}.${last_name}@{{Internet.domainName()}}',
              address: '{{Address.fullAddress()}}',
              profession: '{{Job.position()}}',
              random_words: '{{Lorem.paragraph(2)}}',
            },
      message: '',
      linkTo: '',
      msgBox: {
        success: false,
        error: false,
        'text-center': true,
      },
      linkActive: false,
      link: {
        hide: true,
        show: false,
      },
      bins: {
        empty: true,
        content: [],
      },
      readOnly: {
        mode: 'preview',
        enableSort: false,
        enableTransform: false,
        mainMenuBar: false,
        statusBar: false,
      },
    }
  },
  async asyncData({ $axios, route, $config }) {
    if (route.query.mode === 'G0D') {
      return $axios
        .$get(
          `/api/bins?p=${
            route.query.page !== undefined ? parseInt(route.query.page) : 1
          }&l=${
            route.query.size !== undefined
              ? parseInt(route.query.size)
              : $config.universal.pageSize
          }`
        )
        .then((response) => {
          return {
            bins: response,
          }
        })
        .catch((error) => {
          error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    }
  },
  components: {
    TreeView,
    PagedContainer,
  },
  computed: {
    currentPage() {
      return {
        name: 'index',
        query: this.$route.query,
        params: this.$route.params,
      }
    },
    schemaPage() {
      let query = {
        source: JSON.stringify(this.schema),
      }
      return {
        name: 'schema',
        query: {
          ...this.$route.query,
          ...query,
        },
        params: this.$route.params,
      }
    },
    listSize() {
      return this.$config.universal.pageSize
    },
  },
  methods: {
    inGodMode() {
      return this.$route.query.mode === 'G0D'
    },
    createBin(name, autogenerate, useSchema, schema) {
      this.$axios
        .$post(
          `/api/bins?name=${name}&autogenerate=${autogenerate}`,
          useSchema ? schema : {}
        )
        .then((response) => {
          $nuxt.$emit('reset-ui')
          this.showSuccess('Bin created with name: ' + response.name)
          $nuxt.$emit('update-bin-list')
          this.showLink(response.url)
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
    reloadBins() {
      this.$axios
        .$get(
          `/api/bins?p=${
            this.$route.query.page !== undefined
              ? parseInt(this.$route.query.page)
              : 1
          }&l=${
            this.$route.query.size !== undefined
              ? parseInt(this.$route.query.size)
              : 10
          }`
        )
        .then((response) => {
          this.bins = response
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    },
    useAutogenerate() {
      this.autogenerate = !this.autogenerate
    },
    toggleSchema() {
      this.useSchema = !this.useSchema
    },
    resetUI() {
      this.bin = ''
      this.random = false
      this.message = ''
      this.resetMessage()
      this.hideLink()
    },
    showError(message) {
      this.message = message
      this.msgBox.error = true
      this.msgBox.success = false
    },
    showSuccess(message) {
      this.message = message
      this.msgBox.error = false
      this.msgBox.success = true
    },
    resetMessage() {
      this.msgBox.error = false
      this.msgBox.success = false
    },
    showLink(linkTo) {
      this.linkTo = linkTo
      this.link.show = true
      this.link.hide = false
      this.linkActive = true
    },
    hideLink() {
      this.linkTo = ''
      this.link.hide = true
      this.link.show = false
      this.linkActive = false
    },
  },
  watch: {
    '$route.query'() {
      this.schema =
        this.$route.query.schema !== undefined
          ? JSON.parse(this.$route.query.schema)
          : this.schema
      if (this.inGodMode()) {
        this.reloadBins()
      }
    },
  },
}
</script>

<style>
button.btn-create {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_add.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 42px 42px;
  height: 42px;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border: 0 !important;
  outline: 0 !important;
}

button.btn-schema {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_schema.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 42px 42px;
  height: 42px;
  margin-left: 10px;
  margin-right: 10px;
  border: 0 !important;
  outline: 0 !important;
}

button.btn-delete {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_delete.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 42px 42px;
  height: 42px;
  border: 0 !important;
  outline: 0 !important;
  padding-bottom: 5px;
}

.p5 {
  padding: 5px 5px 5px 5px;
}

.p10 {
  padding: 10px 10px 10px 10px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
