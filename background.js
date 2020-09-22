function playSound() {
	if (typeof(audio) != "undefined" && audio) {
		audio.pause();
		document.body.removeChild(audio);
		audio = null;
	}
	audio = document.createElement('audio');
	document.body.appendChild(audio);
	audio.autoplay = true;
	audio.src = chrome.extension.getURL('assets/tada.mp3');
	audio.play();
}

const sendTelegramMessage = () => {
    const botToken = localStorage.getItem('SRT_MACRO::bot-token');
    const chatId = localStorage.getItem('SRT_MACRO::chat-id');

    if (!botToken || !chatId) {
        return;
    }

	const msg = encodeURI('SRT 예약을 시도하였습니다. 예약을 확인해주세요.');
	const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${msg}`;

    fetch(encodeURI(url));
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.type == 'playSound') {
        playSound();
		sendTelegramMessage();
        sendResponse(true);
    }
});