<template>
  <div class="wrapper">
    <link
      href="https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css"
      rel="stylesheet"
    />
    <div class="table-header">
      문자메시지 기록 | 
    </div>

    <div class="table-main" style="height: fit-content">
      <div>
        <div class="table-main__header">문자메시지 기록</div>
      </div>
       <div>
          <div class="table-main__content">
            <div class="table-main__content-intro"></div>

            <div>
      
      <div class="filters-wrapper">
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
      

      <div class="scrollbar" style="width: 100%; display: flex; justify-content: center; overflow-y:scroll; height:60vh;">
        <table class="table table-bordered table-hover" style="width: 95%; height:70px;">
          <thead>
            <tr>
              <th>발신자</th>
              <th>내용</th>
              <th>수신자</th>
              <th>발송 여부</th>
              <th>발송 날짜</th>
              <th>발송 시간</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="msgLog in msgLogList" in :key="msgLog.id">
            <th>{{ msgLog.sender }}</th>
            <th>{{ msgLog.text }}</th>
            <th>{{ msgLog.receiver }}</th>
            <th>
              <span v-if="msgLog.send">O</span>
              <span v-else>X</span>
            </th>
            <th>{{ msgLog.createdAt.split('T')[0].substring(5) }}</th>
            <th>{{ msgLog.createdAt.split('T')[1].substring(0,5) }}</th>
          </tr>
          </tbody>
        </table>
        </div>
    </div>
          </div>
       </div>
    </div>

    <!--nav aria-label="Page navigation example" style="float: right">
      <ul class="pagination">
        <li
          v-for="i in totalPages"
          :key="i"
          @click="getMsgLog(i - 1)"
          class="page-item"
        >
          <span class="page-link">{{ i }}</span>
        </li>

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
</template>

<script>
// import { Icon } from "@iconify/vue";
import axios from "axios";

export default {
  name: "MsgLog",
  data() {
    return  {
      msgLogList: [],
      currPeriod: { periodId: 0, periodName: "기간 선택", start: new Date(), end: new Date() },
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
      
    }
  },
  created() {
    this.getMsgLog();
    this.setPeriod();
  },
  methods: {
    async getMsgLog() {
      try {
        const res = await axios.get(
          '/api/message/log'
        )
        const tempList = res.data.data;
        for(var list of tempList){
          this.msgLogList.unshift(list);
        }
        //this.msgLogList = res.data.data.content;
        this.totalPages = res.data.data.totalPages;
        
      } catch (err) {
        console.log(err);
      }

    },
  
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
     filterTypePeriod() {
      var currPeriodId = this.currPeriod.periodId;
      var currTypeId = this.currSsType.ssTypeId;

      console.log(this.currSsType.ssTypeId);
      console.log(this.posSensorDataLogList[0]);

      // 전체 기간을 조회하는 경우
      if (currPeriodId === 0) {
        // 모든 센서를 조회하려는 경우
        if (currTypeId === 0) {
          this.sensorDataLogList = this.posSensorDataLogList;
        } else { // 특정 센서를 조회하려는 경우
          this.sensorDataLogList = this.posSensorDataLogList.filter(function(alarmLog) {
            return (alarmLog.sensorManage.ssType.typeId === currTypeId)
          })
        }
      }

      // 특정 기간을 조회하려는 경우
      else {
        var startDate = this.currPeriod.start;
        var endDate = this.currPeriod.end;

        this.sensorDataLogList = this.posSensorDataLogList.filter(function(alarmLog) {
          var logDate = new Date(alarmLog.createdAt);
          if (currTypeId === 0) { // 모든 센서를 조회하려는 경우
            return (startDate <= logDate && logDate <= endDate)
          } else { // 특정 센서를 조회하려는 경우
            return (alarmLog.sensorManage.ssType.typeId === currTypeId) && (startDate <= logDate && logDate <= endDate)
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

<style>
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
</style>
