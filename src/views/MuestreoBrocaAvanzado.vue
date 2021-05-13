 <template>
  
    <v-layout column>
        <FormBroca v-bind:id="id" />
    </v-layout>

</template>
<script>
import FormBroca from "../components/FormMuestreoBrocaAvanzado";
import { nSQL } from "@nano-sql/core";
import { CoffeeCloud } from "../coffeecloud";
import "../coffeecloud.css";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";

export default {
    name: "MuestreoBroca",
    props: ["id"],
    components: {
        FormBroca
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