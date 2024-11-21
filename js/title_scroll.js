document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#title-scroll"); // 選擇滾動容器
    const text = document.querySelector("#song-title"); // 選擇文字

    if (container && text) {
        container.addEventListener("mouseover", () => {
            const containerWidth = container.offsetWidth; // 容器寬度
            const textWidth = text.scrollWidth; // 文字實際寬度

            // 只有當文字長度超過容器寬度時，才啟動滾動效果
            if (textWidth > containerWidth) {
                const scrollDistance = textWidth - containerWidth; // 計算滾動距離
                const scrollDuration = scrollDistance / 50; // 設定滾動速度（越大越慢）

                text.style.transition = `transform ${scrollDuration}s linear`; // 設定滾動時間
                text.style.transform = `translateX(-${scrollDistance}px)`; // 滾動到左側
            }
        });

        container.addEventListener("mouseout", () => {
            text.style.transition = "transform 0.3s ease-out"; // 平滑回到初始位置
            text.style.transform = "translateX(0)";
        });
    }
});
