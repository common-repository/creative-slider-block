=== Creative Slider Block ===
Contributors:      tchevris
Tags:              slider, slideshow, slide, slider block, Gutenberg block
Requires at least: 6.2
Tested up to:      6.6
Requires PHP:      7.0
Stable tag:        1.0.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A custom Gutenberg Block that allows to showcase any content in a slider.

== Description ==

**Creative Slider Block** plugin uses the power of the WordPress Block Editor to create beautiful and responsive sliders with ease. You can add a dedicated slider block to your pages or posts, allowing you to showcase any combination of content in a dynamic and visually engaging way. The Creative Slider Block provides you with complete control over each slide. Customize layouts and animations to create unique sliders that fit perfectly with your website’s design.

= Features =

 - Powered by Swiper JS: The plugin leverages the powerful [Swiper JS](https://swiperjs.com/) library, known for its high performance, smooth transitions, and mobile-friendly design.
 - Flexible Content Options: Add any Gutenberg blocks to your slides, allowing you to combine text, images, videos, buttons, and more to create versatile sliders.
 - Advanced Slider Customization: Control every aspect of your slider, from autoplay settings and transition speed to looping options, navigation and pagination options.
 - Responsive and Touch-Enabled: Sliders are fully responsive and touch-enabled, ensuring a smooth user experience on all devices.
 - Preview in Editor: Preview your slider directly in the WordPress block editor, making it easy to see your changes in real-time without needing to save or refresh the page.

== Installation ==

1. In your WordPress dashboard go to **Plugins > Add New Plugin**.
1. Search for **Creative Slider Block** in the **Search Plugins** bar.
1. Click the **Install Now** button next to the plugin's name.
1. Click **Activate** to activate the plugin.
1. **Creative Slider Block** will be added to the **Design** block category in the editor.

== Frequently Asked Questions ==

= Can I use it with any theme? =
Yes, you can use the block with any theme.

= What blocks are supported? =
You can use any blocks to create the slides. However there might be styling issues.

= Can I use multiple sliders on the same page? =
Yes, you can add multiple Creative Slider Blocks to a single page, and each slider will operate independently.

= Will it slow down my site? =
No, Creative Slider Block is light-weight and it only loads scripts on the pages where the block is used.

== Screenshots ==

1. Slider settings

== Source Code ==
The unminified source code for the plugin’s JavaScript and CSS files is included in the `/src` folder of this plugin.

To modify or rebuild the assets, follow these steps:

1. Install dependencies: `npm install`
2. Run the development build: `npm run start`
3. Create a production build: `npm run build`

== Changelog ==

= 1.0.1 =
* Included the `src/` folder.
* Updated prefix to prevent conflicts.

= 1.0.0 =
* Release

== Upgrade Notice ==
