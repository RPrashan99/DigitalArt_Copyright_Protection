export async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
    });

    const { ipfsPath } = await response.json();

    return ipfsPath;
}

export async function getFromIPFS(hash) {
    const response = await fetch("http://localhost:5000/getFiles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash }),
    });

    const { images } = await response.json();
    return images;
}