/** amba **/

var tag = function (name) {
    return new Tag(name);
};
var Tag = function (name) {
    this.$ = $('<' + name + '>');
    this.$.data('tag', this);
};
Tag.prototype.appendTo = function (parent) {
    this.$.appendTo(parent.$);
    return this;
};
Tag.prototype.append = function () {
    this.$.appendTo($('body'));
    return this;
};

/** initial setting **/
var size = 28;

function digit (row, col) {
    var cv = tag('canvas');
    var canvas = cv.$.get(0);
    canvas.height = size;
    canvas.width = size;
    var ctx = canvas.getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var digits = mnist[col].range(row, row);
    var digit = digits[0];
    for (var i = 0; i < digit.length; i++) {
        var pointColor = digit[i] * 255;
        var position = Math.floor(i/size)*canvas.width + (i % size);
        canvasData.data[position * 4 + 0] = 255-pointColor;
        canvasData.data[position * 4 + 1] = 255-pointColor;
        canvasData.data[position * 4 + 2] = 255-pointColor;
        canvasData.data[position * 4 + 3] = 255;
    }
    ctx.putImageData(canvasData, 0, 0);
    return cv;
}

for (var i=0; i<100; i++) {
    var row = tag('div').append();
    for (var j=0; j<10; j++) {
        digit(i,j).appendTo(row);
    }
}