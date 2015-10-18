Array.range = function (l) {
    return Array.apply(null, new Array(l));
};

Array.prototype.last = function() {
	return this[this.length - 1];
};

var _ = function (x) {
    return x;
};

var $ = function (f) { return f.apply(null, Array.apply(null, arguments).slice(1)); };

var ФEq = function (a) {
    return function (b) {
        return a == b;
    }
}


