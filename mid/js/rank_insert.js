const rankingIDs = [30, 10, 7, 22, 51, 4, 10, 9, 6, 8]; // 你希望顯示的前10名歌曲的ID

function displayRanking(data) {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = ''; // 清空之前的內容

    // 循環 ID 陣列，填入歌曲資料
    rankingIDs.forEach((id,index) => {
        const song = data.find(s => s.id === id); // 根據ID找到對應的歌曲
        if (song) {
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
        }
    });
}



// JSON 載入並初始化
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        displayRanking(data);
    })
    .catch(error => console.error('無法載入 JSON:', error));