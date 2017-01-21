gPages JS
===================


pending description

----------

### New Features

> **27/01/2017** - New properties in options configuration object. **"pagesPrevView"**  :  **Number** Define items show to prev active item in paginator.  **"pagesNextView"**  :  **Number** Define items show to next active item in paginator.  **"classContainerPage"**  :  **String** Define custom css class for each containerPage.

### Options

**Object options** has multiple options of configuration

Option                           | Description
---------------------------------| -------------------------------
item                             | **String** Is the selector element
itemsPerPage                     | **Number** Define quantity items for to show in for each gPage
classContainerPage               | **String** Define custom css class for each containerPage.
prevText                         | **String** Define custom text in prev element in paginator. If is empty not appear nothing
nextText                         | **String** Define custom text in next element in paginator. If is empty not appear nothing
prevSrc                          | **String** Define custom src in prev element in paginator. This src will appear on a tag **< img >**
nextSrc                          | **String** Define custom src in next element in paginator. This src will appear on a tag **< img >**
loader                           | **String** Define a loader from to this list [loders](https://codepen.io/gdmartinez93/pen/pRPyoR)
pagesPrevView                    | **Number** Define items show to prev active item in paginator.
pagesNextView                    | **Number** Define items show to next active item in paginator.
pageChange                       | **Event** Is a callback function is ocurred will a page is changed


### Examples code

This is a example defiintion options configurations, for initialize gPagesJS:

```
// options of configuration for pagination
optionsPagination = {
   item: '.element',
   itemsPerPage: 5,
   loader: 'dots',
   prevText: '',
   prevSrc: '/images/icons/arrow_pagination.svg',
   nextText: '',
   nextSrc: '/images/icons/arrow_pagination.svg',
   pagesPrevView: itemsInPagination,
   pagesNextView: itemsInPagination,
   pageChange: function () {
	   alert('Page is changed!');
   }
}
```

### Table of contents

[TOC]

