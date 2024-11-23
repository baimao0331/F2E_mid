const rankingList_grow = document.getElementById('ranking-list-grow');
const rankingList_total = document.getElementById('ranking-list-total');
const page = document.body.getAttribute("data-page");
const view_num_header = document.getElementById("view-num");

function displayRanking(data) {
    rankingList_grow.innerHTML = ''; // 清空之前的內容
    // 根據當前頁面 URL 動態決定顯示的歌曲數量
    const maxSongs = window.location.pathname.includes('ranking.html') ? 50 : 10; // 如果在 ranking.html 顯示 50 首，否則顯示 10 首
    const song92 = data.find(song => song.id === 92);

    // 根據 popularity 將歌曲按熱門度降序排序，並選取前 maxSongs 名
    const topSongs_grow = data
        .sort((a, b) => b.ViewsGrow - a.ViewsGrow)  // 按觀看成長降序排序
        .slice(0, maxSongs);  // 根據 maxSongs 選取前 N 首
    //.toSpliced(8,0,)
    const topSongs_total = data
        .sort((a, b) => b.CurViews - a.CurViews)  // 按總觀看降序排序
        .slice(0, maxSongs);  // 根據 maxSongs 選取前 N 首

    if (song92) {
        topSongs_grow.splice(8, 0, song92); // 插入第 9 位
        topSongs_total.splice(8, 0, song92); // 插入第 9 位
    }

    // 循環選取的歌曲，填入歌曲資料
    topSongs_grow.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'rankbox';
        li.innerHTML = `
            <span class="ranking-number">${index + 1} </span> <!-- 顯示排名 -->
            <a href="lyric.html?songId=${song.id}"  target="_self" class="song-img"><img src="${song.img}" alt="${song.title} 封面圖" class="song-img" /></a>
            <div class="text-info">
                <a href="lyric.html?songId=${song.id}"  target="_self" class="song-name">${song.title}</a>
                <p class="song-artist">${song.artist}</p>
                </div>
            <div class=view-num><img src="./images/eye.svg" alt="views" class="icon"><p class="num">${song.ViewsGrow}</p></div>
            
        `;
        rankingList_grow.appendChild(li);
    });

    if (page === "ranking") {
        rankingList_total.innerHTML = ''; // 清空之前的內容
        topSongs_total.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'rankbox';
            li.innerHTML = `
                <span class="ranking-number">${index + 1} </span> <!-- 顯示排名 -->
                <a href="lyric.html?songId=${song.id}"  target="_self" class="song-img"><img src="${song.img}" alt="${song.title} 封面圖" class="song-img" /></a>
                <div class="text-info">
                    <a href="lyric.html?songId=${song.id}"  target="_self" class="song-name">${song.title}</a>
                    <p class="song-artist">${song.artist}</p>
                    <div class=view-num><img src="./images/eye.svg" alt="views" class="icon"><p class="num">${song.CurViews}</p></div>
                </div>
            `;
            rankingList_total.appendChild(li);
        });
    }
}

// JSON 載入並初始化
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        displayRanking(data);
    })
    .catch(error => console.error('無法載入 JSON:', error));

if (page === "ranking") {
    const grow_btn = document.getElementById('View-grow-btn');
    const total_btn = document.getElementById('View-total-btn');
    grow_btn.classList.add("active");
    rankingList_grow.classList.add("active");
    view_num_header.innerHTML = "觀看成長量";
    grow_btn.addEventListener('click', function () {
        grow_btn.classList.add("active");
        total_btn.classList.remove("active");
        rankingList_grow.classList.add("active");
        rankingList_total.classList.remove("active");
        view_num_header.innerHTML = "觀看成長量";
    });
    total_btn.addEventListener('click', function () {
        total_btn.classList.add("active");
        grow_btn.classList.remove("active");
        rankingList_total.classList.add("active");
        rankingList_grow.classList.remove("active");
        view_num_header.innerHTML = "總觀看次數";
    });
}
