/*
 * cuba.js: a micro-framework JavaScript
 * copyright Adrian Statescu 2013 (@thinphp)
 * http://thinkphp.ro
 * MIT License
 */

var cuba = {

    version: 1.00,

    name: 'cuba.js',
 
    select: function( selector ) {
 
            this.value = Array.prototype.slice.call( document.querySelectorAll( selector ) )

         return this
    },

    each: function(arr, fn) {

          var len = arr.length,

              index;

              for(index = 0; index < len; index++) {

                  fn.call(this, arr[ index ], index, arr)
              }

         return arr
    },

    css: function( v ) {

         this.value = this.each.call(this, this.value, function( elem ){

              elem.style.cssText = v 
         })

       return this
    },

    attr: function(a, v) {

         this.value = this.each.call(this, this.value, function( elem ){

              elem.setAttribute(a, v)
         })

       return this  
    },

    html: function( h, text ) {

          var specialTags = /select|fieldset|table|tbody|tfoot|td|tr|colgroup/i,

              method = text ? 

                       document.documentElement === null ? 

                                   'innerText':'innerHTML'

                                    :

                                   'innerHTML';

              typeof h !== 'undefined' ? 

                     this.each.call(this, this.value, function(elem){
                          
                          elem[method] = h
                     })

                     :

                     this.each.call(this, this.value, function(elem){

                          elem[method] = h
                     })

         return this            
 
    },

    addClass: function() {
        //to do
    },

    removeClass: function() {
        //to do
    },

    toggleClass: function() {
       //to do 
    },

    on: function(ev, fn) {

       this.value = this.each.call(this, this.value, function( elem ){

                  if( elem.addEventListener ) {

                     elem.addEventListener(ev, fn, false)

                  } else if( elem.attachEvent ) {

                     elem.attachEvent( 'on' + ev, fn)  

                  } else {

                     elem[ 'on' + ev ] = fn
                  }
       })  

      return this
    },

    stopPropagation: function( e ) {

        if(window.event) {

           window.event.cancelBubble = true
           window.event.returnValue = false 
        }   

        if(e.preventDefault && e.stopPropagation) {

           e.preventDefault()
           e.stopPropagation()  
        }
    },

    ajax: function(method,url,callback,postData) {

                  function handleReadyState(o,callback) { 

                       o.onreadystatechange = function() {

                           if(o.readyState == 4) {

                                 if(o.status == 200) {

                                      callback(o.responseText);

                                 }
                           }
                       }
                  }


                  var XHR = function() {   
                       var http;
                       try {
                             http = new XMLHttpRequest();
                             XHR = function(){return new XMLHttpRequest();}
                           }catch(e) {
                                try {
                                     http = new ActiveXObject("Microsoft.XMLHTTP");
                                     XHR = function(){return new ActiveXObject("Microsoft.XMLHTTP");}
                                    }catch(e){} 
                           }
                      return XHR();
                 };

                 var http = XHR();
                     http.open(method,url,true);

                       if(postData) {
                            //Send the proper header information along with the request
                            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            http.setRequestHeader("Content-length", postData.length);
                            http.setRequestHeader("Connection", "close");
                       }

                       handleReadyState(http,callback);       
                       http.send(postData || null);   
 
              return http;
     },

     script: function(url, callback) {

            var s = document.createElement('script')
                s.setAttribute('type','text/javascript')
                s.setAttribute('src',url)
                s.setAttribute('id','leach')

                if(s.readyState) {

                  s.onreadystatechange = function() {

                     if(s.readyState == 'loaded' || s.readyState == 'complete') {
 
                          s.onreadystatechange = null
                          callback( s )
                          var old = document.getElementById('leach')

                          if( old ) {
                            old.parentNode.removeChild( old ) 
                          } 

                     }
                  }
                
                } else {

                  s.onload = function() {

                    callback( s )
                    var old = document.getElementById('leach')
                        if( old ) {
                            old.parentNode.removeChild( old ) 
                        } 
                  } 
                }

                document.getElementsByTagName("head")[0].appendChild(s);
     },


     ready: function( foo ) {

           var fns = [], fn, f = false, d = document,  

               testEl = d.documentElement, hack = testEl.doScroll,

               domContentLoaded = 'DOMContentLoaded', addEventListener = 'addEventListener',

               attachEvent = 'attachEvent',detachEvent = 'detachEvent',

               readyState = 'readyState', onreadystatechange = 'onreadystatechange',

               loaded = /^loade|c/.test(d[readyState]); 

               function flush() {

                        loaded = 1

                        while( f = fns.shift() ) f()
               }

               d[addEventListener] && d[addEventListener](domContentLoaded, fn = function(){

                     d.removeEventListener(domContentLoaded, fn, f)

                     flush()

               }, f);

               hack && d.attachEvent(onreadystatechange, fn = function(){

                  if(/^c/.test(d[readyState])) { 

                    d[detachEvent](onreadystatechange, fn)

                    flush()
                  }
               });
                
               (function( foo ) {

                      loaded ? foo() : fns.push( foo ) 

               })(foo);
     },

     /**
          A method YQL client for this micro-framework;
          Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across web services.
          With YQL, apps runs faster with fewer lines of codes and smaller network footprint.
          Yahoo! and other sites across the internet make much of their structured data available to developers, primarily through
          Web Services. To access and query these services, developers traditionally endure the pain and location the right URLs and 
          documentation to access and query each Web service.

          i.e: select * from twitter.usertimeline where id='YQL'

          console: http://developer.yahoo.com/yql/console/  

          @param query String - a YQL query;
          @param callback Function - a callback function that receives the result of the query;
          @param format String - the format of the result, by default 'json';
          @param diagnostics Boolean - true or false, by default to false;
          @return - return this, c`est-a-dire this object;
               
      */
     yql: function(query, callback, format, diagnostics) {

          this.query = query;

          this.format = format || 'json';

          this.diagnostics = diagnostics || false;

          this.fetch( callback )

        return this 
     },

     fetch: function( callback ) {

         var scriptEl = document.createElement("script"),

         endpoint = 'http://query.yahooapis.com/v1/public/yql?q=',

         env = '&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',

         encodedURL = encodeURIComponent(this.query),

         format = this.format,

         id = 'YQL' + (+new Date()),

         src = endpoint + encodedURL + '&format='+ format + '&callback=cuba.' + id + '&diagnostics=' + this.diagnostics + env;

         cuba[ id ] = function( data ) {

              //for debug
              if(window.console) console.log( data )
 
              //invoke the callback function to execute
              callback( data ) 

              //delete from memory
              delete cuba[ id ]

              //delete script node
              document.body.removeChild( scriptEl )
         }

         //set type attribute
         scriptEl.setAttribute('type', 'text/javascript')

         //set src attribute
         scriptEl.setAttribute('src', src)

         //append to body dom
         document.body.appendChild( scriptEl ) 

       return this 
    }
};

