<template>
  <div id="app">
    {{message}}
  </div>
</template>

<script>
import { getHomeData } from "./network/home";
export default {
  name: "App",
  components: {},
  data(){
    return{
      message:""
    }
  },
  created() {
   getHomeData().then(res=>{
     console.log(res)
     this.message = res
   })
   .catch(err =>{
     console.log(err)
   })
  }
};
</script>

<style>
  @import "assets/css/base.css";
</style>
