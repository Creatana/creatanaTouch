# creatanaTouch
Simple or advanced touch controls. Detects swipes, manages touch slideshows, &amp; scrolls.

##### Usage


###### Scroll Only
In it's most basic usage, it just scrolls with Javascript instead of stock.
  ```
  var touchElement = document.getElementById('sample-id');
  
  var touchSettings = {
    element:  touchElement,
  }
  
  creatanaTouch(touchSettings);
  ```
###### X Slideshow
  ```
  var touchElement = document.getElementById('sample-id');
  
  var touchSettings = {
    element:     touchElement,
    xSlideshow:  true,
  }
  
  creatanaTouch(touchSettings);
  ```
###### Y Slideshow
  ```
  var touchElement = document.getElementById('sample-id');
  
  var touchSettings = {
    element:     touchElement,
    ySlideshow:  true,
  }
  
  creatanaTouch(touchSettings);
  ```
###### Single direction swipe function
  ```
  function exampleFunction (){
    jQuery('#sample-id').hide(500);
  }
  
  var touchElement = document.getElementById('sample-id');
  
  var touchSettings = {
    element:        touchElement,
    rightFunction:  exampleFunction,
  }
  
  creatanaTouch(touchSettings);
  ```
###### Multiple direction swipe
  ```
  function rightFunction (){
    jQuery('#sample-id-1').hide(500);
  }
  
  function leftFunction (){
    jQuery('#sample-id-1').show(500);
  }
  
  function upFunction (){
    jQuery('#sample-id-2').hide(500);
  }
  
  function downFunction (){
    jQuery('#sample-id-2').show(500);
  }
  
  
  var touchElement = document.getElementById('sample-id');
  
  var touchSettings = {
    element:             touchElement,
    rightSwipeFunction:  rightFunction,
    leftSwipeFunction:   leftFunction,
    upSwipeFunction:     upFunction,
    downSwipeFunction:   downFunction,
  }
  
  creatanaTouch(touchSettings);
  ```
  
