<template>
  <div class="container">
    <div class="row-fluid text-center">
      <Logo />
    </div>
    <div class="row-fluid text-left">
      <div class="opblock-tag p10">Define Schema:</div>
      <div class="row-fluid opblock text-left">
        <div class="row-fluid opblock-summary">
          <TreeView
            v-model="source"
            height="400px"
            :options="readWrite"
          ></TreeView>
          <TreeView
            v-model="destination"
            height="400px"
            :options="readOnly"
          ></TreeView>
        </div>
      </div>
    </div>
    <div class="row-fluid text-center p10">
      <button
        class="btn-validate"
        @click="resolveSchema(source)"
        v-b-tooltip.hover.bottom="'Click to generate sample json'"
      ></button>
      <button
        class="btn-use"
        @click="useSchema(source)"
        v-b-tooltip.hover.bottom="'Click to use this json'"
      ></button>
      <button class="btn-help" v-b-toggle.sidebar-1 v-b-tooltip.hover.bottom="'Click to see avaiable attributes'"></button>
      <b-sidebar id="sidebar-1" title="Available attributes" sidebar-class="border-left border-success" :backdrop=true :lazy=true width="35%" bg-variant="dark" text-variant="light" right shadow>
        <div class="row-fluid text-left" v-if="!attributes.empty">
          <div class="message-list">
            <Container :contents="attributes.content" :url="url" :type="type" />
          </div>
        </div>
      </b-sidebar>
    </div>
  </div>
</template>

<script>
import Container from '~/components/ListContainer'
import TreeView from '~/components/TreeView'

export default {
  data() {
    return {
      source:
        typeof this.$route.query.source !== 'undefined'
          ? JSON.parse(this.$route.query.source)
          : {},
      attributes: {
        empty: true,
        content: [],
      },
      url: '',
      type: 'Attr',
      destination: {},
      readWrite: {
        mode: 'code',
        enableTransform: false,
        autocomplete: {
          applyTo: ['key'],
          filter: 'contain',
          trigger: 'focus',
          caseSensitive: false,
          getOptions: function () {
            return new Promise(function (resolve, reject) {
              $nuxt.$axios
                .$get('/api/schema/attributes')
                .then((response) => {
                  const options = []
                  response.forEach((element) => {
                    options.push(element.display)
                  })
                  resolve(options)
                })
                .catch((error) => {
                  reject(options)
                })
            })
          },
        },
      },
      readOnly: {
        mode: 'preview',
        enableSort: false,
        enableTransform: false,
      },
    }
  },
  components: {
    Container,
    TreeView,
  },
  async asyncData(context) {
    return context.$axios
      .$get('/api/schema/attributes')
      .then((response) => {
        return {
          attributes: { content: response, empty: response.length === 0 },
        }
      })
      .catch((error) => {
        return error({
          statusCode: error.response.status,
          message: error.response.data.message,
        })
      })
  },
  methods: {
    resolveSchema: function (source) {
      return this.$axios
        .$post('/api/schema/resolve', { source })
        .then((response) => {
          this.destination = response.source
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    },
    fetchAttributes: function () {
      return this.$axios
        .$get('/api/schema/attributes')
        .then((response) => {
          return {
            attributes: { content: response, empty: response.length === 0 },
          }
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    },
    useSchema: function (source) {
      this.$router.push({
        name: 'index',
        query: this.$route.query,
        params: {
          schema: JSON.stringify(this.source),
          useSchema: true,
        },
      })
    },
  },
}
</script>

<style scoped>
button.btn-validate {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_input.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  border: 0 !important;
  outline: 0 !important;
  height: 42px;
  margin-left: 10px;
  margin-right: 10px;
}

button.btn-use {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_output.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  border: 0 !important;
  outline: 0 !important;
  height: 42px;
  margin-left: 10px;
  margin-right: 10px;
}

button.btn-help {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_help.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  border: 0 !important;
  outline: 0 !important;
  height: 42px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
