document.addEventListener('DOMContentLoaded', () => {
    const qrScanner = new QrScanner(videoElement, result => {
        if (result.includes('https://d3dpi.github.io/x/b.html')) {
            window.location.href = result;
        }
    });

    qrScanner.start();
});
