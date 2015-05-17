describe('tree.service', function () {
    var sut, tree, multiNodeExpectedResult;

    var defaultDisplayNodeProperties = {
                    id: '',
                    label: '',
                    parent: '',
                    depth: -1,
                    leaf: true,
                    root: false,
                    selected: false,
                    moveCandidate: false,
                    moveTarget: false,
                    disabled: false,
                    hidden: false,
                    collapsed: false,
                    data: {}
                };

    var singleNode = {id:'root',label:'root',children:[]};

    var multiNode = {id:'root',label:'root',children:[
                    {id:'foo',label:'foo',children:[
                        {id:'bar',label:'bar',children:[]}
                        ]},
                    {id:'qux',label:'qux',children:[]}
                ]};

    function _provide(callback) {
        module(function ($provide) {
            callback($provide);
        });
    }

    function _inject() {
        inject(function (treeService) {
           sut = treeService;
        });
    }

    function _setup() {
        //Mock any expected data
        //_provide(function(provide) {
            //provide.value('myVal', {});
        //})

        //Inject the code under test
        _inject();
    }

    beforeEach(function () {
        module('yggdrasil.services');

        var node1 = angular.copy(defaultDisplayNodeProperties);

        node1.id = 'root';
        node1.label = 'root';
        node1.depth = 0;
        node1.parent = null;

        var node2 = angular.copy(defaultDisplayNodeProperties);

        node2.id = 'foo';
        node2.label = 'foo';
        node2.depth = 1;
        node2.parent = 'root';

        var node3 = angular.copy(defaultDisplayNodeProperties);

        node3.id = 'bar';
        node3.label = 'bar';
        node3.depth = 2;
        node3.parent = 'foo';

        var node4 = angular.copy(defaultDisplayNodeProperties);

        node4.id = 'qux';
        node4.label = 'qux';
        node4.depth = 1;
        node4.parent = 'root';

        multiNodeExpectedResult = [node1,
                                node2,
                                node3,
                                node4
                             ];
    });

    describe('the tree service', function () {
        beforeEach(function () {
           //Inject with expected values
            _setup();
        });

        it('should exist', function () {
            expect(sut).not.toBe(null);
        });

        it('should provide a createTree method', function () {
           expect(sut.createTree).toBeDefined();
        });

        describe('createTree', function () {
            it('should return a tree with an empty display list when the input is undefined', function () {
              expect(sut.createTree(undefined).displayList).toEqual([]);
            });

            it('should return a tree with a single element in the display list when the tree is a single node', function () {
                var expectedNode = angular.copy(defaultDisplayNodeProperties);

                expectedNode.id = 'root';
                expectedNode.label = 'root';
                expectedNode.depth = 0;
                expectedNode.parent = null;

                var expectedResult = [expectedNode];

                expect(sut.createTree(singleNode).displayList).toEqual(expectedResult);
            });

            it('should return a tree with a multiple elements in the display list when the tree contains multiple elements', function () {
                expect(sut.createTree(multiNode).displayList).toEqual(multiNodeExpectedResult);
            });

            it('should create a display list with multiple level 0 nodes if the inputTree is an array', function () {
                var multiRootTree = [];
                for(var i = 0; i < 5; i++){
                    var clone = angular.copy(multiNode);
                    clone.id = clone.id + i;
                    multiRootTree.push(clone);
                }

                var displayList = sut.createTree(multiRootTree).displayList;
                expect(displayList.length).toBe(20);
            });
        });

        describe('addSiblingAtIndex', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);
                tree.addSiblingAtIndex({ id: 'added', label: 'added', children: [], data: {} }, -1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should not modify the display list if the node to add does not have an id', function () {
                var tree = sut.createTree(multiNode);
                tree.addSiblingAtIndex({ id: undefined, label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should add the new node as a sibling of the node at the specified index', function () {
                var tree = sut.createTree(multiNode);

                var expectedNode = angular.copy(defaultDisplayNodeProperties);

                expectedNode.id = 'added';
                expectedNode.label = 'added';
                expectedNode.depth = 1;
                expectedNode.parent = 'root';

                tree.addSiblingAtIndex({ id: 'added', label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList[1]).toEqual(expectedNode);
            });
        });

        describe('addChildAtIndex', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);
                tree.addChildAtIndex({ id: 'added', label: 'added', children: [], data: {} }, -1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should not modify the display list if the node to add does not have an id', function () {
                var tree = sut.createTree(multiNode);
                tree.addChildAtIndex({ id: undefined, label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should add the new node as a child of the node at the specified index', function () {
                var tree = sut.createTree(multiNode);

                var expectedNode = angular.copy(defaultDisplayNodeProperties);

                expectedNode.id = 'added';
                expectedNode.label = 'added';
                expectedNode.depth = 2;
                expectedNode.parent = 'foo';

                tree.addChildAtIndex({ id: 'added', label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList[2]).toEqual(expectedNode);
            });
        });

        describe('addRoot', function () {
            it('should not modify the display list if the node to add does not have an id', function () {
                var tree = sut.createTree(multiNode);
                tree.addRoot({ id: undefined, label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should add the new node as a root node', function () {
                var tree = sut.createTree(multiNode);

                var expectedNode = angular.copy(defaultDisplayNodeProperties);

                expectedNode.id = 'added';
                expectedNode.label = 'added';
                expectedNode.depth = 0;
                expectedNode.parent = null;

                tree.addRoot({ id: 'added', label: 'added', children: [], data: {} });

                expect(tree.displayList[4]).toEqual(expectedNode);
                expect(tree.displayList[4].depth).toEqual(0);
            });
        });

        describe('editNodeAtIndex', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);
                tree.addChildAtIndex({ id: 'added', label: 'added', children: [], data: {} }, -1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should not modify the display list if the node to add does not have an id', function () {
                var tree = sut.createTree(multiNode);
                tree.addChildAtIndex({ id: undefined, label: 'added', children: [], data: {} }, 1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should update the node at the specified index', function () {
                var tree = sut.createTree(multiNode);

                var expectedNode = multiNodeExpectedResult[1];

                expectedNode.label = 'edited';

                tree.editNodeAtIndex(expectedNode, 1);

                expect(tree.displayList[1]).toEqual(expectedNode);
            });
        });

        describe('deleteNodeAtIndex', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);
                tree.addChildAtIndex({ id: 'added', label: 'added', children: [], data: {} }, -1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should remove the node at the specified index', function () {
                var tree = sut.createTree(multiNode);

                tree.deleteNodeAtIndex(1);

                expect(tree.displayList.length).toEqual(multiNodeExpectedResult.length - 1);
                expect(tree.displayList.some(function (e) { return e.id === 'foo'; })).toBeFalsy();
            });
        });

        describe('selectNode', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);
                tree.selectNode(-1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should select the node at the specified index', function () {
                var tree = sut.createTree(multiNode);

                tree.selectNode(1);

                expect(tree.displayList[1].selected).toBeTruthy();
            });

            it('should set selected to false for the previously selected node', function () {
                var tree = sut.createTree(multiNode);

                tree.selectNode(1);
                tree.selectNode(2);

                expect(tree.displayList[1].selected).toBeFalsy();
            });
        });

        describe('setMoveCandidate', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveCandidate(-1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should set the node at the specified index as the move candidate', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveCandidate(1);

                expect(tree.displayList[1].moveCandidate).toBeTruthy();
            });

            it('should set move candidate to false for the previously selected node', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveCandidate(1);
                tree.setMoveCandidate(2);

                expect(tree.displayList[1].moveCandidate).toBeFalsy();
            });
        });

        describe('setMoveTarget', function () {
            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveCandidate(-1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should set the node at the specified index as the move target', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveTarget(1);

                expect(tree.displayList[1].moveTarget).toBeTruthy();
            });

            it('should set move target to false for the previously selected node', function () {
                var tree = sut.createTree(multiNode);

                tree.setMoveTarget(1);
                tree.setMoveTarget(2);

                expect(tree.displayList[1].moveTarget).toBeFalsy();
            });
        });

        describe('moveNodeToChildOfTarget', function () {

            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToChildOfTarget(-1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should move the source node to be a child of the target', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToChildOfTarget(3, 1);

                expect(tree.displayList[2].id).toBe('qux');
            });

            it('should move the source node should have the proper depth', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToChildOfTarget(3, 1);

                expect(tree.displayList[2].depth).toBe(2);
            });
        });

        describe('moveNodeToSiblingOfTarget', function () {

            it('should not modify the display list if the index is invalid', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToSiblingOfTarget(-1);

                expect(tree.displayList).toEqual(multiNodeExpectedResult);
            });

            it('should move the source node to be a sibling of the target', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToSiblingOfTarget(3, 1);

                expect(tree.displayList[1].id).toBe('qux');
            });

            it('should move the source node should have the proper depth', function () {
                var tree = sut.createTree(multiNode);

                tree.moveNodeToSiblingOfTarget(3, 1);

                expect(tree.displayList[1].depth).toBe(1);
            });
        });
    });
});
