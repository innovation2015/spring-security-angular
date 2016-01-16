springSecurityAngular.controller('authController', ['$scope' ,'$location','$log' , 'authService', function($scope ,$location ,$log ,authService) {

    $scope.login = function (){
        authService.login($scope.username, $scope.password)
            .then(
                function(){
                    $location.path("/");
                },
                function(data){
                     $log.error("Error While Loging "+ data);
                }
            );
    }

    $scope.logout = function(){
        authService.logout()
            .then(
                function(){
                    $location.path("/login");
                },
                function(data){
                    $log.error("Error While Loging "+ data);
                }
            );;
    }

}]);

springSecurityAngular.controller('homeController', ['$scope' , function($scope) {

}]);

springSecurityAngular.controller('manageUser', ['$scope' ,'userService' , function($scope , userService) {
       $scope.gridOptions = {
           columnDefs: [
               { field: 'id' },
               { field: 'email' },
               { field: 'password'}
           ],
           enableGridMenu: true,

           enableSelectAll: true,

           exporterCsvFilename: 'user.csv',

           exporterPdfDefaultStyle: {fontSize: 9},

           exporterPdfTableStyle: {margin: [30, 30, 30, 30]},

           exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},

           exporterPdfHeader: { text: "Users", style: 'headerStyle' },

           exporterPdfFooter: function ( currentPage, pageCount ) {
               return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
           },
           exporterPdfCustomFormatter: function ( docDefinition ) {
               docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
               docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
               return docDefinition;
           },
           exporterPdfOrientation: 'portrait',
           exporterPdfPageSize: 'LETTER',
           exporterPdfMaxGridWidth: 500,
           exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

           onRegisterApi: function(gridApi){
               $scope.gridApi = gridApi;
           }

       }
        userService.findAllUser()
          .then(
                function(data){
                    $scope.gridOptions.data = data;
                },
                function(data){
                    $log.error("Error While Loging "+ data);
                }
           );
}]);