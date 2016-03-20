"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(label, targetNode) {
    _classCallCheck(this, Edge);

    this.label = label === "" ? null : label;
    this.targetNode = targetNode;
};

var Node = function () {
    function Node() {
        var vals = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, Node);

        this.edges = [];

        // vals is the pointer to locations in the actual list
        this.vals = vals;
    }

    _createClass(Node, [{
        key: "isLeaf",
        value: function isLeaf() {
            return this.edges.length === 0;
        }
    }, {
        key: "removeEdge",
        value: function removeEdge(edge) {
            this.edges = this.edges.filter(function (_edge) {
                return _edge.label !== edge.label;
            });
        }
    }, {
        key: "addEdges",
        value: function addEdges(edges) {
            var _this = this;

            edges.forEach(function (edge) {
                _this.addEdge(edge);
            });
        }
    }, {
        key: "addEdge",
        value: function addEdge(edge) {
            this.edges = [].concat(_toConsumableArray(this.edges), [edge]);
            this.vals = this.edges.reduce(function (cache, edge) {
                return [].concat(_toConsumableArray(cache), _toConsumableArray(edge.targetNode.vals));
            }, []);
        }
    }, {
        key: "getEdge",
        value: function getEdge(word) {
            var edges = this.edges.filter(function (edge) {
                return edge.label.indexOf(word) === 0;
            });
            return null ? edges.length === 0 : edges[0];
        }
    }, {
        key: "connect",
        value: function connect(node) {
            this._children = [node].concat(_toConsumableArray(this._children));
        }
    }]);

    return Node;
}();

var RootNode = function (_Node) {
    _inherits(RootNode, _Node);

    function RootNode() {
        _classCallCheck(this, RootNode);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RootNode).apply(this, arguments));
    }

    return RootNode;
}(Node);

var RadixTree = function () {
    function RadixTree() {
        var list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, RadixTree);

        this._list = list;
        this.root = new RootNode();

        // create the tree with the default list
        this.build([].concat(_toConsumableArray(list)));
    }

    _createClass(RadixTree, [{
        key: "build",
        value: function build(list) {
            for (var index in list) {
                var each = list[index];
                this._add(each, index);
            }
        }
    }, {
        key: "insert",
        value: function insert(str) {
            this._list.push(str);
            this._add(str, this._list.length - 1);
        }
    }, {
        key: "_diff",
        value: function _diff(stra, strb) {
            var len_a = stra.length,
                len_b = strb.length;
            var loop_len = len_a < len_b ? len_a : len_b;

            var index = 0;

            for (; index < loop_len; index++) {
                var str_a = stra[index],
                    str_b = strb[index];
                if (str_a !== str_b) {
                    break;
                }
            }
            return index;
        }
    }, {
        key: "_add",
        value: function _add(str, val, parent) {
            var node = parent || this.root;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = node.edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _edge2 = _step.value;

                    var diff_index = this._diff(str, _edge2.label);

                    // there should be at least one match
                    if (diff_index > 0) {

                        // go into the target node if length of the edge label === diff index
                        if (diff_index === _edge2.label.length) {
                            this._add(str.slice(diff_index), val, _edge2.targetNode);
                            return;
                        }

                        // splitting happens here

                        // take the common string as prefix
                        var new_label = _edge2.label.slice(0, diff_index);

                        var edges = [new Edge(_edge2.label.slice(diff_index), _edge2.targetNode), new Edge(str.slice(diff_index), new Node([val]))];

                        var new_node = new Node();
                        new_node.addEdges(edges);

                        node.removeEdge(_edge2);
                        console.log(str, str.slice(0, diff_index), diff_index);
                        node.addEdge(new Edge(str.slice(0, diff_index), new_node));

                        return;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var edge = new Edge(str, new Node([val]));
            node.addEdge(edge);
            return;
        }
    }, {
        key: "find",
        value: function find(prefix, parent) {
            var node = parent || this.root;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = node.edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var edge = _step2.value;


                    if (!edge.label) {
                        return node.vals;
                    }
                    var diff_index = this._diff(prefix, edge.label);

                    if (diff_index > 0 && diff_index <= prefix.length) {
                        return this.find(prefix.slice(diff_index), edge.targetNode);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (node.edges.length === 0) {
                return node.vals;
            }
        }
    }]);

    return RadixTree;
}();