<?php
$apiUrl = "https://dummyjson.com/products?limit=30";
$response = file_get_contents($apiUrl);
$data = json_decode($response, true);
$products = $data['products'] ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Browse our curated catalog of premium products with ratings, prices, and detailed descriptions.">
    <title>Product Catalog Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #0f0f1a;
            color: #e0e0e0;
            min-height: 100vh;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            padding: 2.5rem 2rem;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 50%);
            pointer-events: none;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            letter-spacing: -0.02em;
        }

        .header p {
            color: #94a3b8;
            margin-top: 0.5rem;
            font-size: 1.05rem;
            font-weight: 300;
            position: relative;
        }

        .product-count {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.35rem 1rem;
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.25);
            border-radius: 100px;
            font-size: 0.8rem;
            color: #a5b4fc;
            font-weight: 500;
            position: relative;
        }

        /* Grid */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2.5rem 2rem;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        /* Card */
        .product-card {
            background: linear-gradient(145deg, #1a1a2e, #16182a);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            overflow: hidden;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                        border-color 0.3s ease;
            position: relative;
        }

        .product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 50px rgba(99, 102, 241, 0.12),
                        0 8px 20px rgba(0, 0, 0, 0.3);
            border-color: rgba(99, 102, 241, 0.2);
        }

        .product-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), transparent);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .product-card:hover::after {
            opacity: 1;
        }

        /* Thumbnail */
        .thumbnail-wrapper {
            position: relative;
            height: 220px;
            overflow: hidden;
            background: linear-gradient(135deg, #12121f, #1a1a30);
        }

        .thumbnail-wrapper a {
            display: block;
            width: 100%;
            height: 100%;
        }

        .thumbnail-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 1.5rem;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover .thumbnail-wrapper img {
            transform: scale(1.08);
        }

        .category-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 0.25rem 0.75rem;
            background: rgba(99, 102, 241, 0.2);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 100px;
            font-size: 0.7rem;
            font-weight: 600;
            color: #a5b4fc;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Card Body */
        .card-body {
            padding: 1.25rem 1.5rem 1.5rem;
        }

        .card-body h2 {
            font-size: 1.05rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }

        .card-body h2 a {
            color: #f1f5f9;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .card-body h2 a:hover {
            color: #a5b4fc;
        }

        .description {
            font-size: 0.85rem;
            color: #64748b;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 1rem;
        }

        /* Price & Rating row */
        .card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .price {
            font-size: 1.3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #34d399, #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .rating {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.3rem 0.7rem;
            background: rgba(250, 204, 21, 0.1);
            border: 1px solid rgba(250, 204, 21, 0.15);
            border-radius: 8px;
        }

        .rating .star {
            color: #facc15;
            font-size: 0.85rem;
        }

        .rating .value {
            font-size: 0.85rem;
            font-weight: 600;
            color: #fde68a;
        }

        /* Error */
        .error-message {
            text-align: center;
            padding: 4rem 2rem;
            color: #f87171;
            font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .header h1 { font-size: 1.8rem; }
            .container { padding: 1.5rem 1rem; }
            .product-grid { grid-template-columns: 1fr; }
        }

        /* Fade-in animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .product-card {
            animation: fadeInUp 0.5s ease forwards;
            opacity: 0;
        }
    </style>
</head>
<body>

    <header class="header">
        <h1>Product Catalog</h1>
        <p>Explore our curated collection of premium products</p>
        <span class="product-count"><?php echo count($products); ?> Products Available</span>
    </header>

    <main class="container">
        <?php if (empty($products)): ?>
            <div class="error-message">
                <p>Unable to load products. Please try again later.</p>
            </div>
        <?php else: ?>
            <div class="product-grid">
                <?php foreach ($products as $index => $product): ?>
                    <article class="product-card" style="animation-delay: <?php echo $index * 0.06; ?>s;" id="product-<?php echo $product['id']; ?>">
                        <div class="thumbnail-wrapper">
                            <a href="product.php?id=<?php echo $product['id']; ?>">
                                <img src="<?php echo htmlspecialchars($product['thumbnail']); ?>"
                                     alt="<?php echo htmlspecialchars($product['title']); ?>"
                                     loading="lazy">
                            </a>
                            <span class="category-badge"><?php echo htmlspecialchars($product['category']); ?></span>
                        </div>
                        <div class="card-body">
                            <h2>
                                <a href="product.php?id=<?php echo $product['id']; ?>">
                                    <?php echo htmlspecialchars($product['title']); ?>
                                </a>
                            </h2>
                            <p class="description">
                                <?php echo htmlspecialchars($product['description']); ?>
                            </p>
                            <div class="card-footer">
                                <span class="price">$<?php echo number_format($product['price'], 2); ?></span>
                                <div class="rating">
                                    <span class="star">★</span>
                                    <span class="value"><?php echo number_format($product['rating'], 1); ?></span>
                                </div>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>

</body>
</html>
