app.controller('agendaCtrl', ['$scope', '$rootScope', 'agendaService', '$mdDialog','informService',
	function ($scope, $rootScope, agendaService, $mdDialog, informService) {
		'use strict';
		$scope.agenda = null;
		var getAgendaList = function() {
			agendaService.getAgendasList($scope.event_edition)
			.success(function (data) {
				$scope.agenda = data;
				if ($scope.agenda.length == 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			})
			.	error(function () {
				informService.showSimpleToast('Błąd pobrania danych o agendach');
			});
		};

		getAgendaList();
			
		$rootScope.$on('new.agenda', function () {
			getAgendaList();	
		});

		$rootScope.$on('edit.agenda', function () {
			getAgendaList();	
		});

		$scope.removeAgenda = function(id, name) {
			var msg = 'Czy usunąć z agendy element ' + name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				agendaService.removeAgenda(id)
				.success(function () {
					informService.showSimpleToast('Usunięto element ' + name);
					getAgendaList();
				})
				.error(function () {
					informService.showAlert('Błąd','Usuwanie elementu nie powiodło się');
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.agenda', '');
		};

		$scope.editAgenda = function(element) {
			$rootScope.$emit('agenda.to.edit', angular.copy(element));
			$scope.toggleRight();
		};
	}]);
