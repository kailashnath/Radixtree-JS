'use strict';

var Tree = require('./tree.js');

var data = { 1: ['hello', 'hat'], 2: ['have'] };

var tree = new Tree(data);
console.log(tree.find('have'));