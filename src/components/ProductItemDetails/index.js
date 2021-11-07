import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    detailedProduct: '',
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  formattedData = data => {
    const updatedData = {
      id: data.id,
      imageUrl: data.image_url,
      title: data.title,
      price: data.price,
      description: data.description,
      brand: data.brand,
      totalReviews: data.total_reviews,
      rating: data.rating,
      availability: data.availability,
    }
    return updatedData
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.setState({
        apiStatus: apiStatusConstants.success,
        detailedProduct: this.formattedData(data),
        similarProducts: data.similar_products.map(eachProduct =>
          this.formattedData(eachProduct),
        ),
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecreaseCount = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onIncreaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderProductDetails = () => {
    const {detailedProduct, count} = this.state

    const {
      title,
      imageUrl,
      price,
      rating,
      brand,
      totalReviews,
      description,
      availability,
    } = detailedProduct

    return (
      <div className="product-details-container">
        <Header />
        <div className="product-container">
          <img
            src={imageUrl}
            alt="product"
            className="detailed-product-image"
          />
          <div className="description-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs.{price}</p>
            <div className="set-in-row">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review"> {totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="high-lighted-text">Available : {availability}</p>
            <p className="high-lighted-text">Brand : {brand}</p>
            <hr className="horizontal-line" />
            <div className="number-of-products-container">
              <button
                testid="minus"
                type="button"
                className="btn"
                onClick={this.onDecreaseCount}
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                testid="plus"
                className="btn"
                onClick={this.onIncreaseCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state

    return (
      <div className="similar-products-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="products-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              productData={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="product-details-container">
      <div testid="loader">
        <Loader type="ThreeDots" color="blue" height={50} width={50} />
      </div>
    </div>
  )

  onClickContinueShopping = () => {
    const {history} = this.props

    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderProductDetails()
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
