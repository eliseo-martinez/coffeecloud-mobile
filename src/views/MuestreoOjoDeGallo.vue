<template>
  
    <v-layout column>
        <FormOjoDeGallo v-bind:id="id" />
    </v-layout>

</template>
<script>
import FormOjoDeGallo from "../components/FormMuestreoOjoDeGallo";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";

export default {
    name: "MuestreoOjoDeGallo",
    props: ["id"],
    components: {
        FormOjoDeGallo
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