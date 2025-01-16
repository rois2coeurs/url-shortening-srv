document.getElementById('submit').addEventListener('click', async function (e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const shortCode = await postUrl(url)
    addUrlToDiv({url: `${window.location.origin}/${shortCode}`});
});

async function postUrl(url) {
    const res = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: url})
    });
    const data = await res.json();
    return data.shortCode;
}

function addUrlToDiv(url) {
    const urlsDiv = document.getElementById("responses");
    const a = document.createElement('a');
    a.href = url.url;
    a.textContent = url.url;
    a.classList.add('url');
    urlsDiv.appendChild(a);
    urlsDiv.appendChild(document.createElement('br'));
}