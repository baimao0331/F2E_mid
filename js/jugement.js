document.getElementById('vergil').addEventListener('ended',jumper,false);
function jumper(e) {
    if (window.history.length==1){
        window.close();
    }else{
        window.history.back();
    }
}