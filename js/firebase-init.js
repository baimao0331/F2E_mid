// firebase-init.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';


// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBZuylEBuTmQbprt-t087etIgtIhPESqgc",
  authDomain: "yoisei-4d2dd.firebaseapp.com",
  databaseURL: "https://yoisei-4d2dd-default-rtdb.firebaseio.com",
  projectId: "yoisei-4d2dd",
  storageBucket: "yoisei-4d2dd.firebasestorage.app",
  messagingSenderId: "765961474782",
  appId: "1:765961474782:web:bc5390344f542f59fda84f"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

console.log("Firebase 初始化成功", app);

const menu = document.getElementById('account_option');

// 更新選單的函數
async function updateMenu(user) {
  const menu = document.getElementById('account_option');

  // 如果頁面中沒有選單，則跳過更新
  if (!menu) return;

  // 清空舊的登入/登出選項
  const dynamicItems = document.querySelectorAll('.dynamic-item');
  dynamicItems.forEach(item => item.remove());

  if (user) {
      // 從 Firestore 獲取用戶資料
      try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
              const userData = userDoc.data();
              const userLi = document.createElement('li');
              userLi.className = 'dynamic-item';
              userLi.textContent = `歡迎, ${userData.nickname || '用戶'}`;
              
              const likeLi = document.createElement('li');
              likeLi.className = 'dynamic-item';
              likeLi.innerHTML = `<a href="/liked.html">喜歡的歌曲</a>`;

              const logoutLi = document.createElement('li');
              logoutLi.className = 'dynamic-item';
              logoutLi.innerHTML = `<a href="#" id="logoutButton">登出</a>`;

              menu.appendChild(userLi);
              menu.appendChild(likeLi);
              menu.appendChild(logoutLi);

              const logoutButton = document.getElementById('logoutButton');
              if (logoutButton) {
                  logoutButton.addEventListener('click', (e) => {
                      e.preventDefault();
                      auth.signOut()
                          .then(() => {
                              alert("登出成功！");
                          })
                          .catch((error) => {
                              alert("登出失敗：" + error.message);
                          });
                  });
              }
          } else {
              console.error("Firestore 中未找到用戶資料");
          }
      } catch (error) {
          console.error("從 Firestore 獲取用戶資料失敗：", error.message);
      }
  } else {
      // 使用者未登入
      const loginLi = document.createElement('li');
      loginLi.className = 'dynamic-item';
      loginLi.innerHTML = `<a href="/account.html?type=login">登入</a>`;

      const registerLi = document.createElement('li');
      registerLi.className = 'dynamic-item';
      registerLi.innerHTML = `<a href="/account.html?type=register">註冊</a>`;

      menu.appendChild(loginLi);
      menu.appendChild(registerLi);
  }
}

// 監聽登入狀態變化
onAuthStateChanged(auth, (user) => {
  updateMenu(user);
});


export { auth, firestore };