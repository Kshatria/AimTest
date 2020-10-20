//cursor
(function () {
  var mouse = { x: 0, y: 0 };
  var pos = { x: 0, y: 0 };
  var ratio = 0.15;
  var active = false;
  var ball = document.querySelector("#ball");

  TweenLite.set(ball, { xPercent: -50, yPercent: -50 });

  document.addEventListener("mousemove", mouseMove);

  function mouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }

  TweenLite.ticker.addEventListener("tick", updatePosition);

  function updatePosition() {
    if (!active) {
      pos.x += (mouse.x - pos.x) * ratio;
      pos.y += (mouse.y - pos.y) * ratio;

      TweenLite.set(ball, { x: pos.x, y: pos.y });
    }
  }

  $(".js-control").mouseenter(function(e) {
    TweenMax.to(this, 0.3, { scale: 1.5 });
    TweenMax.to(ball, 0.3, { scale: 2 });
    active = true;
  });

  $(".js-control").mouseleave(function(e) {
    TweenMax.to(this, 0.3, { scale: 1 });
    TweenMax.to(ball, 0.3, { scale: 1 });
    TweenMax.to(this.querySelector(".img-control"), 0.3, { x: 0, y: 0 });
    active = false;
  });

  $(".js-control").mousemove(function(e) {
    parallaxCursor(e, this, 3);
    callParallax(e, this);
  });

  function callParallax(e, parent) {
    parallaxIt(e, parent, parent.querySelector(".img-control"), 10);
  }

  function parallaxIt(e, parent, target, movement) {
    var boundingRect = parent.getBoundingClientRect();
    var relX = e.pageX - boundingRect.left;
    var relY = e.pageY - boundingRect.top;

    TweenMax.to(target, 0.3, {
      x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
      y: (relY - boundingRect.height / 2) / boundingRect.height * movement,
      ease: Power2.easeOut
    });
  }

  function parallaxCursor(e, parent, movement) {
    var rect = parent.getBoundingClientRect();
    var relX = e.pageX - rect.left;
    var relY = e.pageY - rect.top;
    pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
    pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
    TweenMax.to(ball, 0.3, { x: pos.x, y: pos.y });
  }
})()

// card parallax
if (window.innerWidth > 992) {
  function parallaxHover(el, parent, intensity) {

      var self         = this,
          elClass      = el.replace(/\./g,''),
          parentClass  = parent.replace(/\./g,''),
          parent       = document.getElementsByClassName(parentClass),
          $parent      = $(parent),
          els          = document.getElementsByClassName(elClass);

      this.perspective = function(e, el) {

          var elX      = el.getBoundingClientRect().left,
              elY      = el.getBoundingClientRect().top,
              elWidth  = el.offsetWidth,
              elHeight = el.offsetHeight;

          var mouseX = e.clientX,
              mouseY = e.clientY;

          var valY   = -( ( elWidth/2 - (mouseX - elX) ) / (elWidth/2) * intensity ),
              valX   = ( elHeight/2 - (mouseY - elY) ) / (elHeight/2) * intensity;

          el.style.webkitTransform = 'rotateX('+ valX.toFixed(1) + 'deg) rotateY(' + valY.toFixed(1) + 'deg)'; // need webkit transform for this to work in safari 8
          el.style.transform       = 'rotateX('+ valX.toFixed(1) + 'deg) rotateY(' + valY.toFixed(1) + 'deg)'; // toFixed to round decimal values

      }

      this.anim = function(el, valX, valY, time) {

          animate({
              time: time,  // time in seconds
              run: function(rate) {
                  el.style.webkitTransform = 'rotateX('+ rate*valX +'deg) rotateY('+ rate*valY +'deg)';
                  el.style.transform = 'rotateX('+ rate*valX +'deg) rotateY('+ rate*valY +'deg)';
              }
          });

          function animate(item) {

              var duration = 1000*item.time,
                  end = +new Date() + duration;

              var step = function() {

                  var current = +new Date(),
                      remaining = end - current;

                  if( remaining < 60 ) {
                      item.run(0);  // 1 = progress is at 100%
                      return;

                  } else {
                      var rate = remaining/duration;
                      item.run(rate);
                  }
                  window.requestAnimationFrame(step);
              }
              step();
          }
      }

      this.getTransforms = function(el) {

          var st           = window.getComputedStyle(el, null),
              matrix       = st.getPropertyValue("transform"),
              webkitMatrix = st.getPropertyValue("-webkit-transform"),
              rotateX = 0,
              rotateY = 0,
              rotateZ = 0;

          if (matrix !== 'none') {       

              // for safari
              if (!webkitMatrix == '') {
                  matrix = webkitMatrix;
              }

              // calculate the values of the rotation
              var values      = matrix.split('(')[1].split(')')[0].split(','),
                  pi          = Math.PI,
                  sinB        = parseFloat(values[8]),
                  b           = Math.asin(sinB) * 180 / pi,
                  cosB        = Math.cos(b * pi / 180),
                  matrixVal10 = parseFloat(values[9]),
                  a           = Math.asin(-matrixVal10 / cosB) * 180 / pi,
                  rotateX = a;
                  rotateY = b;

              return [rotateX, rotateY];
              
          }

      }

      $parent.on('mousemove', el, function(e){
          self.perspective(e, this);
      });

      $parent.on('mouseleave', el, function(e){
          self.anim(this, self.getTransforms(this)[0], self.getTransforms(this)[1], 0.3);
      });    
  }
    parallaxHover('.parallax-card', '.parallax-perspective', 8);
}

//init main slider
let main = new Swiper('.main__slider-container', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 50,
    speed: 600,
    mousewheel: true,
    parallax: true,
    simulateTouch: false,
    pagination: {
        el: '.main__pagination',
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + ('0' + [index]) + '</span>';
        },
      },
      navigation: {
        nextEl: '.main__button-next',
        prevEl: '.main__button-prev',
      },
});

//mobile menu
$(document).ready(function () {
  $('.header__nav-button--open').on('click', function () {
    $('.header__nav-wrapper').addClass('active')
  });

  $('.header__nav-button--close').on('click', function () {
    $('.header__nav-wrapper').removeClass('active')
  });
});

//main slider chenge
(function () {
  let pageBtnWrapper = document.querySelector('.main__button-next-wrapper')
  pageBtnWrapper.addEventListener('click', function () {
    if (pageBtnWrapper.classList.contains('is-end')) {
      main.slideTo(0, 1000, true)
      pageBtnWrapper.classList.remove('is-end')
    }
  });
    main.on('transitionEnd', function() {
      let pageIndex = main.realIndex
      let pageBtn = document.querySelector('.main__button-text')
      $(pageBtnWrapper).attr('style', 'padding: 0 0 0 40px')
      $(pageBtnWrapper).removeClass('main__button-next-wrapper--js')

      if (pageIndex == 0) {
        pageBtn.innerText = 'Преимущества'
      } else if (pageIndex == 1) {
        pageBtn.innerText = 'Услуги'
        if (pageBtnWrapper.classList.contains('is-end')) {
          pageBtnWrapper.classList.remove('is-end')
        }
      } else if (pageIndex == 2) {
        pageBtn.innerText = 'Примеры работ'
        if (pageBtnWrapper.classList.contains('is-end')) {
          pageBtnWrapper.classList.remove('is-end')
        }
      } else if (pageIndex == 3) {
        pageBtn.innerText = 'Об агенстве'
        if (pageBtnWrapper.classList.contains('is-end')) {
          pageBtnWrapper.classList.remove('is-end')
        }
      } else if (pageIndex == 4) {
        pageBtn.innerText = 'Блог'
        if (pageBtnWrapper.classList.contains('is-end')) {
          pageBtnWrapper.classList.remove('is-end')
        }
      } else if (pageIndex == 5) {
        pageBtn.innerText = 'Отзывы'
        if (pageBtnWrapper.classList.contains('is-end')) {
          pageBtnWrapper.classList.remove('is-end')
        }
      } else if (pageIndex == 6) {
        pageBtn.innerText = 'Контакты'
          if (pageBtnWrapper.classList.contains('is-end')) {
            pageBtnWrapper.classList.remove('is-end')
          }
      } else if (pageIndex == 7) {
        pageBtn.innerText = 'Главная'
        $(pageBtnWrapper).attr('style', 'padding: 0 40px 0 0')
        $(pageBtnWrapper).addClass('main__button-next-wrapper--js')
          pageBtnWrapper.classList.add('is-end')
      }

      if (window.innerWidth > 992 ) {
        pageIndex == 0
        ? document.querySelector('.main__button-prev-wrapper').setAttribute('style', 'display:none;')
        : document.querySelector('.main__button-prev-wrapper').setAttribute('style', 'display:block;')
      }

      // start animation
      let indexSlide = document.querySelector('.main__slide--index')
      if (indexSlide.classList.contains('swiper-slide-active')) {
        $('.index__title').addClass('active')
        $('.index__logo-left').addClass('active')
        $('.index__logo-right').addClass('active')
        $('.parallax-perspective').addClass('active')
        $('.index__btn').addClass('active')
      } else {
        $('.index__title').removeClass('active')
        $('.index__logo-left').removeClass('active')
        $('.index__logo-right').removeClass('active')
        $('.parallax-perspective').removeClass('active')
        $('.index__btn').removeClass('active')
        }
    })
})();

//init advantages slider
if (window.innerWidth > 1500) {
  var advantages = new Swiper('.advantages__container', {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    navigation: {
      nextEl: '.advantages__button-next',
      prevEl: '.advantages__button-prev',
    },
  });
} else if (window.innerWidth > 1200) {
  var advantages = new Swiper('.advantages__container', {
    slidesPerView: 3,
    spaceBetween: 30,
    freeMode: true,
    navigation: {
      nextEl: '.advantages__button-next',
      prevEl: '.advantages__button-prev',
    },
  });
} else if (window.innerWidth > 992) {
  var advantages = new Swiper('.advantages__container', {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    navigation: {
      nextEl: '.advantages__button-next',
      prevEl: '.advantages__button-prev',
    },
  });
} else {
  $('.advantages__container').removeClass('swiper-container')
  $('.advantages__swiper-wrapper').removeClass('swiper-wrapper')
  $('.advantages__swiper-slide').removeClass('swiper-slide')
}

//init services slider 
if (window.innerWidth > 1200) {
  var services = new Swiper('.services__container', {
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: {
      nextEl: '.services__button-next',
      prevEl: '.services__button-prev',
    },
  });
} else if (window.innerWidth > 992) {
  var services = new Swiper('.services__container', {
    slidesPerView: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: '.services__button-next',
      prevEl: '.services__button-prev',
    },
  });  
} else {
  $('.services__container').removeClass('swiper-container')
  $('.services__swiper-wrapper').removeClass('swiper-wrapper')
  $('.services__swiper-slide').removeClass('swiper-slide')
}

// init works slider
if (window.innerWidth < 992) {
  var worksMobile = new Swiper('.works__mobile-slider', {
    slidesPerView: 1,
    spaceBetween: 200,
    pagination: {
      el: '.works__mobile-pagination',
    },
  });
} else {
  var works = new Swiper('.works__project', {
    direction: 'vertical',
    slidesPerView: 2.5,
    centeredSlides: true,
    spaceBetween: 150,
    navigation: {
      nextEl: '.works__button-next',
      prevEl: '.works__button-prev',
    },
    pagination: {
      el: '.works__pagination',
      type: 'fraction',
    },
  });
}

//init partners slider
if (window.innerWidth > 1500) {
  var partners = new Swiper('.partners__container', {
    slidesPerView: 4,
    spaceBetween: 0,
    navigation: {
      nextEl: '.partners__button-next',
      prevEl: '.partners__button-prev',
    },
  });
}  else if (window.innerWidth > 1200) {
  var partners = new Swiper('.partners__container', {
    slidesPerView: 3,
    spaceBetween: 0,
    navigation: {
      nextEl: '.partners__button-next',
      prevEl: '.partners__button-prev',
    },
  });
} else {
  var partners = new Swiper('.partners__container', {
    slidesPerView: 2,
    spaceBetween: 50,
    navigation: {
      nextEl: '.partners__button-next',
      prevEl: '.partners__button-prev',
    },
  });
}

//init partners minibar
if (window.innerWidth > 992) {
  new MiniBar('#myContent');
}

//init blog slider
if (window.innerWidth > 1500) {
  var blog = new Swiper('.blog__container', {
    slidesPerView: 2,
    spaceBetween: 50,
    navigation: {
      nextEl: '.blog__button-next',
      prevEl: '.blog__button-prev',
    },
  });
} else if (window.innerWidth > 1200) {
  var blog = new Swiper('.blog__container', {
    slidesPerView: 1.5,
    spaceBetween: 50,
    navigation: {
      nextEl: '.blog__button-next',
      prevEl: '.blog__button-prev',
    },
  });
} else if (window.innerWidth > 992) {
  var blog = new Swiper('.blog__container', {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: {
      nextEl: '.blog__button-next',
      prevEl: '.blog__button-prev',
    },
  });
} else {
  var blogMobile = new Swiper('.blog__mobile-container', {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: {
      el: '.blog__pagination',
    },
  });
}

//init reviews slider
if (window.innerWidth > 1500) {
  var reviews = new Swiper('.reviews__container', {
    slidesPerView: 2,
    spaceBetween: 50,
    navigation: {
      nextEl: '.reviews__button-next',
      prevEl: '.reviews__button-prev',
    },
  });
} else {
  var reviews = new Swiper('.reviews__container', {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: {
      nextEl: '.reviews__button-next',
      prevEl: '.reviews__button-prev',
    },
  });
}

//sliders controls
(function () {
  let getSliderLastElement = function (sliderId) {
    let i = sliderId.querySelectorAll('.swiper-slide')
    let lastElement = i.length
    return lastElement
  }
  
  if (window.innerWidth > 992) {
    advantages.on('transitionEnd', function() {
      let slideIndex = advantages.realIndex
      let advantagesSlider = document.querySelector('#advantages')
      getSliderLastElement(advantagesSlider) == slideIndex + advantages.passedParams.slidesPerView
      ? document.querySelector('.advantages__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.advantages__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.advantages__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.advantages__button-prev-wrapper').setAttribute('style', 'display:block;')
    })
  
    services.on('transitionEnd', function() {
      let slideIndex = services.realIndex
      let servicesSlider = document.querySelector('#services')
      console.log(slideIndex)
      console.log(services.passedParams.slidesPerView)
      getSliderLastElement(servicesSlider) == slideIndex + services.passedParams.slidesPerView
      ? document.querySelector('.services__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.services__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.services__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.services__button-prev-wrapper').setAttribute('style', 'display:block;')
    })
  
    works.on('transitionEnd', function() {
      let slideIndex = works.realIndex
      let worksSlider_allWorks = document.querySelector('#all_works')
      getSliderLastElement(worksSlider_allWorks) == slideIndex + 1
      ? document.querySelector('.works__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.works__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.works__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.works__button-prev-wrapper').setAttribute('style', 'display:block;')
    })

    partners.on('transitionEnd', function() {
      let slideIndex = partners.realIndex
      let partnersSlider = document.querySelector('#partners')
      getSliderLastElement(partnersSlider) == slideIndex + partners.passedParams.slidesPerView
      ? document.querySelector('.partners__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.partners__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.partners__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.partners__button-prev-wrapper').setAttribute('style', 'display:block;')
    })

    blog.on('transitionEnd', function() {
      let slideIndex = blog.realIndex
      let blogSlider = document.querySelector('#blog')
      getSliderLastElement(blogSlider) == slideIndex + blog.passedParams.slidesPerView
      ? document.querySelector('.blog__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.blog__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.blog__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.blog__button-prev-wrapper').setAttribute('style', 'display:block;')
    })

    reviews.on('transitionEnd', function() {
      let slideIndex = reviews.realIndex
      let reviewsSlider = document.querySelector('#reviews')
      getSliderLastElement(reviewsSlider) == slideIndex + reviews.passedParams.slidesPerView
      ? document.querySelector('.reviews__button-next-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.reviews__button-next-wrapper').setAttribute('style', 'display:block;')
      slideIndex == 0
      ? document.querySelector('.reviews__button-prev-wrapper').setAttribute('style', 'display:none;')
      : document.querySelector('.reviews__button-prev-wrapper').setAttribute('style', 'display:block;')
    })
  }
})()
