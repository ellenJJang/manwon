module.exports = function(app, Record, Total)
{
    var moment  = require('moment');
    var today   = moment();
    var todayFormat   = today.format("YYYY년 MM월 DD일");
    var lastRemain = 0;
    var DAY_GOAL = 50000;

    app.get('/', function (req, res) {
        res.redirect('/record');
    });

    // get records
    app.get('/record', function (req, res) {
        var params = {};
        params.date = todayFormat;
        Record.find(function (err, records) {
            if(err) return res.status(500).send({error: 'database failure'});
            if(records){
                params.history = records;
                Total.findOne(function(err, total){
                    if (err) return res.status(500).send({error: 'database failure'});
                    if(total) {
                        var days = today.diff(total.startDate, 'days')+1;
                        lastRemain = (days * DAY_GOAL) - total.totalSum;
                        params.lastRemain = lastRemain;
                    }
                        res.render('main.html', params);
                });
            }
        });
    });

    // save manwon record
    app.post('/record', function (req, res){
        Record.findOne({ date: todayFormat }, function (err, record) {
          if (err) return res.status(500).send({error: 'database failure'});
          if(record){
            record.list.push({ subject : req.body.subject, cost : new Number(req.body.cost) });
            record.sum = record.sum + new Number(req.body.cost);
            record.save();
          } else {
                var newRecord      = new Record();
                newRecord.date     = todayFormat;
                newRecord.list.push({ subject : req.body.subject, cost : new Number(req.body.cost) });
                newRecord.sum     = new Number(req.body.cost);
                newRecord.save (function(err) {
                    if(err){
                        console.error(err);
                        res.json({result: 0});
                        return;
                    }
                });
            }

            Total.findOne(function(err, total) {
                if (err) return res.status(500).send({error: 'database failure'});
                if(total){
                    total.totalSum = total.totalSum + new Number(req.body.cost);
                    total.save();
                    res.redirect('/');
                } 
            });
        });

        
    });

    app.delete('/:recordListId/:recordId', function (req, res) {
        Record.findOne({_id: req.params.recordListId}, function(err, record){
            if (err) return res.status(500).send({error: 'database failure'});
            if (record) {
                var idx = record.list.map(function(e) { return e._id.toString(); }).indexOf(req.params.recordId);
                if (idx !== -1) {
                    var tmp = record.list[idx];
                    record.list.splice(idx, 1);
                    record.sum = record.sum - tmp.cost;
                    record.save();

                    Total.findOne(function(err, total) {
                        if (err) return res.status(500).send({error: 'database failure'});
                        if(total){
                            total.totalSum = total.totalSum - new Number(tmp.cost);
                            total.save();
                            res.redirect('/record');
                        } 
                    });
                }                
            }
        });
    });
}