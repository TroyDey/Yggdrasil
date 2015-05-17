(function () {
    'use strict';

    angular.module('yggdrasil.controllers').controller('demoCtrl', demoCtrl);

    demoCtrl.$inject = [];

    function demoCtrl() {
        var demoVm = this;

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

        activate();

        function activate() {
            var multiNode = {id:'root',label:'root',children:[
                    {id:'foo',label:'foo',children:[
                        {id:'bar',label:'bar',children:[]}
                        ]},
                    {id:'qux',label:'qux',children:[]}
                ]};

            demoVm.tree = multiNode;
        }

    }
})();
