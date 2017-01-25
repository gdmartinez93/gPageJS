/*
 * gPages - jQuery Plugin
 * version: 1.5
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
        gPages: function(options) {
            if( options != undefined ){
                if( $.isPlainObject(options) || options == 'update' ){
                    // default options
                    var defaults = {
                        item: '',
                        itemsPerPage: 10,
                        classContainerPage: '',
                        prevText: 'back',
                        nextText: 'next',
                        prevSrc: '',
                        nextSrc: '',
                        loader: 'ring',
                        pagesPrevView: 5,
                        pagesNextView: 5,
                        pageChange: function(){}
                    };
                    if( options == 'update' ){
                        options = gOptions;
                    } else{
                        options = $.extend(defaults, options);
                        gOptions = options;
                    }

                    return this.each(function() {
                        if( $(this).hasClass('gPages') ) { return; }
                        obj = $(this);
                        constructor( obj, options );
                    });
                } else if( options == 'update' ){
                    debugger
                } else if( options == 'show_loader' ){
                    showLoader();
                } else if( options == 'hide_loader' ){
                    hideLoader();
                } else if( options == 'destroy' ){
                    destroy(this);
                }
            } else{
                return false;
            }
        }
    });

    /* -------- CONSTRUCTOR -------- */
    function constructor( obj, options ){
        _selfElem = obj.clone();

        obj.addClass('gPages');
        obj.html('');

        createPaginator( options, function(){
            var $paginator = obj.find('.gPaginator'),
                totalItems = _selfElem.find(options.item).length,
                totalPages = Math.ceil( totalItems / options.itemsPerPage ),
                $items = _selfElem.find(options.item).clone();

            createPages( $paginator, totalPages, options, $items );
            createElementsPaginator( $paginator, totalPages, options );
            createLoader();

            if( options.classContainerPage != '' ){
                obj.find('.gPage').addClass( options.classContainerPage );
            }

            if( window.location.hash ){
                var pageActive = Number( window.location.hash.split('page-')[1] );

                obj.find('.gPage')
                    .eq( pageActive - 1 )
                    .addClass('active');

                $paginator
                    .children( '.page' )
                    .removeClass( 'active' )
                    .eq( $paginator.children( '.page[data-page="'+ pageActive +'"]' ).index() - 1 )
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

            if( $paginator.children( '.page' ).first().hasClass('active') ){
                $paginator.find('.page_prev').addClass('disabled')
            }
            if( $paginator.children( '.page' ).last().hasClass('active') ){
                $paginator.find('.page_next').addClass('disabled')
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
        });
    }

    /* -------- CREATE PAGINATOR -------- */
    function createPaginator( options, callback ){
        obj.append($('<ul class="gPaginator"></ul>'));
        var $paginator = obj.find('.gPaginator');

        if( options.prevSrc == '' || options.nextSrc == '' ){
            $paginator.append('<li class="page_prev"><a href="#">'+ options.prevText +'</a></li>');
            $paginator.append('<li class="page_next"><a href="#">'+ options.nextText +'</a></li>');
        }
        else{
            $paginator.append('<li class="page_prev"><a href="#"><img src="'+ options.prevSrc +'"  alt="prev"/></a></li>');
            $paginator.append('<li class="page_next"><a href="#"><img src="'+ options.nextSrc +'"  alt="next"/></a></li>');
        }

        $paginator.attr('min-pages', options.pagesPrevView);
        $paginator.attr('max-pages', options.pagesNextView);

        callback();
    }

    /* -------- CREATE PAGES IN PAGINATOR -------- */
    function createElementsPaginator( $paginator, totalPages, options ){
        for( var i = 0; i < totalPages; i++ ){
            var prevsRender = 0,
                nextsRender = 0,
                classDisabled = '';

            if( window.location.hash ){
                var pageActive = Number( window.location.hash.split('page-')[1] );
                if( ( pageActive - options.pagesPrevView ) >= 1 ){
                    prevsRender = pageActive - options.pagesPrevView;
                } else{
                    prevsRender = 1;
                }

                if( ( pageActive + options.pagesNextView ) < totalPages ){
                    nextsRender = pageActive + options.pagesNextView;
                } else{
                    nextsRender = totalPages;
                }
            } else{
                prevsRender = 1;
                nextsRender = options.pagesNextView;
            }

            if( i + 1 >= prevsRender && i + 1 <= nextsRender ){
                classDisabled = '';
            } else{
                classDisabled = 'disabled';
            }

            //console.log(i, ' ', classDisabled)

            $( '<li class="page '+ classDisabled +'" data-page="'+ ( i + 1 ) +'"><a href="#page-'+ ( i + 1 ) +'">'+ ( i + 1 ) +'</a></li>' ).insertBefore( $paginator.children().last() );
        }
    }

    /* -------- CREATE PAGES -------- */
    function createPages( $paginator, totalPages, options, $items ){
        for( var i = 0; i < totalPages; i++ ){
            $( '<div class="gPage"></div>' ).insertBefore( $paginator );

            if( i + 1 == totalPages ){
                obj.find('.gPage').last().append( $items );
            }

            else{
                var startPoint = 0;
                var endPoint = options.itemsPerPage;

                var itemsToInclude = $items.splice(startPoint, endPoint);

                obj.find('.gPage').last().append( itemsToInclude );
            }
        }
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

            setTimeout(function(){
                $loader.addClass('active');
            }, 400);
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

        gOptions.pageChange();

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

            $.each(obj.find('.gPaginator .page'), function( i,val ){
                $(this).removeClass('disabled');

                var prevsRender = 0,
                    nextsRender = 0,
                    minPages = Number( $(this).parent().attr('min-pages') ),
                    maxPages = Number( $(this).parent().attr('max-pages') ),
                    currentActivePage = $indicatorActive.index(),
                    classDisabled = '';

                if( ( currentActivePage - minPages ) >= 1 ){
                    prevsRender = ( currentActivePage ) - minPages;
                } else{
                    prevsRender = 1;
                }

                if( ( currentActivePage + maxPages ) < obj.find('.gPaginator .page').length ){
                    nextsRender = ( currentActivePage ) + maxPages;
                } else{
                    nextsRender = obj.find('.gPaginator .page').length;
                }

                if( i + 1 >= prevsRender && i + 1 <= nextsRender ){
                } else{
                    $(this).addClass('disabled');
                }
            });

            window.location.hash = elem.children().attr('href');
        }, 2000);
    }

    /* -------- DESTROY -------- */
    function destroy( obj, callback ){
        var self = obj,
            originalItems = [],
            totalItems = 0;

        $.each(self.find('.gPage'), function( i,val ){
            totalItems += $(this).children().length;

            for( var i = 0; i < $(this).children().length; i++ ){
                var selfElem = $(this).children().eq( i ).clone();
                originalItems.push(selfElem);
            }
        })

        var controller = setInterval(function(){
            if( originalItems.length == totalItems ){
                self.html('');

                $.each(originalItems, function( i,val ){
                    self.append( $(this) );

                    if( i + 1 && originalItems.length ){
                        if( typeof callback == 'function' ){
                            callback();
                        }
                    }
                });

                window.location.hash = '';
                clearInterval(controller);
            }
        }, 300);
    }
})(jQuery);
