<template>
  <div class="home">
    <van-cell-group>
      <van-field v-model="roomNo" label="房间号" placeholder="请输入房间号" class="ipt"/>
    </van-cell-group>
    <van-button type="primary" plain class="btn" @click="join">加入房间</van-button>
    <van-divider />
    <van-button type="primary" class="btn" @click="create">创建房间</van-button>
    <van-divider />
    <van-button type="primary" class="btn" @click="loginShow = true">重新登录</van-button>
    <van-dialog v-model="loginShow" title="你是谁" class="login-dialog" 
    confirmButtonText="登录" @confirm="login">
      <van-cell-group>
        <van-field v-model="player.name" label="昵称" placeholder="请输入昵称" class="ipt"/>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<style lang="scss" scoped>
.home{
  // background: #aaa;
  // height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  .ipt, .btn{
    margin: 10px auto;
  }
  .ipt{
    margin-bottom: 60px;
  }
}

.login-dialog{
  text-align: center;
}
</style>

<script>
import api from '@/api';
import storejs from 'storejs';
export default {
  name: 'Home',
  components: {
    
  },
  data() {
    return {
      nkShow: false,
      roomNo: '',
      player:{
        id: storejs.get('player_id'),
        name:'',
      },
      loginShow: false,
    }
  },
  created () {
    if(!this.player.id){
      this.loginShow = true
    }
  },
  methods: {
    login(){
      this.player.id = null 
      this.$http.post(api.avalon.login, this.player).then(res=>{
        if (res.data.success) {
          this.player = res.data.data
          this.loginShow = false
          storejs.set("player_id", this.player.id)
        }else{
          this.$notify(res.data.msg)
          this.loginShow = true
        }
      })
    },
    onInput(v) {
      this.roomNo += v
    },
    onDelete() {
      this.roomNo = this.roomNo.substring(0, this.roomNo.length-1)
    },
    join(){
      if(!this.roomNo){
        this.$notify({ type: 'warning', message: '请输入房间号' });
        return;
        // this.roomNo = '0000'
      }
      this.$router.push({name:'room', query:{roomNo:this.roomNo}});
    },
    create(){
      this.$router.push({name:'create'});
    }
  },
}
</script>
