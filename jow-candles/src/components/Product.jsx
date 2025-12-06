export default function Product({ productName, productPrice, path }) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function formatRegex(price){
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
    
    const animationDuration = `${getRandomInt(1000, 1600)}ms`;

    return (
        <div className="col col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
            <div 
                className="wpo-product-item wow fadeInUp" 
                data-wow-duration={animationDuration} 
                style={{
                    visibility: 'visible', 
                    animationDuration: animationDuration, 
                    animationName: 'fadeInUp'
                }}>
                <div className="wpo-product-img">
                    <img src={path} alt="true"/>
                </div>
                <div className="wpo-product-text">
                    <h3><a href="shop-single.html">{productName}</a></h3>
                    <ul>
                        <li>{`IDR ${formatRegex(productPrice)}`}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}