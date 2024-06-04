function compressFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    
    if (!file) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var inputText = event.target.result;
        var compressedText = compressWithHuffman(inputText);
        var originalSize = inputText.length * 8; // Tamanho original em bits
        var compressedSize = compressedText.length;
        var compressionRatio = (compressedSize / originalSize).toFixed(2);
        document.getElementById('ratio').innerText = compressionRatio;
    };
    reader.readAsText(file);
}

function compressWithHuffman(input) {
    // Função para realizar a compressão usando o algoritmo de Huffman

    // Contagem da frequência dos caracteres
    var freqMap = {};
    for (var i = 0; i < input.length; i++) {
        var char = input[i];
        if (freqMap[char]) {
            freqMap[char]++;
        } else {
            freqMap[char] = 1;
        }
    }

    // Construção da árvore de Huffman
    var nodes = [];
    for (var char in freqMap) {
        nodes.push({ char: char, freq: freqMap[char], left: null, right: null });
    }

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        var left = nodes.shift();
        var right = nodes.shift();
        var newNode = { char: null, freq: left.freq + right.freq, left: left, right: right };
        nodes.push(newNode);
    }

    var root = nodes[0];

    // Construção do dicionário de códigos Huffman
    var huffmanDict = {};
    function buildDict(node, code) {
        if (node.char !== null) {
            huffmanDict[node.char] = code;
        } else {
            buildDict(node.left, code + '0');
            buildDict(node.right, code + '1');
        }
    }
    buildDict(root, '');

    // Compressão do texto usando os códigos Huffman
    var compressedBits = '';
    for (var i = 0; i < input.length; i++) {
        compressedBits += huffmanDict[input[i]];
    }

    return compressedBits;
}
