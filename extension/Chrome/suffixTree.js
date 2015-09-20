var suffixTreeNode = function (data, next, isEnd, words) {
    this.data = data;
    this.next = next;
    this.isEnd = isEnd;
    this.words = words;
};

var suffixTree = function () {
    this.root = new suffixTreeNode(' ', [], false, []);
}

suffixTree.prototype.insertList = function (x) {
    for (var i = 0; i < x.length; i++) {
        this.insertWord(x[i], i);
    }
}

suffixTree.prototype.insertWord = function (s, index) {
    if (s.length == 0) {
        return;
    }
    else {
        var current = this.root;
        for (var i = 0; i < s.length; i++) {
            var ch = s[i];
            ch = ch.toLowerCase();
            var find = current.keys.indexOf(ch);
            if (find == -1) {
                current.keys.push(ch);
                current.next.push(new suffixTreeNode(ch, [], false, []));
                current = current.next[current.next.length-1];
            }
            else {
                current = current.next[find];
            }
            current.isEnd = true;
            if (current.words.indexOf(index) == -1) current.words.push(index);
        }
        this.insertWord(s.substring(1), index);
    }
}

suffixTree.prototype.exists = function (s) {
    s = s.toLowerCase();
    var current = this.root;
    for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        var find = current.keys.indexOf(ch);
        if (find == -1) {
            return false;
        }
        else {
            current = current.next[find];
        }
    }
    if (current.isEnd) {
        return true;
    }
    else {
        return false;
    }
}