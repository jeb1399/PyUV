const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const wispUrl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;
const bareUrl = `${location.protocol === "https:" ? "https" : "http"}://${location.host}/bare/`;

// Preload transport
connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);

const urlInput = document.getElementById("urlInput");
const searchButton = document.getElementById("searchButton");
const switcher = document.getElementById("switcher");

urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

searchButton.onclick = async (event) => {
    event.preventDefault();

    let url = urlInput.value;
    if (!url.includes(".")) {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }

    if (!await connection.getTransport()) {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
    openInNewTab(encodedUrl);
};

switcher.onchange = async (event) => {
    const transport = event.target.value === "epoxy" 
        ? ["/epoxy/index.mjs", [{ wisp: wispUrl }]]
        : ["/baremod/index.mjs", [bareUrl]];
    
    await connection.setTransport(...transport);
};

function openInNewTab(url) {
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
        // Add an event listener to receive messages from the iframe
        window.addEventListener('message', function(event) {
            if (event.origin === location.origin && event.data.type === 'setTitle') {
                newTab.document.title = event.data.title;
            }
        });

        newTab.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Proxy</title>
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <iframe id="contentFrame" src="${url}" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-popups-to-escape-sandbox allow-top-navigation" allow="javascript; encrypted-media;" allowfullscreen allowpaymentrequest></iframe>
                <script>
                    const iframe = document.getElementById('contentFrame');
                    iframe.onload = function() {
                        // Send a message to the parent with the document title
                        iframe.contentWindow.postMessage({ type: 'setTitle', title: iframe.contentDocument.title }, '*');
                    };
                </script>
            </body>
            </html>
        `);
        newTab.document.close();
    } else {
        alert("Pop-up blocker may be preventing the new tab from opening. Please allow pop-ups for this site.");
    }
}