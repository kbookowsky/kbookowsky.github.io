const project = {
  init() {
    this.hamburger();
    this.fixedHeader();
    this.headerLinks();
    this.onScroll();
    this.swiper();
  },
  hamburger() {
    const header = document.querySelector('header');
    const hamburgerMenu = document.getElementById('hamburgerMenu');

    if (!hamburgerMenu) {
      return;
    }

    const headerMenu = document.querySelector('.header__menu');
    const textOpen = hamburgerMenu.querySelector('.screen-reader-text.open');
    const textClose = hamburgerMenu.querySelector('.screen-reader-text.close');

    let switchOn = false;

    hamburgerMenu.addEventListener('click', () => {
      if (!switchOn) {
        header.classList.add('menu-open');
        hamburgerMenu.classList.add('active');
        headerMenu.classList.add('active');
        textOpen.classList.remove('active');
        textClose.classList.add('active');
        switchOn = true;
      } else {
        header.classList.remove('menu-open');
        hamburgerMenu.classList.remove('active');
        headerMenu.classList.remove('active');
        textOpen.classList.add('active');
        textClose.classList.remove('active');
        switchOn = false;
      }
    });

    window.addEventListener('resize', () => {
      if (switchOn && window.innerWidth > 991) {
        header.classList.remove('menu-open');
        hamburgerMenu.classList.remove('active');
        headerMenu.classList.remove('active');
        textOpen.classList.add('active');
        textClose.classList.remove('active');
        switchOn = false;
      }
    });
  },
  // eslint-disable-next-line consistent-return
  fixedHeader() {
    const header = document.querySelector('header.header');

    if (header.length === 0) {
      return false;
    }

    function getScrollPosition() {
      if (window.scrollY > 100) {
        header.classList.add('active');
      } else {
        header.classList.remove('active');
      }
    }

    window.addEventListener('scroll', this.fixedHeader);

    getScrollPosition();
  },
  headerLinks() {
    window.addEventListener('scroll', function () {
      const windowTop = this.scrollY;
      const headerHeight = document.querySelector('header.header').offsetHeight;
      const items = document.querySelectorAll('.header__menu .menu--header .menu-item a');

      items.forEach((el, index) => {
        const anchor = el.href.includes('#') ? el.href.substr(el.href.indexOf('#')) : false;
        const target = anchor ? document.querySelector(anchor) : false;
        const offset = target ? target.offsetTop - headerHeight - 1 : false;
        const menuItem = el.closest('.menu-item');
        const isAnchorNext = items[index + 1] ? items[index + 1].href.includes('#') : false;
        const anchorNext = isAnchorNext ? items[index + 1].href.substr(items[index + 1].href.indexOf('#')) : false;
        const targetNext = anchorNext ? document.querySelector(anchorNext) : false;
        const offsetNext = targetNext ? targetNext.offsetTop - headerHeight - 1 : false;
        const offsetWithHeight = offset ? offset + target.offsetHeight : false;

        if (offset === false) {
          return;
        }

        if (windowTop >= offset && !menuItem.classList.contains('active')) {
          if ((windowTop < offsetNext || offsetNext === false) && windowTop < offsetWithHeight) {
            menuItem.classList.add('active');
          }
        } else if (windowTop >= offset && offsetNext === false && windowTop >= offsetWithHeight) {
          menuItem.classList.remove('active');
        } else if (windowTop < offset || (offsetNext !== false && windowTop >= offsetNext)) {
          menuItem.classList.remove('active');
        }
      });
    });
  },
  onScroll() {
    function toggleVisibility(init = false) {
      const items = document.querySelectorAll('.onscroll, main.main>[class^="wp-block-"], main.main>p, main.main>ul, main.main>ol');
      const bottomDistance = init ? 0 : 100;
      const toToggle = [];

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();

        if (!item.classList.contains('visible') && !item.classList.contains('to-init') && rect.top <= window.innerHeight - bottomDistance) {
          if (init && rect.top >= 0) {
            toToggle[toToggle.length] = item;
            item.classList.add('to-init');
          } else {
            item.classList.add('visible');
          }
        }
      });

      if (init && toToggle.length > 0) {
        toToggle.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
            item.classList.remove('to-init');
          }, 100 * index);
        });
      }
    }

    document.addEventListener('scroll', toggleVisibility);

    document.addEventListener('resize', () => toggleVisibility(true));

    setTimeout(() => toggleVisibility(true), 200);
  },
  swiper() {
    const screenshot = document.querySelector('section.screenshot');
    const screenshotSwiper = screenshot.querySelector('.swiper');

    if (screenshotSwiper) {
      // eslint-disable-next-line no-new, no-undef
      new Swiper(screenshotSwiper, {
        slidesPerView: 'auto',
        centeredSlides: true,
        initialSlide: 2,
        spaceBetween: 9,
        navigation: {
          prevEl: screenshot.querySelector('.swiper-button-prev'),
          nextEl: screenshot.querySelector('.swiper-button-next'),
        },
        pagination: {
          el: screenshot.querySelector('.swiper-pagination'),
        },
        on: {
          slideChange: (swiper) => {
            const { slides } = swiper;
            const index = swiper.activeIndex;

            slides.forEach((slide, i) => {
              if (index - 2 >= i) {
                slide.classList.remove('to-left');
                slide.classList.add('to-right');
              } else if (index + 2 <= i) {
                slide.classList.remove('to-right');
                slide.classList.add('to-left');
              } else {
                slide.classList.remove('to-left');
                slide.classList.remove('to-right');
              }
            });
          },
        },
      });
    }

    const testimonials = document.querySelector('section.testimonials');
    const testimonialsSwiper = testimonials.querySelector('.swiper');

    if (testimonialsSwiper) {
      // eslint-disable-next-line no-new, no-undef
      new Swiper(testimonialsSwiper, {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        effect: 'creative',
        creativeEffect: {
          next: {
            translate: ['29.5%', 0, 0],
            scale: 0.93,
          },
          prev: {
            translate: ['-29.5%', 0, 0],
            scale: 0.93,
          },
        },
        // initialSlide: 1,
        spaceBetween: 9,
        pagination: {
          el: testimonials.querySelector('.swiper-pagination'),
        },
      });
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  project.init();
});
