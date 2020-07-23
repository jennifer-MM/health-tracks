const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '1043359',
    key: '1b9dbf8ebe7d05063175',
    secret: 'a99a00af110c3e0dc9cf',
    cluster: 'us2',
    encrypted: true
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/app')));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

let resultList = {
    data: [
        {
        
        date: "April 15th 2020",
        number: .4,
        measurement: "mIU/L"
        },
        
        {
            date: "May 15th 2020",
            number: .9,
            measurement: "mIU/L"
        },

        {
            date: "June 17th 2020",
            number: 1.4,
            measurement: "mIU/L"
        },

        {
            date: "July 15th 2020",
            number: 1.8,
            measurement: "mIU/L"
        },
    ]
}

app.get('/bloodWork', (req,res) => {
    res.send(resultList);
});

app.post('/result/add', (req, res) => {
    let number = Number(req.body.number)
    let measurement = Number(req.body.measurement)
    let date = req.body.date;
  
  
    let newResult  = {
      date: date,
      number: number,
      measurement: measurement
    };
  
  
    ResultsList.data.push(newResult);
  
  
    pusher.trigger('result', 'new-Result', {
      newResult: ResultList
    });
  
  
    res.send({
      success : true,
      measurement: measurement,
      number: number,
      date: date,
      data: resultList
    })
  });

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});