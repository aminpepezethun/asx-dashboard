export default function downloadFile(
    content: string | Blob,
    filename: string,
    contentType: string = "text/csv;charset=utf-8",
) {
    // Create Blob from the content if it's a string
    const blob = content instanceof Blob
        ? content
        : new Blob([content], {type: contentType});
    
    // Temporary URL for Blob
    const url = URL.createObjectURL(blob);

    // Create anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    // Append to DOM, click and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke URL to free up memory
    URL.revokeObjectURL(url);
}