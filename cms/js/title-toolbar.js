var dir = angular.module('main.directives', []);
dir.directive('titleToolbar', ['$rootScope', function($rootScope) {
	return {
		restrict: 'AE',
		scope: {
			pageTitle: '@titleToolbar',
			toggleLeft: '&menuFunc',
			userInfo: '=',
			logout: '&',
			eventEdition: '=',
			editions: '='
		},
		templateUrl : 'include/title-toolbar.html',
		controller: function ($scope) {
			$scope.changeEdition = function(edition) {
				$rootScope.$broadcast('change.edition', angular.copy(edition));
			};
		}

	}
}]);