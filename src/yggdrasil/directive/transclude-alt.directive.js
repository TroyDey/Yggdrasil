(function () {
    'use strict';
    
    //This directive is used as a workaround for ng-transclude not working correctly within an ng-repeat
    //https://github.com/angular/angular.js/issues/787#issuecomment-52452225
    angular.module('yggdrasil.directives').directive('transcludeAlt', transcludeAlt);
    
    function transcludeAlt() {
        return {
            link: {
                pre: function (scope, element, attr, ctrl, transclude) {
                    if(transclude) {
                        transclude(scope, function (clone) {
                            element.append(clone);
                        });
                    }
                }
            }
        }
    }
})();