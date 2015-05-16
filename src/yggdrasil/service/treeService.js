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
            //TODO: Handle both inputTree of one root node and an array of root nodes will need to create psuedo root then
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
            self.addSiblingAtIndex = addSiblingAtIndex;
            self.addChildAtIndex = addChildAtIndex;
            self.addRoot = addRoot;
            self.editNodeAtIndex = editNodeAtIndex;
            self.deleteNodeAtIndex = deleteNodeAtIndex;
            self.selectNode = selectNode;
            self.setMoveCandidate = setMoveCandidate;
            self.setMoveTarget = setMoveTarget;
            self.moveNodeToSiblingOfTarget = moveNodeToSiblingOfTarget;
            self.moveNodeToChildOfTarget = moveNodeToChildOfTarget;
            self.displayList = [];

            if (angular.isArray(inputTree)){
                self.displayList = inputTree.reduce(function (previousValue, currentValue, index, array) {
                    return index === 1 ? _topologicalSort(previousValue).concat(_topologicalSort(currentValue))
                        : previousValue.concat(_topologicalSort(currentValue));
                });
            }else if (angular.isObject){
                buildTree(inputTree);
            }



            function buildTree(inputTree) {
                self.displayList = _topologicalSort(inputTree);
            }

            function addSiblingAtIndex(node, index) {
                if (_validMutatorMethodInput(index, node)) {
                    return;
                }

                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.depth = self.displayList[index].depth;
                displayNode.parent = self.displayList[index].parent;
                displayNode.data = node.data;

                self.displayList.splice(index,0,displayNode);
            }

            function addChildAtIndex(node, index) {
                if (_validMutatorMethodInput(index, node)) {
                    return;
                }

                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.depth = self.displayList[index].depth + 1;
                displayNode.parent = self.displayList[index].id;
                displayNode.data = node.data;

                self.displayList.splice(index + 1,0,displayNode);
            }

            function addRoot(node) {
                if (!node.id) {
                    return;
                }

                var displayNode = angular.copy(_defaultDisplayNodeProperties);

                displayNode.id = node.id;
                displayNode.label = node.label;
                displayNode.depth = 0;
                displayNode.parent = null;
                displayNode.data = node.data;

                self.displayList.push(displayNode);
            }

            function editNodeAtIndex(node, index) {
                if (_validMutatorMethodInput(index, node)) {
                    return;
                }

                var nodeToEdit = self.displayList[index];

                nodeToEdit.id = node.id;
                nodeToEdit.label = node.label;
                nodeToEdit.data = node.data;
            }

            function deleteNodeAtIndex(index) {
                if (_validMutatorMethodInput(index)) {
                    return;
                }

                self.displayList.splice(index, 1);
            }

            function selectNode(index) {
                if (_validMutatorMethodInput(index)) {
                    return;
                }

                var oldSelection = self.displayList.find(function (e) { return e.selected; });

                if (oldSelection) {
                    oldSelection.selected = false;
                }

                self.displayList[index].selected = true;
            }

            function setMoveCandidate(index) {
                if (_validMutatorMethodInput(index)) {
                    return;
                }

                var oldSelection = self.displayList.find(function (e) { return e.moveCandidate; });

                if (oldSelection) {
                    oldSelection.moveCandidate = false;
                }

                self.displayList[index].moveCandidate = true;
            }

            function setMoveTarget(index) {
                if (_validMutatorMethodInput(index)) {
                    return;
                }

                var oldSelection = self.displayList.find(function (e) { return e.moveTarget; });

                if (oldSelection) {
                    oldSelection.moveTarget = false;
                }

                self.displayList[index].moveTarget = true;
            }

            function moveNodeToSiblingOfTarget(sourceIndex, targetIndex) {
                if (_validMutatorMethodInput(sourceIndex) || _validMutatorMethodInput(targetIndex)) {
                    return;
                }

                var temp = self.displayList.splice(sourceIndex, 1)[0];
                var target = self.displayList[targetIndex];

                temp.parent = target.parent;
                temp.depth = target.depth;

                self.displayList.splice(targetIndex, 0, temp);
            }

            function moveNodeToChildOfTarget(sourceIndex, targetIndex) {
                if (_validMutatorMethodInput(sourceIndex) || _validMutatorMethodInput(targetIndex)) {
                    return;
                }

                var temp = self.displayList.splice(sourceIndex, 1)[0];
                var target = self.displayList[targetIndex];

                temp.parent = target.id;
                temp.depth = target.depth + 1;

                self.displayList.splice(targetIndex + 1, 0, temp);
            }

            function _validMutatorMethodInput(index, node) {
                return index < 0 || index > self.displayList.length || (node && !node.id)
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
