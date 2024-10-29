document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('#pagination .dot');
  let currentPage = 0;
  let newPage = 0;
  let totalPages = pages.length;

  console.log(totalPages);

  function updatePage(newPage) {
      if (newPage < 0 || newPage >= totalPages) return; // 檢查範圍

      // 隱藏所有頁面
      pages.forEach((page, index) => {
          page.classList.remove('active');
          dots[index].classList.remove('active');
      });

      // 顯示當前頁
      pages[newPage].classList.add('active');
      dots[newPage].classList.add('active');
  }

  // 初始化顯示第一頁
  updatePage(currentPage);

  // 點擊下一頁按鈕
  document.getElementById('next-btn').addEventListener('click', function() {
      currentPage = (currentPage + 1) % totalPages; // 循環到下一頁
      updatePage(currentPage);
  });

  // 點擊上一頁按鈕
  document.getElementById('prev-btn').addEventListener('click', function() {
      currentPage = (currentPage - 1 + totalPages) % totalPages; // 循環到上一頁
      updatePage(currentPage);
  });

  // 點擊頁碼指示點
  dots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
          currentPage = index;
          updatePage(currentPage);
      });
  });

  // 自動切換頁面
  setInterval(function() {
      currentPage = (currentPage + 1) % totalPages;
      updatePage(currentPage);
  }, 20000); // 每20秒自動切換
});
