app.controller('partnerNewCtrl', ['$scope', '$rootScope', '$window', 'Upload', '$timeout', 'informService', '$mdDialog', 'partnerServices',
	function ($scope, $rootScope, $window, Upload, $timeout, informService, $mdDialog, partnerServices) { 
		'use strict';
		$scope.partner = {};
		$scope.partnerDictionary = null;
		$scope.progress = 0;

		var getPartnerDictionary = function() {
			partnerServices.getPartnerDictionary($scope.event_edition)
			.success(function (data) {
				$scope.partnerDictionary = data;
			})
			.	error(function () {
				informService.showSimpleToast('Błąd pobrania słownika typów partnerów');
			});
		};
		
		getPartnerDictionary();
		
		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			}  else {
				return true;
			}
		};

		var setToEdit = function(value) {
			$scope.partner = value;
		};

		$rootScope.$on('partner.to.edit', function (event, value) {
			setToEdit(value);
		});

		$scope.isEdit = function() {
			if (angular.isDefined($scope.partner)) {
				if (angular.isDefined($scope.partner.id)) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		};
		
		$scope.save = function(form) {
			if ($scope.partnerDictionary.length === 0) {
				informService.showAlert('Błąd', 'Dodaj typy partnerów w zakładce Słowniki');
			} else if (validForm(form)) {
				partnerServices.addNewPartner($scope.event_edition, $scope.partner)
				.success(function (data) {
					$scope.partner.id = data.partner_id;
					informService.showSimpleToast('Nowy partner został dodany');
					if (!angular.isString($scope.partner.logo) && angular.isDefined($scope.partner.logo) && $scope.partner.logo !== null) {
						$scope.uploadLogo($scope.partner.logo, form);
					} else {
						$rootScope.$emit('new.partner', '');
					}
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowego partnera');
				});
			}
		};

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla partnera ' + $scope.partner.name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					partnerServices.changePartner($scope.partner)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');
						if (!angular.isString($scope.partner.logo) && $scope.partner.logo !== null) {
							$scope.uploadLogo($scope.partner.logo, form);
						} else {
							$rootScope.$emit('edit.partner', '');
						}						
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
				$scope.progress = 0;
				$scope.partner = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.partner', function (event, value) {
			$scope.reset($scope.newPartner);
		});

		$scope.close = function(form) {	
			$scope.reset(form);
			$scope.closeRight();
		};

		$scope.uploadLogo = function(file, form) {
			file.upload = Upload.upload({
				url: 'uploadPartnerLogo',
				file: file,
				fields: {
					username: localStorage.getItem('Username'),
					session_id: localStorage.getItem('SessionID'),
					partner_id: $scope.partner.id,
					edition: $scope.event_edition
				},
			});

			file.upload.then(function (response) {
				$timeout(function () {
					$rootScope.$emit('edit.partner', '');
				});
			}, function (response) {
				if (response.status === 306) {
					informService.showSimpleToast('Logo nie zostało zapisane. ' +
						response.data.error);
				} else {
					informService.showSimpleToast('Logo nie zostało zapisane.');
				}
			}, function (evt) {
				$scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		};
	}]);