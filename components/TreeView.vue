<template>
  <!-- https://github.com/josdejong/jsoneditor -->
  <!-- modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes -->
  <!-- Add callback suport -->
  <div
    class="editor-container"
    :class="{ 'max-box': max, 'min-box': !max }"
    :style="getStyle"
  >
    <div ref="editor" class="editor-box"></div>
    <button @click="switchMode" class="mode-btn" v-if="options.mode === 'tree' || options.mode === 'code'" v-b-tooltip.hover title="Mode switcher"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editor: null,
      style: {},
      max: false,
      internalChange: false,
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return { }
      },
    },
    value: [Object],
    height: {
      type: String,
    },
    width: {
      type: String,
      default: "100%"
    },
    plus: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onChange() {
      let error = null
      let json = {}
      try {
        json = this.editor.get()
      } catch (err) {
        error = err
      }
      if (error) {
        this.$emit('error', error)
      } else {
        if (this.editor) {
          this.internalChange = true
          this.$emit('input', json)
          this.$nextTick(() => {
            this.internalChange = false
          })
        }
      }
      this.options.onChange && this.options.onChange(...arguments)
    },
    initView() {
      if (!this.editor) {
        const JSONEditor = require('jsoneditor')
        var container = this.$refs.editor
        let cacheChange = this.options.onChange
        delete this.options.onChange
        const options = Object.assign(this.options, {
          onChange: this.onChange
        })
        this.editor = new JSONEditor(container, options)
        this.options.onChange = cacheChange
      }
      this.editor.set(this.value || {})
    },
    destroyView() {
      if (this.editor) {
        this.editor.destroy()
        this.editor = null
      }
    },
    switchMode() {
      if(this.editor.options.mode === 'tree') {
        this.editor.setMode('code')
      } else if(this.editor.options.mode === 'code') {
        this.editor.setMode('tree')
      }
    }
  },
  watch: {
    value: {
      handler(value) {
        if (this.editor && value && !this.internalChange) {
          this.editor.set(value)
        }
      },
      deep: true,
    },
    max(value) {
      this.$nextTick(() => {
        this.initView()
      })
    },
  },
  mounted() {
    this.initView()
  },
  beforeDestroy() {
    this.destroyView()
  },
  computed: {
    getStyle() {
      if (this.height && !this.max) {
        return {
          height: this.height,
          width: this.width
        }
      }
      return {}
    },
  },
}
</script>

<style lang="css" scoped>
.editor-container.max-box {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.editor-container.min-box {
  position: relative;
  min-width: 300px;
  width: 100%;
}
.editor-box {
  height: 100%;
}
.editor-container:hover .mode-btn {
  display: block;
}
.mode-btn {
  display: none;
  position: absolute;
  top: 2px;
  right: 250px;
  padding: 0px;
  width: 32px;
  color: white;
  background: url(~assets/img/iconfinder_essential_mode.svg) no-repeat center;
  border: 0 !important;
  outline: 0 !important;
  height: 32px;
  background-size: 32px 32px;
  border-radius: 2px;
}
.mode-btn:hover {
  border: 1px solid #d7e6fe !important;
}
</style>
