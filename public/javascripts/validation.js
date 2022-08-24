// User SignUp Validation
function userSingUp(){
    
    let pass = document.getElementById('password').value;
    let confi = document.getElementById('confirem').value;
    let alert = document.getElementById('alert')

    if(pass == confi){
        return true;
    }else{
        alert.style.display = 'block'
        alert.innerHTML = `<i class="bi bi-x-circle-fill"></i> Password not match`
        return false;
    }
   
}