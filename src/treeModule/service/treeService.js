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
            //TODO: Handel both inputTree of one root node and an array of root nodes will need to create psuedo root then
            var self = this;
            var _defaultDisplayNodeProperties = {
                    id: '',
                    label: '',
                    parent: '',
                    depth: -1,
                    leaf: true,
                    root: false,
                    selected: false,
                    moveCandidate: false,
                    moveTarget: false,
                    data: {}
                };

            self.buildTree = buildTree;
            self.addSiblingToNode = addSiblingAtIndex;
            self.addChildAtIndex = addChildAtIndex;
            self.addRoot = addRoot;
            self.editNodeAtIndex = editNodeAtIndex;
            self.deleteNodeAtIndex = deleteNodeAtIndex;
            self.displayList = [];

             buildTree(inputTree);

            function buildTree(inputTree) {
                self.displayList = _topologicalSort(inputTree);
            }

            function addSiblingAtIndex(node, index) {
                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.data = node.data;

                self.displayList.splice(index,0,displayNode);
            }

            function addChildAtIndex(node, index) {
                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.data = node.data;

                self.displayList.splice(index + 1,0,displayNode);
            }

            function addRoot(node) {
                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.data = node.data;

                self.displayList.push(displayNode);
            }

            function editNodeAtIndex(node, index) {
                var nodeToEdit = self.displayList[index];

                nodeToEdit.id = node.id;
                nodeToEdit.label = node.label;
                nodeToEdit.data = node.data;
            }

            function deleteNodeAtIndex(index) {
                self.displayList.splice(index, 1);
            }

            function _topologicalSort(node) {
                if(!node) {
                    return [];
                }

                function topSort(curNode, parentId, depth, list) {
                    var displayNode = angular.copy(_defaultDisplayNodeProperties);
                    displayNode.id = curNode.id;
                    displayNode.label = curNode.label;
                    displayNode.parent = parentId;
                    displayNode.depth = depth;

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
