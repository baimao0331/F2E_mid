

//回到頂部---
window.onscroll = function () {
    const backToTopButton = document.getElementById("back-to-top");
    if (window.innerWidth > 768) { // 設定你想要的螢幕寬度
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    } else {
        backToTopButton.style.display = "none"; // 強制隱藏按鈕
    }
};

// 滾動到頂部的函數
function scrollToTop() {
    if (window.innerWidth > 768) { // 設定你想要的螢幕寬度
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

//漢堡選單
let hamberger_open = false;
document.getElementById('hamburger-btn').addEventListener('click', function () {
    if (hamberger_open === false) {
        hamberger_open = true;
        document.getElementById('hamburger-btn').classList.add('active');
        document.getElementById('hamberger-nav').classList.add('active');
    } else {
        hamberger_open = false;
        document.getElementById('hamburger-btn').classList.remove('active');
        document.getElementById('hamberger-nav').classList.remove('active');
    }
});
document.getElementById('hamburger-btn-close').addEventListener('click', function () {
    hamberger_open = false;
    document.getElementById('hamburger-btn').classList.remove('active');
    document.getElementById('hamberger-nav').classList.remove('active');
});

let account_option = false;
document.getElementById('account-btn').addEventListener('click', function () {
    if (account_option === false) {
        account_option = true;
        document.getElementById('arrow').classList.add('active');
        document.getElementById('account_option').classList.add('active');
    } else {
        account_option = false;
        document.getElementById('arrow').classList.remove('active');
        document.getElementById('account_option').classList.remove('active');
    }
});