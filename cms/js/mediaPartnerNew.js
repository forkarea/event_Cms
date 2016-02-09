app.controller('mediaPartnerNewCtrl', ['$scope', '$rootScope', '$window', 'informService', 'partnerServices', '$mdDialog', 'Upload', '$timeout',
	function ($scope, $rootScope, $window, informService, partnerServices, $mdDialog, Upload, $timeout) {
		'use strict';
		$scope.isEdit = false;
		$scope.mediaPartner = {};
		$scope.mediaPartnerDictionary = null;
		$scope.progress = 0;

		var getMediaPartnerDictionary = function() {
			partnerServices.getMediaPartnerDictionary($scope.event_edition)
			.success(function (data) {
				$scope.mediaPartnerDictionary = data;
			})
			.	error(function () {
				informService.showSimpleToast('Błąd pobrania słownika typów patronów medialnych');
			});
		};
		getMediaPartnerDictionary();
		
		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			}  else {
				return true;
			}
		}

		$rootScope.$on('media.partner.to.edit', function (event, value) {
			$scope.reset($scope.newMediaPartner);
			$scope.isEdit = true;
			$scope.mediaPartner = value;
		});

		
        $scope.save = function(form) {
        	if ($scope.mediaPartnerDictionary.length === 0) {
				informService.showAlert('Błąd', 'Dodaj typy patronów w zakładce Słowniki');
			} else if (validForm(form)) {
				partnerServices.addNewMediaPartner($scope.event_edition, $scope.mediaPartner)
				.success(function (data) {
					$scope.mediaPartner.id = data.partner_id;
					informService.showSimpleToast('Nowy patron medialny został dodany');
					if (!angular.isString($scope.mediaPartner.logo) && angular.isDefined($scope.mediaPartner.logo) && $scope.mediaPartner.logo !== null) {
						$scope.uploadLogo($scope.mediaPartner.logo, form);
					} else {
						$rootScope.$emit('new.media.partner', '');
					}
					$scope.close(form);
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie dodano nowego patrona medialnego');
				});
			}
		};

		$scope.saveChanges = function(form) {
			var msg = 'Czy zapisać zmiany dla patrona medialnego ' + $scope.mediaPartner.name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				if (validForm(form)) {
					partnerServices.changeMediaPartner($scope.mediaPartner)
					.success(function () {
						informService.showSimpleToast('Dane zostały zaktualizowane');						
						if (!angular.isString($scope.mediaPartner.logo) && angular.isDefined($scope.mediaPartner.logo) && $scope.mediaPartner.logo !== null) {
							$scope.uploadLogo($scope.mediaPartner.logo, form);
						} else {
							$rootScope.$emit('edit.media.partner', '');
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
				$scope.isEdit = false;
				$scope.progress = 0;
				$scope.mediaPartner = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.media.partner', function (event, value) {
			$scope.reset($scope.newMediaPartner);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};
		
		$scope.uploadLogo = function(file, form) {
			file.upload = Upload.upload({
				url: 'uploadMediaPartnerLogo',
				file: file,
				fields: {
					username: localStorage.getItem('Username'),
					session_id: localStorage.getItem('SessionID'),
					partner_id: $scope.mediaPartner.id,
					edition: $scope.event_edition
				},
			});

			file.upload.then(function (response) {
				$timeout(function () {
					$rootScope.$emit('edit.media.partner', '');
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