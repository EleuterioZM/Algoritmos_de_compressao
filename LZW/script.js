// Compressão LZW
function compressLZW(uncompressed) {
    let dictSize = 256;
    let dictionary = {};
    for (let i = 0; i < 256; i++) {
        dictionary[String.fromCharCode(i)] = i;
    }

    let w = "";
    let result = [];
    for (let i = 0; i < uncompressed.length; i++) {
        let c = uncompressed.charAt(i);
        let wc = w + c;
        if (dictionary.hasOwnProperty(wc)) {
            w = wc;
        } else {
            result.push(dictionary[w]);
            dictionary[wc] = dictSize++;
            w = c;
        }
    }

    if (w !== "") {
        result.push(dictionary[w]);
    }
    return result;
}

// Descompressão LZW
function decompressLZW(compressed) {
    let dictSize = 256;
    let dictionary = {};
    for (let i = 0; i < 256; i++) {
        dictionary[i] = String.fromCharCode(i);
    }

    let w = String.fromCharCode(compressed[0]);
    let result = w;
    for (let i = 1; i < compressed.length; i++) {
        let k = compressed[i];
        let entry;
        if (dictionary[k]) {
            entry = dictionary[k];
        } else if (k === dictSize) {
            entry = w + w.charAt(0);
        } else {
            throw new Error("Erro na descompressão: entrada inválida " + k);
        }

        result += entry;

        dictionary[dictSize++] = w + entry.charAt(0);

        w = entry;
    }
    return result;
}

// Salva um array de números como um arquivo binário
function saveCompressedFile(compressed, filename) {
    const blob = new Blob([new Uint16Array(compressed)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Calcular a Taxa de Compressão
function compressionRatio(originalSize, compressedSize) {
    return (originalSize / compressedSize).toFixed(2);
}

document.getElementById('compressButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const compressed = compressLZW(text);
            const originalSize = file.size; // Tamanho original em bytes
            const compressedSize = compressed.length * 2; // Cada entrada comprimida é de 2 bytes (Uint16Array)
            const ratio = compressionRatio(originalSize, compressedSize);

            document.getElementById('compressionRatio').textContent = `Compression Ratio: ${ratio}`;
            saveCompressedFile(compressed, `${file.name}.lzw`);

            // Verificação de descompressão
            const decompressed = decompressLZW(compressed);
            console.assert(decompressed === text, "Erro: O texto descomprimido não corresponde ao original!");
        };
        reader.readAsText(file);
    } else {
        alert('Please select a file first.');
    }
});
