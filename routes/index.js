var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET a JSON list of posts */
// using the global mongoose object
// retrieve the registered models 'Post' and 'Comment'
var mongoose = require( 'mongoose' );
var Post = mongoose.model( 'Post' ); 
var Comment = mongoose.model( 'Comment' );

// using the express 'get' method,
// define the route URL and function to handle request
router.get
(
    // route URL definition
    '/posts',
    
    // request handler
    function( req, res, next )
    {
        // query db for all the posts
        Post.find
        (
            function( err, posts )
            {
                // in case of an error
                // pass the error to an error handling function
                if ( err )
                {
                    return next( err );
                }
                
                // otherwise send the retrieved posts back to the client
                res.json( posts );
            }
        );
    }
);


module.exports = router;