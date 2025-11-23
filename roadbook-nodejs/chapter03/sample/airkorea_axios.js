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

    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey; /* Service Key*/
    queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent('종로구'); /* */
    queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* */
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* */

    const url = airUrl + queryParams;

    try {
        const result = await axios.get(url);
        res.json(result.data)
    } catch (error) {
        console.error(error)
    }
})

/* 서버와 포트 연결.. */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
})