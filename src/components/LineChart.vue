<script>
import {Line, mixins} from 'vue-chartjs' //specify what type of chart from vue-chartjs
const { reactiveProp} = mixins
export default Line.extend({ //extending the base chart class
mixins: [reactiveProp],
data () {
    return {
        options: { //chart.js options
             scales: {
                 yAxes: [{
                     ticks:{
                         beginAtZero: true
                     },
                     gridLines:{
                         display: true
                     }
                 }],
                 xAxis: [{
                     gridLines: {
                         display: false
                     }

                 }]
             },
             legend: {
                 display: true
             },
             responsive: true,
             maintainAspectRatio: false
        }
    }
},

mounted () {
    //this chartData is created in teh mixin
    this.renderChart(this.chartData, this.options)
}
    
})
</script>