(function () {
    'use strict';

    angular.module('yggdrasil.directives').directive('tree', tree);

    tree.$inject = [];

    function tree() {
        return {
            restrict: 'E',
            scope: {
                tree: '=',
                indentPixelAmount: '@'
            },
            transclude: true,
            template: '<ul><li id="yggdrasil-{{node.id}}" class="node" ng-class="{selected: node.selected, hidden: node.hidden, collapsed: node.collapsed, leaf: node.leaf, moveCandidate: node.moveCandidate, moveTarget: node.moveTarget, disabled: node.disabled}" ng-hide="node.hidden" ng-repeat="node in treeVm.displayList track by node.id" ng-style="{\'padding-left\':node.depth * treeVm.indentPixelAmount - treeVm.indentPixelAmount + \'px\'}"><div class="node-content" transclude-alt></div></li></ul>',
            controller: treeController,
            controllerAs: 'treeVm',
            bindToController: true
        };
    }

    treeController.$inject = ['$scope', 'treeService'];

    function treeController($scope, treeService) {
        var treeVm = this;

        $scope.$watch('tree', function(newTree){
            treeVm.masterTree = treeService.createTree(treeVm.tree);
            treeVm.displayList = treeVm.masterTree.displayList;
        });
    }

})();
