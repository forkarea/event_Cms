app.controller('partnersCtrl', ['$scope', '$rootScope', '$window', 'informService', 'partnerServices', '$mdDialog',
	function ($scope, $rootScope, $window, informService, partnerServices, $mdDialog) {
		'use strict';
		$scope.partners = null;
		var getPartnerList = function() {
			partnerServices.getPartnersList($scope.event_edition)
			.success(function (data) {
				$scope.partners = data;
				if ($scope.partners.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o partnerach');
			});
		};

		getPartnerList();
		
		$rootScope.$on('new.partner', function () {
			getPartnerList();	
		});

		$rootScope.$on('edit.partner', function () {
			getPartnerList();	
		});

		$scope.redirectToWWW = function(www){
            $window.open(www, '_blank');
        };
		
		$scope.removePartner = function(id, name) {
			var msg = 'Czy usunąć partnera ' + name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				partnerServices.removePartner(id)
				.success(function () {
					informService.showSimpleToast('Usunięto partnera ' + name);
					getPartnerList();
				})
				.error(function () {
					informService.showAlert('Błąd','Usuwanie partnera ' + name + ' nie powiodło się');
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.partner', '');
		};

		$scope.editPartner = function(partner) {
			$rootScope.$emit('partner.to.edit', angular.copy(partner));
			$scope.toggleRight();
		};

	}]);