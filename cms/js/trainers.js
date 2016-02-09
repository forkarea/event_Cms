app.controller('trainersCtrl', ['$scope', '$rootScope', 'trainersService', '$mdDialog', 'informService',
	function ($scope, $rootScope, trainersService, $mdDialog, informService) {
		'use strict';
		$scope.trainers = null;
		$scope.showInfo = false;
		var getTrainersList = function() {
			trainersService.getTrainersList($scope.event_edition)
			.success(function (data) {
				$scope.trainers = data;
				if ($scope.trainers.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			}).
			error(function () {
				informService.showSimpleToast('Błąd pobrania danych o trenerach');
			});
		};
		
		getTrainersList();

		$rootScope.$on('new.trainer', function () {
			getTrainersList();	
		});

		$rootScope.$on('edit.trainer', function () {
			getTrainersList();	
		});
		
		$scope.removeTrainer = function(trainer) {
			var msg = 'Czy usunąć trenera ' + trainer.first_name + ' ' + trainer.last_name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				trainersService.removeTrainer(trainer.id)
				.success(function (data) {
					informService.showSimpleToast('Usunięto trenera ' + trainer.first_name + ' ' + trainer.last_name);
					getTrainersList();
				}
				).error(function (data) {
					informService.showAlert('Błąd', data.message);
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.trainer', '');
		};

		$scope.editTrainer = function(trainer) {
			$rootScope.$emit('trainer.to.edit', angular.copy(trainer));
			$scope.toggleRight();
		};

	}]);