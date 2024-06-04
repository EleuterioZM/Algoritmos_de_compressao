function compressFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    
    if (!file) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var originalSize = event.target.result.length;
        var compressedData = pako.deflate(event.target.result, { to: 'string' });
        var compressedSize = compressedData.length;
        var compressionRatio = (compressedSize / originalSize).toFixed(2);
        document.getElementById('ratio').innerText = "Taxa de compressão: " + compressionRatio;
        downloadFile(compressedData);
    };
    reader.readAsBinaryString(file);
}

function downloadFile(data) {
    var blob = new Blob([data], { type: 'text/plain' });
    var url = window.URL.createObjectURL(blob);
    var link = document.getElementById('downloadLink');
    link.href = url;
    link.style.display = 'inline';
}
