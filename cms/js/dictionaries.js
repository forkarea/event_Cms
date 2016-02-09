app.controller('dictionariesCtrl', ['$scope', '$mdDialog', 'informService', 'settingsServices',
	function ($scope, $mdDialog, informService, settingsServices) {
		'use strict';
		$scope.partnersDict = null;
		$scope.partnerId = -1;
		$scope.partnerEdit = [];
		$scope.mediaPartnersDict = null;
		$scope.mediaPartnerId = -1;
		$scope.mediaPartnerEdit = [];

		var getDictionaries = function() {
			settingsServices.getDictionaries($scope.event_edition)
			.success(function (data) {
				$scope.partnersDict = data.partners;
				$scope.mediaPartnersDict = data.mediaPartners;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych');
			});
		};

		getDictionaries();

		$scope.addToMediaPartner = function() {
			$scope.mediaPartnersDict.push({'id': $scope.mediaPartnerId, 'name': ''});
			$scope.mediaPartnerId--;
		};

		$scope.addToPartner = function() {
			$scope.partnersDict.push({'id': $scope.partnerId, 'name': ''});
			$scope.partnerId--;
		};

		$scope.removeMediaPartner = function(mediaPartner) {
			var index = $scope.mediaPartnersDict.indexOf(mediaPartner);
			$scope.mediaPartnersDict.splice(index, 1);
		};

		$scope.removePartner = function(partner) {
			var index = $scope.partnersDict.indexOf(partner);
			$scope.partnersDict.splice(index, 1);
		};

		$scope.editMediaPartner = function(id) {
			$scope.mediaPartnerEdit.push(id);
		};

		$scope.editPartner = function(id) {
			$scope.partnerEdit.push(id);
		};

		$scope.isEditMediaPartner = function(id) {
			if ($scope.mediaPartnerEdit.indexOf(id.toString()) < 0) {
				return false;
			} else {
				return true;
			}
		};

		$scope.isEditPartner = function(id) {
			if ($scope.partnerEdit.indexOf(id.toString()) < 0) {
				return false;
			} else {
				return true;
			}
		};

		$scope.saveMediaPartnersDictionary = function() {
			var msg = 'Czy zapisać zmiany w słowniku typów patronów medialnych?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				settingsServices.saveMediaPartnersDictionary($scope.event_edition, $scope.mediaPartnersDict)
				.success(function () {
					informService.showSimpleToast('Dane zostały zaktualizowane');
					$scope.mediaPartnerEdit = [];
					getDictionaries();
				})
				.error(function () {
					informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
				});
			}, function() {
			});
		};

		$scope.savePartnersDictionary = function() {
			var msg = 'Czy zapisać zmiany w słowniku typów partnerów?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				settingsServices.savePartnersDictionary($scope.event_edition, $scope.partnersDict)
				.success(function () {
					informService.showSimpleToast('Dane zostały zaktualizowane');
					$scope.partnerEdit = [];
					getDictionaries();
				})
				.error(function () {
					informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
				});
			}, function() {
			});
		};
	}]);
