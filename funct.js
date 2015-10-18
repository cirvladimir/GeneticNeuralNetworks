Array.range = function (l) {
    return new Array(l).fill(null);
};

Array.prototype.last = function() {
	return this[this.length - 1];
};

Array.prototype.insert = function(ind, el) {
	var rest = this.splice(ind);
	this.push(el);
	var self = this;
	rest.forEach(function(x) { self.push(x); });
	return this;
};

Array.prototype.shuffle = function() {
	return this.reduce(function(acc, el) { return acc.insert(Math.floor(Math.random() * (acc.length + 1)), el)}, []);
};

Array.prototype.flatten = function() {
	return this.reduce(function(acc, ar) { return acc.concat(ar); }, []);
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
