var express = require('express');
var router = express.Router();

// using the global mongoose object
// retrieve the registered models 'Post' and 'Comment'
var mongoose = require( 'mongoose' );
var Post = mongoose.model( 'Post' ); 
var Comment = mongoose.model( 'Comment' );


/* GET home page. */
router.get
(
    '/', 
    function( req, res, next )
    {
        res.render
        (
            'index', 
            { 
                title: 'Express' 
            }
        );
    }
);


/* GET a JSON list of posts */
// using the express 'get' method,
// define the route URL and function to handle request
router.get( '/posts', function( req, res, next )
{
    // query db for all the posts
    Post.find( function( err, posts )
    {
        // in case of an error
        // pass the error to an error handling function
        if ( err )
        {
            return next( err );
        }

        // otherwise send the retrieved posts back to the client
        res.json( posts );
    });
});


/*  POST (i.e. create) a new post object */
// please note that this router.post is to do with GET/POST not crowlines 'post' 
// so basically when POST has request URL '/posts', create a new object and save to db
router.post( '/posts', function( req, res, next )
{
    // creating new post object in memory
    var post = new Post( req.body );

    // and then saving it to the db
    post.save( function( err, post )
    {
        if ( err )
        {
            return next( err );
        }

        // please note that although it is not completely necessary to 
        // return a JSON representation of the model back to the client
        // it is usually a good practice and can help to show success
        res.json( post );
    });
});


module.exports = router;