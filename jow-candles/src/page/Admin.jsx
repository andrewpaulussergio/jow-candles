import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

// SVG Icons for actions
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

function formatRegex(price){
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}


function Admin() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        visible: true
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = formData.image_url;

            if (uploadedFile) {
                const kebabCaseName = formData.name.toLowerCase().replace(/\s+/g, '-');
                const { data, error } = await supabase.storage
                    .from('jow-candles-product')
                    .upload(`${kebabCaseName}-${Date.now()}`, uploadedFile);

                if (error) throw error;

                const { publicURL } = supabase.storage.from('jow-candles-product').getPublicUrl(data.path);
                imageUrl = publicURL;
            }

            const productData = {
                ...formData,
                image_url: imageUrl,
                price: parseFloat(formData.price),
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                
                if (error) throw error;
            }

            setFormData({ name: '', price: '', image_url: '', visible: true });
            setUploadedFile(null);
            setEditingProduct(null);
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            image_url: product.image_url,
            visible: product.visible
        });
        setUploadedFile(null);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', image_url: '', visible: true });
        setUploadedFile(null);
        setShowModal(true);
    };

    const toggleVisibility = async (product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ visible: !product.visible })
                .eq('id', product.id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const sortedAndFilteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const [key, order] = sortOption.split('-');
            if (key === 'price') {
                return order === 'asc' ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price);
            }
            if (a.name.toLowerCase() < b.name.toLowerCase()) return order === 'asc' ? -1 : 1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return order === 'asc' ? 1 : -1;
            return 0;
        });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedAndFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h2>Product Management</h2>
                    <p>Welcome, Johana Koagow</p>
                </div>
                <div className="header-actions">
                    <div className="search-bar">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sort-options">
                        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                            <option value="name-asc">Sort by Name (A-Z)</option>
                            <option value="name-desc">Sort by Name (Z-A)</option>
                            <option value="price-asc">Sort by Price (Low-High)</option>
                            <option value="price-desc">Sort by Price (High-Low)</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleCreate}>
                        + Add Product
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="loading-state">Loading products...</div>
            ) : (
                <>
                    <div className="product-grid">
                        {currentProducts.map((product) => (
                            <div key={product.id} className={`product-card ${!product.visible ? 'opacity-50' : ''}`}>
                                <div className="card-image">
                                    <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} />
                                    <span className={`status-badge ${product.visible ? 'active' : 'inactive'}`}>
                                        {product.visible ? 'Visible' : 'Hidden'}
                                    </span>
                                </div>
                                <div className="card-content">
                                    <h3>{product.name}</h3>
                                    <p className="price">IDR {formatRegex(product.price)}</p>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => toggleVisibility(product)} className="btn-icon" title={product.visible ? 'Hide' : 'Show'}>
                                        {product.visible ? <EyeIcon /> : <EyeOffIcon />}
                                    </button>
                                    <button onClick={() => handleEdit(product)} className="btn btn-secondary">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        productsPerPage={productsPerPage}
                        totalProducts={sortedAndFilteredProducts.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                </>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    step="1000"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    onChange={e => setUploadedFile(e.target.files[0])}
                                />
                                {(formData.image_url || uploadedFile) && (
                                    <div className="image-preview">
                                        <img src={uploadedFile ? URL.createObjectURL(uploadedFile) : formData.image_url} alt="Preview" />
                                    </div>
                                )}
                            </div>
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="visible"
                                    checked={formData.visible}
                                    onChange={e => setFormData({ ...formData, visible: e.target.checked })}
                                />
                                <label htmlFor="visible">Item is visible in store</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={(e) => { e.preventDefault(); paginate(number); }} href="#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Admin;