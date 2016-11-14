var simplesCount = 50;
var size = 28;

var cv = tag('canvas').append();

// var canvas = document.getElementById("mnistCanvas");
var canvas = cv.$.get(0);
canvas.height = size*simplesCount;
var ctx = canvas.getContext("2d");

var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var colOffset, rowOffcet;
console.log(canvasData.data);
for (var col=0;col < 10; col++) {
    colOffset = (9-col)*size;
    var digits = mnist[col].range(0, simplesCount-1);
    for (var row=0;row < simplesCount; row++) {
        var digit = digits[row];
        rowOffcet = row*size;
        for (var i = 0; i < digit.length; i++) {
            var pointColor = digit[i] * 255;
            var position = (colOffset+(rowOffcet + Math.floor(i/size))*canvas.width) + (i % size);
            canvasData.data[position * 4 + 0] = 255-pointColor;
            canvasData.data[position * 4 + 1] = 255-pointColor;
            canvasData.data[position * 4 + 2] = 255-pointColor;
            canvasData.data[position * 4 + 3] = 255;
        }
    }
}
ctx.putImageData(canvasData, 0, 0);
