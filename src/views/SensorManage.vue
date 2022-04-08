<template>
  <div>
    <link
      href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
      rel="stylesheet"
    />
    <div class="wrapper">
      <div class="table-header">센싱 장비 관리</div>

      <div class="table-main" style="height: fit-content">
        <div>
          <div class="table-main__header">센싱 장비 관리 설정</div>

          <div>
            <div class="table-main__content">
              <div class="table-main__content-intro">
                센싱 장비를 관리하는 화면입니다.
              </div>
              <div>
              <div class="filters-wrapper">
              <!-- 구역 선택 -->
                <div class="dropdown" style="margin: 10px">
                  <button
                    class="btn btn-primary dropdown-toggle"
                    data-toggle="dropdown"
                    color="#000080"
                  >
                    {{ currPos.posName }}
                  </button>
                  <div class="dropdown-menu">
                    <a
                      class="dropdown-item"
                      @click="getSensorManager();
                      currPos={ posName: '전체', posId: 0 }"
                    >전체</a>
                    <a
                      v-for="pos in posList"
                      :key="pos.posId"
                      class="dropdown-item"
                      @click="getSensorManager();
                        currPos = { posName: pos.posName, posId: pos.posId };
                      "
                    >
                      {{ pos.posName }}
                    </a>
                  </div>
                </div>

                <div class="dropdown" style="margin: 10px">
                  <button
                    class="btn btn-primary dropdown-toggle"
                    data-toggle="dropdown"
                    color="#000080"
                  >
                    {{ currSsType.ssTypeName }}
                  </button>

                  <div class="dropdown-menu">
                    <a
                      class="dropdown-item"
                      @click="getSensorManager();
                        currSsType = { ssTypeName: '모든 센서', ssTypeId: 0 };
                        
                      "
                      >모든 센서</a
                    >
                    <!-- 전체 구역인 경우 -->
                    <div v-if= "currPos.posId===0">
                      <a
                        v-for="ssType in sensorList"
                        :key="ssType.typeId"
                        class="dropdown-item"
                        @click=" getSensorManager();
                          currSsType = { ssTypeName: ssType.typeName, ssTypeId: ssType.typeId };
                          
                        "
                      >
                        {{ ssType.typeName }}
                      </a>
                    </div>
                    <!-- 전체 구역이 아닌 경우 -->
                    <div v-else>
                      <a
                        v-for="ssType in sensorList"
                        :key="ssType.ssType.typeId"
                        class="dropdown-item"
                        @click=" getSensorManager();
                          currSsType = { ssTypeName: ssType.ssType.typeName, ssTypeId: ssType.ssType.typeId };
                          
                        "
                      >
                        {{ ssType.ssType.typeName }}
                      </a>
                    </div>
                  </div>
              </div>
            
              <div style="margin-left:auto;">
                <button
                  type="button"
                  class="btn btn-primary"
                  style="margin: 10px; float: right"
                  @click="showModal = true"
                >
                  신규 등록
                </button>

                <button
                  type="button"
                  class="btn btn-primary"
                  style="margin: 10px; float: right"
                  @click="sensorModalOpen = true"
                >
                  <i class="bi bi-wrench"></i> 센서 종류 관리
                </button>

                <button
                  type="button"
                  class="btn btn-primary"
                  style="margin: 10px; float: right"
                  @click="placeModalOpen = true"
                >
                  <i class="bi bi-wrench"></i> 장소 관리
                </button>
              </div>
          
           </div>      
           

                <div class="scrollbar"
                  style="width: 100%; display: flex; justify-content: center; overflow-y:auto; height:60vh;"
                >
                  <table
                    class="table table-bordered table-hover"
                    style="width: 95%; height:70px;"
                  >
                    <thead>
                      <tr>
                        <th>식별번호</th>
                        <th>센싱 장비 위치</th>
                        <th>센싱 장비 종류</th>
                        <th>담당자</th>

                        <th>담당자 내선</th>
                        <th>담당자 휴대번호</th>

                        <th style="width: 175px">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="sensor in ssManageList" :key="sensor.ssId" style="height:70px">
                        <td>{{ sensor.ssCode }}</td>
                        <td>{{ sensor.ssPos.posName }}</td>
                        <td>{{ sensor.ssType.typeName }}</td>
                        <td>{{ sensor.ssContact }}</td>
                        <td style="font-size: 1rem;">{{ sensor.ssContactExt }}</td>
                        <td style="font-size: 1rem;">{{ sensor.ssContactPhone }}</td>
                        <td
                          style="
                            vertical-align: middle;
                            padding-right: 0px;
                            padding-left: 0px;
                            text-align: center;
                          "
                        >
                          <a
                            class="btn btn-outline-primary mod-btn"
                            @click="readyToEdit(sensor)"
                            ><i class="bx bx-edit"></i> 수정
                          </a>

                          <a
                            class="btn btn-outline-danger tr_data_del"
                            @click="
                              askToDelete = true;
                              deleteSensorId = sensor.ssId;
                            "
                            ><i class="bx bx-trash"></i> 삭제</a
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                

                <!--nav aria-label="Page navigation example" style="float: right">
                  <ul class="pagination">
                    <li
                      v-for="i in totalPages"
                      :key="i"
                      @click="getSensorManage(i - 1)"
                      class="page-item"
                    >
                      <span class="page-link">{{ i }}</span>
                    </li >

                    <
                <li class="page-item">
                  <a class="page-link cur-page" href="#">1</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>'
                >
                  </ul>
                </nav-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-if="showModal"
      @close="showModal = false"
      @add-new-sensor="addNewSensor"
    />
    <EditSensorModal
      v-if="showEditModal"
      :sensorPosId="sensorPosId"
      :sensorTypeId="sensorTypeId"
      :ssContact="ssContact"
      :ssContactExt="ssContactExt"
      :ssContactPhone="ssContactPhone"
      :ssId="ssId"
      @edit-sensor="editSensor"
      @close="showEditModal = false"
    >
    </EditSensorModal>
    <TypeModal
      v-if="sensorModalOpen"
      @close="sensorModalOpen = false"
      @modified="getSensorManager"
    />
    <PlaceModal
      v-if="placeModalOpen"
      @close="placeModalOpen = false"
      @modified="getSensorManager"
    />
    <AskToDelete
      v-if="askToDelete"
      @close="askToDelete = false"
      @delete="
        deleteSensorManage(deleteSensorId);
        askToDelete = false;
      "
    ></AskToDelete>
    <AlertSuccess
      v-if="alertSuccess"
      :action="action"
      @close="alertSuccess = false"
    ></AlertSuccess>
    <AlertFail
      v-if="alertFail"
      :action="action"
      @close="alertFail = false"
    ></AlertFail>
  </div>
</template>

<script>
// import { Icon } from "@iconify/vue";
import Modal from "@/components/Modal.vue";
import EditSensorModal from "@/components/IoTManage/EditSensorModal.vue";
import PlaceModal from "@/components/IoTManage/PlaceModal.vue";
import TypeModal from "@/components/IoTManage/TypeModal.vue";
import AskToDelete from "@/views/ask-to-delete.vue";
import AlertSuccess from "@/views/alert-success.vue";
import AlertFail from "@/views/alert-fail.vue";
import axios from "axios";

export default {
  components: {
    Modal,
    EditSensorModal,
    PlaceModal,
    TypeModal,
    AskToDelete,
    AlertSuccess,
    AlertFail,
  },
  data() {
    return {
      action: "",
      alertFail: false,
      alertSuccess: false,
      askToDelete: false,
      deleteSensorID: 0,
      sensorPosId: 0,
      sensorTypeId: 0,
      ssContact: "",
      ssContactExt: "",
      ssContactPhone: "",
      ssId: "",
      showModal: false,
      sensorModalOpen: false,
      placeModalOpen: false,
      showEditModal: false,
      ssManageList: [],
      totalPages: 0,
      currPos: { posName: "전체", posId: 0 },
      currSsType: { ssTypeName: "센서 종류 선택", ssTypeId: 0 },
      posList:[],
      sensorList:[],
      
    };
  },
  created() {
    this.getSensorPos();
    this.getAllSensor();
    this.getSensorManager();
    
  },
  methods: {
    async getSensorPos() { // 구역 리스트 얻기
      this.posList =[];
      try {
        const res = await axios.get(
          "/api/sensor-pos"
        );
        this.posList = res.data.data.content;
      } catch (err) {
        console.log(err);
      }
    },
     async getAllSensor() { // 존재하는 모든 센서 종류
      this.sensorList =[];
      try {
        const res = await axios.get(
          "/api/sensor-type"
        );
        this.sensorList = res.data.data.content;
      } catch (err) {
        console.log(err)
      }
    },

    async getPosSensor() { // 구역별 존재하는 센서
      this.sensorList =[];
      try {
        const res = await axios.get(
          "/api/sensor-manage?posId=" + this.currPos.posId
        );
        this.sensorList = res.data.data.content;
      } catch (err) {
        console.log(err);
      }
    },

    async getSensorManager() {
      try {
        const res = await axios.get(
        "/api/sensor-manage"
        );
          const templist = res.data.data;
        if(this.currPos.posId==0 && this.currSsType.ssTypeId == 0 ){
          this.getAllSensor();
          this.ssManageList = templist;
          
        }
        else if (this.currPos.posId !==0 && this.currSsType.ssTypeId == 0){
          this.getPosSensor();
          this.ssManageList =[];
          for (var list of templist){
            if(list.ssPos.posId == this.currPos.posId){
              this.ssManageList.push(list);
            }
          }
        }
        else if (this.currSsType.ssTypeId !==0 && this.currPos.posId !==0){
          this.getPosSensor();
          this.ssManageList =[];
          for (var slist of templist){
            if(slist.ssType.typeId == this.currSsType.ssTypeId && slist.ssPos.posId== this.currPos.posId){
              this.ssManageList.push(slist);
            }
          }
        }
        else if (this.currSsType.ssTypeId !==0 && this.currPos.posId ==0){
          this.getPosSensor();
          this.ssManageList =[];
          for (var tlist of templist){
            if(tlist.ssType.typeId == this.currSsType.ssTypeId){
              this.ssManageList.push(tlist);
            }
          }
        }
        
        
        } catch (err) {
          console.log(err);
      }

     
    },

    readyToEdit(sensor) {
      this.ssId = sensor.ssId;
      this.sensorPosId = sensor.ssPos.posId;
      this.sensorTypeId = sensor.ssType.typeId;
      this.ssContact = sensor.ssContact;
      this.ssContactExt = sensor.ssContactExt;
      this.ssContactPhone = sensor.ssContactPhone;
      this.showEditModal = true;
    },

    async editSensor(newSensor) {
      this.action = "수정";
      console.log(newSensor);
      try {
        const res = await axios.put(
          "/api/sensor-manage/" + newSensor.ssId,
          {
            sensorPosId: newSensor.sensorPosId,
            sensorTypeId: newSensor.sensorTypeId,
            ssContact: newSensor.ssContact,
            ssContactExt: newSensor.ssContactExt,
            ssContactPhone: newSensor.ssContactPhone,
          }
        );
        console.log(res);
        this.getSensorManager();
        this.showEditModal = false;
        this.alertSuccess = true;
      } catch (err) {
        this.alertFail = true;
        console.log(err);
      }
    },

    async deleteSensorManage(ssId) {
      this.showEditModal = false;
      this.action = "삭제";
      try {
        const res = await axios.delete(
          "/api/sensor-manage/" + ssId
        );
        console.log(res);
        this.alertSuccess = true;
        this.getSensorManager();
      } catch (err) {
        this.alertFail = true;
        console.log(err);
      }
    },

    async addNewSensor(newSensor) {
      this.action = "등록";
      try {
        const res = await axios.post(
          "/api/sensor-manage/",
          {
            sensorPosId: newSensor.sensorPosId,
            sensorTypeId: newSensor.sensorTypeId,
            ssContact: newSensor.ssContact,
            ssContactExt: newSensor.ssContactExt,
            ssContactPhone: newSensor.ssContactPhone,
          }
        );
        this.getSensorManager();
        this.showModal = false;
        this.alertSuccess = true;

        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.filters-wrapper {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}
.tableEdge{
  height: 70%;
}
.table-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  height: 600px;
}
.wrapper {
  margin: 10px;
}
.table-header {
  color: #727e8c;
  font-size: 500px;
  margin: 30px;
}
.table {
  color: #464d5c;
  
}


.table-main__content {
  margin: 0 20px;
  color: #8a99b5;
  
}
table-main__content-intro {
  color: #8a99b5;
}
table {
  text-align: center;
}
.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > td,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  border: 2px solid #464d5c;
}
.table.table-bordered th {
  border: 2px solid #464d5c;
  color: #bdd1f8;
  font-size: 1rem;
}
tbody td,
.table tbody th {
  border-color: #464d5c;
  color: #8a99b5;
  font-size: 1rem;
  height: 40px;
  line-height: 40px;
}
td {
  height: 40px;
  line-height: 40px;
}
thead > tr,
tbody > tr,
tfoot > tr {
  height: 30px;
  vertical-align: middle;
  line-height: 30px;
}
.mod-btn {
  margin-right: 5px;
}
.btn-outline-danger,
.mod-btn {
  color: white;
}
.bx {
  color: #7c8ba6;
}
.table-hover:hover tbody tr:hover td {
  color: white;
  background-color: #244a63;
}
.table-hover:target tbody tr:target td {
  color: white;
  background-color: #244a63;
}
nav {
  border: none;
}
.btn-primary {
  background-color: #5a8dee !important;
  font-weight: 600;
  border: #5a8dee 1px solid;
}
.page-link {
  border: #7c8ba6 2px solid;
  color: #7c8ba6;
  background-color: #1a233a;
}
.cur-page {
  background-color: #5a8ded;
  color: white;
}

.edit-input {
  border-radius: 5px;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-transition: background-color 9999s ease-out;
  -webkit-box-shadow: 0 0 0px 1000px #00000000 inset !important;
  -webkit-text-fill-color: #9fb0d6 !important;
}
</style>
