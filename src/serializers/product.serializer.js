export function toPublicProduct(product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    };
  }
  
  export function toPublicProducts(products) {
    return products.map((product) => toPublicProduct(product));
  }