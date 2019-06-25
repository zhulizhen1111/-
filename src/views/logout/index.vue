<template>
    <div>
      
    </div>
</template>
<script>
import tools from "@/utils/tools";
import axios from "axios";
import { weChatConfig, closeWindow, weChatReady } from "@/api/global";
export default {
  name: "Logout",
  props: [],
  data() {
    return {};
  },
  computed: {},
  methods: {
    logout() {
      axios.get("/server/logout").then(res => {
        if (res.data.result == "success") {
          this.$router.push("/");
        }
        tools.rmStorage("username");
        weChatReady().then(res => {
          closeWindow(1000);
        });
      });
    }
  },
  created() {
    weChatConfig();
  },
  mounted() {
    this.logout();
  }
};
</script>