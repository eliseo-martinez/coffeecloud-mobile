<template>
  
    <v-layout column>
        <FormRoya v-bind:id="id" />
    </v-layout>

</template>
<script>
import FormRoya from "../components/FormMuestreoRoyaAvanzado";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";

export default {
    name: "MuestreoRoya",
    props: ["id"],
    components: {
        FormRoya
    },
    data: () => ({
    }),
    methods: {
    },
    mounted() {

    },
    updated() {
    }
};

</script>