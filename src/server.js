import app from './app';

var listener = app.listen(3333, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});