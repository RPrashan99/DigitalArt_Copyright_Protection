export async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
    });

    const { ipfsUrl } = await response.json();

    return ipfsUrl;
}

