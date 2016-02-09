app.controller('newEditionCtrl', ['$scope', '$rootScope', 'editionService', '$mdDialog', 'informService',
	function ($scope, $rootScope, editionService, $mdDialog, informService) {
		'use strict';
		$scope.isEdit = false;
		$scope.myDate = new Date();
		$scope.minDate = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() - 1,
			$scope.myDate.getDate());
		$scope.minDateTo = new Date(
			$scope.myDate.getFullYear(),
			$scope.myDate.getMonth() - 1,
			$scope.myDate.getDate());
		$scope.maxDate = new Date(
			$scope.myDate.getFullYear() + 2,
			$scope.myDate.getMonth(),
			$scope.myDate.getDate());

		$scope.edition = {};

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			}  else {
				return true;
			}
		};

		$rootScope.$on('edition.to.edit', function (event, value) {
			$scope.reset($scope.newEdition);
			$scope.isEdit = true;
			$scope.edition = value;
			$scope.edition.start_date = new Date(value.start_date);
			$scope.edition.stop_date = new Date(value.stop_date);
		});

		$scope.$watch('edition.start_date', function() {
			if (angular.isUndefined($scope.edition.start_date)) {
				$scope.minDateTo = angular.copy($scope.minDate);
			} else {
				$scope.minDateTo = $scope.edition.start_date;
			}
		});

		var isDateInvalid = function() {
			return ($scope.edition.start_date > $scope.edition.stop_date);
		};

		var validateDate = function() {
			if (angular.isDefined($scope.edition.start_date) && angular.isDefined($scope.edition.stop_date)) {
				if (isDateInvalid()) {
					informService.showSimpleToast('Data zakończenia jest wcześniejsza niż data rozpoczęcia');
				}else {
					return true;
				}
			}
		};

		$scope.$watchGroup([
			'edition.start_date', 
			'edition.stop_date'], 
			function() {
				validateDate();
		});
				
		$scope.save = function(form) {
			if (validForm(form) && validateDate()) {
				editionService.addNewEdition($scope.edition)
				.success(function () {
					informService.showSimpleToast('Nowa edycja wydarzenia została dodana');
					$rootScope.$emit('new.edition', '');
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowej edycji wydarzenia');
				});
			}
		};

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla edycji ' + $scope.edition.number + '. ' + $scope.edition.name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					editionService.changeEdition($scope.edition)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');
						$rootScope.$emit('edit.edition', '');
						$scope.close(form);
					})
					.error(function () {
						informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
					});
				}
			}, function() {
			});
		}
		
		$scope.reset = function(form) {
			if (form) {
				$scope.isEdit = false;
				$scope.edition = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.edition', function (event, value) {
			$scope.reset($scope.newEdition);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};
	}]);