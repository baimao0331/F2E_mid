// 解析 URL 參數以獲取歌曲 ID
const urlParams = new URLSearchParams(window.location.search);
const songId = parseInt(urlParams.get('songId'));

// 根據 ID 載入歌曲資料
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        const song = data.find(s => s.id === songId);
        if (song) {
            document.getElementById('song-title').textContent = song.title;
            document.getElementById('song-artist').textContent = song.artist;
            document.getElementById('song-img').src = song.img;

            const lyricContainer = document.getElementById('lyric-container');
            const japaneseLyrics = song.lyrics.japanese;
            const chineseLyrics = song.lyrics.chinese;
            lyricContainer.innerHTML = '';

            for (let i = 0; i < japaneseLyrics.length; i++) {
                const japaneseLine = japaneseLyrics[i];
                const chineseLine = chineseLyrics[i];

                const lyricLine = document.createElement('div');
                lyricLine.classList.add('lyric-line');

                const rubyParsedLine = japaneseLine.replace(/{(.*?)\|(.*?)}/g, '<ruby>$1<rt>$2</rt></ruby>');

                lyricLine.innerHTML = `
                    <p>${rubyParsedLine}</p>
                    <p>${chineseLine}</p>
                `;
                lyricContainer.appendChild(lyricLine);
            }

            // 顯示同一位藝術家的三首最新歌曲
            displayRelatedSongs(song.artist, data);
        } else {
            console.error('找不到歌曲');
            lyricContainer.innerHTML = '<p>找不到該歌曲</p>';
        }
    })
    .catch(error => console.error('無法載入 JSON:', error));

// 顯示同一位藝術家的隨機五首歌曲
function displayRelatedSongs(artist, data) {
    const relatedSongsContainer = document.getElementById('related-songs-container');
    relatedSongsContainer.innerHTML = '';

    // 篩選出同一位歌手的歌曲，排除當前歌曲
    let relatedSongs = data.filter(song => song.artist === artist && song.id !== songId);

    // 如果相關歌曲不足五首，顯示所有可用的歌曲
    if (relatedSongs.length === 0) {
        relatedSongsContainer.innerHTML = '<p>沒有更多該歌手的歌曲。</p>';
        return;
    }

    // 隨機打亂歌曲陣列順序
    relatedSongs = shuffleArray(relatedSongs);

    // 取出前五首隨機歌曲
    const songsToDisplay = relatedSongs.slice(0, 5);

    songsToDisplay.forEach(song => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <a href="lyric.html?songId=${song.id}">
                <img src="${song.img}" alt="${song.title} 封面圖">
                <div class="card-info">
                    <h4>${song.title}</h4>
                </div>
            </a>
        `;
        relatedSongsContainer.appendChild(card);
    });
}

// 隨機打亂陣列的函數
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 解構賦值交換
    }
    return array;
}
