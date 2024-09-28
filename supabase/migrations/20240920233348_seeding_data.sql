-- Insert into categories
INSERT INTO categories (name, description)
VALUES
('Payment Processing', 'Services enabling businesses to accept online payments.');

-- Insert into products
INSERT INTO products (category_id, name, description, website_url, logo_url)
VALUES
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Paystack',
    'Paystack helps businesses in Africa accept payments via credit card, debit card, and other digital means.',
    'https://paystack.com',
    'https://example.com/paystack_logo.png'
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Flutterwave',
    'Flutterwave provides a payment infrastructure for global merchants and payment service providers across the continent.',
    'https://flutterwave.com',
    'https://example.com/flutterwave_logo.png'
);

-- Insert into features
INSERT INTO features (category_id, name, description)
VALUES
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Payment Methods',
    'Types of payment methods supported'
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Fees',
    'Transaction fees for services'
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Settlement Period',
    'Time taken to settle transactions'
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'Security Compliance',
    'Level of security certifications'
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    'API Integration',
    'Ease and comprehensiveness of API integration'
);

-- Insert feature values for Paystack
INSERT INTO product_feature_values (product_id, feature_id, value)
VALUES
(
    (SELECT id FROM products WHERE name = 'Paystack'),
    (SELECT id FROM features WHERE name = 'Payment Methods' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Cards (Visa, Mastercard, Verve), Bank Account, USSD, Mobile Money'
),
(
    (SELECT id FROM products WHERE name = 'Paystack'),
    (SELECT id FROM features WHERE name = 'Fees' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Local: 1.5% + ₦100 (cap ₦2000); International: 3.9%'
),
(
    (SELECT id FROM products WHERE name = 'Paystack'),
    (SELECT id FROM features WHERE name = 'Settlement Period' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Next day for local transactions'
),
(
    (SELECT id FROM products WHERE name = 'Paystack'),
    (SELECT id FROM features WHERE name = 'Security Compliance' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'PCI DSS Level 1 compliant'
),
(
    (SELECT id FROM products WHERE name = 'Paystack'),
    (SELECT id FROM features WHERE name = 'API Integration' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Easy to integrate with comprehensive documentation'
);


-- Insert feature values for Flutterwave
INSERT INTO product_feature_values (product_id, feature_id, value)
VALUES
(
    (SELECT id FROM products WHERE name = 'Flutterwave'),
    (SELECT id FROM features WHERE name = 'Payment Methods' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Cards (Visa, Mastercard, Verve, AMEX), Bank Account, USSD, Mobile Money, Barter, POS, ACH'
),
(
    (SELECT id FROM products WHERE name = 'Flutterwave'),
    (SELECT id FROM features WHERE name = 'Fees' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Local: 1.4%; International: 3.8% + $0.30'
),
(
    (SELECT id FROM products WHERE name = 'Flutterwave'),
    (SELECT id FROM features WHERE name = 'Settlement Period' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    '24-48 hours'
),
(
    (SELECT id FROM products WHERE name = 'Flutterwave'),
    (SELECT id FROM features WHERE name = 'Security Compliance' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'PCI DSS Level 1 compliant'
),
(
    (SELECT id FROM products WHERE name = 'Flutterwave'),
    (SELECT id FROM features WHERE name = 'API Integration' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing')),
    'Easy to integrate with comprehensive documentation'
);


-- Insert comparison metrics for the 'Payment Processing' category
INSERT INTO comparison_metrics (category_id, feature_id)
VALUES
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    (SELECT id FROM features WHERE name = 'Fees' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing'))
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    (SELECT id FROM features WHERE name = 'Settlement Period' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing'))
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    (SELECT id FROM features WHERE name = 'Security Compliance' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing'))
),
(
    (SELECT id FROM categories WHERE name = 'Payment Processing'),
    (SELECT id FROM features WHERE name = 'API Integration' AND category_id = (SELECT id FROM categories WHERE name = 'Payment Processing'))
);
