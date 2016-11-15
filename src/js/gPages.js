/*
 * gPages - jQuery Plugin
 * version: 1.0
 * @requires jQuery
 *
 * Examples at http://lab.veno.it/venobox/
 * License: MIT License
 * License URI: https://github.com/gdmartinez93/gPageJS/blob/master/LICENSE
 * Copyright 2015-2016 Gabriel David Martinez - gdmartinez.sandino@gmail.com
 *
 */
(function($){
    var obj,
        gOptions,
        _selfElem;

    $.fn.extend({
        gPages: function(options, action) {
            // default options
            var defaults = {
                item: '',
                itemPerPage: 10,
                prevText: 'back',
                nextText: 'next',
                loader: 'ring'
            };

            options = $.extend(defaults, options);
            gOptions = options;

            if( options != undefined ){
                return this.each(function() {
                    if( $(this).hasClass('gPages') ) { return; }
                    obj = $(this);
                    _selfElem = obj.clone();

                    obj.addClass('gPages');
                    obj.html('');

                    createPaginator( options );

                    var $paginator = obj.find('.gPaginator'),
                        totalItems = _selfElem.find(options.item).length,
                        totalPages = Math.ceil( totalItems / options.itemPerPage ),
                        $items = _selfElem.find(options.item).clone(),
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

                    createLoader();

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

                        $paginator.find('.page_prev').addClass('disabled');
                    }

                    $paginator.children(':not(".page")').on('click', function( event ){
                        if( $(this).hasClass('disabled') ) { return false; }

                        event.preventDefault();
                        event.stopPropagation();

                        var pageActive = $paginator.find('.page.active');

                        if( $(this).hasClass('page_prev') ){
                            if( pageActive.prev().hasClass('page') ){
                                changePage( null, pageActive.prev() );
                            }
                            else{
                                return false;
                            }
                        }
                        else{
                            if( pageActive.next().hasClass('page') ){
                                changePage( null, pageActive.next() );
                            }
                            else{
                                return false;
                            }
                        }
                    });

                    $paginator.children('.page').on('click', changePage);

                    window.test = obj;
                });
            }
            else{
                return false;
            }
        },
        gPageDestroy: function(){
            this.removeClass('gPages');
            this.html('');
            this.append( _selfElem.children() );
            window.location.hash = '';
        },
        gPageLoader: function( action ){
            console.log(action);
            if( action != undefined ){
                switch (action) {
                    case 'show':
                        showLoader();
                        break;
                    case 'hide':
                        hideLoader();
                        break;
                }
            }
        }
    });

    /* -------- CREATE PAGINATOR -------- */
    function createPaginator( options ){
        obj.append($('<ul class="gPaginator"></ul>'));
        var $paginator = obj.find('.gPaginator');
        $paginator.append('<li class="page_prev"><a href="#">'+ options.prevText +'</a></li>');
        $paginator.append('<li class="page_next"><a href="#">'+ options.nextText +'</a></li>');
    }

    /* -------- CREATE LOADER -------- */
    function createLoader(){
        $('<div class="gPages__loader"></div>').insertBefore( obj.children().first() );
        var $loader = obj.find('.gPages__loader');

        switch (gOptions.loader) {
            case 'circle':
                $loader.append('<span class="circle loader_default">' +
                                    '<span class="left">' +
                                        '<span class="anim"></span>' +
                                    '</span>' +
                                    '<span class="right">' +
                                        '<span class="anim"></span>' +
                                    '</span>' +
                                '</span>');
                break;

            case 'round':
                $loader.append('<span class="round loader_default">' +
                                    '<span class="left">' +
                                        '<span class="anim"></span>' +
                                    '</span>' +
                                    '<span class="right">' +
                                        '<span class="anim"></span>' +
                                    '</span>' +
                                '</span>');
                break;

            case 'balls':
                $loader.append('<div class="balls"></div>');
                break;

            case 'dots':
                $loader.append('<div class="dots">' +
                                    '<div class="dots__dot dot_1"></div>' +
                                    '<div class="dots__dot dot_2"></div>' +
                                    '<div class="dots__dot dot_3"></div>' +
                                    '<div class="dots__dot dot_4"></div>' +
                                '</div>');
                break;

            case 'rspin':
                $loader.append('<div class="rspin">' +
                                    '<span class="rspin__indicator"></span>' +
                                    '<span class="rspin__spinner">' +
                                        '<span class="elem"></span>' +
                                    '</span> ' +
                                    '<span class="rspin__bar bar_1"></span>' +
                                    '<span class="rspin__bar bar_2"></span>' +
                                    '<span class="rspin__bar bar_3"></span>' +
                                    '<span class="rspin__bar bar_4"></span>' +
                                '</div>');
                break;

            case 'metro_spin':
                $loader.append('<div class="metro_spin">' +
                                    '<div class="metro_spin__circle"></div>' +
                                    '<div class="metro_spin__circle"></div>' +
                                    '<div class="metro_spin__circle"></div>' +
                                    '<div class="metro_spin__circle"></div>' +
                                    '<div class="metro_spin__circle"></div>' +
                                '</div>');
                break;

            default:
                $loader.append('<img src="'+ gOptions.loader +'" />');
        }
    }

    /* -------- SHOW LOADER -------- */
    function showLoader(){
        var $loader = obj.find('.gPages__loader');

        if( $loader.length > 0 ){
            obj.find('.gPage.active')
                .fadeOut(function(){
                    obj.find('.gPage.active')
                        .removeClass('active')
                        .removeAttr('style');
                });

            $('html, body').stop().animate({scrollTop:0}, '500', 'swing', function() {

                $loader.addClass('active');
            });
        }
        else{
            return false;
        }
    }

    /* -------- HIDE LOADER -------- */
    function hideLoader(){
        var $loader = obj.find('.gPages__loader');

        if( $loader.length > 0 ) {
            $loader.removeClass('active');
        }
        else{
            return false;
        }
    }

    /* -------- CONTROLLER PAGES -------- */
    function changePage( event, el ){
        var elem;

        if( el != undefined ){
            elem = el;
        }
        else{
            event.preventDefault();
            event.stopPropagation();

            elem = $(this);
        }

        if( elem.hasClass('active') ) { return; }

        showLoader();

        setTimeout(function(){
            hideLoader();

            obj.find('.gPage')
                .eq( elem.index() -1 )
                .addClass('active');

            var $pageActive = obj.find('.gPage.active'),
                $indicator = obj.find('.gPaginator .page').eq( $pageActive.index() - 1 );

                obj.find('.gPaginator .page').removeClass('active');
                $indicator.addClass('active');

                var $indicatorActive = obj.find('.gPaginator .active');

                if( $indicatorActive.next().hasClass('page_next') ){
                    obj.find('.gPaginator .page_next').addClass('disabled');
                    obj.find('.gPaginator .page_prev').removeClass('disabled');
                }
                else if( $indicatorActive.prev().hasClass('page_prev') ){
                    obj.find('.gPaginator .page_prev').addClass('disabled');
                    obj.find('.gPaginator .page_next').removeClass('disabled');
                }
                else{
                    obj.find('.gPaginator .page_prev')
                        .add( obj.find('.gPaginator .page_next') )
                        .removeClass('disabled');
                }

                window.location.hash = elem.children().attr('href');
        }, 2000);
    }
})(jQuery);
