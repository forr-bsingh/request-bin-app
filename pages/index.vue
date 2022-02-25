<template>
  <div class="container">
    <div class="row-fluid text-center">
      <Logo />
    </div>
    <div class="row-fluid">
      <h6>
        RequestBin gives you a URL that will collect requests made to it and let
        you inspect them in a human-friendly way.
        <br />Use RequestBin to see what your HTTP client is sending or to inspect and
        debug webhook requests.
      </h6>
    </div>
    <Bin />
    <AlertBox />
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
export default {
  created() {
    this.$nuxt.$on('update-bin-list', this.reloadBins)
  },
  data() {
    return {
      bins: {
        empty: true,
        content: [],
      }
    }
  },
  async asyncData({ $axios, route, $config, $nuxt }) {
    if (route.query.mode === 'G0D') {
      return $axios
        .$get(
          `/api/bins?p=${route.query.page !== undefined ? parseInt(route.query.page) : 1
          }&l=${route.query.size !== undefined
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
    Bin: () => import("~/components/Bin/View"),
    AlertBox: () => import("~/components/AlertBox"),
    PagedContainer: () => import("~/components/PagedContainer")
  },
  computed: {
    currentPage() {
      return {
        name: 'index',
        query: this.$route.query,
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
    reloadBins() {
      this.$axios
        .$get(
          `/api/bins?p=${this.$route.query.page !== undefined
            ? parseInt(this.$route.query.page)
            : 1
          }&l=${this.$route.query.size !== undefined
            ? parseInt(this.$route.query.size)
            : 10
          }`
        )
        .then((response) => {
          this.bins = response
          if (this.$route.query.page > response.totalPages) {
            console.log("No elements to show. Redirecting to previous page.");
            let query = {
              page: this.$route.query.page - 1 > 1 ? this.$route.query.page - 1 : 1,
              size: this.$route.query.size,
            }
            this.$router.replace({
              name: "index",
              query: {
                ...this.$route.query,
                ...query,
              },
              params: this.$route.params,
            });
          }
        })
        .catch((error) => {
          let alert = {
            message: error.response.data.message,
            variant: "danger",
          };
          $nuxt.$emit("show-alert", alert);
        })
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
.p5 {
  padding: 5px 5px 5px 5px;
}

.p10 {
  padding: 10px 10px 10px 10px;
}
</style>
