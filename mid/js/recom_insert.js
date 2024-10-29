let currentPage = 0;
const songsPerPage = 15; // 每頁 15 首歌

const songIds = [1, 15, 5, 7, 9, 10, 12, 18, 15, 20, 22, 25, 30, 35, 40]; // 根據需要選擇的歌曲 ID

function displaySongs_recom(data) {

    const recommendationContainer = document.getElementById('song-list');
    recommendationContainer.innerHTML = ''; // 清空之前的內容

    // 根據 songIds 陣列篩選出歌曲資料
    const currentSongs = songIds
        .map(id => data.find(song => song.id === id)) // 找到對應的歌曲資料
        .filter(Boolean); // 只保留找到的歌曲

    // 將當前頁面的 15 首歌分為 3 個 <ul>，每個 <ul> 包含 5 個 <li>
    for (let i = 0; i < 3; i++) {
        const ul = document.createElement('ul');
        ul.className = 'page';

        // 取得 5 首歌並創建 <li>
        currentSongs.slice(i * 5, i * 5 + 5).forEach(song => {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = `
                <a href="lyric.html?songId=${song.id}" target="_blank" class="song-img">
                    <img src="${song.img}" alt="${song.title} 封面圖" class="song-img" />
                </a>
                <div class="song-info">
                    <a href="lyric.html?songId=${song.id}" target="_blank" class="song-name">${song.title}</a>
                    <div class="song-artist"><p>${song.artist}</p></div>
                </div>
            `;
            ul.appendChild(li);
        });

        recommendationContainer.appendChild(ul);
    }
}

// JSON 載入並初始化
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        displaySongs_recom(data); // 將歌曲資料傳入顯示函數
    })
    .catch(error => console.error('無法載入 JSON:', error));
