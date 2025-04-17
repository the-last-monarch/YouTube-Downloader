// public/js/script.js
document.getElementById('downloadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const url = document.getElementById('urlInput').value;
    const status = document.getElementById('status');

    status.textContent = 'Processing... Please wait.';

    // Send request to backend to start video download
    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${url}`,
    })
    .then(response => response.blob())
    .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'video.mp4';
        link.click();
        status.textContent = 'Download complete!';
    })
    .catch(error => {
        status.textContent = `Error: ${error.message}`;
    });
});
