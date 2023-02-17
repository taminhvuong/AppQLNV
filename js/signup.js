function signup(){

    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("psw").value;
    var password_re = document.getElementById("psw-repeat").value;
    if (!username || username.length < 5 || username.length > 50 || !firstName || firstName.length > 25 || !lastName || lastName.length > 25 || !password || 
        password.length < 5 || password.length > 30 || !password_re || !email) {
            reset();
       
        if (username.length < 6|| username.length > 30) {
            document.getElementById("checkUsername").style.display = "block"
            document.getElementById("checkUsername").innerHTML = "Username from 6-50 character "

        }
        if (!lastName || lastName.length > 25) {
            document.getElementById("checkLastName").style.display = "block"
            document.getElementById("checkLastName").innerHTML = "LastName from 1-25 character "

        }
        if (!firstName || firstName.length > 25) {
            document.getElementById("checkFirstName").style.display = "block"
            document.getElementById("checkFirstName").innerHTML = "Firstname from 1-25 character "

        }
        if (!password || password.length > 30 || password.length < 6) {
            document.getElementById("checkPsw").style.display = "block"
            document.getElementById("checkPsw").innerHTML = "Password from 6-30 character "

        }
        if (!email) {
            document.getElementById("checkEmail").style.display = "block"
            document.getElementById("checkEmail").innerHTML = "Email not null "

        }
        if (!password_re ||password_re.length > 30 || password_re.length < 6) {
            document.getElementById("checkPsw-repeat").style.display = "block"
            document.getElementById("checkPsw-repeat").innerHTML = "Password repeat from 6-30 character "

        }
        if (password_re!=password) {
            document.getElementById("checkPsw-repeat").style.display = "block"
            document.getElementById("checkPsw-repeat").innerHTML = "Psw-repeat not match "

        }
        
        return;
    }
}
function reset(){
    document.getElementById("checkUsername").style.display = "none"
    document.getElementById("checkFirstName").style.display = "none"
    document.getElementById("checkPsw").style.display = "none"
    document.getElementById("checkEmail").style.display = "none"

    document.getElementById("checkLastName").style.display = "none";
    document.getElementById("checkPsw-repeat").style.display = "none"

}