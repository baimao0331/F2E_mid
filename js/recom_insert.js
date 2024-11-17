let currentRecommendationPage = 0; // 修改名稱，避免和頁面切換部分衝突

const songIds = [9, 15, 93, 7, 44, 62, 12, 71, 23, 2, 91, 45, 55, 35, 40]; // 根據需要選擇的歌曲 ID

function getSongsPerPage() {
    if (window.innerWidth > 1024) {
        return 5; // 大螢幕，每頁顯示 5 首歌
    } else {
        return 3; // 小螢幕，每頁顯示 3 首歌
    }
}

function createPaginationDots(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // 清空之前的內容

    // 根據頁面寬度決定點的數量
    const dotsCount = window.innerWidth > 1024 ? 3 : 5; // 小於 768px 顯示 3 個點，否則顯示 5 個點

    // 確保顯示的點數量不超過頁數
    const finalDotsCount = Math.min(dotsCount, totalPages);

    for (let i = 0; i < finalDotsCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        paginationContainer.appendChild(dot);
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

    // 創建對應頁數的點
    createPaginationDots(totalPages);

    // 當歌曲顯示完成後，啟動頁面切換功能
    runSecondScript(); // 確保 DOM 完成後調用
}

// 當頁面大小變化時，重新生成點
window.addEventListener('resize', function() {
    const totalPages = document.querySelectorAll('.page').length;
    createPaginationDots(totalPages);
});

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
    let currentRecommendationPage = 0;
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
    updatePage(currentRecommendationPage);

    // 點擊下一頁按鈕
    document.getElementById('next-btn').addEventListener('click', function() {
        currentRecommendationPage = (currentRecommendationPage + 1) % totalPages; // 循環到下一頁
        updatePage(currentRecommendationPage);
    });

    // 點擊上一頁按鈕
    document.getElementById('prev-btn').addEventListener('click', function() {
        currentRecommendationPage = (currentRecommendationPage - 1 + totalPages) % totalPages; // 循環到上一頁
        updatePage(currentRecommendationPage);
    });

    // 點擊頁碼指示點
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentRecommendationPage = index;
            updatePage(currentRecommendationPage);
        });
    });

    // 自動切換頁面
    setInterval(function() {
        currentRecommendationPage = (currentRecommendationPage + 1) % totalPages;
        updatePage(currentRecommendationPage);
    }, 20000); // 每20秒自動切換
}
