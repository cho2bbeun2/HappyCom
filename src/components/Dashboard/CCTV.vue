<template>
  <div class="wrapper">
    <link
      href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
      rel="stylesheet"
    />
    <!-- 새로 수정 -->
    <link rel="stylesheet" href="vue-virtual-scroller/dist/vue-virtual-scroller.css"/>
    <!-- -->
    <div class="table-header">CCTV 영상인식</div>
    <!-- 새로 수정 -->
    <div class="table-wrapper" v-on:scroll.passive='handleScroll'>
    
          <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
            <div class="cctv-main" v-for="item in cctvList" v-bind:key="item.cctvId">
              <div class="cctv-main__header">{{ item.posName }}</div>
              <canvas
                class="cctv-view"
                :id="item.posName" 
                width=320
                height=240
                style="width: 320px; height: 240px"
              >
              </canvas>
              <div>
                <button
                  class="btn btn-primary cctv-show-btn"
                  @click="
                    fullScreenModal = true;
                    canvasId = item.posName + 'modal';
                    posName = item.posName;
                    websocketUrl = item.websocketURL;
                    disconnectState = true;
                    [disconnect()];
                  "
                >
                  Click
                </button>
              </div>
            </div>
          </div>
     
      </div>
      <!-- -->
    <FullScreenModal
      v-if="fullScreenModal"
     
      :childCanvasId="canvasId"
      :childWebsocketURL="websocketUrl"
      :posName="posName"

       @close="
        fullScreenModal = false;
        disconnectState = false;
      "
    />
  </div>
</template>

<script>
// import { Icon } from "@iconify/vue";
import JSMpeg from "jsmpeg";
import axios from "axios";
import FullScreenModal from "../AbnormalDetection/FullScreenModal";
//import eventBus from "../../cctveventbus"; 새로 주석처리함
export default {
  name: "CCTV",

  components: {
    FullScreenModal,
  },
  data() {
    return {
      posList: [],
      fullScreenModal: false,
      currId: "",
      cctvList: [],
      cctvListLength: 0,
      elements: [],
      url: [],
      canvasView: [],
      disconnectState: false,
      fireWarning : false,
      fireWarningInfo : {detectionUrl: '', posName: ''},

      //새로 추가
      fullScreenInfo : {canvasId: '', websocketurl: '', posName: ''},
      presentPage: 0,
      //

    };
  },
  created() {
    this.getCCTVInfo();
    console.log("get CCTV Info");

    //새로추가
    document.addEventListener('scroll', this.handleScroll);
    //

    //this.fireDetection();
  },
  updated() {
    //console.log(" mount");
    this.getWebsocketVideo(4); //새로 수정 () ->(4)
  },
  //updated() {
  //console.log("get Websocket");
  //this.getWebsocketVideo();
  //},
  beforeDestroy() {
    this.disconnect();

    //새로추가
    document.removeEventListener('scroll',this.handleScroll);
    //
    //clearInterval(this.fireDetectionPolling);
  },

  methods: {
    async getCCTVInfo() {
      try {
        const res = await axios.get(
          "/api/cctv" //새로 수정
        );
        //"/api/cctv?pageSize=1&paged=true&sort.sorted=true&sort.unsorted=false&unpaged=true" 새로 수정
        this.cctvList = res.data.data.content;
        this.cctvListLength = this.cctvList.length;
        //console.log(this.cctvList)
        //this.getCCTVElement();
      } catch (err) {
        console.log(err);
      }
    },

    //새로 추가
    handleScroll: function(event){  // view only 4 video 
      var eventPage = parseInt(event.target.scrollTop / 1000);
      if(this.presentPage != eventPage){
        console.log("page changed");
        this.presentPage = eventPage;
        document.body.scrollIntoView({behavior:'smooth'}); 
      }
    },
    //

    /*
    getCCTVElement: function (){
      for(let i=0;i<this.cctvListLength;i++){
        this.elements[i] = {cctv_element: '', cctv_location: '', cctv_websocketurl: ''};
      }
      for(let i=0;i<this.cctvListLength;i++){
        this.elements[i].cctv_element= 'test-cctv'+ this.cctvList[i].cctvId;
        this.elements[i].cctv_location = this.cctvList[i].posName;
        this.elements[i].cctv_websocketurl = this.cctvList[i].websocketURL;
      }
      console.log(this.elements);
      //this.getWebsocketVideo();
    },
    */
    getWebsocketVideo: function () {
      //eventBus.$on("fireWebsocketUrl", function (e) { 새로 주석처리
      //  console.log(e); 새로 주석처리
      //}); 새로 주석처리
      console.log("get Websocket Video");
      if (this.disconnectState === false) {
        console.log(this.cctvListLength);

        for (let i = 0; i < this.cctvListLength; i++) {
          this.canvasView[i] = document.getElementById(
            this.cctvList[i].posName
          ); //'test-cctv'+String(this.cctvList[i].cctvId
          this.url[i] = new WebSocket(this.cctvList[i].websocketURL);
          new JSMpeg(this.url[i], { canvas: this.canvasView[i] });
        }
      }
    },
    /*
이 코드는 opencv에서 받을 때

          let open_socket = this.url[i]

          open_socket.addEventListener("open", ()=>{
            console.log("send connect message socket : "+String(i));
            open_socket.send("client number of connection : "+String(i));
          });

          if(this.url && this.url.length >0){
            console.log(this.url[i]);
            let listen = this.url[i];
            listen.addEventListener('message', (event)=>{
              let ctx = this.canvasView[i].getContext("2d");
              let image = new Image();
              image.src = window.URL.createObjectURL(event.data);
              image.addEventListener("load", (e) =>{
                console.log(e);
                ctx.drawImage(image, 0,0,this.canvasView[i].width, this.canvasView[i].height);
                window.URL.revokeObjectURL(image.src);
              });
            });
          }
*/

/* 새로 주석처리
    fireDetection(){
      this.fireDetectionPolling = setInterval(() => {
        const url = "http://163.180.117.40:3000/api/fireDetection/"
        fetch(url).then(res => {
          return res.json();
        }).then(json => {
          console.log(json);
          if(json.detection === true){
            this.fireWarning = true;
            this.fireWarningInfo.detectionUrl = json.detectionUrl;
            this.fireWarningInfo.posName = json.posName;
            console.log("detection URL!!!!!!!!!!!");
            console.log(this.fireWarningInfo.detectionUrl);
            clearInterval(this.fireDetectionPolling);
          }
        }).catch(function (error){
          console.warn(error);
        })
      }, 1000);
    },
    changeCctvView: function(){
      

    },
*/
    disconnect: function () {
      let length = this.cctvListLength;
      for (let i = 0; i < length; i++) {
        this.url[i].close(1000);
      }
    },

    disconnectedState: function(){
      if(this.disconnectState === false){
        this.disconnectState = true;
      }
      else{
        this.disconnectState = false;
      }
    }
  },
};
</script>

<style>
.scroller {
  height: 100%;
}
.wrapper {
  margin: 10px;
}
.table-header {
  color: #727e8c;
  font-size: 20px;
}
.table-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  height: 900px;
}

.cctv-view {
  margin: 0 10%;
}
.cctv-main {
  margin: 20px;
  background-color: #272e48;
  color: #a9c7f0;
  border-radius: 9px;
  width: 400px;
  height: 380px;
  float: left;
  position: relative;
}
.cctv-main__header {
  padding: 10px 20px;
  font-size: 20px;
  border-bottom: #464d5c 0.5px solid;
  margin-bottom: 20px;
}

.cctv-show-btn {
  position: absolute;
  right: 2%;
  margin: 10px;
}
</style>
