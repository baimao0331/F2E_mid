import { auth } from './firebase-init.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    reload
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { firestore } from './firebase-init.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const messageBox = document.getElementById("messagebox");


// 會員系統功能
export async function registerUser(email, password, username) {
    try {
        // 註冊用戶
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 更新使用者名稱
        await updateProfile(user, { username });
        console.log("使用者名稱已設置：", username);

        // 將用戶資料存入 Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            nickname: username,
            liked:[],
            createdAt: new Date(),
        });
        console.log("用戶註冊並存入 Firestore 成功：", user);
        document.getElementById('messagebox').classList.remove("error");
        document.getElementById('messagebox').classList.add("correct");
        messageBox.innerText = `註冊成功！歡迎，${username}`;
    }catch(error) {
            console.error(error.message);
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = getErrorMessage(error);
        };
}

export async function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            console.log("登錄成功：", userCredential.user);
            document.getElementById('messagebox').classList.remove("error");
            document.getElementById('messagebox').classList.add("correct");
            messageBox.innerText = `歡迎, ${userData.nickname || '用戶'}`;
        })
        .catch((error) => {
            document.getElementById('messagebox').classList.remove("correct");
            document.getElementById('messagebox').classList.add("error");
            messageBox.innerText = getErrorMessage(error);
        });
}

export function logoutUser() {
    signOut(auth)
        .then(() => {
            console.log("用戶已登出");
        })
        .catch((error) => {
            console.error("登出失敗：", error.message);
            messageBox.innerText = getErrorMessage(error);
        });
}


// 錯誤消息處理
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return '該電子郵件地址已被使用。請嘗試其他電子郵件地址！';
        case 'auth/invalid-email':
            return '無效的電子郵件地址。請檢查並重新輸入！';
        case 'auth/weak-password':
            return '密碼太弱。請使用至少 6 個字符的密碼！';
        case 'auth/user-not-found':
            return '用戶未找到。請檢查電子郵件地址或註冊新帳號！';
        case 'auth/wrong-password':
            return '密碼錯誤。請檢查並重新輸入！';
        case 'auth/missing-password':
            return '密碼為空。請檢查並重新輸入！';
        case 'auth/invalid-credential':
            return '錯誤的信箱或密碼。請檢查並重新輸入！'
        default:
            return '發生未知錯誤：' + error.message;
    }
}
