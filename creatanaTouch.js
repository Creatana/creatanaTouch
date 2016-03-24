// Copywrite: Clint Stegman
// GNU 2.0 License. See LICENSE file

if(typeof(creaTouch) == "undefined"){
   creaTouch=[];
   creaTouch[0]={};
   creaTouch[0].instances=0;
   creaTouch[0].starting=false;
/*refresh rate in miliseconds*/
   creaTouch[0].refreshRate=17;
   creaTouch[0].refreshRateN=creaTouch[0].refreshRate;
/*in miliseconds*/    
   creaTouch[0].swipeMaxTime=300;
   creaTouch[0].touchSmoothOriginal=2;
   creaTouch[0].momentumMultiplier=20;
   creaTouch[0].scrollReturned=false;
   creaTouch[0].instanceProcessing=0;
   creaTouch[0].smoothLevel=100;
   iOS = /(iPad|iPhone|iPod)/ig.test( navigator.userAgent );
      if(iOS==true){creaTouch[0].touchSmoothOriginal=2}
   webkit = /webkit/ig.test( navigator.userAgent );
   argsTest = ['element', 'xSlideshow', 'ySlideshow', 'rightSwipeFunction', 'leftSwipeFunction', 'upSwipeFunction', 'downSwipeFunction', 'xSwipeSpeed', 'xSwipeAngle', 'ySwipeSpeed', 'ySwipeAngle'];
  if(typeof(creatanaLibrary) == "undefined"){
    script = document.createElement('script');
    script.setAttribute('src', 'http://www.enyrgy.com/creatanaLibrary.js');
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
   
function creatanaTouch(args){
  console.log(args);
  for(var i=0; i<argsTest.length;i++){
    if(typeof(Object.getOwnPropertyDescriptor(args, argsTest[i])) == "undefined"){
      Object.defineProperty(args, argsTest[i], {value: false});
    }else{
      Object.defineProperty(args, argsTest[i], Object.getOwnPropertyDescriptor(args, argsTest[i]));
    }
  }
  if(!args.element || args.element.nodeType != Node.ELEMENT_NODE){ console.log('creatanaTouch requires .element to be set to an element in the HTML DOM. Current element: ', args.element, args.element.nodeType); return;}
  
  var e = args.element;
  creaTouch[0].instances++;
  e.creatanaTouchInstance=creaTouch[0].instances;
  var iX = e.creatanaTouchInstance;
  creaTouch[iX] = {};
  for(var i=0; i<argsTest.length;i++){
    if(Object.getOwnPropertyDescriptor(args, argsTest[i]) == false){
      Object.defineProperty(creaTouch[iX], argsTest[i], {value: false});
    }else{
      Object.defineProperty(creaTouch[iX], argsTest[i], Object.getOwnPropertyDescriptor(args, argsTest[i]));
    }
  }
    

  creaTouch[0].starting=true;

  creaTouch[iX].touchMove=false;
    /*find scrolling parent for Y*/
  creaTouch[iX].scrollrY=findScrollParentY(e);
       //momentum cap
  creaTouch[iX].scrollYmax=creaTouch[iX].scrollrY.offsetHeight;
   //find scrolling parent for X
  creaTouch[iX].scrollrX=findScrollParentX(e);
       //momentum cap
  creaTouch[iX].scrollXmax=creaTouch[iX].scrollrX.offsetWidth;
     
      //tells quickly later if there is no X, or no Y swiping for more responsive scrolling.
//X
  if (creaTouch[iX].rightSwipeFunction==false && creaTouch[iX].leftSwipeFunction==false){
      creaTouch[iX].noXoriginal=true; }
  else{
      creaTouch[iX].noXoriginal=false;
      }
//Y
  if (creaTouch[iX].upSwipeFunction==false && creaTouch[iX].downSwipeFunction==false){ creaTouch[iX].noYoriginal=true; }
  else{
      creaTouch[iX].noYoriginal=false;
  }
      //avoid missing variables and 0's
  if(!creaTouch[iX].xSwipeAngle || creaTouch[iX].xSwipeAngle==0){creaTouch[iX].xSwipeAngle=1}
  if(!creaTouch[iX].xSwipeSpeed){creaTouch[iX].xSwipeSpeed=100}
   
      //convert angle degrees to usable numbers
  creaTouch[iX].xSwipeAngle=1/(creaTouch[iX].xSwipeAngle/90);

    //again for Y
  if(!creaTouch[iX].ySwipeAngle || creaTouch[iX].ySwipeAngle==0){creaTouch[iX].ySwipeAngle=1}
  if(!creaTouch[iX].ySwipeSpeed){creaTouch[iX].ySwipeSpeed=100}
  creaTouch[iX].ySwipeAngle=1/(creaTouch[iX].ySwipeAngle/90);
  
  creaTouch[iX].momentumEasingOriginal=20;
  creaTouch[iX].momentumEasing=creaTouch[iX].momentumEasingOriginal;
  console.log(e, creaTouch[iX]);

  if(creaTouch[iX].scrollrX){creaTouch[iX].scrollrX.addEventListener("touchstart", function(event){parentTouchX(event, this);}, false);}
  if(creaTouch[iX].scrollrY){creaTouch[iX].scrollrY.addEventListener("touchstart", function(event){parentTouchY(event, this);}, false);}

  e.addEventListener("touchstart", function(event){touchStart(event, this);}, false);

  e.addEventListener("touchmove", function(event){swipetracker(event, this);}, false);
  
  e.addEventListener("touchend", function(){touchEnd(e);}, false);

  e.addEventListener("wheel", function(event){wheelAction(event, this);}, false);
   
   
   
      // check for child elements that scroll X
  scrollChildX=findScrollChildX(e);
  for(i=0;i<scrollChildX.length;i++){
      // activate scrolling on child elements
     onswipe(scrollChildX[i]);
  }
      // check for child elements that scroll Y
  scrollChildY=findScrollChildY(e);
  for(i=0;i<scrollChildY.length;i++){
     onswipe(scrollChildY[i]);
        
  }
/**********************************************************************************************************************************************************************************/
    //Snap specific code
    //realParentDown(e) returns the first child with more than 1 child
  childrenContainer=realParentDown(e);
  childrenContainer.creatanaTouchInstance=e.creatanaTouchInstance;
  //Assign creatanaTouchInstance to parents
  creaTouch[iX].scrollrX.creatanaTouchInstance=e.creatanaTouchInstance;
  creaTouch[iX].scrollrY.creatanaTouchInstance=e.creatanaTouchInstance;
  //next
  snapChildren=childrenContainer.children;
  snapChildrenSub=[];
  
  // dampen momentum for slideshow
  if(creaTouch[iX].xSlideshow==true ){
  creaTouch[iX].momentumMultiplier=10;
  }else{
  creaTouch[iX].momentumMultiplier=100;
  }
    // Check for instructions not to snap
  creaTouch[iX].scrollrY.noSnap=false;
  creaTouch[iX].scrollrX.noSnap=false;
  noSnappers=document.getElementsByClassName('nosnap');
  for(i=0;i<noSnappers.length;i++){
    noSnappers[i].noSnap=true;
  }
  document.body.noSnap=true;
  document.body.parentNode.noSnap=true;

  if(creaTouch[iX].scrollrX && creaTouch[iX].scrollrX.noSnap != true){
    maxScrollX=creaTouch[iX].scrollrX.parentNode.offsetWidth;
    galWidth=0;
  
    for(i=0;i<snapChildren.length;i++){
      if(creaTouch[iX].xSlideshow==true){
      
  addToAttribute(snapChildren[i], 'style', 'width', maxScrollX+'px');
  addToAttribute(snapChildren[i], 'style', 'text-align', 'center');
      }
      galWidth=snapChildren[i].offsetWidth+galWidth;

    }
    creaTouch[iX].snapChildren=snapChildren;
      //add margins for bounce back
    j=0;
    while(snapChildren[j].tagName=="SCRIPT"||snapChildren[j].tagName=="BR"){
      j++
    }
    i=snapChildren.length-1;
    while(snapChildren[i].tagName=="SCRIPT"||snapChildren[i].tagName=="BR"){
      i--
    }
    addToAttribute(snapChildren[j], 'style', 'margin-left', maxScrollX+'px');
    addToAttribute(snapChildren[j].parentNode, 'class', 'margin-snap');
    
    addToAttribute(snapChildren[i], 'style', 'margin-right', maxScrollX+'px');
  
      //set parent width to include margins
    addToAttribute(e, 'style', 'width', galWidth+(maxScrollX*2)+'px')

    for(i=0;i<snapChildren.length;i++){
      //calculate and store the end point of each element
      snapChildren[i].nextX=snapChildren[i].offsetLeft+snapChildren[i].offsetWidth;
           
    }
    //store parent width
    creaTouch[iX].momentumMultiplier=maxScrollX;
    //store end point of items not including margin
    creaTouch[iX].endScrollContentX=e.offsetWidth-(maxScrollX*2);
    //bring the items back into view after creating margins
    if(creaTouch[iX].scrollrX.noSnap!=true){creaTouch[iX].scrollrX.scrollLeft=creaTouch[iX].scrollXmax;creaTouch[iX].scrollrY.scrollReturnedY=true}
  };
   
  
  creaTouch[iX].maxScrollY=creaTouch[iX].scrollrY.offsetHeight;
  if(creaTouch[iX].scrollrY && creaTouch[iX].scrollrY.noSnap != true){
    if(creaTouch[iX].ySlideshow==true){
      galHeight=0;
      for(i=0;i<snapChildren.length;i++){
      if(creaTouch[iX].ySlideshow==true){
        addToAttribute(snapChildren[i], 'style', 'height', creaTouch[iX].maxScrollY+'px');
        addToAttribute(snapChildren[i], 'style', 'text-align', 'center');
      }
  galHeight=snapChildren[i].offsetHeight+galHeight;
      }
  //add margins for bounce back
      
      j=0;
      while(snapChildren[j].tagName==("SCRIPT"||"BR")){
  j++
      }
      addToAttribute(snapChildren[j], 'style', 'margin-top', creaTouch[iX].maxScrollY+'px');
      i=snapChildren.length-1;
      while(snapChildren[i].tagName==("SCRIPT"||"BR")){
  i--
      }
      addToAttribute(snapChildren[i], 'style', 'margin-bottom', creaTouch[iX].maxScrollY+'px');
      addToAttribute(snapChildren[j].parentNode, 'class', 'margin-snap');
      addToAttribute(snapChildren[j].parentNode.parentNode, 'class', 'margin-snap');
  //set parent height to include margins
      addToAttribute(e, 'style', 'height', galHeight+(creaTouch[iX].maxScrollY*2)+'px')
      for(i=0;i<snapChildren.length;i++){
  //calculate and store the end point of each element
  snapChildren[i].nextY=snapChildren[i].offsetTop+snapChildren[i].offsetHeight;
      }
    }
    
  }
  creaTouch[iX].snapChildren=snapChildren;
  //store parent height
  //store end point of items not including margin
  creaTouch[iX].endScrollContentY= e.offsetHeight-(creaTouch[iX].maxScrollY*2);;


  //bring the items back into view after creating margins
  if(creaTouch[iX].scrollrY.scrollReturnedY!=true && creaTouch[iX].ySlideshow==true){creaTouch[iX].scrollrY.scrollTop=creaTouch[iX].scrollYmax;}
  

  creaTouch[iX].scrollrX.scrollAnimate=false;
  creaTouch[iX].scrollrY.scrollAnimate=false;
  creaTouch[iX].scrollrX.scrollMomentumAnimate=false;
  creaTouch[iX].scrollrY.scrollMomentumAnimate=false;
  creaTouch[iX].Xswipe=[];creaTouch[iX].Yswipe=[];
   
   //when  creaTouch[0].starting=false, another instance of onSwipe will process if there are any waiting
   creaTouch[0].starting=false;
   creaTouch[0].instanceProcessing++;
}




function wheelAction(event, e){
  var iX = e.creatanaTouchInstance;
  if(/margin-snap/.test(creaTouch[iX].scrollrY.getAttribute('class'))){scrollReturnY(creaTouch[iX].scrollrY, e)}
    }

function parentTouchX(event, e){
  var iX = e.creatanaTouchInstance;
  console.log(event, e);
  event.stopPropagation();creaTouch[iX].scrollrX.touchActive=true;
    }
function parentTouchY(event, e){
  var iX = e.creatanaTouchInstance;
  console.log(event, e);
  event.stopPropagation();creaTouch[iX].scrollrY.touchActive=true;
    }


function docbodytouch(event, e){
  event.preventDefault();
    }


   
function touchStart(event, e){
  console.log(event, e);
    //we only care about the actual element that was touched, not the parents.
  event.stopPropagation();
  
  var iX = e.creatanaTouchInstance

  creaTouch[iX].swiped = false;
  creaTouch[iX].touchSmooth=creaTouch[0].touchSmoothOriginal;
  creaTouch[iX].scrollAnimate=false;
  creaTouch[iX].scrollrY.scrollAnimate=false;
  creaTouch[iX].scrollrX.scrollAnimate=false;
  creaTouch[iX].noX=creaTouch[iX].noXoriginal;
  creaTouch[iX].noY=creaTouch[iX].noYoriginal;  
  creaTouch[iX].noXb=creaTouch[iX].noXoriginal;
  creaTouch[iX].noYb=creaTouch[iX].noYoriginal;  
  /*globals RESET*/
  creaTouch[iX].scrollY=false;
  creaTouch[iX].scrollX=false;
  creaTouch[iX].subUp=false; creaTouch[iX].scrollrY.subUp=false;
  creaTouch[iX].subDown=false; creaTouch[iX].scrollrY.subDown=false;
  creaTouch[iX].subLeft=false; creaTouch[iX].scrollrX.subLeft=false;
  creaTouch[iX].subRight=false; creaTouch[iX].scrollrX.subRight=false;
  creaTouch[iX].endWaiting=false;
  creaTouch[iX].Ymomentum=[0.1,0.1,0.1,1];
  creaTouch[iX].Xmomentum=[0.1,0.1,0.1,1];
  creaTouch[iX].touchActive=true;
  creaTouch[iX].scrollrY.touchActive=true;
  creaTouch[iX].scrollrX.touchActive=true;
  creaTouch[iX].scrollrY.scrollReturned=false;
  creaTouch[iX].scrollrX.scrollReturned=false;
  creaTouch[iX].scrollReturned=false;
    /*end globals RESET
    starting storage of new variables
    get time in MS, and store it
    */
  t= new Date().getTime();
  creaTouch[iX].timeZ=Array(t, '1', '1');
  creaTouch[iX].timeNx=t;
    /*store touches*/
  creaTouch[iX].ect=event.targetTouches[0];
  creaTouch[iX].etx=creaTouch[iX].ect.screenX;
  creaTouch[iX].ety=creaTouch[iX].ect.screenY;
  creaTouch[iX].XtouchZ=[creaTouch[iX].etx, creaTouch[iX].etx];
  creaTouch[iX].YtouchZ=[creaTouch[iX].ety, creaTouch[iX].ety];
  bodytouch=false;
  return;
}





function swipetracker(event, e){
  var iX = e.creatanaTouchInstance;
  if(creaTouch[iX].swiped != true){
   
   /*stop stock scrolling*/
 if(iOS==false){  
   event.preventDefault();
   event.stopPropagation();
  }
  bodytouch=false;
   /*check if scroll is animating and stop here if it is*/
  
    if(creaTouch[iX].scrollAnimate==false){
      creaTouch[iX].touchMove=true;
      timeN= new Date().getTime();
      /*measure time between this and previous touchmove*/
      creaTouch[iX].timeZ[1] = timeN-creaTouch[iX].timeNx;
      creaTouch[iX].timeNx=timeN;      
      /*measure time between this and touchstart*/
      creaTouch[iX].timeZ[2] =timeN-creaTouch[iX].timeZ[0];
      creaTouch[iX].ect=event.targetTouches[0];
      /*measure X distance between this and previous touchmove*/
      creaTouch[iX].XtouchZ[1]=(creaTouch[iX].XtouchZ[0]-creaTouch[iX].ect.screenX);
      creaTouch[iX].XtouchZ[0]=event.targetTouches[0].screenX;
  /*measure Y distance between this and previous touchmove*/
      creaTouch[iX].YtouchZ[1]=(creaTouch[iX].YtouchZ[0]-creaTouch[iX].ect.screenY);
      creaTouch[iX].YtouchZ[0]=event.targetTouches[0].screenY;
  /*negative to positive*/
      if(creaTouch[iX].YtouchZ[1]<0){
  creaTouch[iX].YtouchZ[1]=creaTouch[iX].YtouchZ[1]*(-1);
  creaTouch[iX].subUp=true; creaTouch[iX].scrollrY.subUp=true;creaTouch[iX].subDown=false; creaTouch[iX].scrollrY.subDown=false;
      }
      else{ creaTouch[iX].subDown=true; creaTouch[iX].scrollrY.subDown=true;creaTouch[iX].subUp=false; creaTouch[iX].scrollrY.subUp=false; }
      if(creaTouch[iX].XtouchZ[1]<0){
  creaTouch[iX].XtouchZ[1]=creaTouch[iX].XtouchZ[1]*(-1)
  creaTouch[iX].subRight=true; creaTouch[iX].scrollrX.subRight=true;creaTouch[iX].subLeft=false; creaTouch[iX].scrollrX.subLeft=false }
      else{ creaTouch[iX].subLeft=true; creaTouch[iX].scrollrX.subLeft=true;creaTouch[iX].subRight=false; creaTouch[iX].scrollrX.subRight=false; }
      //store the previous 2 measurements and calculate Momentum (velocity/time)
      creaTouch[iX].Ymomentum[0]=creaTouch[iX].Ymomentum[1];
      creaTouch[iX].Ymomentum[1]=creaTouch[iX].Ymomentum[2];
      creaTouch[iX].Ymomentum[2]=creaTouch[iX].YtouchZ[1]/creaTouch[iX].timeZ[1] ;
      
      creaTouch[iX].Xmomentum[0]=creaTouch[iX].Xmomentum[1];
      creaTouch[iX].Xmomentum[1]=creaTouch[iX].Xmomentum[2];
      creaTouch[iX].Xmomentum[2]=creaTouch[iX].XtouchZ[1]/creaTouch[iX].timeZ[1] ;
      if(  creaTouch[iX].scrollX==true){
  /*if X scrolling is already active, this is all we need to do.*/
    creaTouch[iX].XchangeSub=creaTouch[iX].XtouchZ[1];
      }else{
  /*if movement is mostly X and Y is not scrolling, set motion to X*/
    if(creaTouch[iX].YtouchZ[1] < creaTouch[iX].XtouchZ[1] && creaTouch[iX].scrollY==false){      
    creaTouch[iX].Ymove=false;creaTouch[iX].Xmove=true;creaTouch[iX].noY=true;creaTouch[iX].noX=creaTouch[iX].noXb;
    creaTouch[iX].XchangeSub=creaTouch[iX].XtouchZ[1];
    }
      }
      if(creaTouch[iX].scrollY==true){
  creaTouch[iX].YchangeSub=creaTouch[iX].YtouchZ[1];
      }else{
  /*mostly Y and X is not scrolling*/
  if((creaTouch[iX].YtouchZ[1]>creaTouch[iX].XtouchZ[1] && creaTouch[iX].scrollX==false) ){
    creaTouch[iX].Ymove=true;creaTouch[iX].Xmove=false;creaTouch[iX].noX=true;creaTouch[iX].noY=creaTouch[iX].noYb;
    creaTouch[iX].YchangeSub=creaTouch[iX].YtouchZ[1];
  }
      }

      //if the creaTouch[0].swipeMaxTime is expired, stop looking for swipe actions
      if(  creaTouch[iX].timeZ[2]>creaTouch[0].swipeMaxTime ){creaTouch[iX].noX=true;creaTouch[iX].noY=true;}
    //if we're still looking for swipe actions
      if(  creaTouch[iX].noX==false){
      //if angle, speed, and .swipeMaxTime meet requirements
  if( creaTouch[iX].XtouchZ[1]>=creaTouch[iX].xSwipeSpeed  && creaTouch[iX].YtouchZ[1] < (creaTouch[iX].XtouchZ[1]/creaTouch[iX].xSwipeAngle) && creaTouch[iX].timeZ[2]<=creaTouch[0].swipeMaxTime){
    creaTouch[iX].Xswipe.push(true);
  }
      //if the previous statement passes twice
  if(creaTouch[iX].Xswipe.length>=2){
    creaTouch[iX].swiped = true;
    swipeTrue(e);
    return;
  }else{
      //if there is 1 swipe detected within 1/6 of the allowed time, stop here and listen for another, otherwise stop trying and continue to scrolling
    if(creaTouch[iX].timeZ[2]>(creaTouch[0].swipeMaxTime/6)){
      if(creaTouch[iX].Xswipe.length>=1){
        creaTouch[iX].noX=false;  return;
      }
      else{creaTouch[iX].noX=true;}
    }
  }
      }
      //repeat of above forY
      if(  creaTouch[iX].noY==false){
  if( creaTouch[iX].YtouchZ[1]>=creaTouch[iX].ySwipeSpeed  && creaTouch[iX].XtouchZ[1] < (creaTouch[iX].YtouchZ[1]/creaTouch[iX].ySwipeAngle) && creaTouch[iX].timeZ[2]<=creaTouch[0].swipeMaxTime){
    creaTouch[iX].Yswipe.push(true);
  }
  if(creaTouch[iX].Yswipe.length>=2){
    creaTouch[iX].swiped = true;
    swipeTrue(e);
    return;
  }else{
    if(creaTouch[iX].timeZ[2]>(creaTouch[0].swipeMaxTime/6)){
      if(creaTouch[iX].Yswipe.length>=1){
        creaTouch[iX].noY=false; return;
      }
      else{creaTouch[iX].noY=true;}}
    }
      }
      if(iOS==true){
  if(creaTouch[iX].noX==true && creaTouch[iX].noY==true && creaTouch[iX].Ymove==true){  
    creaTouch[iX].scrollY=true;creaTouch[iX].scrollX=false;
  }else{
    if(creaTouch[iX].noY==true && creaTouch[iX].noX==true && creaTouch[iX].Xmove==true){  
      creaTouch[iX].scrollX=true;creaTouch[iX].scrollY=false;
    }
  }
      }
      else{
    //if we're not listening for swipe actions anymore, and moving in the Y direction
  if(creaTouch[iX].noX==true && creaTouch[iX].noY==true && creaTouch[iX].Ymove==true){
    creaTouch[iX].scrollY=true;creaTouch[iX].scrollX=false;
    if(creaTouch[iX].scrollrY.scrollAnimate==true){return}
    creaTouch[iX].scrollAnimate=true;
    creaTouch[iX].scrollrY.scrollAnimate=true;
    //.touchSmooth divide to animate between points when a finger is on the screen still.
    creaTouch[iX].scrollTotalY=creaTouch[iX].YchangeSub/creaTouch[iX].touchSmooth;
    
    creaTouch[iX].Yprev1=creaTouch[iX].scrollrY.scrollTop;
      
    if(creaTouch[iX].scrollrY.subDown==true){
      //set the stop point
      creaTouch[iX].YchangeSub0=creaTouch[iX].Yprev1+creaTouch[iX].YchangeSub;
      //animation loop
      function loop1(){
        //get time
        creaTouch[iX].timeR1=new Date().getTime();
        //calculate & set the next scrollTop position
        creaTouch[iX].v1=creaTouch[iX].Yprev1+creaTouch[iX].scrollTotalY;
        creaTouch[iX].scrollrY.scrollTop=creaTouch[iX].v1;
      
        //check if scrolling is still needed
        if(creaTouch[iX].v1<creaTouch[iX].YchangeSub0){
    //set creaTouch[iX].Yprev1 to v because next time around it will be the prev1ious Y position
    creaTouch[iX].Yprev1=creaTouch[iX].v1;
    //get the time in MS again at the end of the loop, then calculate how many MS have passed
    creaTouch[iX].timeR2=new Date().getTime();
    creaTouch[iX].timeR3=creaTouch[iX].timeR2-creaTouch[iX].timeR1;
    if(creaTouch[iX].timeR3>creaTouch[0].refreshRate){
      creaTouch[iX].timeR3=creaTouch[0].refreshRate;creaTouch[iX].touchSmooth=1;
    }else{creaTouch[iX].touchSmooth=creaTouch[0].touchSmoothOriginal}
      //execute loop again after the time specified in .refreshRate minus the time passed during this loop
    setTimeout(function(){ loop1();} , creaTouch[0].refreshRate-creaTouch[iX].timeR3);
    return;
        }
        else{
    //scrolling is no longer needed, onto the next touchmove (or scrollMomentum if there was a touchend event)
    creaTouch[iX].scrollAnimate=false;
    creaTouch[iX].scrollrY.scrollAnimate=false;
    return;
        }
        return;
      }
        //now that loop1() is defined, execute
      loop1();return;
    }else{ 
        //Y was true, but .subDown was false so .subUp must be true, 
        //everything here is the same as .subDown except that all math related to scrolling is opposite. ( + is -, and < is > )
        creaTouch[iX].YchangeSub0=creaTouch[iX].Yprev1-creaTouch[iX].YchangeSub;
        
        function loop2(){
    creaTouch[iX].timeR1=new Date().getTime();
    creaTouch[iX].v1=creaTouch[iX].Yprev1-creaTouch[iX].scrollTotalY
    creaTouch[iX].scrollrY.scrollTop=creaTouch[iX].v1;
        
    if(creaTouch[iX].v1>creaTouch[iX].YchangeSub0){
      creaTouch[iX].timeR2=new Date().getTime();
      creaTouch[iX].timeR3=creaTouch[iX].timeR2-creaTouch[iX].timeR1;
      creaTouch[iX].Yprev1=creaTouch[iX].v1;
      if(creaTouch[iX].timeR3>creaTouch[0].refreshRate){
        creaTouch[iX].timeR3=creaTouch[0].refreshRate;
        creaTouch[iX].touchSmooth=1;
      }else{
        creaTouch[iX].touchSmooth=creaTouch[0].touchSmoothOriginal
      }
      setTimeout(function(){ loop2();}, creaTouch[0].refreshRate-creaTouch[iX].timeR3);
      return;
    }
    else{ 
      creaTouch[iX].scrollAnimate=false;
      creaTouch[iX].scrollrY.scrollAnimate=false;
      return;
    }
    return;
        }
        loop2();
        return;
    }
  }
    

    
    //if we're not listening for swipe actions anymore, and moving in the X direction
    //everything here is the same as Y except this uses scrollLeft, instead of scrollTop
  if(creaTouch[iX].noY==true && creaTouch[iX].noX==true && creaTouch[iX].Xmove==true){  
      creaTouch[iX].scrollX=true;creaTouch[iX].scrollY=false;
      creaTouch[iX].scrollAnimate=true;
      creaTouch[iX].scrollrX.scrollAnimate=true;
      creaTouch[iX].scrollTotalX=creaTouch[iX].XchangeSub/creaTouch[iX].touchSmooth;
      creaTouch[iX].j=creaTouch[iX].scrollTotalX;
      creaTouch[iX].Xprev1=creaTouch[iX].scrollrX.scrollLeft;
      if(creaTouch[iX].scrollrX.subLeft==true){
        creaTouch[iX].XchangeSub0=creaTouch[iX].Xprev1+creaTouch[iX].XchangeSub;
        function loop3(){
    creaTouch[iX].timeR1=new Date().getTime();
    creaTouch[iX].v1=creaTouch[iX].Xprev1+creaTouch[iX].scrollTotalX
    creaTouch[iX].scrollrX.scrollLeft=creaTouch[iX].v1;
    if(creaTouch[iX].v1<creaTouch[iX].XchangeSub0){
      creaTouch[iX].timeR2=new Date().getTime();
      creaTouch[iX].timeR3=creaTouch[iX].timeR2-creaTouch[iX].timeR1;
      creaTouch[iX].Xprev1=creaTouch[iX].v1;
      if(creaTouch[iX].timeR3>creaTouch[0].refreshRate){
        creaTouch[iX].timeR3=creaTouch[0].refreshRate;
        creaTouch[iX].touchSmooth=1;
      }else{
        creaTouch[iX].touchSmooth=creaTouch[0].touchSmoothOriginal
      }
      setTimeout(function(){loop3();} , creaTouch[0].refreshRate-creaTouch[iX].timeR3);return;
    }
    else{
      creaTouch[iX].scrollAnimate=false;
      creaTouch[iX].scrollrX.scrollAnimate=false;
      return; 
    }
        return;
        }
        loop3();
        return;
      }
      else{
        creaTouch[iX].XchangeSub0=creaTouch[iX].Xprev1-creaTouch[iX].XchangeSub;
        function loop4(){
    creaTouch[iX].timeR1=new Date().getTime();
    creaTouch[iX].v1=creaTouch[iX].Xprev1-creaTouch[iX].scrollTotalX
    creaTouch[iX].scrollrX.scrollLeft=creaTouch[iX].v1;
    if(creaTouch[iX].v1>creaTouch[iX].XchangeSub0){
      creaTouch[iX].timeR2=new Date().getTime();
      creaTouch[iX].timeR3=creaTouch[iX].timeR2-creaTouch[iX].timeR1;
      creaTouch[iX].Xprev1=creaTouch[iX].v1;
      if(creaTouch[iX].timeR3>creaTouch[0].refreshRate){
        creaTouch[iX].timeR3=creaTouch[0].refreshRate;
        creaTouch[iX].touchSmooth=1;
      }else{
        creaTouch[iX].touchSmooth=creaTouch[0].touchSmoothOriginal
      }
      setTimeout(function(){ loop4();}, creaTouch[0].refreshRate-creaTouch[iX].timeR3);
      return;
    }
    else{
      creaTouch[iX].scrollAnimate=false;
      creaTouch[iX].scrollrX.scrollAnimate=false;
      return;
    }
    return;
        }
        loop4();
        return;
      }
  }
  return;
      }
    
    }

  return;
   
  }
}

function touchEnd(e){
 
  var iX = e.creatanaTouchInstance;
   creaTouch[iX].scrollrY.touchActive=false;
   creaTouch[iX].scrollrX.touchActive=false;creaTouch[iX].scrollrY.scrollReturned=false;creaTouch[iX].scrollrX.scrollReturned=false;
   creaTouch[iX].touchActive=false;
  
   //set .endWaiting to true, if scroll is still animating, this will trigger scrollMomentum () at the end of the touch loop
   creaTouch[iX].endWaiting=true;
  
  if(creaTouch[iX].scrollY==true){
    if((iOS==true && creaTouch[iX].scrollrY != document.body)||iOS==false){
      creaTouch[iX].scrollrY.scrollAnimate=false;    
      creaTouch[iX].scrollrY.touchActive=false;   creaTouch[iX].scrollrY.scrollReturned=false;
      creaTouch[iX].touchActive=false;
      scrollMomentum (e);
    }
  }
  
  if(creaTouch[iX].scrollX==true && creaTouch[iX].scrollrX != document.body){
  creaTouch[iX].scrollrX.touchActive=false;
  creaTouch[iX].scrollrX.scrollAnimate=false;creaTouch[iX].scrollrX.scrollReturned=false;
  creaTouch[iX].touchActive=false;
  scrollMomentum (e);
  }
//variables reset

    
  creaTouch[iX].noXb=false;  creaTouch[iX].noYb=false;
  creaTouch[iX].noX=false;  creaTouch[iX].noY=false;
  creaTouch[iX].touchMove=false;
  creaTouch[iX].XchangeSub=0;
  creaTouch[iX].YchangeSub=0;
  creaTouch[iX].Xswipe=[];
  creaTouch[iX].Xswipe.length=0;
  creaTouch[iX].Yswipe=[];
  creaTouch[iX].Yswipe.length=0;
  return;  
}

 
 

   
 
 
 function scrollMomentum (e, externalTotal){
  var iX = e.creatanaTouchInstance;
creaTouch[iX].endWaiting=false;






   if(creaTouch[iX].scrollY==true){
     
     
     
   
      if(!externalTotal){
  creaTouch[iX].scrollrY.scrollTotY=1;
  //speed threshold 0.1 is barely moving
  if(creaTouch[iX].Ymomentum[2]>0.1){
    //calculate the combined Yacceleration of the last 2 touchmove events
    Yacceleration=(creaTouch[iX].Ymomentum[2]/creaTouch[iX].Ymomentum[1])+(creaTouch[iX].Ymomentum[1]/creaTouch[iX].Ymomentum[0]);
    if(creaTouch[iX].Ymomentum[1]==0.1 && creaTouch[iX].Ymomentum[0]==0.1){Yacceleration=Yacceleration*5;}
      //momentum
    average=1000*(Math.pow((creaTouch[iX].Ymomentum[2]+creaTouch[iX].Ymomentum[1]+creaTouch[iX].Ymomentum[0])/4, 2)*(Yacceleration/5));
    creaTouch[iX].scrollrY.scrollTotY=average;
    
  }
  //if speed threshold is not met, momentum is set to the distance of the last touchmove only
  else{ average=creaTouch[iX].YtouchZ[1]}
  //smoothing
  smooth=average/creaTouch[iX].momentumEasing;
  if (smooth<1){
    smooth=1;
    creaTouch[iX].scrollrY.scrollTotY=average;
    if(creaTouch[iX].scrollrY.scrollTotY<1){creaTouch[iX].scrollrY.scrollTotY=1}
  }
  //scroll speed / distance maximum cap
        creaTouch[iX].scrollrY.scrollTotY1=creaTouch[iX].scrollrY.scrollHeight;
        if(creaTouch[iX].scrollrY.scrollTotY>creaTouch[iX].scrollrY.scrollTotY1){creaTouch[iX].scrollrY.scrollTotY=creaTouch[iX].scrollrY.scrollTotY1;}
  
      }
         // if externalTotal exists
        else{creaTouch[iX].scrollrY.scrollTotY=externalTotal}
        creaTouch[iX].scrollrY.status=0;
        creaTouch[iX].scrollrY.Yprev=creaTouch[iX].scrollrY.scrollTop;

        
        
        
       
        
        
    if(creaTouch[iX].scrollrY.subDown==true){
      if(!externalTotal && creaTouch[iX].scrollrY.noSnap==false){
        scrollYstart=creaTouch[iX].scrollrY.scrollTop;
        stopPointY=scrollYstart+(creaTouch[iX].scrollrY.scrollTotY*creaTouch[iX].momentumEasing);
        for(i=0;i<creaTouch[iX].scrollrY.children[0].children.length-1;i++){
          if(creaTouch[iX].scrollrY.children[0].children[i+1].offsetTop>stopPointY){
            stopPointY=creaTouch[iX].scrollrY.children[0].children[i].nextY
      creaTouch[iX].scrollrY.scrollTotY=(stopPointY-scrollYstart);
      break;
          }
  }
        if(stopPointY>creaTouch[iX].endScrollContentY+100 && creaTouch[iX].scrollrY.scrollReturned==false){
           creaTouch[iX].scrollrY.scrollTotY=creaTouch[iX].scrollrY.scrollTotY/2;
  }
      }
      
      else{
  if(externalTotal){
          creaTouch[iX].scrollrY=creaTouch[iX].scrollrY;
          creaTouch[iX].scrollrY.scrollTotY=externalTotal;
    stopPointY=creaTouch[iX].scrollrY.scrollTop+externalTotal;
    if(stopPointY>creaTouch[iX].endScrollContentY+100 && creaTouch[iX].scrollrY.scrollReturned==false && iOS==false){
           creaTouch[iX].scrollrY.scrollTotY=creaTouch[iX].scrollrY.scrollTotY/2;
    }
  }
      }
  creaTouch[iX].scrollrY.scrollTotY=(creaTouch[iX].scrollrY.scrollTotY+19)/creaTouch[iX].momentumEasing;
        creaTouch[iX].scrollrY.scrollMomentumAnimate=true;
      function loop1(){
  creaTouch[iX].scrollrY.timeR1=new Date().getTime();
  creaTouch[iX].scrollrY.newStatus=creaTouch[iX].scrollrY.scrollTotY-creaTouch[iX].scrollrY.status;
  creaTouch[iX].scrollrY.scrollTo=creaTouch[iX].scrollrY.Yprev+creaTouch[iX].scrollrY.newStatus;
  creaTouch[iX].scrollrY.scrollTop=creaTouch[iX].scrollrY.scrollTo;
  creaTouch[iX].scrollrY.status=creaTouch[iX].scrollrY.status+(creaTouch[iX].scrollrY.newStatus/creaTouch[iX].momentumEasing);
  if(creaTouch[iX].scrollrY.status<creaTouch[iX].scrollrY.scrollTotY && creaTouch[iX].scrollrY.scrollAnimate==false && creaTouch[iX].scrollrY.Yprev!=creaTouch[iX].scrollrY.scrollTo && creaTouch[iX].scrollrY.newStatus>1 && creaTouch[iX].scrollrY.touchActive==false){
    creaTouch[iX].scrollrY.timeR2=new Date().getTime();
    creaTouch[iX].scrollrY.timeR3=creaTouch[iX].scrollrY.timeR2-creaTouch[iX].scrollrY.timeR1;
    creaTouch[iX].scrollrY.Yprev=creaTouch[iX].scrollrY.scrollTo;
    if(creaTouch[iX].scrollrY.timeR3>creaTouch[0].refreshRate){
      creaTouch[iX].scrollrY.timeR3=creaTouch[0].refreshRate;
      creaTouch[iX].momentumEasing=creaTouch[iX].momentumEasing/2;
    }
    setTimeout(function(){loop1();return; }, creaTouch[0].refreshRate-creaTouch[iX].scrollrY.timeR3);
  }
  else{
    creaTouch[iX].scrollrY.scrollMomentumAnimate=false;
    if(creaTouch[iX].scrollrY.scrollReturned==false){
      scrollReturnY (creaTouch[iX].scrollrY, e);
    }
    return;
  }
  return;
      }
      loop1();
    }


    else{
      if(!externalTotal && creaTouch[iX].scrollrY.noSnap==false){
        scrollYstart=creaTouch[iX].scrollrY.scrollTop;
        stopPointY=scrollYstart-(creaTouch[iX].scrollrY.scrollTotY*creaTouch[iX].momentumEasing);
        for(i=0;i<creaTouch[iX].scrollrY.children[0].children.length-1;i++){
    if(creaTouch[iX].scrollrY.children[0].children[i].offsetTop<stopPointY &&
      creaTouch[iX].scrollrY.children[0].children[i+1].offsetTop>stopPointY){
      stopPointY=creaTouch[iX].scrollrY.children[0].children[i].offsetTop
      creaTouch[iX].scrollrY.scrollTotY=(scrollYstart-stopPointY);
      break;
    }
  }
  if(stopPointY<creaTouch[iX].scrollYmax-100 && creaTouch[iX].scrollrY.scrollReturned==false && iOS==false){
      creaTouch[iX].scrollrY.scrollTotY=creaTouch[iX].scrollrY.scrollTotY/2;
  }
      }
      
      else{if(externalTotal){
        creaTouch[iX].scrollrY=creaTouch[iX].scrollrY;
        creaTouch[iX].scrollrY.scrollTotY=externalTotal;
        stopPointY=creaTouch[iX].scrollrY.scrollTop-externalTotal;
  if(stopPointY<creaTouch[iX].scrollYmax-100 && creaTouch[iX].scrollrY.scrollReturned==false){
      creaTouch[iX].scrollrY.scrollTotY=creaTouch[iX].scrollrY.scrollTotY/2;
  }

      }
      }
      creaTouch[iX].scrollrY.scrollTotY=(creaTouch[iX].scrollrY.scrollTotY+19)/creaTouch[iX].momentumEasing;
      creaTouch[iX].scrollrY.scrollMomentumAnimate=true;
    function loop2(){
      creaTouch[iX].scrollrY.timeR1=new Date().getTime();
      creaTouch[iX].scrollrY.newStatus=creaTouch[iX].scrollrY.scrollTotY-creaTouch[iX].scrollrY.status;
      creaTouch[iX].scrollrY.scrollTo=creaTouch[iX].scrollrY.Yprev-creaTouch[iX].scrollrY.newStatus;
      creaTouch[iX].scrollrY.scrollTop=creaTouch[iX].scrollrY.scrollTo;
      creaTouch[iX].scrollrY.status=creaTouch[iX].scrollrY.status+(creaTouch[iX].scrollrY.newStatus/creaTouch[iX].momentumEasing);
      if(creaTouch[iX].scrollrY.status<creaTouch[iX].scrollrY.scrollTotY && creaTouch[iX].scrollrY.scrollAnimate==false && creaTouch[iX].scrollrY.Yprev!=creaTouch[iX].scrollrY.scrollTo && creaTouch[iX].scrollrY.newStatus>1 && creaTouch[iX].scrollrY.touchActive==false){
        creaTouch[iX].scrollrY.timeR2=new Date().getTime();
  creaTouch[iX].scrollrY.timeR3=creaTouch[iX].scrollrY.timeR2-creaTouch[iX].scrollrY.timeR1;
  creaTouch[iX].scrollrY.Yprev=creaTouch[iX].scrollrY.scrollTo;
  if(creaTouch[iX].scrollrY.timeR3>creaTouch[0].refreshRate){
    creaTouch[iX].scrollrY.timeR3=creaTouch[0].refreshRate;
    creaTouch[iX].momentumEasing=creaTouch[iX].momentumEasing/2;
  }
  setTimeout(function(){loop2();return; }, creaTouch[0].refreshRate-creaTouch[iX].scrollrY.timeR3);
      }
      else{
        creaTouch[iX].scrollrY.scrollMomentumAnimate=false;
  if(creaTouch[iX].scrollrY.scrollReturned==false){
    scrollReturnY (creaTouch[iX].scrollrY, e);
  }
  return;
      }
      return;
    }
    loop2();
  }
}
  else{   
   

   if(creaTouch[iX].scrollX==true){
      if(!externalTotal){
  creaTouch[iX].scrollrX.scrollTotX=1;
  //speed threshold 0.1 is barely moving
  if(creaTouch[iX].Xmomentum[2]>0.1){
  //calculate the combined Xacceleration of the last 2 touchmove events
    Xacceleration=(creaTouch[iX].Xmomentum[2]/creaTouch[iX].Xmomentum[1])+(creaTouch[iX].Xmomentum[1]/creaTouch[iX].Xmomentum[0]);
    //momentum
    average=creaTouch[0].momentumMultiplier*(Math.pow((creaTouch[iX].Xmomentum[2]+creaTouch[iX].Xmomentum[1]+creaTouch[iX].Xmomentum[0])/4, 2)*(Xacceleration/10));
  }
  //if speed threshold is not met, momentum is set to the distance of the last touchmove
  else{ average=creaTouch[iX].XtouchZ[1]}
  //smoothing
  smooth=average/creaTouch[iX].momentumEasing;
  if (smooth<1){
    smooth=1;
    creaTouch[iX].scrollrX.scrollTotX=average;
    if(creaTouch[iX].scrollrX.scrollTotX<1){creaTouch[iX].scrollrX.scrollTotX=1}
  }
  else{
    creaTouch[iX].scrollrX.scrollTotX=average/smooth;
  }
  //scroll speed / distance maximum cap
  creaTouch[iX].scrollrX.scrollTotX1=creaTouch[iX].scrollWidth/smooth;
  if(creaTouch[iX].scrollrX.scrollTotX>creaTouch[iX].scrollrX.scrollTotX1){creaTouch[iX].scrollrX.scrollTotX=creaTouch[iX].scrollrX.scrollTotX1}
      }
      // if externalTotal exists
      else{creaTouch[iX].scrollrX.scrollTotX=externalTotal}
      creaTouch[iX].scrollrX.status=0;
      creaTouch[iX].scrollrX.Xprev=creaTouch[iX].scrollrX.scrollLeft;

        
    
    if(creaTouch[iX].scrollrX.subLeft==true){
  if(!externalTotal && creaTouch[iX].scrollrX.noSnap==false){
    scrollXstart=creaTouch[iX].scrollrX.scrollLeft;
    stopPointX=scrollXstart+(creaTouch[iX].scrollrX.scrollTotX*creaTouch[iX].momentumEasing);
    if(stopPointX>creaTouch[iX].scrollrX.children[0].offsetWidth-(creaTouch[iX].scrollXmax*3)){stopPointX=creaTouch[iX].scrollrX.children[0].offsetWidth-(creaTouch[iX].scrollXmax*3);}
    for(i=0;i<creaTouch[iX].scrollrX.children[0].children.length-1;i++){
      if(creaTouch[iX].scrollrX.children[0].children[i+1].offsetLeft>stopPointX){
        stopPointX=creaTouch[iX].scrollrX.children[0].children[i].nextX
        creaTouch[iX].scrollrX.scrollTotX=(stopPointX-scrollXstart);
        break;
      }
    }
    if(stopPointX>creaTouch[iX].endScrollContentX+100 && creaTouch[iX].scrollrX.scrollReturned==false && iOS==false){
      creaTouch[iX].scrollrX.scrollTotX=creaTouch[iX].scrollrX.scrollTotX/2;
    }
  }
  else{
    if(externalTotal){
      creaTouch[iX].scrollrX=creaTouch[iX].scrollrX;
      creaTouch[iX].scrollrX.scrollTotX=externalTotal;
      stopPointX=creaTouch[iX].scrollrX.scrollLeft+externalTotal;
      if(stopPointX>creaTouch[iX].endScrollContentX+100 && creaTouch[iX].scrollrX.scrollReturned==false && iOS==false){
        creaTouch[iX].scrollrX.scrollTotX=creaTouch[iX].scrollrX.scrollTotX/2;
      }
    }
  }
    creaTouch[iX].scrollrX.scrollTotX=(creaTouch[iX].scrollrX.scrollTotX+19)/creaTouch[iX].momentumEasing;
    creaTouch[iX].scrollrX.scrollMomentumAnimate=true;
  function loop3(){
      creaTouch[iX].scrollrX.timeR1=new Date().getTime();
      creaTouch[iX].scrollrX.newStatus=creaTouch[iX].scrollrX.scrollTotX-creaTouch[iX].scrollrX.status;
      creaTouch[iX].scrollrX.scrollTo=creaTouch[iX].scrollrX.Xprev+creaTouch[iX].scrollrX.newStatus;
      creaTouch[iX].scrollrX.scrollLeft=creaTouch[iX].scrollrX.scrollTo;
      creaTouch[iX].scrollrX.status=creaTouch[iX].scrollrX.status+(creaTouch[iX].scrollrX.newStatus/creaTouch[iX].momentumEasing);
      if(creaTouch[iX].scrollrX.status<creaTouch[iX].scrollrX.scrollTotX && creaTouch[iX].scrollrX.scrollAnimate==false &&  creaTouch[iX].scrollrX.Xprev!=creaTouch[iX].scrollrX.scrollTo && creaTouch[iX].scrollrX.newStatus>1 && creaTouch[iX].scrollrX.touchActive==false){
        creaTouch[iX].scrollrX.timeR2=new Date().getTime();
        creaTouch[iX].scrollrX.timeR3=creaTouch[iX].scrollrX.timeR2-creaTouch[iX].scrollrX.timeR1;
        creaTouch[iX].scrollrX.Xprev=creaTouch[iX].scrollrX.scrollTo;
        if(creaTouch[iX].scrollrX.timeR3>creaTouch[0].refreshRate){
    creaTouch[iX].scrollrX.timeR3=creaTouch[0].refreshRate;
    creaTouch[iX].momentumEasing=creaTouch[iX].momentumEasing/2;
        }
        setTimeout(function(){loop3();return; }, creaTouch[0].refreshRate-creaTouch[iX].scrollrX.timeR3);
      }
      else{
        creaTouch[iX].scrollrX.scrollMomentumAnimate=false;
        if(creaTouch[iX].scrollrX.scrollReturned==false){
    scrollReturnX (creaTouch[iX].scrollrX, e);
        }
        return;
      }
      ;return;
  }
  loop3();
      }
      else{
  if(!externalTotal && creaTouch[iX].scrollrX.noSnap==false){
    scrollXstart=creaTouch[iX].scrollrX.scrollLeft;
    stopPointX=scrollXstart-(creaTouch[iX].scrollrX.scrollTotX*creaTouch[iX].momentumEasing);
    if(stopPointX<creaTouch[iX].scrollXmax){stopPointX=creaTouch[iX].scrollXmax+10;}
    for(i=0;i<creaTouch[iX].scrollrX.children[0].children.length-1;i++){
      if(creaTouch[iX].scrollrX.children[0].children[i].offsetLeft<stopPointX &&
        creaTouch[iX].scrollrX.children[0].children[i+1].offsetLeft>stopPointX){
        stopPointX=creaTouch[iX].scrollrX.children[0].children[i].offsetLeft
        creaTouch[iX].scrollrX.scrollTotX=(scrollXstart-stopPointX);
        break;
      }
    }
    if(stopPointX<creaTouch[iX].scrollXmax-100 && creaTouch[iX].scrollrX.scrollReturned==false){
      creaTouch[iX].scrollrX.scrollTotX=creaTouch[iX].scrollrX.scrollTotX/2;
    }
  }
  
  else{
    if(externalTotal){
      creaTouch[iX].scrollrX=creaTouch[iX].scrollrX;
      creaTouch[iX].scrollrX.scrollTotX=externalTotal;
      stopPointX=creaTouch[iX].scrollrX.scrollLeft-externalTotal;
      if(stopPointX<creaTouch[iX].scrollXmax-100 && creaTouch[iX].scrollrX.scrollReturned==false){
    creaTouch[iX].scrollrX.scrollTotX=creaTouch[iX].scrollrX.scrollTotX/2;
      }

    }
  }
  creaTouch[iX].scrollrX.scrollTotX=(creaTouch[iX].scrollrX.scrollTotX+19)/creaTouch[iX].momentumEasing;
  creaTouch[iX].scrollrX.scrollMomentumAnimate=true;
      function loop4(){
    creaTouch[iX].scrollrX.timeR1=new Date().getTime();
    creaTouch[iX].scrollrX.newStatus=creaTouch[iX].scrollrX.scrollTotX-creaTouch[iX].scrollrX.status;
    creaTouch[iX].scrollrX.scrollTo=creaTouch[iX].scrollrX.Xprev-creaTouch[iX].scrollrX.newStatus;
    creaTouch[iX].scrollrX.scrollLeft=creaTouch[iX].scrollrX.scrollTo;
    creaTouch[iX].scrollrX.status=creaTouch[iX].scrollrX.status+(creaTouch[iX].scrollrX.newStatus/creaTouch[iX].momentumEasing);
    if(creaTouch[iX].scrollrX.status<creaTouch[iX].scrollrX.scrollTotX && creaTouch[iX].scrollrX.scrollAnimate==false && creaTouch[iX].scrollrX.Xprev!=creaTouch[iX].scrollrX.scrollTo && creaTouch[iX].scrollrX.newStatus>1 && creaTouch[iX].scrollrX.touchActive==false){
      creaTouch[iX].scrollrX.timeR2=new Date().getTime();
      creaTouch[iX].scrollrX.timeR3=creaTouch[iX].scrollrX.timeR2-creaTouch[iX].scrollrX.timeR1;
      creaTouch[iX].scrollrX.Xprev=creaTouch[iX].scrollrX.scrollTo;
      if(creaTouch[iX].scrollrX.timeR3>creaTouch[0].refreshRate){
        creaTouch[iX].scrollrX.timeR3=creaTouch[0].refreshRate;
        creaTouch[iX].momentumEasing=creaTouch[iX].momentumEasing/2;
      }
      setTimeout(function(){loop4();return; }, creaTouch[0].refreshRate-creaTouch[iX].scrollrX.timeR3);
      
    }
  else{
    creaTouch[iX].scrollrX.scrollMomentumAnimate=false;
    if(creaTouch[iX].scrollrX.scrollReturned==false){
        scrollReturnX (creaTouch[iX].scrollrX, e);
    }
    return;
    
  }
  return;
      }
      loop4();
      
    }
  }
}
 return;
    
      
}
     
     
     
  
     
     
     
     
     
     
     
     
function scrollReturnX (scrollr, e){
  var iX = e.creatanaTouchInstance;
  i=0; creaTouch[iX].scrollrX.scrollReturned=true
    if(scrollr.scrollLeft<creaTouch[iX].scrollXmax && scrollr.noSnap==false){
  scrollr.subLeft=true; scrollr.subRight=false;scrollr.scrollY=false;scrollr.scrollX=true;
  scrollr.subLeft=true; scrollr.subRight=false;creaTouch[iX].scrollY=false;creaTouch[iX].scrollX=true;
  scrollr.touchActive=false;creaTouch[iX].touchActive=false;
  scrollr.scrollAnimate=false;creaTouch[iX].scrollAnimate=false;
  creaTouch[iX].scrollrX=scrollr;
  n=creaTouch[iX].scrollXmax;
  nx=(creaTouch[iX].scrollXmax-scrollr.scrollLeft);
  scrollMomentum(e, nx);
  
    }
    else{
  if(scrollr.scrollLeft>creaTouch[iX].endScrollContentX && scrollr.noSnap==false){
  scrollr.subLeft=false; scrollr.subRight=true;scrollr.scrollY=false;scrollr.scrollX=true;
  scrollr.subLeft=false; scrollr.subRight=true;creaTouch[iX].scrollY=false;creaTouch[iX].scrollX=true;
  scrollr.touchActive=false;creaTouch[iX].touchActive=false;
  scrollr.scrollAnimate=false;creaTouch[iX].scrollAnimate=false;
  creaTouch[iX].scrollrX=scrollr;
  scrollMomentum(e, (scrollr.scrollLeft-creaTouch[iX].endScrollContentX))
  }
    }
}


function scrollReturnY (scrollr, e){
  var iX = e.creatanaTouchInstance;
  i=0; creaTouch[iX].scrollrY.scrollReturned=true
    if(scrollr.scrollTop>creaTouch[iX].scrollYmax && scrollr.noSnap==false){
  scrollr.scrollY=true;scrollr.scrollX=false;
  scrollr.subUp=false; scrollr.subDown=true;creaTouch[iX].scrollY=true;creaTouch[iX].scrollX=false;
  scrollr.touchActive=false;creaTouch[iX].touchActive=false;
  scrollr.scrollAnimate=false;creaTouch[iX].scrollAnimate=false;
  creaTouch[iX].scrollrY=scrollr;
  n=creaTouch[iX].scrollYmax;
  nx=(creaTouch[iX].scrollYmax-scrollr.scrollTop);
  scrollMomentum(e, nx);
  
    }
    else{
  if(scrollr.scrollTop<creaTouch[iX].endScrollContentY && scrollr.noSnap==false){
  scrollr.scrollY=true;scrollr.scrollX=false;
  scrollr.subUp=true; scrollr.subDown=false;creaTouch[iX].scrollY=true;creaTouch[iX].scrollX=false;
  scrollr.touchActive=false;creaTouch[iX].touchActive=false;
  scrollr.scrollAnimate=false;creaTouch[iX].scrollAnimate=false;
  creaTouch[iX].scrollrY=scrollr;
  scrollMomentum(e, (scrollr.scrollTop-creaTouch[iX].endScrollContentY))
  }
    }
}
 
function findScrollParentY(e){
  var iX = e.creatanaTouchInstance;
      epScroll2=window.getComputedStyle(e).getPropertyValue("overflow-y");
    if(epScroll2=='scroll'){
  return e;
    }else{
      ep=getAllParents(e);
      ep.reverse();
      for(i=0;i<ep.length;i++){
    if(ep[i]!=document){
    epScroll2=window.getComputedStyle(ep[i]).getPropertyValue("overflow-y");
      if(epScroll2 =='scroll'){
        if(ep[i]==document.body.parentNode && webkit==true){
    ep[i]=document.body;}
        if(i<1){ ep[i].scrollReturnedY=true;}
        return ep[i];
        
      }
    }
      }
      docscroll2=window.getComputedStyle(document.body).getPropertyValue("overflow-y");
      if(docscroll2=='hidden'){return false;}
      document.body.scrollReturnedY=true;
      return document.body;
    }
}


function findScrollParentX(e){
  var iX = e.creatanaTouchInstance;
   epScroll2=window.getComputedStyle(e).getPropertyValue("overflow-x");
   if(epScroll2=='scroll'){
      return e;
   }else{
    ep=getAllParents(e);
    ep.reverse();
    for(i=0;i<ep.length;i++){
  if(ep[i]!=document){
    epScroll=window.getComputedStyle(ep[i]).getPropertyValue("overflow-x");
    if(epScroll=='scroll' ){
      if(i<1){
        ep[i].scrollReturnedX=true;
      };
      return ep[i]
    }
  }
    }
    docscroll=window.getComputedStyle(document.body).getPropertyValue("overflow-x");
    if(docscroll=='hidden'){return false;}
    document.body.scrollReturnedX=true;
    return document.body;
   }
}

 function findScrollChildY(e){
  var iX = e.creatanaTouchInstance;
    scrollingChildren=[];
   currentChildren=e.children;
   while(currentChildren.length>=1){
    nextChildren=[];
      for(i=0;i<currentChildren.length;i++){
  currentChildrenScroll1=window.getComputedStyle(currentChildren[i]).getPropertyValue("overflow");
  currentChildrenScroll2=window.getComputedStyle(currentChildren[i]).getPropertyValue("overflow-y");
  for(creaTouch[iX].j=0;creaTouch[iX].j<currentChildren[i].children.length;creaTouch[iX].j++){
      nextChildren.push(currentChildren[i].children[creaTouch[iX].j]);
    }
  if(!currentChildren[i].creatanaTouchInstance && (currentChildrenScroll1 =='scroll' || currentChildrenScroll2 =='scroll')){
    scrollingChildren.push(currentChildren[i])
  }
      }
   currentChildren=nextChildren
   }
return scrollingChildren;
 }
 function findScrollChildX(e){
  var iX = e.creatanaTouchInstance;
    scrollingChildren=[];
   currentChildren=e.children;
   while(currentChildren.length>=1){
    nextChildren=[];
      for(i=0;i<currentChildren.length;i++){
    currentChildrenScroll2=window.getComputedStyle(currentChildren[i]).getPropertyValue("overflow-x");
    for( var j=0; j < currentChildren[i].children.length; j++){
      nextChildren.push(currentChildren[i].children[j]);}
      if(!currentChildren[i].creatanaTouchInstance && currentChildrenScroll2 =='scroll'){ scrollingChildren.push(currentChildren[i]);}
    
    }
  currentChildren=nextChildren
   }
return scrollingChildren;
 }
 
function swipeTrue(e){
  console.log('Swipe');
  var iX = e.creatanaTouchInstance;
// reference lines 99 - 125
   a=creaTouch[e.creatanaTouchInstance];
      if (a.rightSwipeFunction!=false &&  creaTouch[iX].subRight==true){
  a.rightSwipeFunction();  };
      if (a.leftSwipeFunction!=false && creaTouch[iX].subLeft==true){
   a.leftSwipeFunction();};
      if (a.upSwipeFunction!=false && creaTouch[iX].subUp==true){
   a.upSwipeFunction(); };
      if (a.downSwipeFunction!=false && creaTouch[iX].subDown==true){
   a.downSwipeFunction();  };
      
 
  ;return;
}
