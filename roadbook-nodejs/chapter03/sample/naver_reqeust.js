const express = require('express')
const morgan = require('morgan')
const request = require('request')

require('dotenv').config()

const app = express()

/* 포트 설정 */
app.set('port', process.env.PORT || 8080);

/* 공통 미들웨어 */
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* 라우팅 설정 */
app.get('/naver/news', (req, res) => {
    const client_id = process.env.DEV_NAVER_ID;
    const client_secret = process.env.DEV_NAVER_PASSWD;

    const api_url = 'https://openapi.naver.com/v1/search/news.json?query=' + encodeURI('req.query.query'); // JSON 결과
    //   const api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // XML 결과

    const option = { 'query': '코스피' }
    const options = {
        url: api_url,
        qs: option,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let newsItem = JSON.parse(body).items;
            // items - title, link, description, pubDate

            const newsJson = {
                title: [],
                link: [],
                description: [],
                pubDate: []
            }

            newsItem.forEach((item) => {
                newsJson.title.push(item.title.replace(/(<([^>]+)>)|&quot;/ig, ""));
                newsJson.link.push(item.link);
                newsJson.description.push(item.description.replace(/(<([^>]+)>)|&quot;/ig, ""));
                newsJson.pubDate.push(item.pubDate);
            })

            res.json(newsJson);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
})

/* 서버와 포트 연결.. */
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
})