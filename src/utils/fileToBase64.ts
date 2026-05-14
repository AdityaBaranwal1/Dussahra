export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string; name: string }> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return {
        base64: btoa(binary),
        mimeType: file.type || 'application/octet-stream',
        name: file.name,
    };
}
