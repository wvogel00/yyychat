var textCnt = 0;
var ws = null;
var blockN = 4;

window.onload = function()
{
    $('.chattext').arctext({radius: 160, dir: -1});     

    try
    {
        ws = new WebSocket('ws://localhost:3000');
    }catch(err){
        Console.error(err);
    }

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
    textCnt += textCnt <= blockN ? 1 : 0;
    if(textCnt > blockN)
        shiftText();

    //新規メッセージを設定する
    setTextAt(Math.min(blockN, textCnt), msg);
    //文字をアーチ状にする
    $('.chattext').arctext({radius: 160, dir: -1}); 
}

function shiftText()
{
    for(let i = 1; i < blockN; i++)
    {
        var prev = document.getElementById('text' + i);
        var overwrite = document.getElementById('text' + (i+1));
        prev.innerHTML = overwrite.innerHTML;
    }
}

function setTextAt(index, msg)
{
    var newMessage = document.getElementById('text' + index);
    newMessage.innerHTML = (msg.data + '<br>'); 
}