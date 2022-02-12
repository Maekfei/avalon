<template>
    <div class="container">
        <van-divider class="title" @click="getPlayers">房间号 {{roomNo}}</van-divider>

        <div class="seats">
            <div class="seat" v-for="i in players" :key="i" @click="changeSeat(i)">
                <div class="seat-item">
                    <span class="seat-item-no">{{i}}</span>
                    <div class="seat-item-body" v-for="(item,idx) in playerList" :key="'s-'+idx">
                        <span class="seat-item-name"  v-if="(idx+1)==i">{{item.name}}</span>
                    </div>
                </div>
            </div>
        </div>

        <van-button type="primary" class="btn" @click="start" :loading="startLoading"
         v-if="playerId==createPlayerId">开始游戏</van-button>
        <h3 v-if="playerId!=createPlayerId" style="width:100%; text-align:center;margin-top:60px;">等待房主开始...</h3>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;
    display:flex;
    flex-wrap: wrap;
    .title{
        width: 100%;
    }
    .seats{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .seat{
            width: 25%;
            .seat-item{
                width: 100%;
                padding: 25px 0;
                text-align: center;
                .seat-item-body{
                    width: 100%;
                    .seat-item-name{
                        width: 100%;
                    }
                }
            }
        }
    }
    .btn{
        margin: 100px auto;
    }
}
</style>

<script>
    import api from '@/api';
    import storejs from 'storejs'
    export default {
        data() {
            return {
                roomNo: this.$route.params.roomNo || this.$route.query.roomNo || '0000',
                players: this.$route.params.players || this.$route.query.players || 0,
                createPlayerId: this.$route.query.createPlayerId,
                playerList: [],
                startLoading: false,
                playerId: storejs.get('player_id'),
                websock: null,
            }
        },
        created () {
            this.initWebSocket();
        },
        beforeDestroy () {
            this.websock.close(); //离开路由之后断开websocket连接
        },
        methods: {
            changeSeat(seat) {
                console.log("change seat:"+seat);
            },
            start(){
                this.startLoading = true
                if (this.players != this.playerList.length) {
                    this.$notify("玩家未到齐")
                    this.startLoading = false
                    return;
                }
                let param = {
                    "roomNo": this.roomNo,
                    "playerId": this.playerId
                }
                let createGame = {
                    "action" : "createGame",
                    "param" : JSON.stringify(param)
                };
                this.websocketsend(JSON.stringify(createGame));
                // this.$router.push({name:'game', query:{roomNo:this.roomNo}})
            },
            getPlayers(){
                this.$http.get(api.avalon.getPlayers+'/'+this.roomNo).then(res=>{
                    if (res.data.success) {
                        this.playerList = res.data.data
                    }
                })
            },
            initWebSocket(){ //初始化weosocket
                this.websock = new WebSocket(window.appConfig.baseWs+'/room/'+this.roomNo+'/'+this.playerId);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                // 加入房间
                let join = {
                    "roomNo": this.roomNo,
                    "playerId": this.playerId
                }
                let params = {
                    "action" : "join",
                    "param" : JSON.stringify(join)
                };
                this.websocketsend(JSON.stringify(params));
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                console.log("websocket receive:",e);
                const redata = JSON.parse(e.data);
                if (redata.action == "join") {
                    this.playerList = redata.result.data
                    if (this.playerList && this.playerList.length > 0) {
                        this.players = this.playerList[0].players
                    }
                }
                if (redata.action == "start") {
                    this.$router.push({name:'game', query:{roomNo:this.roomNo}})
                }
                
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                //离开房间
                console.log('断开连接',e);
            },
        },
    }
</script>
