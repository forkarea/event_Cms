app.controller('editionCtrl', ['$scope', '$rootScope', 'editionService', 'informService',
	function ($scope, $rootScope, editionService, informService) {
		'use strict';
		$scope.editionsList = null;

		var getEditionsList = function() {
			editionService.getEditionsList()
			.success(function (data) {
				$scope.editionsList = data;
				if ($scope.editionsList.length == 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o edycjach wydarzenia');
			});
		};

		getEditionsList();

		$rootScope.$on('new.edition', function () {
			getEditionsList();	
		});

		$rootScope.$on('edit.edition', function () {
			getEditionsList();	
		});

		$scope.setEditionVisibility = function(edition) {
				editionService.setEditionVisibility(edition)
				.success(function () {
					getEditionsList();
				})
				.error(function () {
					informService.showSimpleToast('Błąd zapisu zmiana widoczności');
				});
		};

		$scope.editEditions = function(edition) {
			$rootScope.$emit('edition.to.edit', angular.copy(edition));
			$scope.toggleRight();
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.edition', '');
		};

	}]);