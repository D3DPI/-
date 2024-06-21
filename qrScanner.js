document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video');
    const qrScanner = new QrScanner(videoElement, result => {
        if (result.includes('https://d3dpi.github.io/x/b.html')) {
            window.location.href = result;
        }
    });

    qrScanner.start();
});
