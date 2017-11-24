$(function() {
    var frequency = [];
    
    $(".huffman-input").on("input", function() {
        frequency = [];
        var val = $(this).val();
        
        var ascii = "";
        
        for(var i = 0; i < val.length; i++) {
            var char = val[i];
            var huffie = frequency.filter((obj) => {return obj.char == char;});
            
            huffie = huffie.length > 0 ? huffie[0] : undefined;
            
            if(huffie == undefined) {
                let newHuffie = {char: char, frequency: 1};
                frequency.push(newHuffie);
            } else {
                huffie.frequency++;
            }
            
            ascii += dec2bin(char.charCodeAt(0)) + " ";
        }
        
        frequency.sort(compareFreq);
        
        while(frequency.length > 1) {
            var huffieFirst = frequency.shift();
            var huffieSecond = frequency.shift();
            
            var huffieKnot = {char: '', frequency: huffieFirst.frequency + huffieSecond.frequency, leftChild: huffieFirst, rightChild: huffieSecond};
            
            frequency.push(huffieKnot);
            frequency.sort(compareFreq);
        }
        
        createTree(frequency);
        
        var bits = "";
        var displayBits = "";
        
        for(var i = 0; i < val.length; i++) {
            var char = val[i];
            
            var huffieBits = getBits(frequency[0], char, "");
            
            bits += huffieBits;
            displayBits += huffieBits;
        }
        
        for(var i = 0; i <= displayBits.length; i += 8) {
            if(i != 0) {
                displayBits = [displayBits.slice(0, i), " ", displayBits.slice(i)].join('');
                i++;
            }
        }
        
        $(".huffman-compression").text(100-((bits.length/ascii.length)*100).toFixed(2) + "%")
        $(".huffman-ascii").text(ascii);
        $(".huffman-bits").text(displayBits);
        $(".huffman-decoded").text(decodeBits(frequency[0], bits));
    });
});

function getBits(huffie, char, code) {
    if(huffie.char.length == 0) {
        var newCode = undefined;
        if(huffie.leftChild.char.length == 0) {
            newCode = getBits(huffie.leftChild, char, code + "0");
        } else {
            newCode = getBits(huffie.leftChild, char, code + "0");
        }
        
        if(newCode == undefined) {
            if(huffie.rightChild.char.length == 0) {
                newCode = getBits(huffie.rightChild, char, code + "1");
            } else {
                newCode = getBits(huffie.rightChild, char, code + "1");
            }
        }
        
        return newCode;
    } else {
        return huffie.char == char ? code : undefined;
    }
}

function decodeBits(huffie, bits) {
    var text = "";
    
    var currentHuffie = huffie;
    
    for(var i = 0; i < bits.length; i++) {
        var bit = bits[i];
        
        if(bit == "0") {
            if(currentHuffie.leftChild.char.length == 0) {
                currentHuffie = currentHuffie.leftChild;
            } else {
                text += currentHuffie.leftChild.char;
                currentHuffie = huffie;
            }
        } else {
            if(currentHuffie.rightChild.char.length == 0) {
                currentHuffie = currentHuffie.rightChild;
            } else {
                text += currentHuffie.rightChild.char;
                currentHuffie = huffie;
            }
        }
    }
    
    return text;
}

function createTree(huffieTree) {
    $(".tree-head").html(createTreeElement(huffieTree[0]));
}

function createTreeElement(huffie) {
    var html = "<li>";
     
    if(huffie.char.length == 0) {
        html += "<p>" + huffie.frequency + "</p>";
        html += "<ul>";
        
        html += createTreeElement(huffie.leftChild);
        html += createTreeElement(huffie.rightChild);
        
        html += "</ul>";
    } else {
        html += "<p>" + huffie.char + ":" + huffie.frequency + "</p>";
    }
    
    html += "</li>";
    
    return html;
}

function compareFreq(o1, o2) {
    var val = o1.frequency-o2.frequency;
    
    if(val == 0) {
        val += o1.char.length == 0 ?  1 : -1;
        val += o2.char.length == 0 ? -1 :  1;
    }
    
    return  val;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}