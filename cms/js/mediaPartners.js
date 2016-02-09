app.controller('mediaPartnersCtrl', ['$scope', '$rootScope', '$window', 'informService', 'partnerServices', '$mdDialog',
	function ($scope, $rootScope, $window, informService, partnerServices, $mdDialog) {
		'use strict';
		$scope.mediaPartners = null;
		var getMediaPartnersList = function() {
			partnerServices.getMediaPartnersList($scope.event_edition)
			.success(function (data) {
				$scope.mediaPartners = data;
				if ($scope.mediaPartners.length === 0) {
					$scope.showInfo = true;
				} else {
					$scope.showInfo = false;
				}
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o patronach medialnych');
			});
		};

		getMediaPartnersList();
		
		$rootScope.$on('new.media.partner', function () {
			getMediaPartnersList();	
		});

		$rootScope.$on('edit.media.partner', function () {
			getMediaPartnersList();	
		});

		$scope.redirectToWWW = function(www){
            $window.open(www, '_blank');
        };
		
		$scope.removeMediaPartner = function(id, name) {
			var msg = 'Czy usunąć patrona medialnego ' + name + '?';
			$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
				partnerServices.removeMediaPartner(id)
				.success(function () {
					informService.showSimpleToast('Usunięto patrona medialnego ' + name);
					getMediaPartnersList();
				})
				.error(function () {
					informService.showAlert('Błąd','Usuwanie patrona medialnego ' + name + ' nie powiodło się');
				});
			}, function() {
			});
		};

		$scope.clearForm = function() {
			$rootScope.$emit('clear.new.media.partner', '');
		};

		$scope.editMediaPartner = function(partner) {
			$rootScope.$emit('media.partner.to.edit', angular.copy(partner));
			$scope.toggleRight();
		};

	}]);