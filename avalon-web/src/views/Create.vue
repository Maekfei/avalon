<template>
    <div class="container">
        <h3>创建房间</h3>
        <van-field name="player-slider" label="玩家数:">
            <template #input>
               <van-slider v-model="players" :min="6" :max="8" :step="1" class="player-slider"/>
            </template>
            <template #button>
                {{players}} 人
            </template>
        </van-field>
        
        <div class="roles">
            <van-divider>身份配置</van-divider>
            <div class="role-body">
                <div class="role-item" v-for="(item,index) in roles" :key="'r-'+index">
                    <div class="role-item-name">{{item.name}}</div>
                    <van-stepper v-model="item.num" :min="item.min" :max="item.max" class="role-item-num"/>
                </div>
            </div>
        </div>

        <van-button type="primary" class="btn" @click="create">创建房间</van-button>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display:flex;
    flex-wrap: wrap;
    h3 {
        width: 100%;
        text-align: center;
    }
    .player-slider{
        width: 80%;
    }
    .btn{
        margin: 0 auto;
    }
}

.roles{
    width: 100%;
    .role-body{
        display: flex;
        flex-wrap: wrap;
    }
    .role-item{
        width: 33%;
        margin-bottom: 20px;
    }
    .role-item-name{
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }
    .role-item-num{
        text-align: center;
        margin-bottom: 20px;
    }
}
</style>

<script>
    import api from '@/api';
    export default {
        data() {
            return {
                roomNo: '',
                players:8,
                roles:[
                    {name:'梅林',  num:1, min:1, max:1},
                    {name:'派希维尔',  num:1, min:1, max:1},
                    {name:'忠臣',  num:3, min:2, max:3},
                    {name:'莫德雷德',  num:1, min:0, max:1},
                    {name:'莫甘娜',  num:1, min:1, max:1},
                    {name:'刺客',  num:1, min:1, max:1},
                ]
            }
        },
        methods: {
            create() {
                let nums = 0;
                this.roles.forEach(e => {
                    nums += e.num
                });
                console.log(nums, this.players);
                if (nums !== this.players) {
                    this.$notify("玩家数量与身份配置不一致")
                    return;
                }
                let para = {
                    room : { players:this.players },
                    roles: this.roles
                }
                this.$http.post(api.avalon.createRoom, para).then(res=>{
                    if(res.data.success){
                        this.$router.push({name:'room', query:res.data.data});
                    }else{
                        this.$notify(res.data.msg)
                    }
                })
                
            }
        },
    }
</script>
