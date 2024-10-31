function displayRanking(data) {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; // 清空之前的內容

    // 根據當前頁面 URL 動態決定顯示的歌曲數量
    const maxSongs = window.location.pathname.includes('ranking.html') ? 50 : 10; // 如果在 ranking.html 顯示 50 首，否則顯示 10 首

    // 根據 popularity 將歌曲按熱門度降序排序，並選取前 maxSongs 名
    const topSongs = data
        .sort((a, b) => b.popularity - a.popularity)  // 按熱門度降序排序
        .slice(0, maxSongs);  // 根據 maxSongs 選取前 N 首

    // 循環選取的歌曲，填入歌曲資料
    topSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'rankbox';
        li.innerHTML = `
            <span class="ranking-number">${index + 1} </span> <!-- 顯示排名 -->
            <a href="lyric.html?songId=${song.id}" target="_blank" class="song-img"><img src="${song.img}" alt="${song.title} 封面圖" class="song-img" /></a>
            <a href="lyric.html?songId=${song.id}" target="_blank" class="song-name">${song.title}</a>
            <div class="song-artist"><p>${song.artist}</p></div>
            <a href="lyric.html?songId=${song.id}" class="link-item">看歌詞</a>
        `;
        rankingList.appendChild(li);
    });
}

// JSON 載入並初始化
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        displayRanking(data);
    })
    .catch(error => console.error('無法載入 JSON:', error));
