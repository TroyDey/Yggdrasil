(function () {
    'use strict';

    angular.module('yggdrasil.services').factory('treeService', treeService);

    function treeService() {

        return {
            createTree: createTree
        };

        /*inputTree should be
            {
                id:'root',
                label:'root',
                children:[
                    {
                        id:'foo',
                        label:'bar',
                        children:[]
                    }
                ]
            }
        */
        function tree(inputTree) {
            var self = this;

            self.buildTree = buildTree;
            self.displayList = [];

             buildTree(inputTree);

            function buildTree(inputTree) {
                self.displayList = topologicalSort(inputTree);
            }

            function topologicalSort(node) {
                if(!node) {
                    return [];
                }

                function topSort(curNode, parentId, depth, list) {
                    var displayNode = {
                        id: curNode.id,
                        label: curNode.label,
                        parent: parentId,
                        depth: depth
                    }

                    list.push(displayNode);

                    for(var i = 0; i < curNode.children.length; i++) {
                        topSort(curNode.children[i], curNode.id, depth+1, list);
                    }

                    return list;
                }

                return topSort(node, null, 0, []);
            }
        }

        function createTree(inputTree) {
            return new tree(inputTree);
        }
    }
})();
