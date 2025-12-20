import React, { useState, useEffect, useRef } from 'react'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Product from '../components/Product.jsx'
import '../App.css'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL, 
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const effectRan = useRef(false)

    useEffect(() => {
        if (effectRan.current === false) {
            fetchProducts();
            
            return () => {
                effectRan.current = true;
            }
        }
  }, [])

useEffect(() => {
    if (window.WOW) {
        new window.WOW({
        live: false
        }).init();
    }
}, []);

useEffect(() => {
    // Create and append the script dynamically
    const script = document.createElement('script');
    script.src = "assets/js/script.js";
    script.async = true;
    
    script.onload = () => {
        // TRIGGER the window load event manually. 
        // The obfuscated script waits for $(window).on('load'), so we must fake it.
        window.dispatchEvent(new Event('load'));
        
        // Also trigger resize to fix width calculations
        window.dispatchEvent(new Event('resize'));
    };

    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script);
    }
    }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error;
      setProducts(data || [])
    }catch (error) {
      console.error('Error fetching products:', error)
    }finally {
      setLoading(false)
    }
  }

  const visibleProducts = products.filter(p => p.visible);

  return (
    <div className="page-wrapper">
        <div className="preloader">
            <div className="vertical-centered-box">
                <div className="content">
                    <div className="loader-circle"></div>
                    <div className="loader-line-mask">
                        <div className="loader-line"></div>
                    </div>
                </div>
            </div>
        </div>
        <header id="header">
            <div className="wpo-site-header wpo-header-style-2">
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                                <div className="mobail-menu">
                                    <button type="button" className="navbar-toggler open-btn">
                                        <span className="sr-only">Toggle navigation</span>
                                        <span className="icon-bar first-angle"></span>
                                        <span className="icon-bar middle-angle"></span>
                                        <span className="icon-bar last-angle"></span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-6">
                                <div className="navbar-header" style={{paddingTop: '8px'}}>
                                    <a className="navbar-brand" href="index.html">
                                        <img src="assets/images/jow-candles/misc/jow-candles-logo.png" alt="" width="127.5px" height="72.3px"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
          <section
            className="static-hero-s2"
            style={{
              background: "url(assets/images/jow-candles/misc/index-products-bg-large.png) no-repeat center",
              backgroundSize: "1905px 950px"
            }}>
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-xl-6 col-lg-6 col-12">
                                <div className="wpo-static-hero-inner">
                                    <div className="shape-2 wow fadeInUp" data-wow-duration="1800ms"><img
                                        src="assets/images/jow-candles/misc/jow-candles-logo.png" alt=""/></div>
                                    <div className="shape-2 wow fadeInUp" data-wow-duration="1800ms"><img
                                            src="assets/images/slider/shape2.svg" alt=""/></div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="static-hero-right">
                <div className="static-hero-img scene" id="scene">
                    <div className="static-hero-img-inner">
                        <img className="zoom" src="assets/images/jow-candles/misc/crystal.jpg" alt=""/>
                        <div className="hero-img-inner-shape">
                            <img src="assets/images/slider/shape9.svg" alt=""/>
                        </div>
                        <div className="hero-img-inner-shape-2">
                            <img src="assets/images/slider/shape10.svg" alt=""/>
                        </div>
                    </div>
                    <div className="inner-image-1">
                        <span className="layer" data-depth="0.25">
                            <img src="assets/images/jow-candles/misc/gloves.jpg" alt=""/>
                        </span>
                    </div>
                    <div className="inner-image-2">
                        <span className="layer" data-depth="0.45">
                            <img src="assets/images/jow-candles/misc/orange.png" alt=""/>
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <section className="wpo-couple-section-s2 section-padding" id="couple">
            <div className="container-fluid">
                <div className="couple-area clearfix">
                    <div className="row align-items-center">
                        <div className="col col-md-12 col-12">
                            <div className="couple-item-wrap pointparallax">
                                <div className="couple-img-wrap">
                                    <div className="couple-common point__item" data-position="left-top" data-point="middle"
                                        data-path="280">
                                        <div className="couple-img">
                                            <img src="assets/images/jow-candles/misc/candle-no-bg.png" alt=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="couple-common couple-text-wrap">
                                    <div className="couple-text-l-item">
                                        <div className="couple-text-bg point__item top" data-position="center-top"
                                            data-point="left" data-path="280">
                                            <svg className="shape-bg" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 667 413" fill="none">
                                                <path
                                                    d="M666.082 212.859C663.967 197.547 655.652 181.032 639.387 163.277C611.196 132.471 572.902 114.388 538.985 92.1488C479.066 52.8841 411.743 4.50513 339.423 0.968758C247.811 -3.51551 167.797 56.4934 90.7001 101.19C56.2727 121.096 -3.09998 147.382 0.838745 199.188C2.55282 221.646 18.016 239.801 33.1874 255.369C86.1049 309.727 143.362 364.668 211.779 395.22C305.908 437.218 403.975 392.157 491.867 353.913C542.669 331.82 677.424 294.232 666.082 212.859Z"
                                                    fill="" />
                                            </svg>
                                            <div className="outer-shape">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 669 424"
                                                    fill="none">
                                                    <path
                                                        d="M291.648 424C273.96 424 255.689 421.703 236.761 416.526C175.383 399.829 119.475 365.85 72.9029 334.825C69.4018 332.492 65.7548 330.159 62.0349 327.752C42.4872 315.211 20.3136 300.993 8.31507 280.175C-3.68345 259.395 -2.6623 234.166 11.1232 210.979C23.3406 190.49 42.3778 174.266 57.6586 161.215C75.784 145.757 92.9248 130.189 111.853 112.909C148.942 79.0397 190.992 40.65 241.83 17.9735C292.013 -4.37495 347.483 -5.94262 411.305 13.1611C440.846 22.0202 469.766 33.8324 497.738 45.2801L498.832 45.7176C511.196 50.7852 523.96 55.4517 536.323 60.0089C553.099 66.1702 570.495 72.5502 587.126 79.9511C588.949 80.7532 589.788 82.9406 588.986 84.7635C588.183 86.6228 586.031 87.4249 584.172 86.6228C567.76 79.2949 550.51 72.9877 533.807 66.8629C521.371 62.3057 508.533 57.6027 496.061 52.4986L494.967 52.0612C467.14 40.6864 438.402 28.9107 409.19 20.1609C347.082 1.56762 293.326 3.02591 244.785 24.6452C195.003 46.8113 153.428 84.7999 116.739 118.304C98.4681 135.002 80.5615 151.262 62.3632 166.756C47.4835 179.443 28.9569 195.23 17.3596 214.698C4.95986 235.515 3.93871 258.046 14.6243 276.493C25.7476 295.743 46.2071 308.867 65.9737 321.591C69.6936 323.997 73.377 326.367 76.951 328.7C123.049 359.397 178.3 393.011 238.694 409.417C337.418 436.286 418.563 382.438 497.009 330.377C507.512 323.414 518.38 316.195 529.066 309.341C533.734 306.352 538.949 303.107 544.492 299.644C596.972 266.978 684.791 212.365 655.907 146.048C651.604 136.168 644.164 126.507 633.807 117.284C632.311 115.935 632.166 113.638 633.515 112.143C634.864 110.648 637.162 110.502 638.657 111.851C649.817 121.768 657.877 132.304 662.581 143.132C693.982 215.208 602.807 271.936 548.358 305.841C542.815 309.268 537.673 312.513 533.005 315.503C522.355 322.32 511.524 329.539 501.057 336.502C436.032 379.668 369.256 424 291.648 424Z"
                                                        fill="" />
                                                </svg>
                                            </div>
                                            <div className="couple-text">
                                                <h3 style={{fontFamily: 'Poppins', color: 'rgb(51, 51, 51)', textTransform: 'none', textDecoration: 'none', letterSpacing: '0px', wordSpacing: '0px', fontSize: '22px', fontWeight: 'bold'}}>Only The Finest Wax</h3>
                                                <p>Our candles are designed with clean lines and elegant fragrances, perfect for any setting. Made from high-quality wax and essential oils, each candle is a testament to our commitment to quality and style.</p>
                                            </div>
                                            <div className="round-shape">
                                                <div className="inner"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="couple-text-r-item">
                                        <div className="couple-text-bg point__item" data-position="left-bottom"
                                            data-point="right-bottom" data-path="280">
                                            <svg className="shape-bg" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 591 440" fill="none">
                                                <path
                                                    d="M25.4114 57.986C-7.01725 96.9909 -4.11683 145.478 11.5491 183.165C41.245 254.568 93.5948 320.713 144.62 380.572C161.617 400.497 175.513 426.044 204.832 435.682C234.53 445.496 272.426 434.916 303.036 419.91C352.842 395.499 393.348 358.703 432.676 322.758C480.973 278.571 537.087 232.887 568.81 179.978C596.134 134.421 602.956 73.8999 561.072 43.6382C517.585 12.246 436.357 7.28966 376.423 4.79922C329.292 2.83538 281.155 3.3091 233.647 1.59968C173.101 -0.572324 96.6825 -2.76814 43.2131 40.5322C36.3646 46.0749 30.4711 51.9203 25.4114 57.986Z"
                                                    fill="" />
                                            </svg>
                                            <div className="outer-shape">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 437"
                                                    fill="none">
                                                    <path
                                                        d="M666.082 212.859C663.967 197.547 655.652 181.032 639.387 163.277C611.196 132.471 572.902 114.388 538.985 92.1488C479.066 52.8841 411.743 4.50513 339.423 0.968758C247.811 -3.51551 167.797 56.4934 90.7001 101.19C56.2727 121.096 -3.09998 147.382 0.838745 199.188C2.55282 221.646 18.016 239.801 33.1874 255.369C86.1049 309.727 143.362 364.668 211.779 395.22C305.908 437.218 403.975 392.157 491.867 353.913C542.669 331.82 677.424 294.232 666.082 212.859Z"
                                                        fill="none" />
                                                </svg>
                                            </div>
                                            <div className="couple-text">
                                                <h3 style={{fontFamily: 'Poppins', color: 'rgb(51, 51, 51)', textTransform: 'none', textDecoration: 'none', letterSpacing: '0px', wordSpacing: '0px', fontSize: '22px', fontWeight: 'bold'}}>Hand-Poured Quality</h3>
                                                <p>Our candles feature clean lines and elegant fragrances, made from high-quality wax and essential oils, showcasing our commitment to quality and style.</p>
                                            </div>
                                            <div className="round-shape">
                                                <div className="inner"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="wpo-shop-page section-padding">
            <div className="container">
                <div className="wpo-section-title">
                    <span style={{fontSize: '18px'}}>Since 2022</span>
                    <h2 style={{fontFamily: 'Poppins', color: 'rgb(51, 51, 51)', textTransform: 'none', textDecoration: 'none', letterSpacing: '0px', wordSpacing: '0px', fontSize: '22px', fontWeight: 'bold'}}>QUALITY IN EVERY CANDLE</h2>
                </div>
                <div className="col-lg-9 order-lg-2 center">
                    <div className="wpo-product-section">
                        <div className="wpo-product-wrap">
                            <div className="row">
                                {visibleProducts.map((product) => (
                                        <Product
                                            productName = {product.name} 
                                            productPrice = {product.price} 
                                            path = {product.image_url}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="wpo-portfolio-section section-padding" id="gallery" style={{background: 'url(assets/images/jow-candles/misc/index-products-bg-large.png) no-repeat center'}}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="portfolio-grids gallery-container clearfix portfolio-slide owl-carousel">
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-1.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-1.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-2.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-2.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-3.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-3.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-4.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-4.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-5.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-5.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="img-holder">
                                    <a href="assets/images/jow-candles/misc/candle-6.jpg" className="fancybox"
                                        data-fancybox-group="gall-1">
                                        <img src="assets/images/jow-candles/misc/candle-6.jpg" alt="" className="img img-responsive"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </section>
        <section className="wpo-blog-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="wpo-section-title">
                        <h2 style={{fontFamily: 'Poppins', color: 'rgb(51, 51, 51)', textTransform: 'none', textDecoration: 'none', letterSpacing: '0px', wordSpacing: '0px', fontSize: '22px', fontWeight: 'bold'}}>FEATURES</h2>
                    </div>
                </div>
                <div className="wpo-blog-items">
                    <div className="row">
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-blog-item wow fadeInUp" data-wow-duration="1000ms" style={{visibility: 'visible', animationDuration: '1200ms', animationName: 'fadeInUp', background: 'url(assets/images/jow-candles/misc/index-products-bg.jpg) center'}}>
                                <div className="wpo-blog-img">
                                    <img src="assets/images/jow-candles/misc/candle-7.jpg" alt=""/>
                                </div>
                                <div className="wpo-blog-content">
                                    <h2>Beautifully crafted packaging, ensuring they arrive safely and in style.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-blog-item wow fadeInUp" data-wow-duration="1200ms" style={{visibility: 'visible', animationDuration: '1200ms', animationName: 'fadeInUp', background: 'url(assets/images/jow-candles/misc/index-products-bg.jpg) center'}}>
                                <div className="wpo-blog-img">
                                    <img src="assets/images/jow-candles/misc/candle-4.jpg" alt=""/>
                                </div>
                                <div className="wpo-blog-content">
                                    <h2>Crafted from premium wax and essential oils, offering a luxurious and lasting experience.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-4 col-md-6 col-12">
                            <div className="wpo-blog-item wow fadeInUp" data-wow-duration="1400ms" style={{visibility: 'visible', animationDuration: '1200ms', animationName: 'fadeInUp', background: 'url(assets/images/jow-candles/misc/index-products-bg.jpg) center'}}>
                                <div className="wpo-blog-img">
                                    <img src="assets/images/jow-candles/misc/candle-8.jpg" alt=""/>
                                </div>
                                <div className="wpo-blog-content">
                                    <h2>Minimalist and elegant, reflecting the simplicity and sophistication of our candles.</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <footer className="wpo-site-footer-s2">
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="col col-xs-12">
                        <p className="copyright"> &copy; 2026 | <a href="index.html">JOW Candles</a></p>
                    </div>
                </div>
            </div>
          </footer>
        </div>
      )
}

export default Home;