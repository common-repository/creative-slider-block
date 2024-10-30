const { Swiper } = window;

function csbloSlidesSliderInit() {
	// Check if Swiper is defined.
	if ( typeof Swiper === 'undefined' ) {
		return;
	}

	const $sliders = document.querySelectorAll( '.csblo-slides-slider' );

	// Return early if no slider.
	if ( ! $sliders.length ) {
		return;
	}

	$sliders.forEach( ( $slider ) => {
		const $swiper = $slider.querySelector( '.swiper' );

		// Return early if no swiper container.
		if ( ! $swiper ) {
			return;
		}

		const $prev = $slider.querySelector( '.wp-block-csblo-slides__prev' );
		const $next = $slider.querySelector( '.wp-block-csblo-slides__next' );
		const $pagination = $slider.querySelector( '.swiper-pagination' );

		// Data
		let options = {};
		try {
			const optionsData = $swiper.dataset.csbloSwiperOptions;
			if ( optionsData ) {
				options = JSON.parse( optionsData );
			}
		} catch ( error ) {
			console.error( 'Error parsing JSON data:', error );
		}

		// Swiper configuration
		const effect = options?.effect ?? 'slide';

		let autoplay = false;
		const autoplaySettings = {};
		if ( options.autoplay?.enable ) {
			autoplaySettings[ 'delay' ] = options.autoplay?.delay
				? parseInt( options.autoplay?.delay, 10 )
				: 3000;
			autoplaySettings[ 'pauseOnMouseEnter' ] =
				options.autoplay?.hoverPause ?? false;
			autoplaySettings[ 'disableOnInteraction' ] =
				options.autoplay?.disableInteraction ?? false;
			autoplaySettings[ 'stopOnLastSlide' ] =
				options.autoplay?.stopLast ?? false;

			autoplay = autoplaySettings;
		}

		let swiperConfig = {
			init: false,
			touchEventsTarget: 'container',
			grabCursor: true,
			parallax: true,

			effect,

			direction: options.direction ? options.direction : 'horizontal',
			speed: options.speed ? parseInt( options.speed, 10 ) : 300,
			loop: options.loop ?? false,

			autoplay,

			navigation:
				$prev && $next
					? {
							prevEl: $prev,
							nextEl: $next,
					  }
					: false,

			on: {
				init: function ( swiper ) {
					swiper.el.classList.remove( 'loading' );
				},
			},
		};

		if ( $pagination && options.pagination?.enable ) {
			swiperConfig = {
				...swiperConfig,
				pagination: {
					el: $pagination,
					type: options.pagination?.type ?? 'bullets',
					dynamicBullets: false,
					clickable: true,
				},
			};
		}

		if ( effect === 'slide' ) {
			swiperConfig = {
				...swiperConfig,
				spaceBetween: options.spaceBetween
					? parseInt( options.spaceBetween, 10 )
					: 0,
			};
		}

		if ( effect === 'creative' ) {
			const opacityNext =
				!! options.creativeKeyframes?.opacityNext ||
				options.creativeKeyframes?.opacityNext === 0
					? parseFloat( options.creativeKeyframes?.opacityNext )
					: 1;
			const scaleNext =
				!! options.creativeKeyframes?.scaleNext ||
				options.creativeKeyframes?.scaleNext === 0
					? parseFloat( options.creativeKeyframes?.scaleNext )
					: 1;
			const translateXNext =
				!! options.creativeKeyframes?.translateXNext ||
				options.creativeKeyframes?.translateXNext === 0
					? parseInt( options.creativeKeyframes?.translateXNext, 10 )
					: 0;
			const translateYNext =
				!! options.creativeKeyframes?.translateYNext ||
				options.creativeKeyframes?.translateYNext === 0
					? parseInt( options.creativeKeyframes?.translateYNext, 10 )
					: 0;
			const translateZNext =
				!! options.creativeKeyframes?.translateZNext ||
				options.creativeKeyframes?.translateZNext === 0
					? parseInt( options.creativeKeyframes?.translateZNext, 10 )
					: 0;
			const rotateXNext =
				!! options.creativeKeyframes?.rotateXNext ||
				options.creativeKeyframes?.rotateXNext === 0
					? parseInt( options.creativeKeyframes?.rotateXNext, 10 )
					: 0;
			const rotateYNext =
				!! options.creativeKeyframes?.rotateYNext ||
				options.creativeKeyframes?.rotateYNext === 0
					? parseInt( options.creativeKeyframes?.rotateYNext, 10 )
					: 0;
			const rotateZNext =
				!! options.creativeKeyframes?.rotateZNext ||
				options.creativeKeyframes?.rotateZNext === 0
					? parseInt( options.creativeKeyframes?.rotateZNext, 10 )
					: 0;

			const opacityPrev =
				!! options.creativeKeyframes?.opacityPrev ||
				options.creativeKeyframes?.opacityPrev === 0
					? parseFloat( options.creativeKeyframes?.opacityPrev )
					: 1;
			const scalePrev =
				!! options.creativeKeyframes?.scalePrev ||
				options.creativeKeyframes?.scalePrev === 0
					? parseFloat( options.creativeKeyframes?.scalePrev )
					: 1;
			const translateXPrev =
				!! options.creativeKeyframes?.translateXPrev ||
				options.creativeKeyframes?.translateXPrev === 0
					? parseInt( options.creativeKeyframes?.translateXPrev, 10 )
					: 0;
			const translateYPrev =
				!! options.creativeKeyframes?.translateYPrev ||
				options.creativeKeyframes?.translateYPrev === 0
					? parseInt( options.creativeKeyframes?.translateYPrev, 10 )
					: 0;
			const translateZPrev =
				!! options.creativeKeyframes?.translateZPrev ||
				options.creativeKeyframes?.translateZPrev === 0
					? parseInt( options.creativeKeyframes?.translateZPrev, 10 )
					: 0;
			const rotateXPrev =
				!! options.creativeKeyframes?.rotateXPrev ||
				options.creativeKeyframes?.rotateXPrev === 0
					? parseInt( options.creativeKeyframes?.rotateXPrev, 10 )
					: 0;
			const rotateYPrev =
				!! options.creativeKeyframes?.rotateYPrev ||
				options.creativeKeyframes?.rotateYPrev === 0
					? parseInt( options.creativeKeyframes?.rotateYPrev, 10 )
					: 0;
			const rotateZPrev =
				!! options.creativeKeyframes?.rotateZPrev ||
				options.creativeKeyframes?.rotateZPrev === 0
					? parseInt( options.creativeKeyframes?.rotateZPrev, 10 )
					: 0;

			swiperConfig = {
				...swiperConfig,

				creativeEffect: {
					next: {
						opacity: opacityNext,
						scale: scaleNext,
						translate: [
							`${ translateXNext }%`,
							`${ translateYNext }%`,
							`${ translateZNext }px`,
						],
						rotate: [ rotateXNext, rotateYNext, rotateZNext ],
					},
					prev: {
						opacity: opacityPrev,
						scale: scalePrev,
						translate: [
							`${ translateXPrev }%`,
							`${ translateYPrev }%`,
							`${ translateZPrev }px`,
						],
						rotate: [ rotateXPrev, rotateYPrev, rotateZPrev ],
					},
				},
			};
		}

		// Swiper instance
		const slider = new Swiper( $swiper, swiperConfig );

		// Swiper instance initialization
		slider.init();
	} );
}

csbloSlidesSliderInit();
