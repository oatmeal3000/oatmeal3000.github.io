
function redirect2url(email_address, score) {
    var current_url = document.location;
    var args = String(current_url).split('?');

    if (args[1] != null){
         var pin_code = args[1];
         var data = "email=" + email_address + "&" + pin_code;
         $.getJSON("http://121.42.44.204/FundreamAuth/authentication.php", data, function(msg){
         window.setTimeout("window.location='"+msg['ice_appurl'] + "?score=" + score + "'", 3000); 
         //writeObj(msg);
         });
    }

}

function writeObj(obj){ 
        var description = ""; 
        for(var i in obj){   
            var property=obj[i];   
            description+=i+" = "+property+"\n";  
        }   
        alert(description); 
} 

