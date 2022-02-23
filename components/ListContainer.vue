<template>
  <div>
    <div v-for="(content, index) in contents" :key="index">
      <Ops v-if="type === 'Ops'" :content="content" :url="url"/>
      <Attr v-if="type === 'Attr'" :content="content" :url="url"/>
      <Bin v-if="type === 'Bin'" :content="content"/>
    </div>
  </div>
</template>

<script>
import Ops from '~/components/Ops'
import Attr from '~/components/Attr'
import Bin from '~/components/Bin'
export default {
  props: {
    contents: {
      type: Array,
      default: () => {
        return [];
      }
    },
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String
    }
  },
  components: {
    Ops,
    Attr,
    Bin
  },
}
</script>

<style></style>
