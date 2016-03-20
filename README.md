# Radixtree-JS

This is an implementation of the standard Radix tree with small changes to improve the performance speed while read. This was written to 
handle the suggestion results in the UI.

In this implementation every leaf node stores a reference to the value mentioned in the input.

For ex:
var tree = new RadixTree({1: ['radix', 'tree', 'js', 'trie'], 2: ['tree', 'python', 'radix', 'trie'], 3: ['tree', 'datastructure']});

The input here is a dictionary with keys representing the reference to a position in the actual data and it's values are the tokens which
we use to build our tree.

A small improvement which we have added to our radix tree is every ndoe holds the list of references which all it's children poin to.
In our example: The node at the edge of 'tr' would hold `references = [1, 2, 3]` and the nodes at the edges 'ee' and 'ie' would hold 
`references = [1, 2, 3]` and `references = [1, 2]` respectively.

With this approach the program does not need to traverse all the way to the leaf node to find out what are the matches, works extremely 
well when you would want to implement typeahead suggestion in the UI.
