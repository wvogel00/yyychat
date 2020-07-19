function formPost(input_id)
{
    var sendStr = document.getElementById(input_id).value;
    if(sendStr != null && sendStr != '')
    {
        document.getElementById(input_id).value = "";
    }
    
    try{
        var ws = new WebSocket('ws://localhost:3000/');
    }catch(e){
        console.error(e);
    }

    ws.send(sendStr);
    //return false;

    ws.onmessage = function (msg){
        var newPost = document.createElement("li");
        newPost.appendChild(msg.data + '<br>');
        var allPosts = document.getElementById("chatList");
        allPosts.appendChild(newPost);
        // $('ul').prepend(msg.data + '<br>');
    }
}