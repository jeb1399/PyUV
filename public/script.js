function loadUrl() {
    const url = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    resultDiv.innerHTML = 'Loading...';

    fetch(`/proxy?url=${encodeURIComponent(url)}`)
        .then(response => response.text())
        .then(data => {
            resultDiv.innerHTML = `<pre>${escapeHtml(data)}</pre>`;
        })
        .catch(error => {
            resultDiv.innerHTML = `Error: ${error.message}`;
        });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
