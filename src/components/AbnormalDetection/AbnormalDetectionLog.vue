<template>
  <div class="wrapper">
    <link
      href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
      rel="stylesheet"
    />
    <div class="table-header">이상 감지 이력 |</div>

    <div class="table-main" style="height: fit-content">
      <div>
        <div class="table-main__header">이상 감지 이력</div>

        <div>
          <div class="table-main__content">
            <div class="table-main__content-intro">구역, 센서 종류 및 기간을 선택해주세요</div>

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
                    @click="
                      getAlarmLog();
                      currPos = { posName: '모든 구역', posId: 0 };
                    "
                    >모든 구역</a
                  >
                  <a
                    v-for="pos in posList"
                    :key="pos.posId"
                    class="dropdown-item"
                    @click="
                      getPosAlarmLog(pos.posId);
                      currPos = { posName: pos.posName, posId: pos.posId };
                    "
                  >
                    {{ pos.posName }}
                  </a>
                </div>
              </div>

              <!-- 센서 종류 선택 -->
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
                    @click="
                      currSsType = { ssTypeName: '모든 센서', ssTypeId: 0 };
                      filterTypePeriod();
                    "
                    >모든 센서</a
                  >
                  <!-- 전체 구역인 경우 -->
                  <div v-if= "currPos.posId===0">
                    <a
                      v-for="ssType in sensorList"
                      :key="ssType.typeId"
                      class="dropdown-item"
                      @click="
                        currSsType = { ssTypeName: ssType.typeName, ssTypeId: ssType.typeId };
                        filterTypePeriod();
                      "
                    >
                      {{ ssType.typeName }}
                    </a>
                  </div>
                  <!-- 전체 구역이 아닌 경우 -->
                  <div v-else>
                    <a
                      v-for="list in sensorList"
                      :key="list.typeId"
                      class="dropdown-item"
                      @click="
                        currSsType = { ssTypeName: list.ssType.typeName, ssTypeId: list.ssType.typeId };
                        filterTypePeriod();
                      "
                    >
                      {{ list.ssType.typeName }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="period-filter-wrapper">
              <!-- 기간 선택 -->
              <div class="dropdown" style="margin: 10px">
                <button
                  class="btn btn-primary dropdown-toggle"
                  data-toggle="dropdown"
                  color="#000080"
                >
                  {{ currPeriod.periodName }}
                </button>
                <div class="dropdown-menu">
                  <a
                    v-for="period in periodList"
                    :key="period.periodId"
                    class="dropdown-item"
                    @click="
                      currPeriod = period;
                      getCurrStartEndString();
                      filterTypePeriod();
                    "
                  >
                    {{ period.periodName }}
                  </a>
                </div>
              </div>
                <!-- 사용자 지정 기간 -->
                <div class="user-period-wrapper">
                  <div class="use-period">
                    <div>시작</div>
                    <input
                    type="date"
                    v-model="startDate.date"
                    :disabled="currPeriod.periodId !== 7"
                    />
                    <input 
                    type="time"
                    v-model="startDate.time"
                    :disabled="currPeriod.periodId !== 7"
                    >
                  </div>
                  <div class="use-period">
                    <div>끝</div>
                    <input
                    type="date" 
                    v-model="endDate.date"
                    :disabled="currPeriod.periodId !== 7"
                    />
                    <input
                    type="time" 
                    v-model="endDate.time"
                    :disabled="currPeriod.periodId !== 7"
                    >
                  </div>
                </div>

                <button
                class="btn btn-secondary"
                style="margin-left: 1rem;"
                :disabled="currPeriod.periodId !== 7"
                @click="
                getStartEndDate();
                filterTypePeriod()
                "
                >
                  조회하기
                </button>
              </div>
              
              </div>

              <div v-if="alarmLogList.length===0" class="empty-data">
                <div>데이터가 존재하지 않습니다.</div>
                <div class="empty-icon"><i class="bi bi-x-circle"></i></div>
              </div>
              <!-- <div v-else class="table-wrapper scrollbar"> -->
              <div v-else class="scrollbar" style="display:flex; overflow-y:auto; height:60vh;">
                <table
                  class="table table-bordered table-hover"
                  style="width: 95%; height:70px;"
                >
                  <!-- <thead class="alarm-log-header"> -->
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>시간</th>
                      <th>위치</th>
                      <th>종류</th>
                      <th>레벨</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(alarmLog, i) in alarmLogList" in :key="i">
                      <td>
                        {{ alarmLog.createdAt.split('T')[0].substring() }}
                        <!-- substring(5) -->
                      </td>
                      <td>
                        {{ alarmLog.createdAt.split('T')[1].substring(0, 8) }}
                        <!-- substring(0, 5) -->
                      </td>
                      <td>{{ alarmLog.posName }}</td>
                      <td>{{ alarmLog.typeName }}</td>
                      <td
                        :style="{ color: statusList[alarmLog.sensorState][1] }"
                      >
                        {{ statusList[alarmLog.sensorState][0] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Icon } from "@iconify/vue";
import axios from "axios";

export default {
  name: "EsopManager",
  data() {
    return {
      currPos: { posName: "구역 선택", posId: 0 },
      currSsType: { ssTypeName: "센서 종류 선택", ssTypeId: 0 },
      currPeriod: { periodId: 0, periodName: "기간 선택", start: new Date(), end: new Date() },
      posList: [],
      sensorList: [],
      alarmLogList: [], // 필터링된 알람 로그들
      posAlarmLogList: [], // 해당 구역의 모든 알람 로그들
      startDate: { date: "", time: "" },
      endDate: { date: "", time: "" },
      periodList: [
        { periodId: 0, periodName: "모든 기간" },
        { periodId: 1, periodName: "오늘" },
        { periodId: 2, periodName: "어제" },
        { periodId: 3, periodName: "최근 7일" },
        { periodId: 4, periodName: "최근 30일" },
        { periodId: 5, periodName: "이번달" },
        { periodId: 6, periodName: "지난달" },
        { periodId: 7, periodName: "사용자 지정" },
      ],
      statusList: [
        ["안전", "#5a8dee"],
        ["관심", "#39da8a"],
        ["주의", "#fdce41"],
        ["경고", "#fdac41"],
        ["심각", "#ff5b5c"],
      ],
    };
  },
  created() {
    this.getSensorPos();
    this.setPeriod();
    this.getAlarmLog();
    this.getAllSensor();
  },
  methods: {
    getYYYYMMDD(d) { // date를 string으로
      return new Date(d.getTime()-(d.getTimezoneOffset()*60*1000)).toISOString().split('T')[0];
    },

    getTime(d) { // time을 string으로
      return new Date(d.getTime()-(d.getTimezoneOffset()*60*1000)).toISOString().split('T')[1].substr(0, 5);
    },

    setPeriod() { // 오늘을 기준으로 기간의 start와 end를 정함
      var today = new Date();
      var t_year = today.getFullYear();
      var t_month = today.getMonth();
      var t_date = today.getDate();

      for (var period of this.periodList) {
        var start = new Date();
        var end = new Date();
        start.setHours(0, 0, 0, 0);

        switch (period.periodId) {
        case 0:
        case 1: // 오늘
          break;
        case 2: // 어제
          start.setDate(t_date - 1);
          end = new Date(t_year, t_month, t_date - 1, 23, 59);
          break;
        case 3: // 최근 7일
          start.setDate(t_date - 7);
          break;
        case 4: // 최근 30일
          start.setDate(t_date - 30);
          break;
        case 5: // 이번달
          start = new Date(t_year, t_month, 1);
          break;
        case 6: // 저번달
          start = new Date(t_year, t_month - 1, 1);
          end = new Date(t_year, t_month, 0, 23, 59);
          break;
        }
        period.start = new Date(start);
        period.end = new Date(end);
      }
    },

    async getAllSensor() { // 존재하는 모든 센서 종류
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
      try {
        const res = await axios.get(
          "/api/sensor-manage?posId=" + this.currPos.posId
        );
        this.sensorList = res.data.data;
        
      } catch (err) {
        console.log(err);
      }
    },

    async getSensorPos() {
      try {
        const res = await axios.get(
          "/api/sensor-pos"
        );
        this.posList = res.data.data.content;
      } catch (err) {
        console.log(err);
      }
    },

    async getAlarmLog() {
      try {
        const res = await axios.get(
          "/api/abnormal-detection"
        );
        this.getAllSensor();
        const templist = res.data.data.content;
        for( var tlist of templist){
          this.posAlarmLogList.unshift(tlist);
        }
        //this.posAlarmLogList = res.data.data.content;

        // 센서 종류 필터링 초기화
        this.currSsType = { ssTypeName: "모든 센서", ssTypeId: 0 }

        this.filterTypePeriod();
      } catch (err) {
        console.log(err);
      }
    },

    async getPosAlarmLog(posId) {
      try {
        const res = await axios.get(
          "/api/abnormal-detection?posId=" + posId
        );
        this.getPosSensor();
        this.posAlarmLogList=[];
        const templist = res.data.data.content;
        for(var list of templist){
          this.posAlarmLogList.unshift(list);
        }
        //this.posAlarmLogList = res.data.data.content;

        // 센서 종류 필터링 초기화
        this.currSsType = { ssTypeName: "모든 센서", ssTypeId: 0 }

        // 센서 종류 및 기간 필터링
        this.filterTypePeriod();
      } catch (err) {
        console.log(err);
      }
    },

    filterTypePeriod() { // 센서 타입, 기간 필터링 기능
    
      var currPeriodId = this.currPeriod.periodId;
      var currTypeId = this.currSsType.ssTypeId;

      // 전체 기간을 조회하는 경우
      if (currPeriodId === 0) {
        // 모든 센서를 조회하려는 경우
        if (currTypeId === 0) {
          this.alarmLogList = this.posAlarmLogList;
        } else { // 특정 센서를 조회하려는 경우
          this.alarmLogList = this.posAlarmLogList.filter(function(alarmLog) {
            return (alarmLog.typeId === currTypeId)
          })
        }
      }

      // 특정 기간을 조회하려는 경우
      else {
        var startDate = this.currPeriod.start;
        var endDate = this.currPeriod.end;

        this.alarmLogList = this.posAlarmLogList.filter(function(alarmLog) {
          var logDate = new Date(alarmLog.createdAt);
          if (currTypeId === 0) { // 모든 센서를 조회하려는 경우
            return (startDate <= logDate && logDate <= endDate)
          } else { // 특정 센서를 조회하려는 경우
            return (alarmLog.typeId === currTypeId) && (startDate <= logDate && logDate <= endDate)
          }
        })
      }
    },

    getCurrStartEndString() {
      this.startDate.date = this.getYYYYMMDD(this.currPeriod.start);
      this.startDate.time = this.getTime(this.currPeriod.start);
      this.endDate.date = this.getYYYYMMDD(this.currPeriod.end);
      this.endDate.time = this.getTime(this.currPeriod.end);
    },

    getStartEndDate() {
      this.currPeriod.start = new Date(this.startDate.date + 'T' + this.startDate.time)
      this.currPeriod.end = new Date(this.endDate.date + 'T' + this.endDate.time)
      console.log(this.currPeriod);
    },


  },
};
</script>

<style scoped>

.table-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;
  height: 600px;
}

.filters-wrapper {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}

.period-filter-wrapper {
  display: flex;
  margin-left: auto;
}

.user-period-wrapper {
  display: flex;
  flex-direction: row;
}

.use-period {
  margin: 0px 10px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  margin-top: 70px;
  font-size: 30px;
  text-align: center;
}

.empty-icon {
  font-size: 60px;
  margin-top: 20px;
}

.alarm-log-header {
  background-color: #00000020;
}

</style>
