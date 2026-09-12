import { useMemo, useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

type Product = {
  id: number
  name: string
  category: string
  price: number
  rating: string
  badge: string
  description: string
}

type CartItem = Product & {
  quantity: number
  lineTotal: number
}

const products: Product[] = [
  {
    id: 1,
    name: 'Pulse Air Buds',
    category: 'Tech',
    price: 79,
    rating: '4.9',
    badge: 'Best seller',
    description: 'Noise-free wireless earbuds with 30-hour battery life.',
  },
  {
    id: 2,
    name: 'Urban Layer Jacket',
    category: 'Fashion',
    price: 129,
    rating: '4.8',
    badge: 'Trending',
    description: 'Lightweight water-resistant jacket for everyday wear.',
  },
  {
    id: 3,
    name: 'Nord Desk Lamp',
    category: 'Home',
    price: 54,
    rating: '4.7',
    badge: 'New',
    description: 'Minimal desk lamp with warm and cool lighting modes.',
  },
  {
    id: 4,
    name: 'Cloud Runner Sneakers',
    category: 'Fashion',
    price: 99,
    rating: '4.9',
    badge: 'Editor pick',
    description: 'Breathable sneakers designed for daily comfort.',
  },
  {
    id: 5,
    name: 'Smart Desk Hub',
    category: 'Tech',
    price: 149,
    rating: '5.0',
    badge: 'Premium',
    description: 'Dock, charge, and organize your workspace in one hub.',
  },
  {
    id: 6,
    name: 'Softform Chair',
    category: 'Home',
    price: 219,
    rating: '4.8',
    badge: 'Limited',
    description: 'Supportive accent chair built for long reading sessions.',
  },
]

const categories = ['All', 'Tech', 'Fashion', 'Home']

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products
    }

    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id)

          if (!product) {
            return null
          }

          return {
            ...product,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          } satisfies CartItem
        })
        .filter((item): item is CartItem => item !== null),
    [cart],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.lineTotal, 0),
    [cartItems],
  )
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12
  const total = subtotal + shipping

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (productId: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === productId)

      if (existing) {
        return current.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { id: productId, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => setCart([])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">ITMANGEMENT.COM</p>
          <h1>Fresh deals for a better shopping day.</h1>
        </div>
        <div className="topbar-badge">
          <span>Cart</span>
          <strong>{cartCount}</strong>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">New season drop</p>
            <h2>One storefront for tech, fashion, and home essentials.</h2>
            <p className="hero-text">
              Discover curated products, quick add-to-cart actions, and a clean checkout
              summary that feels ready for launch.
            </p>

            <div className="hero-actions">
              <a href="#products" className="primary-button">
                Shop products
              </a>
              <button type="button" className="secondary-button" onClick={clearCart}>
                Reset cart
              </button>
            </div>

            <ul className="stats">
              <li>
                <strong>120+</strong>
                <span>Products ready</span>
              </li>
              <li>
                <strong>4.8★</strong>
                <span>Average rating</span>
              </li>
              <li>
                <strong>Same day</strong>
                <span>Shipping in 3 cities</span>
              </li>
            </ul>
          </div>

          <div className="hero-visual">
            <img src={heroImg} alt="Lifestyle preview of the ecommerce collection" />
            <div className="floating-card">
              <span>Limited offer</span>
              <strong>20% off selected bundles</strong>
              <p>Build your cart with curated picks and fast checkout.</p>
            </div>
          </div>
        </section>

        <section className="content-grid" id="products">
          <div className="catalog">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Catalog</p>
                <h3>Featured products</h3>
              </div>

              <div className="category-list" role="tablist" aria-label="Product categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={category === activeCategory ? 'category-chip active' : 'category-chip'}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-meta">
                    <span>{product.badge}</span>
                    <strong>{product.rating}★</strong>
                  </div>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <strong>${product.price}</strong>
                    <button type="button" onClick={() => addToCart(product.id)}>
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="cart-panel" aria-label="Shopping cart">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Checkout</p>
                <h3>Your cart</h3>
              </div>
              <button type="button" className="link-button" onClick={clearCart}>
                Clear all
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <strong>Your cart is empty</strong>
                  <p>Add products to see the order summary update instantly.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="cart-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="summary">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? 'Free' : `$${shipping}`}</strong>
              </div>
              <div className="total">
                <span>Total</span>
                <strong>${total}</strong>
              </div>
            </div>

            <button type="button" className="checkout-button">
              Proceed to checkout
            </button>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
