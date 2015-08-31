/* 
    app.js - crowdlines
    contains the main angularjs logic

    Aziz | 18 Aug 2015
 */


//////////////////////////////////////////////////
// Modules & Config
//////////////////////////////////////////////////

// angular modules are basically mini applications 
// please note how "crowdlines" has a dependency named "ui.router"
// please note that we could have used the regular 'ngRoute' module, but
// ui-router is newer and provides more flexibility and features 
// please note the ngRoute us based on URLs whereas ui-router is based on states
var app = angular.module( "crowdlines", [ "ui.router" ] );


// Angular config() function used to setup a home state
app.config
(
    // setup of our 'home' route
    // each state is given ...
    // ... a name (ie 'home'),
    // ... a display URL (ie '/home')
    // ... the actual URL (ie '/home.html')
    // additionally 'otherwise()' is used to describe what happens if the app
    // receives a request for a URL that is not defined
    function( $stateProvider, $urlRouterProvider )
    {
        $stateProvider
        
            // entire list of posts
            .state
            (
                "home",
                {
                    url: "/home",
                    templateUrl: "/home.html",
                    controller: "MainCtrl"
                }
            )

            // individual post page (w/ comments)
            .state
            (
                "posts",
                {
                    // what's within the curley brackets is the dynamic part of the url
                    // also known as the route 'parameter', it can alternatively be written as "/post/:id"
                    url: "/posts/{id}",
                    templateUrl: "/posts.html",
                    controller: 'PostsCtrl'
                }
            );
            

        // other routes (unspecified) will be directed to "home"
        $urlRouterProvider.otherwise( "home" );
    }
);



//////////////////////////////////////////////////
// Services
//////////////////////////////////////////////////

// reusable business logic independent of views

// definition of the posts factory (ie a kind of service)
app.factory
( 
    // factory ID
    "posts",
    function() 
    {
        // please note that we could have simply return posts,
        // however, by creating an object (containing the array) first, it will allow us to add 
        // other properties and methods to this service object, if necessary
        var service = 
        {
            posts: 
            [
                { title: "Post 1", link: "#", upvotes: 5, comments: [] },
                { title: "Post 2", link: "#", upvotes: 2, comments: [] },
                { title: "Post 3", link: "#", upvotes: 5, comments: [] },
                { title: "Post 4", link: "#", upvotes: 9, comments: [] },
                { title: "Post 5", link: "#", upvotes: 4, comments: [] }
            ]
        };
        
        return service;
    }
);



//////////////////////////////////////////////////
// Controllers
//////////////////////////////////////////////////

// the business logic behind views

// definition of the 'MainCtrl' controller, which is referenced within index.html
app.controller
(
    // controller ID
    "MainCtrl", 
    
    // angular helps to wire this with the appropriate factory based on the factory ID 'posts'
    function( $scope, posts )
    {
        // please note that 2-way data-binding only applies to variables bound to the '$scope'
        // so this controller variable is now bound to the service variable
        // as a result any change to the posts object in the view will also affect the 'posts' service object 
        // and automatically beaccessible to other modules using the posts service object
        $scope.posts = posts.posts;
        
        // this variable used to be independent of the service variable,
        // as shown in the commented out code below
//        $scope.posts =
//        [
//            { title: "post 1", link: "#", upvotes: 5 },
//            { title: "post 2", link: "#", upvotes: 2 },
//            { title: "post 3", link: "#", upvotes: 5 },
//            { title: "post 4", link: "#", upvotes: 9 },
//            { title: "post 5", link: "#", upvotes: 4 }
//        ];
        
        
        // everytime 'addPost' is accessed, it will invoke the anonymous function
        // that will cause a new post to be appended to the array
        $scope.addPost = function()
        {   
            // prevent an empty post title from being submitted,
            // please note 'link' on the other hand is NOT compulsary
            if ( !$scope.title || $scope.title === "" )
            {
                return;
            }
            
            // this is to prevent page reloading on empty links
            if ( !$scope.link || $scope.link === "" )
            {
                $scope.link = "#";
            }
            
            // this simple adds a new post with hardcoded values
            // $scope.posts.push( { title: 'A new post!', upvotes: 0 } );
            
            // $scope.title, $scope.link allow the form bounded values to be accessed here
            $scope.posts.push
            ({ 
                title: $scope.title, 
                link: $scope.link, 
                upvotes: 0,
                comments: []
            });
            
            // and this will allow the bound title input to be cleared at this point
            // please note that we have already captured the title above
            $scope.title = "";
            $scope.link = "";
        };
        
        
        // defines the functionality to allow incrementing the upvotes,
        // everytime the 'up arrow' is clicked
        // please note however that instead of 
        // 1. passing back the index number and 
        // 2. traversing the entire array and
        // 3. then finally updating the count
        // we are retrieving a reference directly to the post to be updated
        $scope.upTheVotes = function( post )
        {
            post.upvotes += 1;
        };
    } 
);


/*
// an example of a very basic controller example,
// one which is used without any 'services' and
// directly connects all scope variables with the view
app.controller
( 
    "MainCtrl",
    [
        "$scope",
        
        // the $scope variable acts like a bridge between the view and the controller
        // anything that should be accessible to the view should be binded to the $scope
        function( $scope )
        {
            $scope.test = "salam dunya";
            $scope.posts =
            [
                { title: "post 1", upvotes: 5 },
                { title: "post 2", upvotes: 2 },
                { title: "post 3", upvotes: 15 },
                { title: "post 4", upvotes: 9 },
                { title: "post 5", upvotes: 4 }
            ];
        }
    ]
);*/


// Individual post item controller, that will be directly connected with the 'post (w/ comments)' view
app.controller
(
    "PostsCtrl",
    
    // apart from $scope, we want to be able to access...
    // ... post id using '$stateParams'
    // ... 'posts' factory service object
    function( $scope, $stateParams, posts )
    {
        // for now the post index will be used as the ID
        // and used to grab the appropriate post from the factory service object 
        // and used to newly create a 'post' object within $scope
        // please note that 'posts.posts' here is being wired to the same factory service object
        // as used in the 'MainCtrl'. This is the benefit of using factory service,
        // previously the 'posts' was defined within 'MainCtrl' and non-reusable
        $scope.post = posts.posts[ $stateParams.id ];
        
        // function to handle adding of comment
        $scope.addComment = function()
        {
            // empty comment should not push anything
            if ( !$scope.comment || $scope.comment === "" )
            {
                return;
            }
            
            
            // push the actual comment onto the array of $scope.post.comments
            $scope.post.comments.push
            ({ 
                body: $scope.comment, 
                author: "Joe", 
                upvotes: 0
            });
            
            // to clear field after submission
            $scope.comment = "";
        };
    }
);




//////////////////////////////////////////////////
// Filters
//////////////////////////////////////////////////

// formats the value of expressions for display to user

app.filter
( 
    "capitalise", 
    function()
    {
        return function( text )
        {
            return text.toUpperCase();
        };
    } 
);

