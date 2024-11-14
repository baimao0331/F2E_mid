let currentRecommendationPage = 0; // 修改名稱，避免和頁面切換部分衝突

const songIds = [9, 15, 93, 7, 44, 62, 12, 71, 23, 2, 91, 45, 55, 35, 40]; // 根據需要選擇的歌曲 ID

// 根據螢幕寬度計算每頁顯示的歌曲數量
function getSongsPerPage() {
    if (window.innerWidth > 1024) {
        return 5; // 大螢幕，每頁顯示 5 首歌
    } else {
        return 3; // 小螢幕，每頁顯示 3 首歌
    }
}

function displaySongs_recom(data) {
    const songsPerPage = getSongsPerPage();
    const recommendationContainer = document.getElementById('song-list');
    recommendationContainer.innerHTML = ''; // 清空之前的內容

    // 根據 songIds 陣列篩選出歌曲資料
    const currentSongs = songIds
        .map(id => data.find(song => song.id === id)) // 找到對應的歌曲資料
        .filter(Boolean); // 只保留找到的歌曲

    const totalPages = Math.ceil(currentSongs.length / songsPerPage);

    // 將當前頁面的歌曲分為 <ul>，每個 <ul> 包含 songsPerPage 個 <li>
    for (let i = 0; i < totalPages; i++) {
        const ul = document.createElement('ul');
        ul.className = 'page';

        // 取得 songsPerPage 首歌並創建 <li>
        currentSongs.slice(i * songsPerPage, i * songsPerPage + songsPerPage).forEach(song => {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = `
                <a href="lyric.html?songId=${song.id}" class="song-img">
                    <img src="${song.img}" alt="${song.title} 封面圖" class="song-img" />
                </a>
                <div class="song-info">
                    <a href="lyric.html?songId=${song.id}" class="song-name">${song.title}</a>
                    <div class="song-artist"><p>${song.artist}</p></div>
                </div>
            `;
            ul.appendChild(li);
        });

        recommendationContainer.appendChild(ul);
    }

    // 當歌曲顯示完成後，啟動頁面切換功能
    runSecondScript(); // 確保 DOM 完成後調用
}

// JSON 載入並初始化
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        displaySongs_recom(data); // 將歌曲資料傳入顯示函數
    })
    .catch(error => console.error('無法載入 JSON:', error));

// 確保在螢幕大小改變時重新渲染歌曲
window.addEventListener('resize', () => {
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            displaySongs_recom(data); // 重新顯示歌曲
        });
});

function runSecondScript() {
    const pages = document.querySelectorAll('.page');  // 確保在內容生成後選取 .page
    const dots = document.querySelectorAll('#pagination .dot');
    let currentPage = 0;
    let totalPages = pages.length;

    console.log('Total pages:', totalPages);

    if (totalPages === 0) {
        console.error('未找到任何頁面，確保內容已正確生成');
        return;
    }

    function updatePage(newPage) {
        if (newPage < 0 || newPage >= totalPages) return; // 檢查範圍
        // 隱藏所有頁面
        pages.forEach((page, index) => {
            page.classList.remove('active');
            if (dots[index]) dots[index].classList.remove('active');  // 檢查 dot 存在
        });
        // 顯示當前頁
        pages[newPage].classList.add('active');
        if (dots[newPage]) dots[newPage].classList.add('active');
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
}
