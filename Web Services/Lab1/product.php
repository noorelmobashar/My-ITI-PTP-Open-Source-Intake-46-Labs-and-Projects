<?php
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    header('Location: index.php');
    exit;
}

$apiUrl = "https://dummyjson.com/products/" . $id;
$response = @file_get_contents($apiUrl);
$product = $response ? json_decode($response, true) : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo $product ? htmlspecialchars($product['description']) : 'Product details'; ?>">
    <title><?php echo $product ? htmlspecialchars($product['title']) : 'Product Not Found'; ?> — Product Catalog</title>
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

        /* Nav bar */
        .topbar {
            background: rgba(26, 26, 46, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            padding: 1rem 2rem;
        }

        .topbar a {
            color: #a5b4fc;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s ease;
        }

        .topbar a:hover {
            color: #c4b5fd;
        }

        .topbar .arrow {
            font-size: 1.1rem;
        }

        /* Container */
        .detail-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        /* Product layout */
        .product-detail {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            background: linear-gradient(145deg, #1a1a2e, #16182a);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 24px;
            overflow: hidden;
            animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Image section */
        .image-section {
            background: linear-gradient(135deg, #12121f, #1a1a30);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            position: relative;
            min-height: 420px;
        }

        .image-section img {
            max-width: 100%;
            max-height: 360px;
            object-fit: contain;
            border-radius: 12px;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-section:hover img {
            transform: scale(1.05);
        }

        .discount-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 0.4rem 1rem;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 100px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #fff;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Info section */
        .info-section {
            padding: 2.5rem 2.5rem 2.5rem 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .badges {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1rem;
        }

        .badge {
            padding: 0.3rem 0.85rem;
            border-radius: 100px;
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-category {
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.25);
            color: #a5b4fc;
        }

        .badge-brand {
            background: rgba(168, 85, 247, 0.15);
            border: 1px solid rgba(168, 85, 247, 0.25);
            color: #c4b5fd;
        }

        .product-title {
            font-size: 2rem;
            font-weight: 800;
            color: #f1f5f9;
            line-height: 1.3;
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
        }

        .product-description {
            font-size: 0.95rem;
            color: #94a3b8;
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }

        /* Price block */
        .price-block {
            display: flex;
            align-items: baseline;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .current-price {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #34d399, #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .original-price {
            font-size: 1.1rem;
            color: #64748b;
            text-decoration: line-through;
        }

        .discount-text {
            font-size: 0.85rem;
            font-weight: 600;
            color: #f87171;
            background: rgba(248, 113, 113, 0.1);
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
        }

        /* Stats grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 1rem;
            text-align: center;
            transition: border-color 0.2s ease;
        }

        .stat-card:hover {
            border-color: rgba(99, 102, 241, 0.2);
        }

        .stat-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 0.4rem;
            font-weight: 500;
        }

        .stat-value {
            font-size: 1.15rem;
            font-weight: 700;
            color: #e2e8f0;
        }

        .stat-value.rating-val {
            color: #facc15;
        }

        .stat-value.stock-val {
            color: #34d399;
        }

        .stat-value.discount-val {
            color: #f87171;
        }

        /* Back button */
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            align-self: flex-start;
        }

        .back-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
        }

        /* Error state */
        .error-state {
            text-align: center;
            padding: 6rem 2rem;
        }

        .error-state h2 {
            font-size: 1.8rem;
            color: #f1f5f9;
            margin-bottom: 0.5rem;
        }

        .error-state p {
            color: #94a3b8;
            margin-bottom: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .product-detail {
                grid-template-columns: 1fr;
            }

            .info-section {
                padding: 2rem;
            }

            .product-title {
                font-size: 1.5rem;
            }

            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .image-section {
                min-height: 280px;
                padding: 2rem;
            }
        }
    </style>
</head>
<body>

    <nav class="topbar">
        <a href="index.php"><span class="arrow">←</span> Back to Catalog</a>
    </nav>

    <main class="detail-container">
        <?php if (!$product): ?>
            <div class="error-state">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or the API is unavailable.</p>
                <a href="index.php" class="back-btn">← Browse Products</a>
            </div>
        <?php else: ?>
            <?php
                $discountPercent = $product['discountPercentage'] ?? 0;
                $originalPrice = $discountPercent > 0
                    ? $product['price'] / (1 - $discountPercent / 100)
                    : $product['price'];
            ?>
            <div class="product-detail">
                <div class="image-section">
                    <img src="<?php echo htmlspecialchars($product['thumbnail']); ?>"
                         alt="<?php echo htmlspecialchars($product['title']); ?>">
                    <?php if ($discountPercent > 0): ?>
                        <span class="discount-badge">-<?php echo number_format($discountPercent, 1); ?>%</span>
                    <?php endif; ?>
                </div>

                <div class="info-section">
                    <div class="badges">
                        <span class="badge badge-category"><?php echo htmlspecialchars($product['category'] ?? 'N/A'); ?></span>
                        <?php if (!empty($product['brand'])): ?>
                            <span class="badge badge-brand"><?php echo htmlspecialchars($product['brand']); ?></span>
                        <?php endif; ?>
                    </div>

                    <h1 class="product-title"><?php echo htmlspecialchars($product['title']); ?></h1>

                    <p class="product-description"><?php echo htmlspecialchars($product['description']); ?></p>

                    <div class="price-block">
                        <span class="current-price">$<?php echo number_format($product['price'], 2); ?></span>
                        <?php if ($discountPercent > 0): ?>
                            <span class="original-price">$<?php echo number_format($originalPrice, 2); ?></span>
                            <span class="discount-text">Save <?php echo number_format($discountPercent, 1); ?>%</span>
                        <?php endif; ?>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Rating</div>
                            <div class="stat-value rating-val">★ <?php echo number_format($product['rating'], 1); ?></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Stock</div>
                            <div class="stat-value stock-val"><?php echo intval($product['stock']); ?></div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Discount</div>
                            <div class="stat-value discount-val"><?php echo number_format($discountPercent, 1); ?>%</div>
                        </div>
                    </div>

                    <a href="index.php" class="back-btn">← Back to Catalog</a>
                </div>
            </div>
        <?php endif; ?>
    </main>

</body>
</html>
