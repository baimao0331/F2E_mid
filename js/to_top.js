// 監控滾動事件來顯示或隱藏按鈕
window.onscroll = function() {
    const backToTopButton = document.getElementById("back-to-top");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// 滾動到頂部的函數
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
