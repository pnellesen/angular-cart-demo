// Set up myApp
var myApp = angular.module('mobileWebApp', ['ngRoute','ui.bootstrap','ngResource','ngAnimate','LocalStorageModule']);

// Set up the routing needed for each section
myApp.config(['$routeProvider','localStorageServiceProvider', function($routeProvider,localStorageServiceProvider) {
    $routeProvider.
    when('/phones', {
        templateUrl: 'views/phones.html',
        controller: 'PhoneCtrl'
    }).
    when('/plans', {
        templateUrl: 'views/plans.html',
        controller: 'PlansCtrl'
    }).
    when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl'
    }).
    when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
    localStorageServiceProvider.setPrefix('myApp');
}]);

//Set up Shopping Cart service
myApp.service('myAppCart', ['localStorageService', function(localStorageService) {
	return {
		addItemToCart: function(item, cost) {
			var cart = localStorageService.get('cart') || [];
			cart.push({"item":item, "cost":cost});
			localStorageService.set("cart", cart);
		},
		removeItemFromCart: function(item, cartIdx) {
			var cart = localStorageService.get('cart') || [];
			var itemIdx = -1;
			if (cartIdx >= 0) {
				itemIdx = cartIdx;
			} else {
				for (i=0;i<cart.length;i++) {
					if (cart[i].item == item) {
						itemIdx = i;
						break;
					}
				}				
			}
			if (itemIdx > -1) {
				cart.splice(itemIdx,1);
				localStorageService.set("cart",cart);
			}
			return cart;
		},
		checkCartForItem: function(item) {
			var cart = localStorageService.get('cart') || [];
			for (i=0;i<cart.length;i++) {
				if (cart[i].item == item) return true
			}
			return false;
		},
		clearCart: function() {
			console.log("Clear Cart");
			localStorageService.remove("cart");
			return this.getCart();
		},
		getCart: function() {
			return localStorageService.get('cart') || [];
		},
		setCart: function(cart) {
			localStorageService.set("cart",cart);
		}
	};
}]);

//Set up Phone factory to retrieve phone info from file
myApp.factory('phoneFactory', ['$resource', function($resource){
 return $resource(
     'data/phones.json',
     {},
     {
         get: {
             method: 'GET',
             params:{},
             isArray:true
         }
     }
 );
}]);

//Setup service to persist phone and slide data
myApp.service('phoneDataService', function() {
	return {
		phoneDataArray: [],
		phoneSlideInfo: []
	}

});

// Set up plan factory to retrieve plan info from file 
myApp.factory('planFactory', ['$resource', function($resource) {
    return $resource(
        'data/plans.json', {}, {
        get: {
            method: 'GET',
            params: {},
                isArray: true
            }
        }
    );
}]);

//Setup service to persist plan data.
myApp.service('planDataService', function() {
	return {
		planData: []
	}

});

// Setup controllers
myApp.controller('HomeCtrl', ['$scope','phoneFactory','phoneDataService', function($scope, phoneFactory, phoneDataService) {
	console.log('phoneDataArray? %O', phoneDataService.phoneDataArray);

	$scope.interval = 5000; // carousel animation interval
    $scope.noWrapSlides = false;
    $scope.active = 0;
	var currIndex = 0;
	
	$scope.addSlide = function() {
    	var slideIndex = currIndex;
    	if (slideIndex > phoneDataService.phoneDataArray.length - 1) slideIndex = Math.floor(Math.random() * (phoneDataService.phoneDataArray.length));//Grab random slide from deck if we've used all of them already
	    slides.push({
	    	url: phoneDataService.phoneDataArray[slideIndex].url,
	    	img: phoneDataService.phoneDataArray[slideIndex].img,
	    	text: phoneDataService.phoneDataArray[slideIndex].title,
	    	slide_id: phoneDataService.phoneDataArray[slideIndex].id,
	    	slide_index: currIndex++
	    });
	  };
	$scope.popSlideInfo = function() {// Initialize carousel
		for (var i = 0; i < phoneDataService.phoneDataArray.length; i++) {
	    	 $scope.addSlide();
      }
	  phoneDataService.phoneSlideInfo = $scope.slides;
	}
	
	// BEGIN Retrieve phone info from file or phoneDataService service
	if (phoneDataService.phoneDataArray.length == 0) {
		console.log("first run, no phone data - pull from file via phoneFactory and populate data and slides in phoneDataService service");
		var slides = $scope.slides = [];
		phoneFactory.get(function(phoneData) {
			  phoneDataService.phoneDataArray = phoneData;
			  $scope.popSlideInfo();
		});				
	} else if (phoneDataService.phoneSlideInfo.length == 0) {
		console.log("We have phone data, but no slide info - add slides to phoneDataService service");
		var slides = $scope.slides = [];
		$scope.popSlideInfo();	
	} else {
		/* Todo: add code to see if X minutes have passed, if so, do another retrieval */
		
		console.log("We have phone and slide info. Get slides from phoneDataService service.");
		var slides = $scope.slides = phoneDataService.phoneSlideInfo;	
		currIndex = slides.length;
	}
	// END phone info retrieval
	  
	  $scope.randomize = function() {
	    var indexes = generateIndexesArray();
	    assignNewIndexesToSlides(indexes);
	  };
  
	// Randomize logic below

	  function assignNewIndexesToSlides(indexes) {
	    for (var i = 0, l = slides.length; i < l; i++) {
	      slides[i].slide_id = indexes.pop();
	    }
	  }

	  function generateIndexesArray() {
		 
	    var indexes = [];
	    for (var i = 0; i < currIndex; ++i) {
	      indexes[i] = i;
	    }
	    return shuffle(indexes);
	  }

	  // http://stackoverflow.com/questions/962802#962890
	  function shuffle(array) {
	    var tmp, current, top = array.length;
	    
	    if (top) {
	      while (--top) {
	        current = Math.floor(Math.random() * (top + 1));
	        tmp = array[current];
	        array[current] = array[top];
	        array[top] = tmp;
	      }
	    }
	    console.log('shuffling. Array is now: ' + array);
	    return array;
	  }
      console.log('Home controller initialized.'); 
}]);

myApp.controller('PhoneCtrl',['$scope', 'phoneFactory', 'phoneDataService', function($scope, phoneFactory, phoneDataService) {
    console.log('Phone controller initialized');
    console.log("phone info? %O", phoneDataService.phoneDataArray);
    if (phoneDataService.phoneDataArray.length == 0) { 
    	phoneFactory.get(function(phoneData) {
    		phoneDataService.phoneDataArray = phoneData;
    		var phones = $scope.phones = phoneDataService.phoneDataArray;
   			console.log("getting phoneData as phones: %O", phones);
   			
    	});
    }  else {
    	var phones = $scope.phones = phoneDataService.phoneDataArray;

    }
}]);

myApp.controller('PlansCtrl', ['$scope', 'planFactory', 'planDataService', '$document', function($scope, planFactory, planDataService, $document) {
	console.log('Plans controller initialized');
	if (planDataService.planData.length == 0) {
		console.log('No Plan data, getting from file');
		planFactory.get(function(data) {
	        $scope.plans = data;
	        planDataService.planData = data;
	    });		
	} else {
		console.log('Got Plan data, retrieve from service');
		$scope.plans = planDataService.planData
	};
	// May want something here to watch for clicks outside accordion
}]);

myApp.controller('CartCtrl',['$scope', 'myAppCart', function($scope,myAppCart) {
	$scope.cart = myAppCart.getCart();
	console.log('Cart controller initialized. Cart is: %O', $scope.cart);
	$scope.removeItemFromCart = function(item, idx) {
		$scope.cart = myAppCart.removeItemFromCart(item,idx);
	}
	$scope.clearCart = function() {
		$scope.cart = myAppCart.clearCart();
	}
}]);

// Set up directives 
myApp.directive('activeLink', ['$location', function(location) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			console.log("element: %0", element);
			scope.location = location;
			var thisRoute = element[0].hash.substring(2);
			scope.$watch('location.path()', function(newPath, oldPath) {
				console.log("path change: old - " + oldPath + " - new: " + newPath);
				var newRoute = newPath.substring(1);
				if (thisRoute === newRoute) {
					element.parent().addClass("active-item");
				} else {
					element.parent().removeClass("active-item");
				}

			});
			
		}
	};
}]);

myApp.directive('cartButtons', ['myAppCart', function(myAppCart) {
	return {
		templateUrl: 'views/cart-buttons.html',
		transclude: true,
		scope: {
			id: "=id",
			price: "=price"
		},
		restrict: 'AE',
		link: function(scope, element) {
			scope.addItemToCart = function() {
				myAppCart.addItemToCart(scope.id, scope.price);
			}
			scope.checkCartForItem = function() {
		    	return myAppCart.checkCartForItem(scope.id);
		    }
			scope.removeItemFromCart = function() {
			    myAppCart.removeItemFromCart(scope.id);
			}
		}
	};
}]);

//hack to close accordions when clicking outside
//not perfect - next click on an accordion section does nothing, not sure why
// can't seem to flip the is-open variable. Probably need a directive for this
/* 
$(document).on('click',function(){
$('.collapse').collapse('hide');
});
*/