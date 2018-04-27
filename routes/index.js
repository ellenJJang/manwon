module.exports = function(app, Record, Stat)
{
    var moment      = require('moment');
    var today = moment(new Date()).format("DD/MM/YYYY");

    // save manwon record
    app.post('/record', function (req, res){
        var record = new Record();
        record.date = today;
        record.subject = req.body.subject;
        record.cost = new Number(req.body.cost);

        record.save (function(err) {
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
        });

        res.redirect('/');
    });

    // get manwon records
    app.get('/record', function (req, res) {
        Record.find(function (err, records) {
            if(err) return res.status(500).send({error: 'database failure'});
            var params = {
                date    : today,
                history : records
            };

            res.render('main.html', params);
        });
    });

    //delete all manwon records(DEV)
    app.delete('/record', function (req, res) {
        Record.remove({}, function (err, output) {
            if(err) return res.status(500).json({ error: "database failure" });
            res.json({ message: "All records deleted." });
            res.status(204).end();
        })
    });

    //make older stat 
    app.put('/stat', function(req, res) {
        // 이전 데이터 있는지 확인
        Stat.
    });

    app.get('/stat', function(req, res) {
        Stat.find(function (err, stat) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(stat);
        });
    });
}