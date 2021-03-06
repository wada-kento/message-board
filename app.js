var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var methodOverride = require('method-override');
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

const db = require('./models/index');

app.get('/', function(req, res) {
    res.redirect('/messages');
});

app.get('/messages', function(req, res) {
    const options = {
        where: {
            is_deleted: false
        }
    };
    db.message.findAll(options).then(function(results) {
        res.render('index.ejs', { messages: results });
    });
});

app.post('/messages', function(req, res) {
    const values = {
        content: req.body.content
    };
    db.message.create(values).then(function(results) {
        res.redirect('/messages');
    });
});

app.delete('/messages/:id', function(req, res) {
    const params = {
        is_deleted: true
    };
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.update(params, options).then(function(results) {
        res.redirect('/messages');
    });
});

app.get('/messages/:id/edit', function(req, res) {
    db.message.findByPk(req.params.id).then(function(results) {
        res.render('edit.ejs', { message: results });
    });
});

app.put('/messages/:id', function(req, res) {
    const values = {
        content: req.body.content
    };
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.update(values, options).then(function(results) {
        res.redirect('/messages');
    });
});

app.get('/messages/trash', function(req, res) {
    const options = {
        is_deleted: 1
    };
    db.message.findAll(options).then(function(results) {
        res.render('trash.ejs', { messages: results });
    });
});

app.delete('/messages/trash/:id', function(req, res) {
    const options = {
        where: {
            id: req.params.id
        }
    };
    db.message.destroy(options).then(function(results) {
        res.redirect('/messages/trash');
    });
});

app.get('/messages/:id', function(req, res) {
    const options = {
        include: [{
            model: db.reply
        }]
    }
    db.message.findByPk(req.params.id, options).then(function(results) {
        res.render('show.ejs', { message: results });
    });
});

app.post('/replies', function(req, res) {
    const values = {
        content: req.body.replyContent,
        message_id: req.body.messageId
    };
    db.reply.create(values).then(function(results) {
        res.redirect('/messages/' + req.body.messageId);
    });
});

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
    res.render('error');
});

module.exports = app;