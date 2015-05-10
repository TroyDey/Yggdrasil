describe('tree.service', function () {
    var sut, tree;
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
                    data: {}
                };

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
                var singleNode = {id:'root',label:'root',children:[]};
                var expectedNode = angular.copy(defaultDisplayNodeProperties);

                expectedNode.id = 'root';
                expectedNode.label = 'root';
                expectedNode.depth = 0;
                expectedNode.parent = null;

                var expectedResult = [expectedNode];

                expect(sut.createTree(singleNode).displayList).toEqual(expectedResult);
            });

            it('should return a tree with a multiple elements in the display list when the tree contains multiple elements', function () {
                var singleNode = {id:'root',label:'root',children:[
                    {id:'foo',label:'foo',children:[
                        {id:'bar',label:'bar',children:[]}
                        ]},
                    {id:'qux',label:'qux',children:[]}
                ]};

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

                var expectedResult = [node1,
                                        node2,
                                        node3,
                                        node4
                                     ];

                expect(sut.createTree(singleNode).displayList).toEqual(expectedResult);
            });
        });
    });
});
