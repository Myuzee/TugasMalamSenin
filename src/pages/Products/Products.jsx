import {useEffect, useState, useRef, useTransition } from 'react'
import { getAllProducts } from '../../services/getAllProducts'
import ProductList from '../../components/ProductList/ProductList'
import Navbar from '../../components/Navbar/Navbar'
import RadioButton from '../../components/RadioButton/RadioButton'
import getAllProductCategories from '../../services/getAllProductCategories'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSort } from "@fortawesome/free-solid-svg-icons" // Menghapus faFilter
import formatToIDRCurrency from '../../utils/formatToIDRCurrency'

function Products() {
  const [products, setProducts] = useState([])
  const RadioButtonOpts = useRef([
    {
      label: 'All',
      value: 'all'
    },
  ])

  const originalProducts = useRef([])
  const [isPending, startTransition] = useTransition()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [showInStock, setShowInStock] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  useEffect(()=>{
    function fetchProducts() {
      let allProducts = getAllProducts()
      allProducts = (allProducts.length > 0 ? allProducts : [])
      originalProducts.current = allProducts;
      setProducts(allProducts);
    }

    function fetchCategories() {
      const allCategories = getAllProductCategories()
      const newCategories = allCategories
        .map((cat) => ({label: cat.name, value: cat.slug}))
          .filter(
            (newCat) => !RadioButtonOpts.current
              .some((existingCat) => existingCat.value === newCat.value)
          )
      RadioButtonOpts.current = [...RadioButtonOpts.current, ...newCategories]
    }

    fetchCategories()
    fetchProducts()
  },[])

  useEffect(() => {
    startTransition(() => {
      let filtered = originalProducts.current
        .filter(product => {
          const matchedCategory = 
              selectedCategory === 'all' || product.categorySlug === selectedCategory
          const matchesSearch = product.name
              .toLowerCase()
                .includes(searchQuery.toLowerCase())
          const matchesPrice = 
              product.price >= priceRange.min && product.price <= priceRange.max
          const matchesStock = 
              !showInStock || product.stock > 0
          
          return matchedCategory && matchesSearch && matchesPrice && matchesStock
        })

      switch(sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'stock-desc':
          filtered.sort((a, b) => b.stock - a.stock)
          break
        default:
          break
      }

      setProducts(filtered)
    })
  }, [selectedCategory, searchQuery, sortBy, priceRange, showInStock])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
  }

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max })
    setCurrentPage(1)
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

  return (
    <>
      <Navbar onSearchChange={handleSearchChange}/>

      <div className='px-24 py-4 gap-4 mt-4'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-medium text-xl'>Our Products</h3>
          
          <div className='flex gap-4'>
            <div className='relative'>
              <select 
                className='p-2 border rounded-md appearance-none pr-8 bg-white'
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="stock-desc">Stock Available</option>
              </select>
              <FontAwesomeIcon 
                icon={faSort} 
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>

            <div className='flex items-center gap-2'>
              <input 
                type="number" 
                placeholder="Min Price"
                className='w-24 p-2 border rounded-md'
                onChange={(e) => handlePriceRangeChange(
                  Number(e.target.value) || 0,
                  priceRange.max
                )}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max Price"
                className='w-24 p-2 border rounded-md'
                onChange={(e) => handlePriceRangeChange(
                  priceRange.min,
                  Number(e.target.value) || Infinity
                )}
              />
            </div>

            <label className='flex items-center gap-2'>
              <input 
                type="checkbox"
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
                className='w-4 h-4'
              />
              In Stock Only
            </label>
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='font-medium mb-2'>Filter by Category</h3>
          <div className='flex gap-2 flex-wrap'>
            <RadioButton 
              options={RadioButtonOpts.current} 
              defaultValue={'all'} 
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {(selectedCategory !== 'all' || showInStock || priceRange.min > 0 || priceRange.max < Infinity) && (
          <div className='mb-4 flex gap-2 flex-wrap'>
            <span className='font-medium'>Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className='bg-blue-100 px-2 py-1 rounded-full text-sm'>
                Category: {RadioButtonOpts.current.find(opt => opt.value === selectedCategory)?.label}
              </span>
            )}
            {showInStock && (
              <span className='bg-blue-100 px-2 py-1 rounded-full text-sm'>
                In Stock Only
              </span>
            )}
            {(priceRange.min > 0 || priceRange.max < Infinity) && (
              <span className='bg-blue-100 px-2 py-1 rounded-full text-sm'>
                Price: {formatToIDRCurrency(priceRange.min)} - {priceRange.max === Infinity ? '∞' : formatToIDRCurrency(priceRange.max)}
              </span>
            )}
          </div>
        )}

        <div className='mb-4 text-gray-600'>
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
        </div>
      </div>

      <section className='container px-24 py-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto'>
          <ProductList products={currentProducts} isPending={isPending}/>
        </div>

        {totalPages > 1 && (
          <div className='flex justify-center gap-2 mt-8'>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-4 py-2 border rounded-md disabled:opacity-50'
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='px-4 py-2 border rounded-md disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}

        {products.length === 0 && !isPending && (
          <div className='text-center py-8'>
            <h3 className='text-xl font-medium mb-2'>No products found</h3>
            <p className='text-gray-600'>Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>
    </>
  )
}

export default Products