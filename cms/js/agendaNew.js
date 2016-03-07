app.controller('agendaNewCtrl', ['$scope', '$rootScope', 'agendaService', 'informService', '$mdDialog', 'trainersService',
	function ($scope, $rootScope, agendaService, informService, $mdDialog, trainersService) {
		'use strict';
		$scope.element = {};
		$scope.isEdit = false;
		$scope.event_start_date = new Date($scope.event_edition_start_date);
		$scope.event_stop_date = new Date($scope.event_edition_stop_date);
		$scope.minDate = new Date(
			$scope.event_start_date.getFullYear(),
			$scope.event_start_date.getMonth(),
			$scope.event_start_date.getDate());
		$scope.minDateTo = new Date(
			$scope.event_start_date.getFullYear(),
			$scope.event_start_date.getMonth(),
			$scope.event_start_date.getDate());
		$scope.maxDate = new Date(
			$scope.event_stop_date.getFullYear(),
			$scope.event_stop_date.getMonth(),
			$scope.event_stop_date.getDate());

		$scope.trainers = [];

		$scope.paths = [{id: 1, name: 'Poziom 1'}, {id: 2, name: 'Poziom 2'}, {id: 3, name: 'Wszystkie'}];
		
		var init = function() {
			trainersService.getTrainersShortList($scope.event_edition)
			.success(function (data) {
				$scope.trainers = data;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o trenerach');
			});
		};

		init();

		$scope.$watch('element.start_date', function() {
			if (angular.isUndefined($scope.element.start_date)) {
				$scope.minDateTo = angular.copy($scope.minDate);
			} else {
				$scope.minDateTo = $scope.element.start_date;
			}
		});

		var isDateInvalid = function() {
			var startDate = new Date($scope.element.start_date);
			var startTime = new Date($scope.element.start_time);
			startDate.setHours(startTime.getHours());
			startDate.setMinutes(startTime.getMinutes());
			var stopDate = new Date($scope.element.stop_date);
			var stopTime = new Date($scope.element.stop_time);
			stopDate.setHours(stopTime.getHours());
			stopDate.setMinutes(stopTime.getMinutes());
			return (startDate >= stopDate);
		};

		var validateDate = function() {
			if (angular.isDefined($scope.element.start_date) && angular.isDefined($scope.element.start_time)
				&& angular.isDefined($scope.element.stop_date) && angular.isDefined($scope.element.stop_time)) {
				if (isDateInvalid()) {
					informService.showSimpleToast('Data zakończenia jest wcześniejsza niż data rozpoczęcia');
				}
			}
		};

		var setToEdit = function(value) {
			$scope.element = angular.copy(value);
			$scope.element.start_date = new Date(value.start_date);
			$scope.element.start_time = new Date('1970-01-01 ' + value.start_time);
			$scope.element.stop_date = new Date(value.stop_date);
			$scope.element.stop_time = new Date('1970-01-01 ' + value.stop_time);
			$scope.minDateTo = $scope.element.start_date;
		}

		$rootScope.$on('agenda.to.edit', function (event, value) {
			$scope.reset($scope.newAgendaElem);
			setToEdit(value);
			$scope.isEdit = true;
		});

		$scope.$watchGroup([
			'element.start_date', 
			'element.stop_date',
			'element.start_time',
			'element.stop_time'], 
			function() {
				validateDate();
		});

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			} else if (isDateInvalid()) {
				informService.showAlert('Błąd', 'Data zakończenia jest wcześniejsza niż data rozpoczęcia');
				return false;
			} else {
				return true;
			}
		}
		
		$scope.save = function(form) {
			if (validForm(form)) {
				agendaService.addNewAgenda($scope.event_edition, $scope.element)
				.success(function () {
					informService.showSimpleToast('Nowa pozycja agendy została dodana');
					$rootScope.$emit('new.agenda', 'new');
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowej pozycji agendy');
				});
			}
		};

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla elementu agendy ' + $scope.element.name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					agendaService.changeAgenda($scope.element)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');
						$rootScope.$emit('edit.agenda', '');
						$scope.close(form);
					})
					.error(function () {
						informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
					});
				}
			}, function() {
			});
		};

		$scope.reset = function(form) {
			if (form) {
				$scope.isEdit = false;
				$scope.element = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.agenda', function (event, value) {
			$scope.reset($scope.newAgendaElem);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};
	}]);