// popup.js
document.getElementById('extract-images').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractImages,
    }, (results) => {
        const images = results[0].result;
        const imagesContainer = document.getElementById('images');
        imagesContainer.innerHTML = '';

        images.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'image-item';
            imagesContainer.appendChild(img);
        });
    });
});

function extractImages() {
    const images = Array.from(document.images).map(img => img.src);
    const backgroundImages = Array.from(document.querySelectorAll('*'))
        .map(el => getComputedStyle(el).backgroundImage)
        .filter(bg => bg.startsWith('url'))
        .map(bg => bg.slice(5, -2));

    return [...new Set([...images, ...backgroundImages])];
}

// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log('Image Extractor extension installed.');
});
