<template>
    <div class="container">
        <div class="role">你的身份：{{role.displayName}}
            <span class="switch-btn" @click="showRole">{{switchBtn}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                roomNo: this.$route.query.roomNo,
                role:{
                    id: 0,
                    name: '',
                    displayName: '****',
                },
                switchBtn:'显示'
            }
        },
        methods: {
            showRole() {
                if(this.switchBtn === '显示'){
                    this.role.displayName = this.role.name
                    this.switchBtn = '隐藏'
                }else {
                    this.role.displayName = '****'
                    this.switchBtn = '显示'
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    display:flex;
    flex-wrap: wrap;
}
</style>