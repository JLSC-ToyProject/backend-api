const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');

const apartRouter = require('./controller/apart');
const apiRouter = require('./api');
const { sequelize} = require('./models');

const apartmentRouter = require('./routes/apartment');
const areaRouter = require('./routes/area');

const app = express();

sequelize.sync({})
.then(()=>{console.log('데이터베이스 성공')
})
.catch((error)=>{
    console.log('에러')
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/login', loginRouter);

app.use('/apart',apartRouter);
app.use('/api',apiRouter);

app.use('/apartment', apartmentRouter);
app.use('/area', areaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
});

app.set('port', 3000);
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

module.exports = app;
