"use client"

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StoreService } from '@/services/store.service';
import { Button } from '@/components/ui/button';
import { CartService } from '@/services/cart.service';
import { toast } from 'react-toastify';
import ProductImage from '@/components/product/ProductImage';
import ProductInteractions from '@/components/product/ProductInteractions';
import ProductComments from '@/components/product/ProductComments';
import ProductRatingSection from '@/components/product/ProductRatingSection';

export default function ProductDetailPage() {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const fetchProduct = async () => {
        if (!productId) return;
        if (!product) setLoading(true);
        setError(null);
        try {
            const response = await StoreService.getProductDetails(productId);
            if (response.status === 'success') {
                setProduct(response.product);
            } else {
                setError('Failed to fetch product details.');
                toast.error(response.message || 'Failed to load product.');
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'An error occurred while fetching the product.';
            setError(errorMsg);
            toast.error(errorMsg);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const handleAddToCart = async () => {
        if (!product || isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            await CartService.addToCart({ product_id: product.id, quantity: 1 });
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            console.error("Error adding to cart:", err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Failed to add item to cart.';
            toast.error(errorMsg);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleRatingChange = () => {
        console.log("Rating changed, refetching product details...");
        fetchProduct();
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading product details...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
    }

    if (!product) {
        return <div className="container mx-auto p-4">Product not found or failed to load.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center items-start">
                     <ProductImage src={product.image_url} alt={product.name} />
                 </div>

                <div className="flex flex-col justify-start">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    
                    {/* Pre-order badge */}
                    {product.is_pre_order && (
                        <div className="inline-block bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-md mb-3">
                            PRE-ORDER
                        </div>
                    )}
                    
                    <p className="text-md text-gray-600 mb-1">Category: {product.category_name}</p>
                     {product.store?.name && (
                         <p className="text-sm text-gray-500 mb-4">Store: {product.store.name}</p>
                     )}
                    <p className="text-lg text-gray-700 mb-4 whitespace-pre-wrap">{product.description}</p>
                    
                    {product.has_discount ? (
                        <div className="mb-4">
                            <p className="text-2xl font-semibold text-red-600">
                                Price: ${parseFloat(product.discounted_price).toFixed(2)}
                            </p>
                            <p className="text-lg text-muted-foreground line-through">
                                Original: ${parseFloat(product.price).toFixed(2)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-2xl font-semibold mb-4">
                            Price: ${parseFloat(product.price).toFixed(2)}
                        </p>
                    )}

                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || loading}
                        className="mt-4 w-full md:w-auto"
                    >
                        {isAddingToCart ? 'Adding...' : product.is_pre_order ? 'Pre-order Now' : '+ Add To Cart'}
                    </Button>

                    <div className="mt-4">
                        <ProductRatingSection
                            productId={productId}
                            initialAverageRating={product.average_rating}
                            initialUserRating={product.user_rating}
                            onRatingChange={handleRatingChange}
                        />
                    </div>

                     <div className="mt-6 border-t pt-4">
                         <ProductInteractions productId={productId} />
                     </div>
                </div>
            </div>

            <div className="mt-10 border-t pt-6">
                 <ProductComments productId={productId} />
             </div>
        </div>
    );
}