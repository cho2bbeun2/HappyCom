<template>
    <!--습도-->
  <div>
    <div class="box">
        <div class="box_title"><i class="bi bi-droplet-half"></i>   습도
          <i  v-if="!smallView" class="bi bi-caret-down-fill" id="hide_icon" style="float: right"
          @click="smallView=true"
          ></i>
          <i  v-if="smallView" id="hide_icon" class="bi bi-caret-up-fill" style="color: white;"
          @click="smallView=false"
          ></i>

        <!-- 습도 큰 창 -->
        </div>
          <div v-if="!smallView" class="large_view_content">
          <div id="humidity" :style="{borderColor: color}" class="humid"></div>
          <div id="humidity" :style="{color: color}" class="value_text" style="bottom: 100px;">{{ value }}</div>
          <div class="pct">%</div>
          <div id="humidity" :style="{color: color}" class="status">
            <span v-html="icon"></span>
            <span style="margin-left: 4px">{{ status }}</span>
          </div>
        </div>

        <!-- 습도 작은 창 -->
        <div v-if="smallView" class="small_view_content">
          <div class="small_status" :style="{ backgroundColor: color }">
            <div>{{ value }}<span style="font-size: 12px"> %</span></div>
            <div style="font-weight: lighter;">|</div>
          <div>{{ status }}</div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
//import Stomp from "webstomp-client";
//import SockJS from "sockjs-client";

export default {
    name: 'value-chart',
    data() {
      return {
        smallView: false,
        value: 0,
        color: "#5a8dee",
        icon: "<i class='bi bi-emoji-laughing-fill'></i>",
        status: "안전",
      };
    },

  mounted() {
    this.connect();
  },
//새로 수정
  beforeDestroy() {
    console.log("Main beforeDestory 습기")
      try {
      this.disconnect();
    } catch (error) { console.log("catch!!!")
      this.disconnect();
    }
    clearInterval(this.timer);
  },
  //
  
  methods: {
    //새로추가
    delay(){
      setTimeout(() => this.connect(), 2000)
    },
    //
    /* 새로 주석 처리 수정
    connect() {
      const serverURL = "/ws";
      var socket = new SockJS(serverURL);
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
        // headers
        {},
        // connetCallback
        (frame) => {
          // 현재 보여지는 화면의 데이터값 가져오기
            this.connected = true;
            console.log("Socket Connection Success", frame);
            // subscribe(destination, callback)
            this.stompClient.subscribe(
              "/send/" + this.ssId,
              (res) => {
                // sensorState : ex) 심각 -> 4
                // ["안전","관심","주의","경고","심각"]
                const state = JSON.parse(res.body).sensorState;
                this.value = JSON.parse(res.body).inputData;
                this.color = this.infoList[state].color;
                this.icon = this.infoList[state].icon;
                this.status = this.infoList[state].status;
              }
            );
          },
        // errorCallback
        (error) => {
          console.log("Socket Connection Fail", error);
          this.connected = false;
        }
      );
      this.infSend();
    },
    */

   //새로 추가
   connect() {
     this.$stompClient.subscribe("/send/" + this.ssId, this.callback, {id: this.ssId});
     this.send();
     this.infSend();
   },

   callback(res) {
    if (JSON.parse(res.body).ssId == this.ssId) {
      const state = JSON.parse(res.body).sensorState;
      this.value = JSON.parse(res.body).inputData;
      this.color = this.infoList[state].color;
      this.icon = this.infoList[state].icon;
      this.status = this.infoList[state].status;
    }    
  },
   //

    infSend() {
      this.timer = setInterval(this.send, 5000);
    },

    send() {
        //console.log("send : " + sensor.ssId);
        if (this.$stompClient && this.$stompClient.connected) {
          const msg = {
            ssId: this.ssId,
          };
          this.$stompClient.send(
            "/receive/" + this.ssId,
            JSON.stringify(msg),
            {}
          );
        }
    },

    //새로 수정
    disconnect() {
      this.$stompClient.unsubscribe(this.ssId);
    },
  },
//

  props: {
    ssId: Number,
    infoList: Array
  },
}

</script>

<style>
#humidity {
    color: v-bind(color);
    border-color: v-bind(color);
}

.pct {
  color: white;
  font-size: 35px;
  font-weight: bold;
  position: absolute;
  top: 35px;
  right: 30px;
}

</style>
