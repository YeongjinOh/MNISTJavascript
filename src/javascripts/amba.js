var tag = function (name) {
    return new Tag(name);
};
var Tag = function (name) {
    this.$ = $('<' + name + '>');
    this.$.data('tag', this);
};
Tag.prototype.appendTo = function (parent) {
    if (parent.$ === undefined)
        this.$.appendTo($('#'+parent));
    else
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
Tag.prototype.text = function (txt) {
    this.$.text(txt);
    return this;
};
Tag.prototype.css = function (prop, key) {
    this.$.css(prop,key);
    return this;
};
Array.prototype.shuffle = function () {
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
}