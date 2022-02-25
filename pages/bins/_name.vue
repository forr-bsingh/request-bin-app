<template>
  <div class="container">
    <div class="row-fluid text-center">
      <Logo />
    </div>
    <div class="row-fluid" v-if="!content.empty">
      <!-- Iterate over the request and list them here -->
      <div class="message-list">
        <PagedContainer
          :page="content"
          :url="findBin.baseUrl + findBin.binName + findBin.endpoint"
          :type="type"
          headerText="Recent requests"
          :pageRoute="currentPage"
          :listSize="listSize"
        />
      </div>
    </div>
    <!-- Show first page once its loaded -->
    <div class="row-fluid" v-if="content.empty">
      <div class="row-fluid text-left">
        <div class="message-list">
          <PagedContainer
            :page="sample"
            :url="findBin.baseUrl + findBin.binName + findBin.endpoint"
            :type="type"
            headerText="Operations"
            :pageRoute="currentPage"
            :listSize="listSize"
            :showFooter="false"
          />
        </div>
        <Samples :url="findBin.baseUrl + findBin.binName + findBin.endpoint" />
      </div>
      <hr />
    </div>
  </div>
</template>

<script>
import PagedContainer from '~/components/PagedContainer'
import Samples from '~/components/Samples'
export default {
  data() {
    return {
      content: {
        empty: true,
      },
      type: 'Ops',
      sample: {
        empty: true,
      },
      pageSize: 100,
      watch: "",
    }
  },
  created() {
    this.watch = setInterval(this.reloadOps, 10000)
  },
  components: {
    PagedContainer,
    Samples
  },
  async asyncData({ $axios, route, $config }) {
    let [content, sample] = await Promise.all([
      $axios
        .$get(
          `/api/bins/${route.params.name}/ops?p=${route.query.page !== undefined ? parseInt(route.query.page) : 1
          }&l=${route.query.size !== undefined
            ? parseInt(route.query.size)
            : $config.universal.pageSize
          }`
        )
        .then((response) => {
          return response
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        }),
      $axios
        .$get(`/api/bins/${route.params.name}`)
        .then((response) => {
          return response.ops
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        }),
    ])
    return {
      content: content,
      sample: sample,
    }
  },
  computed: {
    findBin() {
      return {
        baseUrl: this.$config.apiBaseURL,
        binName: this.$route.path,
        endpoint: '/requests',
      }
    },
    currentPage() {
      return {
        name: 'bins-name',
        query: this.$route.query,
        params: this.$route.params,
      }
    },
    listSize() {
      return this.$config.universal.pageSize
    },
  },
  methods: {
    reloadOps() {
      this.$axios
        .$get(
          `/api/bins/${this.$route.params.name}/ops?p=${this.$route.query.page !== undefined
            ? parseInt(this.$route.query.page)
            : 1
          }&l=${this.$route.query.size !== undefined
            ? parseInt(this.$route.query.size)
            : this.listSize
          }`
        )
        .then((response) => {
          this.content = response
          if (this.$route.query.page > response.totalPages) {
            console.log("No elements to show. Redirecting to previous page.");
            let query = {
              page: this.$route.query.page - 1 > 1 ? this.$route.query.page - 1 : 1,
              size: this.$route.query.size,
            }
            this.$router.replace({
              name: "bins_name",
              query: {
                ...this.$route.query,
                ...query,
              },
              params: this.$route.params,
            });
          }
        })
        .catch((error) => {
          return error({
            statusCode: error.response.status,
            message: error.response.data.message,
          })
        })
    },
    resetWatchClock: function() {
      clearInterval(this.watch)
    }
  },
  watch: {
    '$route.query'() {
      this.reloadOps()
    },
  },
  beforeDestroy() {
    this.resetWatchClock()
  }
}
</script>

<style></style>
