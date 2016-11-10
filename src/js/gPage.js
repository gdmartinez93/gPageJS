/*
 * gPages - jQuery Plugin
 * version: 1.0
 * @requires jQuery
 *
 * Examples at http://lab.veno.it/venobox/
 * License: MIT License
 * License URI: https://github.com/gdmartinez93/gPageJS/blob/master/LICENSE
 * Copyright 2015-2016 Gabriel David Martinez - @nicolafranchini
 *
 */
(function($){
  $.fn.extend({
    //plugin name - venobox
    gPages: function(options) {
      var loaders = {
          gear: 'gear.svg',
          spin: 'spin.svg',
          ellipsis: 'ellipsis.svg',
          ring: 'ring.svg'
      };

      if( options.loader ){
          if( loaders[options.loader] ){
              options.loader = '../assets/'+ loaders[options.loader];
          }
      }

      // default options
      var defaults = {
          item: '',
          itemPerPage: 10,
          prevText: 'back',
          nextText: 'next',
          loader: '../assets/ring.svg'
      };

      var options = $.extend(defaults, options);

      return this.each(function() {
        var obj = $(this),
            $paginator;

        obj.addClass('gPages');
        createPaginator( obj, options );

        var $paginator = obj.find('.gPaginator'),
            totalItems = obj.find(options.item).length,
            totalPages = Math.ceil( totalItems / options.itemPerPage ),
            $items = obj.find(options.item),
            $itemsForInclude = $items;

        // Create pages and append items
        for( var i = 0; i < totalPages; i++ ){
          $( '<div class="gPage"></div>' ).insertBefore( $paginator );

          if( i + 1 == totalPages ){
              obj.find('.gPage').last().append( $itemsForInclude );
          }
          else{
              var startPoint = 0;
              var endPoint = options.itemPerPage;

              var itemsToInclude = $itemsForInclude.splice(startPoint, endPoint);

              obj.find('.gPage').last().append( itemsToInclude );
          }

          $( '<li class="page"><a href="#page-'+ ( i + 1 ) +'">'+ ( i + 1 ) +'</a></li>' ).insertBefore( $paginator.children().last() );
        }

        if( window.location.hash ){
            var pageActive = Number( window.location.hash.split('page-')[1] );

            obj.find('.gPage')
                .eq( pageActive - 1 )
                .addClass('active');

            $paginator
                .children( '.page' )
                .removeClass( 'active' )
                .eq( pageActive - 1 )
                .addClass( 'active' );

            if( pageActive == 1 ){
                $paginator.find('.page_prev').addClass('disabled');
            }
            else if( pageActive == totalPages ){
                $paginator.find('.page_next').addClass('disabled');
            }
        }
        else{
            obj.find('.gPage')
                .removeClass('active')
                .first().addClass('active');

            $paginator
                .children( '.page' )
                .removeClass('active')
                .first().addClass('active');

            $paginator.find('page_prev').addClass('disabled');
        }

        $paginator.children(':not(".page")').on('click', function( event ){
            if( $(this).hasClass('disabled') ) { return; }

            event.preventDefault();
            event.stopPropagation();

            var pageActive = $paginator.find('.page.active');

            if( $(this).hasClass('page_prev') ){
                if( pageActive.prev().hasClass('page') ){
                    pageActive.prev().click();
                    $paginator.find('.page_next').removeClass('disabled');

                    if( !$paginator.find('.page.active').prev().hasClass('page') ){
                        $(this).addClass('disabled');
                    }
                }
            }
            else{
                if( pageActive.next().hasClass('page') ){
                    pageActive.next().click();
                    $paginator.find('.page_prev').removeClass('disabled');

                    if( !$paginator.find('.page.active').next().hasClass('page') ){
                        $(this).addClass('disabled');
                    }
                }
            }
        });

        $paginator.children('.page').on('click', function( event ){
            //event.preventDefault();
            //event.stopPropagation();

            if( $(this).hasClass('active') ) { return; }

            $(this)
                .addClass('active')
                .siblings().removeClass('active');

            obj.find('.gPage')
                .removeClass('active')
                .eq( $(this).index() -1 )
                .addClass('active');
        });
      });
    }
  });

  /* -------- CREATE PAGINATOR -------- */
  function createPaginator( elem, options ){
    elem.append($('<ul class="gPaginator"></ul>'));
    var $paginator = elem.find('.gPaginator');
    $paginator.append('<li class="page_prev"><a href="#">'+ options.prevText +'</a></li>');
    $paginator.append('<li class="page_next"><a href="#">'+ options.nextText +'</a></li>');
    return $paginator;
  }

  function changePage(){

  }
})(jQuery);
