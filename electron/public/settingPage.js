// 要素を取得
const createButton = document.getElementById("create");
const settingButton = document.getElementById("setting");

async function goCreatePage() {
    location.href = "eventCreate.html"
};

async function goSettingPage() {
    location.href = "eventSetting.html"
};


//addEventListenerで登録
createButton.addEventListener("click", goCreatePage);
settingButton.addEventListener("click", goSettingPage);
