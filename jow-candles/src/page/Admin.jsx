import { useState, useEffect } from 'react'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function Admin () {
    const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL, 
        import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    const [products, setProducts] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image_url: '',
        visible: true
    })

    useEffect(() => {
        fetchProducts()
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        if (editingProduct){
            const { error } = await supabase
            .from('products')
            .update({
                name: formData.name,
                price: parseFloat(formData.price),
                image_url: formData.image_url,
                visible: formData.visible
            })
            .eq('id', editingProduct.id)

            if(error) throw error;
        } else {
            const { error } = await supabase
            .from('products')
            .insert([{
                name: formData.name,
                price: parseFloat(formData.price),
                image_url: formData.image_url,
                visible: formData.visible
            }])
            
            if(error) throw error;
        }

        setFormData({name: '', price: '', image_url: '', visible: true})
        setEditingProduct(null)
        setShowModal(false)
        fetchProducts()
    } catch (error){
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error;
      fetchProducts()
    } catch (error){
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image_url: product.image_url,
      visible: product.visible
    })
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({name: '', price: '', image_url: '', visible: true})
    setShowModal(true)
  }

  const toggleVisibility = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ visible: !product.visible })
        .eq('id', product.id)

      if (error) throw error;
      fetchProducts()
    } catch (error){
      console.error('Error toggling visibility:', error);
    }
  }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h2>Product Management</h2>
                    <p>Manage your inventory and visibility</p>
                </div>
                <button className="btn-primary" onClick={handleCreate}>
                    + Add Product
                </button>
            </header>

            {loading ? (
                <div className="loading-state">Loading products...</div>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className={`product-card ${!product.visible ? 'opacity-50' : ''}`}>
                            <div className="card-image">
                                <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} />
                                <span className={`status-badge ${product.visible ? 'active' : 'inactive'}`}>
                                    {product.visible ? 'Visible' : 'Hidden'}
                                </span>
                            </div>
                            <div className="card-content">
                                <h3>{product.name}</h3>
                                <p className="price">${product.price}</p>
                            </div>
                            <div className="card-actions">
                                <button onClick={() => toggleVisibility(product)} className="btn-icon">
                                    {product.visible ? '👁️' : '🚫'}
                                </button>
                                <button onClick={() => handleEdit(product)} className="btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="btn-danger">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
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
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.visible}
                                        onChange={e => setFormData({ ...formData, visible: e.target.checked })}
                                    />
                                    Item is visible in store
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin