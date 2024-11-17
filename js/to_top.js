window.onscroll = function() {
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
