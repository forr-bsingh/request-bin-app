<template>
  <div class="opblock">
    <div class="opblock-summary opblock-tag text-left" v-if="headerText !== ''">
      {{ headerText }}: (Showing {{ start }} - {{ end }} of {{ total }})
    </div>
    <ListContainer :contents="page.content" :url="url" :type="type" />
    <div class="opblock-tag text-center" v-if="this.showFooter">

      <nuxt-link class="ml10 mr10" v-bind:class="{ inactive: page.first }" :to="first()" :event="page.first ? '' : 'click'">
        <button
          v-bind:class="{ inactive: page.first }"
          class="btn-first"
          v-b-tooltip.hover.bottom="'FIRST'"
        ></button>
      </nuxt-link>

      <nuxt-link class="ml10 mr10" :to="prev()" :event="page.first ? '' : 'click'">
        <button
          v-bind:class="{ inactive: page.first }"
          class="btn-prev"
          v-b-tooltip.hover.bottom="'PREVIOUS'"
        ></button>
      </nuxt-link>

      <nuxt-link class="ml10 mr10" :to="next()" :event="page.last ? '' : 'click'">
        <button
          v-bind:class="{ inactive: page.last }"
          class="btn-next"
          v-b-tooltip.hover.bottom="'NEXT'"
        ></button>
      </nuxt-link>

      <nuxt-link class="ml10 mr10" :to="last()" :event="page.last ? '' : 'click'">
        <button
          v-bind:class="{ inactive: page.last }"
          class="btn-last"
          v-b-tooltip.hover.bottom="'LAST'"
        ></button>
      </nuxt-link>
    </div>
    <div class="opblock-tag text-center footer" v-if="this.showFooter">
      Page {{ page.number + 1 }} of {{ page.totalPages }}
    </div>
  </div>
</template>

<script>
import ListContainer from '~/components/ListContainer'
export default {
  props: {
    page: {
      content: {
        type: Array,
        default: () => {
          return []
        },
      },
      number: {
        type: Number,
        default: 0,
      },
      size: {
        type: Number,
        default: 10,
      },
      totalElements: {
        type: Number,
      },
      last: {
        type: Boolean,
        default: false,
      },
      totalPages: {
        type: Number,
        default: 0,
      },
      first: {
        type: Boolean,
        default: true,
      },
      numberOfElements: {
        type: Number,
        default: 0,
      },
      empty: {
        type: Boolean,
        default: true,
      },
    },
    type: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    headerText: {
      type: String,
      default: '',
    },
    pageRoute: {
      type: Object,
    },
    listSize: {
      type: Number,
      default: 10,
    },
  },
  components: {
    ListContainer,
  },
  computed: {
    start() {
      return this.page.pageable.offset + 1
    },
    end() {
      return this.page.pageable.offset + this.page.pageable.pageSize <=
        this.total
        ? this.page.pageable.offset + this.page.pageable.pageSize
        : this.total
    },
    total() {
      return this.page.totalElements
    },
  },
  methods: {
    currentPage() {
      return parseInt(this.$route.query.page) || 1
    },
    buildLink(page, size) {
      let internal = {
        name: this.pageRoute.name,
        params:
          this.pageRoute.params === undefined ? {} : this.pageRoute.params,
        query: { ...this.pageRoute.query, ...{ page: page, size: size } },
      }
      return internal
    },
    first() {
      return this.buildLink(1, this.listSize)
    },
    prev() {
      return this.buildLink(
        this.currentPage() > 1 ? this.currentPage() - 1 : 1,
        this.listSize
      )
    },
    next() {
      return this.buildLink(
        this.currentPage() < this.page.totalPages
          ? this.currentPage() + 1
          : this.page.totalPages,
        this.listSize
      )
    },
    last() {
      return this.buildLink(this.page.totalPages, this.listSize)
    },
  },
}
</script>

<style>
.footer {
  font-size: 14px;
}

.ml10 {
  margin-left: 10px;
}

.mr10 {
  margin-right: 10px;
}

button.btn-first {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_first.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 36px 36px;
  height: 42px;
  border-radius: 1px;
  border: 0 !important;
  outline: 0 !important;
}

button.btn-prev {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_prev.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 36px 36px;
  height: 42px;
  border-radius: 1px;
  border: 0 !important;
  outline: 0 !important;
}

button.btn-next {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_next.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 36px 36px;
  height: 42px;
  border-radius: 1px;
  border: 0 !important;
  outline: 0 !important;
}

button.btn-last {
  padding: 0px;
  width: 42px;
  background: url(~assets/img/iconfinder_essential_last.svg) no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 36px 36px;
  height: 42px;
  border-radius: 1px;
  border: 0 !important;
  outline: 0 !important;
}

button.inactive {
  cursor: default;
}
</style>
