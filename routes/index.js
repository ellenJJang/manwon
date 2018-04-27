module.exports = function(app, Record)
{
    var moment  = require('moment');
    var today   = moment(new Date()).format("DD/MM/YYYY");
    var lastRemain = 0;
    var DAY_GOAL = 50000;

    app.get('/', function (req, res) {
        res.redirect('/record');
    });

    // get records
    app.get('/record', function (req, res) {
        Record.find(function (err, records) {
            if(err) return res.status(500).send({error: 'database failure'});
            if(records.length){
                lastRemain = records[records.length-1].remain;
            }
            var params = {
                date    : today,
                history : records
            };

            res.render('main.html', params);
        });
    });

    // save manwon record
    app.post('/record', function (req, res){
        Record.findOne({ date: today }, function (err, record) {
          if (err) return res.status(500).send({error: 'database failure'});
          if(record){
            record.list.push({ subject : req.body.subject, cost : new Number(req.body.cost) });
            record.sum = record.sum + new Number(req.body.cost);
            record.remain = record.remain - new Number(req.body.cost);
            record.save();
          } else {
                var newRecord      = new Record();
                newRecord.date     = today;
                newRecord.list.push({ subject : req.body.subject, cost : new Number(req.body.cost) });
                newRecord.sum     = new Number(req.body.cost);
                newRecord.remain    = lastRemain + DAY_GOAL - new Number(req.body.cost);
                newRecord.save (function(err) {
                    if(err){
                        console.error(err);
                        res.json({result: 0});
                        return;
                    }
                });
            }
        });
        res.redirect('/');
    });

    //delete all manwon records(DEV)
    app.delete('/record', function (req, res) {
        Record.remove({}, function (err, output) {
            if(err) return res.status(500).json({ error: "database failure" });
            res.json({ message: "All records deleted." });
            res.status(204).end();
        })
    });
}