describe('tree.service', function () {
   var sut, tree;

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
                var expectedResult = [{id:'root',label:'root',parent:null,depth:0}];

                expect(sut.createTree(singleNode).displayList).toEqual(expectedResult);
            });

            it('should return a tree with a multiple elements in the display list when the tree contains multiple elements', function () {
                var singleNode = {id:'root',label:'root',children:[
                    {id:'foo',label:'foo',children:[
                        {id:'bar',label:'bar',children:[]}
                        ]},
                    {id:'qux',label:'qux',children:[]}
                ]};
                var expectedResult = [{id:'root',label:'root',parent:null,depth:0},
                                        {id:'foo',label:'foo',parent:'root',depth:1},
                                        {id:'bar',label:'bar',parent:'foo',depth:2},
                                        {id:'qux',label:'qux',parent:'root',depth:1}
                                     ];

                expect(sut.createTree(singleNode).displayList).toEqual(expectedResult);
            });
        });
    });
});
