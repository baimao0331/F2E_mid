// 解析 URL 參數以獲取歌曲 ID
const urlParams = new URLSearchParams(window.location.search);
const songId = parseInt(urlParams.get('songId'));
let player;
if (songId == 92) {
    window.location.href = 'storm.html';
}

// 根據 ID 載入歌曲資料
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        const song = data.find(s => s.id === songId);
        if (song) {
            document.getElementById('release-date').textContent = song.release;
            document.getElementById('album').textContent = song.album;
            document.getElementById('song-title').textContent = song.title;
            document.getElementById('song-artist').textContent = song.artist;
            document.getElementById('song-img').src = song.img;

            const lyricContainer = document.getElementById('lyric-container');
            const japaneseLyrics = song.lyrics.japanese;
            const chineseLyrics = song.lyrics.chinese;
            const lyricTimes = song.lyrics.time; // 獲取歌詞時間戳
            lyricContainer.innerHTML = '';

            for (let i = 0; i < japaneseLyrics.length; i++) {
                const japaneseLine = japaneseLyrics[i];
                const chineseLine = chineseLyrics[i];

                const lyricLine = document.createElement('div');
                lyricLine.classList.add('lyric-line');
                if (i === 0) {
                    lyricLine.id = 'first-line';
                }
                if (i === japaneseLyrics.length - 1) {
                    lyricLine.id = 'last-line';
                }
                const rubyParsedLine = japaneseLine.replace(/{(.*?)\|(.*?)}/g, '<ruby>$1<rt>$2</rt></ruby>');

                lyricLine.innerHTML = `
                    <p>${rubyParsedLine}</p>
                    <p>${chineseLine}</p>
                `;
                lyricContainer.appendChild(lyricLine);
            }
            console.log("使用 IFrame API 創建 YouTube 播放器");
            // 使用 IFrame API 創建 YouTube 播放器
            player = new YT.Player('video-container', {
                videoId: song.ytid, // 使用 JSON 中的 youtubeId
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            // 顯示同一位藝術家的隨機五首歌曲
            displayRelatedSongs(song.artist, data);
        } else {
            console.error('找不到歌曲');
            lyricContainer.innerHTML = '<p>找不到該歌曲</p>';
        }
    })
    .catch(error => {
        location.reload();
        console.error('無法載入 JSON:', error)});

// 顯示同一位藝術家的隨機五首歌曲
function displayRelatedSongs(artist, data) {
    const relatedSongsContainer = document.getElementById('related-songs-container');
    relatedSongsContainer.innerHTML = '';

    // 篩選出同一位歌手的歌曲，排除當前歌曲
    let relatedSongs = data.filter(song => song.artist === artist && song.id !== songId);

    // 如果相關歌曲不足五首，顯示所有可用的歌曲
    if (relatedSongs.length === 0) {
        relatedSongsContainer.innerHTML = '<p>尚沒有更多該歌手的歌曲。</p>';
        return;
    }

    // 隨機打亂歌曲陣列順序
    relatedSongs = shuffleArray(relatedSongs);

    const songsToDisplay = relatedSongs.slice(0, 9);

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

function onPlayerReady(event) {
    // 可以在這裡控制播放器，比如自動播放
    // event.target.playVideo();
    console.log('YouTube IFrame API 已載入完成');
    setInterval(updateLyrics, 500); // 每 500ms 更新一次歌詞
}

function onPlayerStateChange(event) {
    // 可以處理播放器狀態變化
}

// 更新歌詞滾動同步
function updateLyrics() {
    const currentTime = player.getCurrentTime(); // 獲取當前播放時間
    const lyricLines = document.querySelectorAll('.lyric-line');

    // 找到對應的歌詞行
    let currentIndex = Array.from(lyricLines).findIndex(line => {
        const time = parseFloat(line.dataset.time);
        const nextTime = parseFloat(lyricLines[line.dataset.time + 1]?.dataset.time || Infinity);
        return currentTime >= time && currentTime < nextTime;
    });

    // 如果找到對應的歌詞行，滾動並高亮
    if (currentIndex !== -1) {
        lyricLines.forEach((line, index) => {
            line.classList.toggle('highlight', index === currentIndex);
        });

        const currentLine = document.getElementById(`lyric-${currentIndex}`);
        currentLine.scrollIntoView({
            behavior: 'smooth', // 平滑滾動
            block: 'center',   // 滾動到容器中間
        });
    }
}
