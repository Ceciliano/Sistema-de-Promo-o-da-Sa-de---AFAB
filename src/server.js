import app from './app';

var listener = app.listen(process.env.PORT || 3333, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});