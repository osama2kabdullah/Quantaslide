var ProductSplide = new Splide( '.product-slider-1', {
  perPage: 4,
  perMove: 1,
  drag: false,
  gap: 20,
  breakpoints: {
		640: {
			perPage: 2,
		},
  },
  classes: {
		arrows: 'splide__arrows your-class-arrows',
		arrow : 'splide__arrow your-class-arrow',
		prev  : 'splide__arrow--prev your-class-prev',
		next  : 'splide__arrow--next your-class-next',
  }
} );

var splideReviews = new Splide( '.review-slider-1', {
  perPage: 3,
  perMove: 1,
  gap: 20,
  breakpoints: {
		640: {
			perPage: 1,
		},
  },
  drag: false,
  classes: {
		arrows: 'splide__arrows your-class-arrows',
		arrow : 'splide__arrow your-class-arrow',
		prev  : 'splide__arrow--prev your-class-prev',
		next  : 'splide__arrow--next your-class-next',
  }
} );

ProductSplide.mount();
splideReviews.mount();