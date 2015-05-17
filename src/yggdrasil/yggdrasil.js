(function () {
    'use strict';

    angular.module('yggdrasil.services', []);
    angular.module('yggdrasil.directives', []);
    angular.module('yggdrasil.controllers', []);

    angular.module('yggdrasil', [
        'yggdrasil.services',
        'yggdrasil.directives',
        'yggdrasil.controllers'
    ]);
})();
