function savePassword() {
    var passwordOld = document.getElementById("password").value;

    var passwordNew = document.getElementById("passwordNew").value;

    console.log(passwordNew, passwordOld);
    if ( !passwordOld||passwordOld != storage.getItem("PASSWORD") ||!passwordNew) {
   
        if (!passwordOld) {
      
            document.getElementById("checkPasswordOld").style.display="block";
            document.getElementById("checkPasswordOld").innerHTML = "Mật khẩu cũ không để trống";
        }

        if(passwordOld="" && passwordNew){
          
            document.getElementById("checkPasswordNew").style.display="none";
            document.getElementById("checkPasswordOld").style.display="block";
            document.getElementById("checkPasswordOld").innerHTML = "Mật khẩu cũ không để trống";
            
        }
        if (passwordOld != storage.getItem("PASSWORD")) {
          
            document.getElementById("checkPasswordOld").style.display="block";
            document.getElementById("checkPasswordOld").innerHTML = "Mật khẩu cũ không đúng";

        }
        if(!passwordOld&& !passwordNew){
            document.getElementById("checkPasswordOld").style.display="block";
            document.getElementById("checkPasswordOld").innerHTML = "Mật khẩu cũ không để trống";
            document.getElementById("checkPasswordNew").style.display="block";
            document.getElementById("checkPasswordNew").innerHTML = "Mật khẩu mới không để trống";

        }
       
        if(passwordOld != storage.getItem("PASSWORD")&& passwordNew){
         
            document.getElementById("checkPasswordNew").style.display="none";
            document.getElementById("checkPasswordOld").style.display="block";
            document.getElementById("checkPasswordOld").innerHTML = "Mật khẩu cũ không đúng";
           
        }
      
        if(!passwordNew){
            document.getElementById("checkPasswordNew").style.display="block";
            document.getElementById("checkPasswordNew").innerHTML = "Mật khẩu mới không để trống";

        }
        if(!passwordNew&& passwordOld == storage.getItem("PASSWORD") &&passwordOld){
            document.getElementById("checkPasswordNew").style.display="block";
            document.getElementById("checkPasswordNew").innerHTML = "Mật khẩu mới không để trống";
            document.getElementById("checkPasswordOld").style.display="none";
        }
        return;
    }
    var account = {
        id:storage.getItem("ID"),
        password: passwordNew
       
    };
    // call api
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/updatePassword/' + storage.getItem("ID"),
        type: 'PUT',
        data: JSON.stringify(account), // body
        contentType: "application/json", // type of body (json, xml, text)
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("USERNAME") + ":" + storage.getItem("PASSWORD")));
        },
        // dataType: 'json', // datatype return
        success: function (data, textStatus, xhr) {
            console.log(data);
            storage.setItem("PASSWORD",passwordNew);
            showSuccessAlert(function(){
                
            });

            window.location.replace("http://127.0.0.1:5500/DepartmentManagement/html/program.html");
           
        },
        error(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });


}
function showSuccessAlert() {
    $("#success-alert").fadeTo(1000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
}
function reset(){
   
            document.getElementById("checkPasswordNew").innerHTML = "";
            document.getElementById("checkPasswordOld").innerHTML = "";
}