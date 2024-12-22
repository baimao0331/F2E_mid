let currentRecommendationPage = 0; // 修改名稱，避免和頁面切換部分衝突

const songIds = [9, 15, 93, 7, 44, 62, 12, 71, 23, 2, 91, 45, 55, 35, 40]; // 根據需要選擇的歌曲 ID


function displaySongs_recom(data) {
    const songsPerPage = window.innerWidth < 576 ? 3 : 5; // 寬度小於 768px 時每頁 3 首，否則 5 首
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
                    <a href="search.html?type=song&query=${song.artist}" class="song-artist"><p>${song.artist}</p></a>
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
    let songListContainer = document.getElementById('song-list');
    let songWidth = songListContainer.querySelector('.page').offsetWidth;

    // 每次窗口調整大小時重新計算 songWidth
    window.addEventListener('resize', function() {
        songListContainer = document.getElementById('song-list');
        songWidth = songListContainer.querySelector('.page').offsetWidth; // 重新計算每頁寬度
        songListContainer.scrollTo({ left: 0, behavior: 'smooth' });
    });

    // 監聽「下一頁」按鈕
    document.getElementById('next-btn').addEventListener('click', function () {
        if (songListContainer.scrollLeft + songListContainer.offsetWidth >= (songListContainer.scrollWidth - 1)) {
            // 如果已經滾動到最右邊，則回到開頭
            songListContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // 否則平移到下一頁
            songListContainer.scrollBy({ left: songWidth, behavior: 'smooth' });
        }
    });

    // 監聽「上一頁」按鈕
    document.getElementById('prev-btn').addEventListener('click', function () {
        if (songListContainer.scrollLeft === 0) {
            // 如果在最左邊，則跳到最右邊
            songListContainer.scrollTo({ left: songListContainer.scrollWidth, behavior: 'smooth' });
        } else {
            // 否則平移到上一頁
            songListContainer.scrollBy({ left: -songWidth, behavior: 'smooth' });
        }
    });
}
