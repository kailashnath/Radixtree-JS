
var RadixTree = (function() {
    class Edge {
        constructor(label, targetNode) {
            this.label = label === ""? null: label;
            this.targetNode = targetNode;
        }
    }

    class Node {

        constructor(vals = []) {
            this.edges = [];

            // vals is the pointer to locations in the actual list
            this.vals = vals;
        }

        isLeaf() {
            return this.edges.length === 0;
        }

        removeEdge(edge) {
            this.edges = this.edges.filter((_edge) => {
                return _edge.label !== edge.label;
            });
        }

        addEdges(edges) {
            edges.forEach((edge) => {
                this.addEdge(edge);
            });
        }

        addEdge(edge) {
            this.edges = [...this.edges, edge];
            this.vals = this.edges.reduce((cache, edge) => {
                return [...cache, ...edge.targetNode.vals];
            }, []);
        }

        getEdge(word) {
            let edges = this.edges.filter((edge) => {
                return edge.label.indexOf(word) === 0;
            });
            return null? edges.length === 0: edges[0];
        }

        connect(node) {
            this._children = [node, ...this._children];
        }

    }


    class RootNode extends Node {

    }


    class RadixTree {
        constructor(dict = []) {
            // should be of type {'ptrRef': ['token1', 'token2']}
            this._dict = dict;
            this.root = new RootNode();

            // create the tree with the default list
            this.build(dict);
        }

        build(dict) {
            let self = this;
            for(let key in dict) {
                let tokens = dict[key];

                tokens.forEach((token) => {
                    self._add(token, key);
                });
            }
        }


        insert(str) {
            this._list.push(str);
            this._add(str, this._list.length - 1);
        }

        _diff(stra, strb) {
            let len_a = (stra || '').length, len_b = (strb || '').length;
            let loop_len = len_a < len_b? len_a: len_b;

            let index = 0;

            for(; index < loop_len; index++) {
                let str_a = stra[index], str_b = strb[index];
                if (str_a !== str_b) {
                    break;
                }
            }
            return index;

        }

        _add(str, val, parent) {
            let node = parent || this.root;

            for(let edge of node.edges) {
                let diff_index = this._diff(str, edge.label);

                // there should be at least one match
                if (diff_index > 0) {

                    // go into the target node if length of the edge label === diff index
                    if (diff_index === edge.label.length) {
                        this._add(str.slice(diff_index), val, edge.targetNode);
                        return;
                    }

                    // splitting happens here

                    // take the common string as prefix
                    let new_label = edge.label.slice(0, diff_index);

                    let edges = [new Edge(edge.label.slice(diff_index), edge.targetNode),
                                    new Edge(str.slice(diff_index), new Node([val]))]


                    let new_node = new Node();
                    new_node.addEdges(edges);

                    node.removeEdge(edge);
                    node.addEdge(new Edge(str.slice(0, diff_index), new_node));

                    return;
                }
            }

            let edge = new Edge(str, new Node([val]));
            node.addEdge(edge);

            // if the node is a leaf node it means that there is a term which ends at this
            // leaft node, so we add an `empty` edge to indicate it
            if (node.isLeaf()) {
                node.addEdge('', new Node(node.targetNode.vals));
            }
            return;
        }

        find(prefix, parent) {
            let node = parent || this.root;

            // if the node is leaf or the prefix is empty then return all the vals at current node
            if (node.isLeaf() || prefix === "") {
                return node.vals;
            }

            for (let edge of node.edges) {

                let diff_index = this._diff(prefix, edge.label);

                if (diff_index > 0) {
                    return this.find(prefix.slice(diff_index), edge.targetNode);
                }
            }
            return [];
        }
    }

    return RadixTree;
}());

module.exports = RadixTree;
