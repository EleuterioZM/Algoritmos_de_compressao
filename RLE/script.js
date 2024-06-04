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
        var compressedText = compressWithRLE(inputText);
        var originalSize = inputText.length * 8; // Tamanho original em bits
        var compressedSize = compressedText.length;
        var compressionRatio = (compressedSize / originalSize).toFixed(2);
        document.getElementById('ratio').innerText = compressionRatio;
    };
    reader.readAsText(file);
}

function compressWithRLE(input) {
    var compressedText = '';
    var count = 1;
    for (var i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            compressedText += input[i] + count;
            count = 1;
        }
    }
    return compressedText;
}
