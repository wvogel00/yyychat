var textCnt = 0;
var ws = null;

window.onload = function()
{
    $('.chattext').arctext({radius: 160, dir: -1});     

    try
    {
        ws = new WebSocket('ws://localhost:3000');
    }catch(err){
        Console.error(err);
    }
/*
    var sendBtn = document.getElementById('textbox');
    sendBtn.addEventListener('click', function(){
        sendMessage();
    })
*/

    ws.onmessage = function(msg){
        onReceiveMsg(msg);
    }
}

function sendMessage()
{
    ws.send($('input').val());
    $('input').val('');
    //return false;
};

function onReceiveMsg(msg)
{
    textCnt += 1;
    var newMessage = document.getElementById('text' + textCnt);
    newMessage.innerHTML = (msg.data + '<br>');
    $('.chattext').arctext({radius: 160, dir: -1}); 
}
