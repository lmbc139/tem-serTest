const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const pool = require('./config/db');

// 设置 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// 静态文件服务
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 从 MySQL 获取温度数据
async function getTemperatureData() {
  try {
    const [rows] = await pool.query('SELECT time, temperature FROM temperature_logs');
    return rows;
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    return [];
  }
}

// 渲染首页
app.get('/', async (req, res) => {
  try {
    const data = await getTemperatureData();
    res.render('index', { data: data });
  } catch (error) {
    console.error('Error rendering index page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-temperature', async (req, res) => {
  try {
    const { time, temperature } = req.body;

    if (!time || !temperature) {
      return res.status(400).send('Time and temperature are required');
    }

    const [result] = await pool.query('INSERT INTO temperature_logs (time, temperature) VALUES (?, ?)', [time, temperature]);
    res.status(201).send('Temperature data added successfully');
  } catch (error) {
    console.error('Error adding temperature data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});