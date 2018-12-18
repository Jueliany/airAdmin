const express = require('express');
const app = express();
var querystring = require('querystring');
var moment = require('moment');
    //导入cors模块,该模块为跨域所用
var cors = require('cors')
app.use(cors());

//解析表单的插件
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
 extended:true
}));
app.use(cors({
    origin:['*'],
    methods:['GET','POST'],
    alloweHeaders:['Conten-Type', 'Access-Control-Allow-Headers']
}));

//创建数据库连接对象
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: '47.106.253.59',//数据库地址
    user: 'user',//账号
    password: '123456',//密码
    database: 'air',//库名
    multipleStatements: true //允许执行多条语句
})


app.post('/api/addAirQuality', function(req, res){
    var body = "";
    req.on('data', function (chunk) {
        body += chunk; 
    });
    req.on('end', function (chunk) {
    body = JSON.parse(body)
    console.log(body)
    const sqlStr = 'insert into air_quality set ?'
    conn.query(sqlStr, body, (err, results) => {
        if (err) return res.json({ err_code: 1, message: err, affectedRows: 0 })
        console.log("插入成功："+body)
        res.json({ err_code: 0, message: '恭喜成功', affectedRows: results.affectedRows })
    })
    });
})

//获取数据列表
app.post('/api/getAirQualityList', function(req, res){
    var body = "";
    req.on('data', function (chunk) {
        body += chunk; 
    });
    req.on('end', function (chunk) {
    body = JSON.parse(body)
    var sqlStr = 'select * from air_quality where 1=1 '
    if(body.node){
        sqlStr += " and node = " + body.node;
    }
    if(body.start){
        sqlStr += " and datetime > '" + body.start +"'";
    }
    if(body.end){
        sqlStr += " and datetime < '" + body.end +"'";
    }
    sqlStr += " ORDER BY datetime DESC"
    console.log(sqlStr)
    conn.query(sqlStr, (err, results) => {
        if (err) return res.json({ resultCode: 1, message: '数据不存在', affextedRows: 0 })
        for(var item of results){
            item.datetime = moment(item.datetime).format('YYYY-MM-DD HH:mm:ss');
        }
        console.log(results)
        res.json({ resultCode: 0, data: results,message:"成功", affextedRows: results.affextedRows })
    })
    });
})

app.get('/api/getlist', (req, res) => {
    const sqlStr = 'select * from air_quality '
    conn.query(sqlStr, (err, results) => {
        if (err) return res.json({ err_code: 1, message: '资料不存在', affextedRows: 0 })
        console.log(results)
        res.json({ err_code: 200, message: results, affextedRows: results.affextedRows })
    })
})
//登陆
app.post('/api/login', function(req, res){
    var body = "";
	req.on('data', function (chunk) {
        body += chunk; 
    });
	req.on('end', function (chunk) {
    var user = {};
    body = JSON.parse(body)
	console.log(body.user);
	console.log(body.password);
	const sqlStr = 'select * from user where user = "' + body.user + '"'
    conn.query(sqlStr, (err, results) => {
    	console.log(results)
        if (results.length < 1){ return res.json({ resultCode: 1, message: "帐号不存在", affectedRows: 0 })}
        else{
        	if (results[0].password != body.password) {  res.json({ resultCode: 1, message: "帐号或者密码错误",data: results, affectedRows: 0 })}
        	else{res.json({ resultCode: 0, message: '登陆成功', affectedRows: results.affectedRows })}
        }
        
    })
    });
})

app.post('/api/addUser', function(req, res){
    var body = "";
	req.on('data', function (chunk) {
        body += chunk; 
    });
	req.on('end', function (chunk) {
    var user = {};
    body = JSON.parse(body)
	console.log(body.id);
	console.log(body.name);
	const sqlStr = 'insert into user set ?'
    conn.query(sqlStr, body, (err, results) => {
        if (err) return res.json({ err_code: 1, message: err, affectedRows: 0 })
        res.json({ err_code: 0, message: '恭喜成功', affectedRows: results.affectedRows })
    })
    });
})

app.post('/api/update', function(req, res){
    var body = "";
    req.on('data', function (chunk) {
        body += chunk; 
    });
    req.on('end', function (chunk) {
    body = JSON.parse(body)
    const sqlStr = 'update user set name = "'+ body.name +'" where user = " '+ body.user +' "'
    conn.query(sqlStr, body, (err, results) => {
        if (err) return res.json({ err_code: 1, message: err, affectedRows: 0 })
        res.json({ err_code: 0, message: '恭喜成功', affectedRows: results.affectedRows })
    })
    });
})
app.listen(3000, () => {
    console.log('正在监听端口3000'); //192.168.1.114换成你的ip,本机ip查询用cmd=>ipconfig
})