<template>
    <div class="row-fluid">
        <div class="opblock opblock-none">
            <div class="opblock-summary clickable" @click="toggleThis">
                <div class="row-fluid text-center opblock-tag">Create a Bin</div>
            </div>
            <div v-bind:class="accordian">
                <b-form class="row-fluid" v-if="show" @submit.stop.prevent>
                    <b-form-group
                        id="autogenerate"
                        label
                        label-for="autogenerate"
                        v-b-tooltip.hover.topright="'Auto generate a bin with name.'"
                    >
                        <b-form-checkbox
                            id="chkbx-autogenerate"
                            v-model="bin.autogenerate"
                            name="chkbx-autogenerate"
                            :state="states.autogenerate"
                        >Auto Generate bin</b-form-checkbox>
                    </b-form-group>
                    <b-form-group
                        id="name"
                        label
                        label-for="name"
                        v-b-tooltip.hover.topright="'Enter name for the bin.'"
                    >
                        <b-form-input
                            id="name"
                            v-if="!bin.autogenerate"
                            v-model="bin.name"
                            type="text"
                            placeholder="Enter name for the bin"
                            :state="states.name"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                        id="defaultSchema"
                        label
                        label-for="defaultSchema"
                        v-b-tooltip.hover.topright="'Use default schema or uncheck to define your own schema.'"
                    >
                        <b-form-checkbox
                            id="chkbx-useSchema"
                            v-model="bin.useSchema"
                            name="chkbx-useSchema"
                            :state="states.useSchema"
                        >Use Schema</b-form-checkbox>
                        <TreeView
                            v-if="bin.useSchema"
                            class="p10 text-left"
                            v-model="bin.schema"
                            height="150px"
                            :options="readOnly"
                        ></TreeView>
                    </b-form-group>
                    <div class="row-fluid text-center p10">
                        <button
                            class="btn-create"
                            @click="createBin"
                            v-b-tooltip.hover.bottom="'Click to create bin'"
                        ></button>

                        <button
                            class="btn-schema"
                            v-if="bin.useSchema"
                            @click="goToSchemaPage"
                            v-b-tooltip.hover.bottom="'Click to edit schema'"
                        ></button>
                    </div>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    created() {
        this.$nuxt.$on("reset-ui", this.resetUI);
    },
    data() {
        return {
            bin: {
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
            },
            states: {
                autogenerate: null,
                name: null,
                useSchema: null,
                schema: null,
            },
            show: true,
            isClosed: false,
            readOnly: {
                mode: 'preview',
                enableSort: false,
                enableTransform: false,
                mainMenuBar: false,
                statusBar: false,
            },
        };
    },
    components: {
        TreeView: () => import('~/components/TreeView'),
    },
    computed: {
        currentPage: function () {
            return {
                name: 'index',
                query: this.$route.query,
                params: this.$route.params,
            }
        },
        schemaPage: function () {
            let query = {
                source: JSON.stringify(this.bin.schema),
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
        accordian: function () {
            return {
                closed: this.isClosed,
                opblock: !this.isClosed,
                "message-detail": !this.isClosed,
            };
        },
    },
    methods: {
        createBin: function () {
            this.$axios
                .$post(
                    `/api/bins?name=${this.bin.name}&autogenerate=${this.bin.autogenerate}`,
                    this.bin.useSchema ? this.bin.schema : {}
                )
                .then((response) => {
                    let alert = {
                        message: 'Bin created with name: ' + response.name,
                        link: response.url,
                        variant: "success",
                    };
                    $nuxt.$emit("show-alert", alert);
                    $nuxt.$emit('update-bin-list')
                    $nuxt.$emit("reset-ui");
                })
                .catch((error) => {
                    let alert = {
                        message: error.response.data.message,
                        variant: "danger",
                    };
                    $nuxt.$emit("show-alert", alert);
                })
        },
        goToSchemaPage: function () {
            this.$router.replace(this.schemaPage);
        },
        resetUI() {
            this.bin = {
                name: '',
                autogenerate: true,
                useSchema: false,
                schema: {
                    first_name: '{{Name.firstName()}}',
                    last_name: '{{Name.lastName()}}',
                    email_address:
                        '${first_name}.${last_name}@{{Internet.domainName()}}',
                    address: '{{Address.fullAddress()}}',
                    profession: '{{Job.position()}}',
                    random_words: '{{Lorem.paragraph(2)}}',
                },
            }
        },
        toggleThis: function () {
            this.isClosed = !this.isClosed;
        },
    },
    watch: {},
};
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
</style>