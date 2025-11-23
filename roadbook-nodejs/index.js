const express = require('express');
const morgan = require('morgan')
const axios = require('axios')

require('dotenv').config()

const app = express();

/* 포트 설정 */
app.set('port', process.env.PORT);

/* 공통 미들웨어 */
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* 라우팅 설정 */
app.get('/airkorea', async (req, res) => {
    const serviceKey = process.env.DATA_AIRKOREA_KEY;
    const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty"
    const stationName = '마포구'

    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName); /* */
    queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* */
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* */

    const url = airUrl + queryParams;

    try {
        const result = await axios.get(url);
        const items = result.data.response.body.items;

        const airItem = {
            "location": stationName,
            "time": items[0]['dataTime'],
            "pm10": items[0]['pm10Value'],
            "pm25": items[0]['pm25Value']
        }

        const badAir = [];

        if (airItem.pm10 <= 30) {
            badAir.push("좋음😊😊")
        } else if (pm10 > 30 && pm10 <= 80) {
            badAir.push("보통😑😑")
        } else {
            badAir.push("나쁨😞😞")
        }

        if (airItem.pm25 <= 15) {
            badAir.push("좋음😊😊")
        } else if (pm25 > 15 && pm25 <= 35) {
            badAir.push("보통😑😑")
        } else {
            badAir.push("나쁨😞😞")
        }

        res.send(`관측 지역: ${airItem.location} / 관측 시간: ${airItem.time} <br>
미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]} 입니다.`)
    } catch (error) {
        console.error(error)
    }
})

/* 서버와 포트 연결.. */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
})