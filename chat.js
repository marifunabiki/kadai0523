// データベースと接続する
var messagesRef = new Firebase('https://fir-demo-1bbcb-default-rtdb.firebaseio.com');

var messageField = $('#messageInput');  // var messageField = document.getElementById('messageInput')
var nameField = $('#nameInput');
var messageList = $('#messages');

// ENTERキーを押した時に発動する
messageField.keypress(function (e) {   //　e = 引数：引き渡す数
    if (e.keyCode == 13) { //13はエンターキー
        //フォームに入力された情報
        var username = nameField.val();
        var message = messageField.val();
        if(message.length > 0){
          //データベースに保存する
          messagesRef.push({name:username, text:message});
          messageField.val('');
 
          $('#scroller').scrollTop($('#messages').height());

        }
    }   
});

// データベースにデータが追加されたときに発動する
messagesRef.limitToLast(10).on('child_added', function (snapshot) {
    //取得したデータ
    var data = snapshot.val();
    var username = data.name || "anonymous";
    var message = data.text;
    var akey = snapshot.key();

    //取得したデータの名前が自分の名前なら右側に吹き出しを出す
    if ( username == nameField.val() ) {

        var messageElement = $("<li id='" + akey + "'><img src='pig.png' width=7% class='sender_name me'><p class='sender_name me'>" + username + "</p><p class='right_balloon'>" + message + "</p><p class='clear_balloon'></p></li>");

    } else {

        var messageElement = $("<li id='" + akey + "'><p class='sender_name'>" + username + "</p><p class='left_balloon'>" + message + "</p><p class='clear_balloon'></p></li>");

    }
    //HTMLに取得したデータを追加する
    messageList.append(messageElement);

    const target = document.getElementById(akey);
    target.addEventListener('contextmenu', function(event){
        event.preventDefault();
        messagesRef.child(target.getAttribute('id')).remove();
        target.remove();
        return false;
    },)

    //一番下にスクロールする
    messageList[0].scrollTop = messageList[0].scrollHeight;
});
