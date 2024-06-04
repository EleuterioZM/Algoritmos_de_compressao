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
        var compressedText = compressWithBWT(inputText);
        var originalSize = inputText.length * 8; // Tamanho original em bits
        var compressedSize = compressedText.length;
        var compressionRatio = (compressedSize / originalSize).toFixed(2);
        document.getElementById('ratio').innerText = compressionRatio;
    };
    reader.readAsText(file);
}

function rotate(text) {
    var rotations = [];
    for (var i = 0; i < text.length; i++) {
        var rotatedText = text.substring(i) + text.substring(0, i);
        rotations.push(rotatedText);
    }
    return rotations.sort();
}

function compressWithBWT(input) {
    var rotations = rotate(input);
    var bwt = '';
    for (var i = 0; i < rotations.length; i++) {
        bwt += rotations[i].charAt(input.length - 1);
    }
    return bwt;
}
