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
Tag.prototype.remove = function () {
    this.$.remove();
    return this;
};

/** initial setting **/

// get mnist digit
function mn(row, col) {
    return mnist[col].range(row, row)[0];
}
function showDigit (row, col) {
    var cv = tag('canvas');
    var canvas = cv.$.get(0);
    canvas.height = size;
    canvas.width = size;
    var ctx = canvas.getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var digit = mn(row, col);
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

/** show digits **/

// var prev = tag('div');
// for (var i=0; i<10; i++) {
//     (function (i) {
//         setTimeout(function () {
//             var row = tag('div');
//             for (var j = 0; j < 10; j++) {
//                 showDigit(i, j).appendTo(row);
//             }
//             prev.remove();
//             row.append();
//             prev = row;
//         }, i * 100)
//     })(i);
// }

/** basic utils **/

function sigmoid(z) {
    return 1.0/(1.0+Math.exp(-z));
}

function sigmoid_prime(z) {
    return sigmoid(z)*(1-sigmoid(z));
}

function softmax (y) {
    var res = new Array(10);
    var sum = 0;
    for (var i=0; i<10; i++) {
        res[i] = Math.exp(y[i]);
        sum += res[i];
    }
    for (i=0; i<10; i++) {
        res[i] = res[i]/sum;
    }
    return res;
}


/** initialize model **/

// fully connected
function getW (n, k) {
    var w = new Array(k);
    // random initialize
    for (var i=0; i<k; i++) {
        w[i] = new Array (n);
        for (var j=0; j<n; j++) {
            w[i][j] = Math.random();
        }
    }
    return w;
}
function getB (k) {
    var b = new Array(k);
    for (var i=0; i<k; i++) {
        b[i] = Math.random();
    }
    return b;
}

// predict
function getSolution (cur) {
    var sol = new Array(10);
    for (var i=0; i<10; i++) {
        sol[i] = 0;
    }
    sol[cur] = 1;
    return sol;
}
// from given x and w, return y
function model (x, w, b) {
    var y = new Array(10);
    for (i=0; i<w.length; i++) {
        y[i] = b[i];
        for (j=0; j<w[i].length; j++) {
            y[i] += w[i][j] * x[j];
        }
    }
    return softmax(y);
}

function train (row, col, w, b) {
    var x = mn(row,col), i, j;
    var sol = getSolution(col);
    var y = model(x, w, b);
    for (i=0; i<w.length; i++) {
        for (j=0; j<w[i].length; j++) {
            // -= ? += ?
            w[i][j] -= alpha*x[j]*(sol[i]-y[i]);
        }
    }
}

/** default parameters **/
var size = 28, k = 10;
var alpha = 0.01; // learning rate
var i,j;
var w1 = getW(size*size,k);
var b1 = getB(k);


var answer = 1;
var trainNum = 700;

for (i=0; i<10; i++) {
    for (j=0; j<trainNum; j++) {
        train(j, i, w1, b1);
    }
}
var x = mn(trainNum+1, answer);
var y = model(x, w1, b1);

function maxIdx (y) {
    var max = -1, idx = -1;
    for (var i=0; i<y.length; i++) {
        if (max < y[i]) {
            max = y[i];
            idx = i;
        }
    }
    return idx;
}
alert(maxIdx(y) + ' with ' + y[maxIdx(y)] + ' where answer is ' + answer);
console.log(y);