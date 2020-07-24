<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <h2 class="title">Track your Health data in realtime</h2>
        <h3 class="subtitle">Notice patterns in your routine blood work</h3>
        <!--We are using the LineChart component imported below in the script and also setting the chart-data prop to the datacollection object-->
        <line-chart :chart-data="datacollection"></line-chart>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <form class="form" @submit.prevent="addResults">
          <h4>Add new Entry</h4>
          <div class="form-group">
            <label>Result</label>
            <input
              class="form-control"
              placeholder="What is your bloodwork result?"
              type="number"
              v-model="expenseamount"
              required
            />
          </div>
          <div class="form-group">
            <label>Unit</label>
            <input
              class="form-control"
              placeholder="What is the measurement?"
              type="number"
              v-model="incomeamount"
              required
            />
          </div>
          <div class="form-group">
            <label>Date</label>
            <input class="form-control" placeholder="Date" type="date" v-model="entrydate" required />
          </div>
          <div class="form-group">
            <button class="btn btn-primary">Add New Entry</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import moment from 'moment'
import Pusher from 'pusher-js'
import LineChart from '@/components/LineChart'

const socket = new Pusher('b9dbf8ebe7d05063175', {
  cluster: 'eu',
  encrypted: true
})
const channel = socket.subscribe('bloodWork')


export default {
  name: "Home",
  components: {LineChart},
  data () {
    return{
      result: null,
      unit: null,
      data: null,
      resultamount: null,
      unitsamount: null,
      datacollection: null,
      entrydate: null
    }
  },
  created () {
    this.fetchData()
    this.fillData()
  },
  mounted () {
    this.fillData()
  },
  methods: {
      fillData () {
        axios.get('/bloodWork')
        .then(response => {
        let results = response.data.data
    
        let dateresult = results.map(a => a.date)
        let numberresult = results.map(a => a.number)
        let unitsresult = results.map(a => a.units)
    
        this.number = numberresult
        this.units = unitsresult
        this.date = dateresult
    
        this.datacollection = {
          labels: this.date,
          datasets: [
            {
              label: 'Number',
              backgroundColor: '#f87979',
              data: this.number
            },
            {
              label: 'Unit',
              backgroundColor: '#5bf8bf',
              data: this.unit
            }
          ]
        }
      })
      .catch(error => {
        console.log(error)
      })
      },
      addResults () {
        let number = this.numberamount
        let units = this.unitsamount
        let today = moment(this.entrydate).format('MMMM Do YYYY')

        axios.post('/results/add', {
          number: number,
          units: units,
          date: today
        })
          .then(response => {
            this.numberamount = ''
            this.unitsamount = ''
            this.entrydate = ''

            channel.bind('new-result', function (data) {
              let results = data.newResult.data
              let dateresult = results.map(a => a.date)
              let numberresult = results.map(a => a.number)
              let unitsresult = results.map(a => a.units)

            //The instance data are updated here with the latest data gotten from Pusher
              this.number = numberresult
              this.units = unitsresult
              this.date = dateresult

            //The Chart's dataset is updated with the latest data gotten from Pusher
              this.datacollection = {
                labels: this.date,
                datasets: [
                  {
                    label: 'Number',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#f87979',
                    data: this.number
                  },
                  {
                    label: 'Units',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#5bf8bf',
                    data: this.units
                  }
                ]
              }
            });
          })
          .catch(error => {
            console.log(error)
          })

      },
    
    fetchData () {
   //We are bound to new-expense on Pusher and it listens for changes to the dataset so it can automatically rebuild the Line Chart in realtime.    
        channel.bind('new-result', data => {
        let _results = data.newResults.data
        let dateresult = _results.map(a => a.date);
        let numberresult = _results.map(a => a.number);
        let unitresult = _results.map(a => a.unit);
        
        //The instance data are updated here with the latest data gotten from Pusher
          this.number = numberresult
          this.units = unitsresult
          this.date = dateresult

        //The Chart's dataset is updated with the latest data gotten from Pusher
        this.datacollection = {
            labels: this.date,
            datasets: [
                {
                    label: 'Number',
                    backgroundColor: '#f87979',
                    data: this.number
                },
                {
                    label: 'Unit',
                    backgroundColor: '#5bf8bf',
                    data: this.unit
                }
            ]
        }
    }),
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  text-align: center;
  margin-top: 40px;
}
.subtitle {
  text-align: center;
}
.form {
  max-width: 600px;
  width: 100%;
  margin: 20px auto 0 auto;
}
.form h4 {
  text-align: center;
  margin-bottom: 30px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style scoped>