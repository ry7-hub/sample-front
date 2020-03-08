<template>
  <div style="width: 100%">
  <v-list-item>
  <v-flex xs4>
    <v-select
      :items="display_month_list"
      v-model="display_month"
      label="表示年月"
      single-line
      v-on:change="changeDisplayMonth()"
    ></v-select>
  </v-flex>
  <v-flex xs4 class="header_button">
    <v-btn dark @click="batchApplication()">一括申請</v-btn>
    <!-- <v-btn dark>月末申請</v-btn> -->
  </v-flex>
  </v-list-item>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr class="header_color">
          <th class="text-left">日付</th>
          <th class="text-left">勤務区分</th>
          <th class="text-left">出勤時刻</th>
          <th class="text-left">退勤時刻</th>
          <th class="text-left">休憩開始</th>
          <th class="text-left">休憩終了</th>
          <th class="text-left">総労働時間</th>
          <th class="text-left">休憩時間</th>
          <th class="text-left">残業時間</th>
          <th class="text-left">備考</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in attendance_list" :key="item.name" v-bind:class="getRowColor(item)">
          <td>{{ item.key.attendance_date }} {{getDayOfWeekJp(item.day_of_week)}}</td>
          <td>{{ item.kind }}</td>
          <td>{{ item.start_time }}</td>
          <td>{{ item.end_time }}</td>
          <td>{{ item.break_start_time }}</td>
          <td>{{ item.break_end_time }}</td>
          <td>{{ item.all_time }}</td>
          <td>{{ item.break_all_time }}</td>
          <td>{{ item.overtime }}</td>
          <td>{{ item.remarks }}</td>
          <td style="text-align: center; width: 100px;">
            <v-btn v-if="item.aproval_kind == '未申請'" dark @click.stop="editAttendance(user_id, item.key.attendance_date, item.day_of_week)" class="button">編集</v-btn>
            <v-btn v-else-if="item.aproval_kind == '申請済'" dark @click.stop="cancelApplication(item.key.attendance_date)" class="button">申請取消</v-btn>
            <v-btn v-else dark >承認済</v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template> -->
      <v-card>
        <v-toolbar dark color="">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>日次勤怠</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="registAttendance()">登録</v-btn>
            <v-btn dark text @click="registAttendance('申請済')">申請</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-list-item>
            {{getDisplayDate(selected_date)}}  {{selected_day_of_week}}
            <br/>
            {{name}}
          </v-list-item>
          
          <v-list-item>
            <v-flex xs1>
              <v-select
                :items="attendance_kind_list"
                v-model="attendance.kind"
                label="勤怠区分"
                single-line
              ></v-select>
            </v-flex>
          </v-list-item>

          <!-- 時刻 -->
          <v-list-item>
            <v-flex xs11 sm1>
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="attendance.start_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                <v-text-field
                  slot="activator"
                  v-model="attendance.start_time"
                  label="出勤時刻"
                  readonly
                  v-on="on"
                ></v-text-field>
                </template>
                <v-time-picker v-model="attendance.start_time" @change="$refs.menu.save(attendance.start_time)"></v-time-picker>
              </v-menu> 
            </v-flex>
          &nbsp;&nbsp;～&nbsp;&nbsp;
            <v-flex xs11 sm1>
              <v-menu
                ref="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="attendance.end_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                <v-text-field
                  slot="activator"
                  v-model="attendance.end_time"
                  label="退勤時刻"
                  readonly
                  v-on="on"
                ></v-text-field>
                </template>
                <v-time-picker v-model="attendance.end_time" @change="$refs.menu2.save(attendance.end_time)"></v-time-picker>
              </v-menu> 
            </v-flex>
          </v-list-item>

          <v-list-item>
            <v-flex xs11 sm1>
              <v-menu
                ref="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="attendance.break_start_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                <v-text-field
                  slot="activator"
                  v-model="attendance.break_start_time"
                  label="休憩開始時刻"
                  readonly
                  v-on="on"
                ></v-text-field>
                </template>
                <v-time-picker v-model="attendance.break_start_time" @change="$refs.menu3.save(attendance.break_start_time)"></v-time-picker>
              </v-menu> 
            </v-flex>
          &nbsp;&nbsp;～&nbsp;&nbsp;
            <v-flex xs11 sm1>
              <v-menu
                ref="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="attendance.break_end_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                <v-text-field
                  slot="activator"
                  v-model="attendance.break_end_time"
                  label="休憩終了時刻"
                  readonly
                  v-on="on"
                ></v-text-field>
                </template>
                <v-time-picker v-model="attendance.break_end_time" @change="$refs.menu4.save(attendance.break_end_time)"></v-time-picker>
              </v-menu> 
            </v-flex>
          </v-list-item>

          <!-- 備考 -->
          <v-list-item>
            <v-flex xs4>
              <v-text-field
                id="remarks"
                name="remarks"
                label="備考"
                v-model="attendance.remarks"
              ></v-text-field>
            </v-flex>
          </v-list-item>

          <!-- 申請承認 -->
          <v-list-item>
            <v-flex xs4>
              申請承認：{{attendance.aproval_kind}}
            </v-flex>
          </v-list-item>
        </v-list>        
      </v-card>
    </v-dialog>
  </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment'

export default {
  middleware: 'auth',
  data () {
    return {
      display_month_list: [],
      display_month: '',
      attendance_list:[],
      attendance: {},
      user_id: 0,
      name:'',

      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      // 編集用
      selected_date: '',
      selected_day_of_week: '',  
      attendance_kind_list: [
        {'text': '出勤'},
        {'text': '公休'},
        {'text': '有休'},
        {'text': '欠勤'}
      ],
      // attendance_kind: '',
      // start_time: null,
      // end_time: null,
      // break_start_time: null,
      // break_end_time: null,
      // remarks: '',
      // aproval_kind: '未申請'
    }
  },
  created() {
    var month_list = [];
    for(let i = 0; i < 5; i++) {
      let m = moment().subtract(i, 'months').format('YYYY/MM');
      let month_item = {'text': m}
      month_list.push(month_item);
    }
    this.display_month_list = month_list;
    this.display_month = moment().format('YYYY/MM');
  },
  mounted() {
    this.user_id = this.$auth.user.id;
    this.name = this.$auth.user.name;
    this.getAttendanceData();
  },
  methods: {
    getRowColor: function(item) {
      if(item.day_of_week == 'SUNDAY') {
        return 'sunday';
      }
      else if(item.day_of_week == 'SATURDAY') {
        return 'saturday';
      }
      return '';
    },
    getDayOfWeekJp(day_of_week) {
      if(day_of_week == 'SUNDAY') {
        return '(日)';
      }
      else if(day_of_week == 'MONDAY') {
        return '(月)';
      }
      else if(day_of_week == 'TUESDAY') {
        return '(火)';
      }
      else if(day_of_week == 'WEDNESDAY') {
        return '(水)';
      }
      else if(day_of_week == 'THURSDAY') {
        return '(木)';
      }
      else if(day_of_week == 'FRIDAY') {
        return '(金)';
      }
      else if(day_of_week == 'SATURDAY') {
        return '(土)';
      }
    },
    getAttendanceData: function() {
      let month = this.getQueryMonth();
      axios.get('http://172.30.0.2:8081/api/attendance/list?userId=' + this.user_id + '&date=' + month).then(response => this.attendance_list = response.data)
    },
    getAttendanceDateForDay: function(date) {
      axios.get('http://172.30.0.2:8081/api/attendance/find?userId=' + this.user_id + '&date=' + date).then(response =>{
        this.attendance = response.data
        console.log(this.attendance);
        this.dialog = true;
      }).catch(error => {
        alert('error');
      })
    },
    getQueryMonth: function() {
      return this.display_month.split('/')[0] + this.display_month.split('/')[1];
    },
    getDisplayDate: function(date) {
      return date.substr(0, 4) + '/' + date.substr(4, 2) + '/' + date.substr(6);
    },
    changeDisplayMonth: function() {
      this.getAttendanceData();
    },
    editAttendance: function(id, date, day_of_week) {
      this.selected_date = date;
      this.selected_day_of_week = day_of_week;
      // ここで登録されているデータをとってくる
      this.getAttendanceDateForDay(date);
    },
    registAttendance: function(aproval_kind = '未申請') {
      // バリデーションはなしで
      if(aproval_kind == '申請済') {
        if(this.attendance.start_time == null || this.attendance.end_time == null || this.attendance.break_start_time == null || this.attendance.break_end_time == null) {
          alert('申請する場合は、時間を全て入力してください。');
          return;
        }
      }
      
      let data = {
       	user_id: this.user_id,
        attendance_date: this.selected_date,
        kind: this.attendance.kind,
        start_time: this.attendance.start_time,
        end_time: this.attendance.end_time,
        break_start_time: this.attendance.break_start_time,
        break_end_time: this.attendance.break_end_time,
        remarks: this.attendance.remarks,
        aproval_kind: aproval_kind
      }
      axios.post('http://172.30.0.2:8081/api/attendance/regist', data).then(response => {
        this.dialog = false;
        let month = this.getQueryMonth();
        axios.get('http://172.30.0.2:8081/api/attendance/list?userId=' + this.user_id + '&date=' + month).then(response => this.attendance_list = response.data)
      }).catch(error => {
        alert('error');
      })
    },
    cancelApplication: function(date) {
      if(confirm('申請を取り消しますか')) {
        let data = {
          user_id: this.user_id,
          date: date,
          status: '未申請'
        }
        axios.post('http://172.30.0.2:8081/api/attendance/update/status', data).then(response => {
          let month = this.getQueryMonth();
          axios.get('http://172.30.0.2:8081/api/attendance/list?userId=' + this.user_id + '&date=' + month).then(response => this.attendance_list = response.data)
        }).catch(error => {
          alert('error');
        })
      }
    },
    batchApplication: function() {
      let data = {
        user_id: this.user_id,
        month: this.getQueryMonth()
      }
      axios.post('http://172.30.0.2:8081/api/attendance/update/batch', data).then(response => {
        let resData = response.data;
        alert(resData.message);
        let month = this.getQueryMonth();
        axios.get('http://172.30.0.2:8081/api/attendance/list?userId=' + this.user_id + '&date=' + month).then(response => this.attendance_list = response.data)
      }).catch(error => {
        alert('error');
      })
    }
  }
}
</script>

<style>
.header_color {
  background-color: beige;
}
.sunday {
  background-color: lavenderblush
}
.saturday {
  background-color: lightcyan
}

.header_button {
  margin-left: auto;
  text-align: right;
}
.button {
  width: 75px;
}
</style>
