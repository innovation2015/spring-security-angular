var springSecurityAngular = angular.module('springSecurityAngular', ['ui.router', 'ngResource', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter']);

// ROUTES
springSecurityAngular.config(function ($stateProvider, $httpProvider, $provide ,$urlRouterProvider) {

    $urlRouterProvider.otherwise( '/' );

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeController',
            templateUrl: 'partials/home.html',
            resolve: {
                user: ['$rootScope', 'userService', function ($rootScope, userService) {
                    userService.getLoggedInUserDetails()
                        .then(function (user) {
                            $rootScope.user = user;
                        });
                }]
            },
            data: {pageTitle: 'Home'},
            protected:true
        })
        .state('login', {
            url: '/login',
            controller: 'authController',
            templateUrl: 'partials/login.html',
            data: {pageTitle: 'Login'}

        })
        .state('logout' ,{
            url: '/logout',
            templateUrl: 'partials/login.html',
            controller: 'authController',
            resolve: {
                clear: ['$rootScope' ,'authService' , function($rootScope , authService){
                    authService.logout()
                        .then(function(){
                            delete $rootScope.user;
                        }).catch(function(data){
                        messageService.error("LOGOUT_FAILURE", "We were unable to log you out, please try again.");
                    });
                }]
            },
            data: {pageTitle: 'Login'},
            protected:true
        })
        .state('manageUser' ,{
            url: '/manageUser',
            templateUrl: 'partials/manageUser.html',
            controller: 'manageUser',
            data: {pageTitle: 'Manage User'},
            protected:true
        })
        .state('createUser' ,{
            url : '/createUser',
            templateUrl: 'partials/createUser.html',
            controller: 'createUser',
            data: {pageTitle: 'Create User'},
            protected:true
        })
        .state('forgotPassword', {
            url: '/forgotPassword',
            controller: 'forgotPassword',
            templateUrl: 'partials/forgotPassword.html',
            data: {pageTitle: 'Forgot Password'},
            protected:false
        })
        .state('resetPassword', {
            url: '/resetPassword',
            controller: 'resetPassword',
            templateUrl: 'partials/resetPassword.html',
            data: {pageTitle: 'Reset Password'},
            protected:false
        });

    $httpProvider.interceptors.push(function ($q, $rootScope , messageService ,$injector) {
            return {
                'request': function (request) {
                    messageService.clearError();
                    return request;
                },
                'responseError': function (rejection) {
                    switch (rejection.status) {
                        case 400:
                        {
                            break;
                        }
                        case 401:
                        {
                            $injector.get('$state').go("login");
                            if($rootScope.user){
                                delete $rootScope.user
                            }
                            break;
                        }
                        case 403:
                        {
                            break;
                        }
                        case 500:
                        {
                            break;
                        }
                        default :
                        {
                            messageService.error("UNKNOWN_ERROR", "An error has occurred, please try again.");

                            break;
                        }
                    }
                    return $q.reject(rejection);
                }
            };
        }
    );

    $provide.decorator('$templateRequest', ['$delegate', function ($delegate) {
        var fn = $delegate;
        $delegate = function (tpl) {

            for (var key in fn) {
                $delegate[key] = fn[key];
            }
            return fn.apply(this, [tpl, true]);
        };
        return $delegate;
    }]);

}).run(function ($rootScope ,userService) {
    $rootScope.$on('$stateChangeStart', function(event, next) {
        console.log("next.protected  ",next.protected);
        if (next.protected) {
            if (!$rootScope.user) {
                  userService.getLoggedInUserDetails()
                      .then(function (user) {
                          $rootScope.user = user;
                      });
            }
            console.log("not logged in");
            event.preventDefault();
        }
    });
    $rootScope.hasRole = function (role) {
        if ($rootScope.user === undefined) {
            return false;
        }
        if ($rootScope.user.roles[role] === undefined) {
            return false;
        }
        return $rootScope.user.roles[role];
    };

    $rootScope.isLoggedIn = function () {
        return $rootScope.user !== undefined;
    };




});














