/** default parameters **/

var size = 28, n = size * size, k = 10;
var alpha = 0.1; // learning rate
var w1 = getW(size * size, k);
var b1 = getB(k);

// divide all dataset into traing and test sets
var sizeTraining = 8000, sizeTest = 2000, batch = 100;
var set = mnist.set(sizeTraining, sizeTest);
var trainingSet = set.training;
var testSet = set.test;
sizeTest = testSet.length;

/** basic layout **/

var root = tag('div').append();
var cols = 10;
var digits = new Array(cols + 1);
var pre = new Array(cols + 1);
var ans = new Array(cols + 1);
for (var i = 0; i < cols + 1; i++) {
    var th = tag('th').appendTo('digits').css('width', size).css('border', '1px solid gray');
    digits[i] = tag('canvas').appendTo(th).css('width', '30px').css('height', '30px');
    pre[i] = tag('td').appendTo('precision').css('text-align', 'center').css('border', '1px solid gray');
    ans[i] = tag('td').appendTo('answer').css('text-align', 'center').css('border', '1px solid gray');
}
pre[0].text('Prediction');
ans[0].text('Answer');

/** initial setting **/

var timeStep = 500, rep = 10, each = 100;

var train = function () {
    $('#status').text('Loading...');
    for (var j = 0; j <= rep; j++) {
        (function (i) {
            setTimeout(function () {
                if (i < rep) {
                    $('#status').text('Training... ' + i * each + '/' + rep * each);
                    trainAllUsingBatch(each, batch, w1, b1);
                } else {
                    $('#status').text('Validating...');
                    var result = test(sizeTest);
                    setTimeout(function () {
                        $('#status').text('Done.\nAcuracy is ' + Math.round(result * 100) + '% with ' + sizeTest + ' validation sets');
                    }, 2 * timeStep);
                }
            }, i * timeStep)
        })(j)
    }
};
$('#trainbutton').click(train);
