<template>
  <div @click="handleBack">手机详情</div>
</template>

<script>
export default {
    methods:{
        handleBack(){
            this.$router.go(-1)
        }
    }
}
</script>

<style>

</style>