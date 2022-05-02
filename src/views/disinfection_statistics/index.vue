<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <el-form-item label="街镇">
        <el-select filterable  v-model="form.street" placeholder="请选择" @change="onStreetChange">
           <el-option
            v-if="streetList.length !== 1"
            label="全部"
            value=""
            >
          </el-option>
          <el-option
            v-for="item in streetList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="居委会">
        <el-select filterable  v-model="form.neighborhood" placeholder="请选择" @change="onNeighborhoodChange">
           <el-option
            v-if="neighborhoodList.length !== 1"
            label="全部"
            value=""
            >
          </el-option>
          <el-option
            v-for="item in neighborhoodList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="社区">
        <el-select filterable  v-model="form.community" placeholder="请选择" @change="onCommunityChange">
           <el-option
            v-if="communityList.length !== 1"
            label="全部"
            value=""
            >
          </el-option>
          <el-option
            v-for="item in communityList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.date"
          @change="onDateChange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          :clearable="false"
          :picker-options="pickerOptions"
          end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="isDownload" type="primary" @click="handleDownload">
          数据导出
        </el-button>
      </el-form-item>

    </el-form>
    <div class="statistics">
      <el-card class="stats-part1">
        <el-row :gutter="10">
          <el-col :span="24">
            <div class="stats-box-warp">
              <div class="stats-box">
                <template v-if="form.street === ''">
                  <span class="stats-label">街(镇)数: </span><span class="stats-val">{{streetList.length}}</span>
                </template>
                <template v-else-if="form.neighborhood === ''">
                  <span class="stats-label">居委会数: </span><span class="stats-val">{{neighborhoodList.length}}</span>
                </template>
                <template v-else>
                  <span class="stats-label">社区数: </span><span class="stats-val">{{form.community === '' ? communityList.length : 1}}</span>
                </template>
              </div>
              <div class="stats-box">
                <span class="stats-label">总楼栋数: </span><span class="stats-val">{{statisticsData.building_num || 0}}</span>
              </div>
              <div class="stats-box">
                <span class="stats-label">涉疫楼栋数: </span><span class="stats-val color-red">{{statisticsData.positive_building_num || 0}}</span>
              </div>
              <div class="stats-box">
                <span class="stats-label">专业队伍: </span><span class="stats-val">{{statisticsData.professional_num || 0}}</span>
              </div>
              <div class="stats-box">
                <span class="stats-label">物业: </span><span class="stats-val">{{statisticsData.management_num || 0}}</span>
              </div>
              <div class="stats-box">
                <span class="stats-label">志愿者: </span><span class="stats-val">{{statisticsData.volunteer_num || 0}}</span>
              </div>
              <div class="stats-box">
                <span class="stats-label">专业服务人次: </span><span class="stats-val">{{statisticsData.professional_serve_count || 0}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <span class="stats-label">七天的防护消毒物资: </span>
            <span class="stats-val">
              <template v-for="item in wuziList">
                <span :key="item.field" class="wuzi-item">{{item.label}}:
                  <template v-if="statisticsData[item.field] === 0">
                      <el-tag type="success">全</el-tag>
                  </template>
                  <template v-else>
                      <el-tag type="danger">缺</el-tag>
                  </template>
                </span>
              </template>
            </span>
          </el-col>
        </el-row>
      </el-card>
      <div class="stats-part2">
        <table class="stats-table" cellspacing="0" cellpadding="0" border="0">
          <thead>
            <tr>
              <th colspan="10">{{this.tableTitle}}</th>
            </tr>
          </thead>
          <tbody>
            <tr :key="item.areaName" v-for="item in xiaoshaList">
              <td>{{item.areaName}}</td>
              <td>{{item.workType}}</td>
              <td>{{item.areaVal1}}</td>
              <td>{{item.areaVal2}}</td>
              <td>杀毒人员数</td>
              <td>{{item.personNuum}}</td>
              <td>填报记录数</td>
              <td>{{item.infoCount}}</td>
              <td>未填报账号数</td>
              <td>{{item.accountNum}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getStreetList,
  getNeighborhoodList,
  getCommunityList,
  getStatisticsData,
  downloadUrl,
  getDowloadFileName,
  getDowloadFileUrl
} from "@/api/disinfection_statistics";
import moment from 'moment';
import { TABLE_CONF, XIAODU_TPYE, wuziList, allVals } from './const';
import { Message } from 'element-ui'

export default {
  data() {
    const _moment = moment();
    const dateStr = `${_moment.year()}年${_moment.month() + 1}月${_moment.date()}日`;
    // console.log(this.$store.state, this.$store.state.userInfo)
    const {userInfo = {}} = this.$store.state.user;
    const {user} = userInfo;
    const isDownload = user?.userId === 925;
    return {
      isDownload,
      downloadUrl,
      allVals,
      dateStr,
      wuziList,
      form: {
        date: [_moment, _moment],
        street: "",
        neighborhood: "",
        community: ''
      },
      listLoading: false,
      streetList: [],
      neighborhoodList: [],
      communityList: [],
      statisticsData: {},
      xiaoshaList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    // 初始化
    this.fetchStreets().then(async (response) => {
      console.log('created', response)
      const { data } = response;
      if(response?.code === 200 && data?.length === 1) {
        const res2 = await this.fetchNeighborhoods(this.form.street);
        if(res2?.code === 200 && res2?.data?.length === 1) {
          await this.fetchCommunitys(this.form.neighborhood);
        }
      }
      this.fetchStatistisData();
    });
  },
  methods: {
    handleDownload() {
      getDowloadFileName({...this.form}).then(res => {
        console.log(res)
        if(res.code === 200) {
          window.open(getDowloadFileUrl({fileName: res.msg}))
        } else {
           Message.error(res.msg || '下载失败，请稍后重试')
        }
      })
    },
    onStreetChange(val) {
      if(val === '') {
        this.neighborhoodList = [];
        this.communityList = [];
        this.form = {
          ...this.form,
          neighborhood: '',
          community: ''
        };
      } else {
        this.fetchNeighborhoods(val);
      }
      this.fetchStatistisData({street: val, neighborhood: '', community: ''})

    },
    onNeighborhoodChange(val) {
      if(val === '') {
        this.communityList = [];
        this.form = {
          ...this.form,
          community: ''
        };
      } else {
        this.fetchCommunitys(val);
      }

      this.fetchStatistisData({neighborhood: val, community: ''});
    },
    onCommunityChange(val) {
      this.fetchStatistisData({community: val});
    },
    onDateChange(val) {
      this.fetchStatistisData({date: val});
    },
    fetchStreets() {
      return getStreetList().then(response => {
        this.streetList = response.code === 200 ? response.data : [];
        this.neighborhoodList = [];
        let street = '';
        if(this.streetList.length === 1) {
          street = this.streetList[0]?.name;
        }
        this.form = {
          ...this.form,
          street,
          neighborhood: '',
          community: ''
        };
        return response
      })
    },
    fetchNeighborhoods(val) {
      return getNeighborhoodList({street: val}).then(response => {
        this.neighborhoodList = response.code === 200 ? response.data : [];
        this.communityList = [];
        let neighborhood = '';
        if(this.neighborhoodList.length === 1) {
          neighborhood = this.neighborhoodList[0]?.name;
        }
        this.form = {
          ...this.form,
          neighborhood,
          community: ''
        };
        return response
      })
    },
    fetchCommunitys(val) {
      return getCommunityList({neighborhood: val}).then(response => {
        this.communityList = response.code === 200 ? response.data : [];
        let community = '';
        if(this.communityList.length === 1) {
          community = this.communityList[0]?.name;
        }
        this.form = {
          ...this.form,
          community,
        };
        return response
      })
    },
    fetchStatistisData(param) {
      this.listLoading = true;
      console.log(param)
      const localParam = {...this.form, ...param };

      getStatisticsData(localParam).then(response => {
        const {xiaoshaInfo = {}, ...stats} = response.code === 200 ? response.data : {};
        const newList = TABLE_CONF.map((item) => {
          const target = xiaoshaInfo[item.type];
          return {
            ...target,
            areaName: item.label,
            workType: XIAODU_TPYE[target.workType],
            areaVal1: item.areaVal1,
            areaVal2: item.getAreaVal2(item, target)
          }
        });
        this.xiaoshaList = newList;
        this.statisticsData = stats || {};
        this.listLoading = false;
      })
    }
  },
  computed: {
    tableTitle() {
      const date = this.form.date || [];
      let dateStr = this.dateStr;
      if(date.length !== 0) {
        let [startTime, endTime] = date;
        startTime = moment(startTime).format('YYYY[年]MM[月]DD[日]');
        endTime = moment(endTime || startTime).format('YYYY[年]MM[月]DD[日]');
        dateStr = startTime === endTime ? startTime : `${startTime} 至 ${endTime}`;
      }
      return `消毒日志 - ${dateStr}`
    }
  }
};
</script>

<style scoped>
.wuzi-item {
  display: inline-block;
  padding: 5px 10px;
}

.el-radio {
  margin: 0 20px;
}

.stats-part2 {
  padding: 20px 0 10px;
}

th.hidden-item {
  display: none;
  height: 0;
}

.stats-box-warp {
  display: flex;
  justify-content: space-around;
  margin: 20px 0 15px;
}

.stats-box-warp .stats-box {
  text-align: center;
  padding: 10px 20px;
  border-radius: 15px;
  margin: 0 5px;
  background-color: rgba(82, 169, 231, 0.2);
}

.color-red {
  color: red;
  font-weight: bold;
}

.el-radio-group .el-radio {
  width: 12.5%;
  margin-bottom: 15px;
}

.stats-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  text-align: center;
}

.stats-table th {
  background: #F5F7FA;
  border: 1px solid #EBEEF5;
  color: #909399;
  height: 48px;
}

.stats-table td {
  border: 1px solid #EBEEF5;
  color: #909399;
  height: 48px;
  font-size: 14px;
  color: #606266;
}

.stats-table tbody tr:nth-child(1) td:nth-child(1) {
  background-color: #FFC000;
}

.stats-table tbody tr:nth-child(2) td:nth-child(1) {
  background-color: #FFD966;
}

.stats-table tbody tr:nth-child(3) td:nth-child(1) {
  background-color: #F4B084;
}

.stats-table tbody tr:nth-child(4) td:nth-child(1) {
  background-color: #D6DCE4;
}

.stats-table tbody tr:nth-child(5) td:nth-child(1) {
  background-color: #00B0F0;
}


</style>
