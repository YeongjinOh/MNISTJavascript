/** basic utils **/

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
// fully connected
function getW (n, k, init) {
    var w = new Array(k);
    // random initialize
    for (var i=0; i<k; i++) {
        w[i] = new Array (n);
        for (var j=0; j<n; j++) {
            if (init)
                w[i][j] = init
            else
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

function appendDigit (sol, x, w, b, i) {
    var y = model(x, w, b);
    showDigit(x, digits[i+1]);
    pre[i+1].text(maxIdx(y));
    ans[i+1].text(maxIdx(sol));
    if (maxIdx(y) === maxIdx(sol))
        pre[i+1].css('color','black').css('font-weight','initial');
    else
        pre[i+1].css('color','red').css('font-weight','bold');
}

function showDigit (digit, cv) {
    var canvas = cv.$.get(0);
    canvas.height = size;
    canvas.width = size;
    var ctx = canvas.getContext("2d");
    var canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

/** functions **/

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

// from given x and w, return y
function model (x, w, b) {
    var y = new Array(10);
    for (var i=0; i<w.length; i++) {
        y[i] = b[i];
        for (var j=0; j<w[i].length; j++) {
            y[i] += w[i][j] * x[j];
        }
    }
    return softmax(y);
}

/** train & test **/

function train (sol, x, w, b) {
    var y = model(x, w, b);
    for (var i=0; i<w.length; i++) {
        for (var j=0; j<w[i].length; j++) {
            w[i][j] += alpha*x[j]*(sol[i]-y[i]);
        }
    }
}
function trainAll (sizeTraining, w, b) {
    var x, sol;
    for (var i=0; i<sizeTraining; i++) {
        x = trainingSet[i].input;
        sol = trainingSet[i].output;
        train(sol, x, w, b);
        if (i%1000 === 0) {
            appendDigit(sol, x, w, b, i/1000);
        }
    }
}
function trainBatch (batch, w, b, append) {
    var x, y, sol;
    var dw = getW(size*size,10,0);
    var start = Math.floor(Math.random()*(trainingSet.length-batch));
    // shuffle before training
    trainingSet.shuffle();
    var cnt = 0;
    for (var s=start; s<start+batch; s++) {
        x = trainingSet[s].input;
        sol = trainingSet[s].output;
        y = model(x, w, b);
        for (var i=0; i<w.length; i++) {
            for (var j=0; j<w[i].length; j++) {
                dw[i][j] -= x[j]*(sol[i]-y[i]);
            }
        }
        if (append && s<start+10) {
            appendDigit(sol, x, w, b, s-start);
        }
        if (maxIdx(sol) === maxIdx(y))
            cnt++
    }
    if (append)
        $('#acuracy').text(cnt/batch*100);
    // update parameters
    for (i=0; i<w.length; i++) {
        for (j=0; j<w[i].length; j++) {
            w[i][j] -= alpha*dw[i][j]/batch;
        }
    }
}
function trainAllUsingBatch (rep, batch, w, b) {
    for (var i=0; i<rep; i++) {
        trainBatch(batch, w, b, i%100===0);
    }
}

function test (sizeTest) {
    var x, answer, y, cnt = 0;
    for (var i=0; i<sizeTest; i++) {
        x = testSet[i].input;
        answer = testSet[i].output;
        y = model(x, w1, b1);
        if (maxIdx(y) === maxIdx(answer))
            cnt++;
    }
    return cnt/sizeTest;
}