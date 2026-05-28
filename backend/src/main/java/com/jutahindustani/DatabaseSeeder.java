package com.jutahindustani;

import com.jutahindustani.entity.*;
import com.jutahindustani.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedCategories();
        seedUsers();
        checkAndCleanJpgProducts();
        seedProducts();
    }

    private void checkAndCleanJpgProducts() {
        long count = productRepository.count();
        if (count != 13) {
            System.out.println("Database Seeding: Product count is " + count + " (expected 13). Cleaning up database to re-seed 13 products (7 PNG + 6 JPG)...");
            wishlistRepository.deleteAll();
            cartItemRepository.deleteAll();
            orderRepository.deleteAll();
            productRepository.deleteAll();
            System.out.println("Database Seeding: Truncation complete!");
        }
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(RoleEntity.builder().name("ROLE_CUSTOMER").build());
            roleRepository.save(RoleEntity.builder().name("ROLE_ADMIN").build());
            System.out.println("Database Seeding: Roles seeded successfully!");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(Category.builder().name("SNEAKERS").build());
            categoryRepository.save(Category.builder().name("RUNNING").build());
            categoryRepository.save(Category.builder().name("CASUAL").build());
            categoryRepository.save(Category.builder().name("FORMAL").build());
            System.out.println("Database Seeding: Categories seeded successfully!");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = User.builder()
                    .name("test")
                    .email("test@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);

            // Seed Customer User
            User customer = User.builder()
                    .name("test1")
                    .email("test1@gmail.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.ROLE_CUSTOMER)
                    .build();
            User savedCustomer = userRepository.save(customer);

            // Initialize shopping cart for customer
            Cart cart = Cart.builder()
                    .user(savedCustomer)
                    .build();
            cartRepository.save(cart);

            System.out.println("Database Seeding: Admin and Customer users created successfully!");
            System.out.println("Admin login: test@gmail.com / admin123");
            System.out.println("Customer login: test1@gmail.com / customer123");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            Category sneakers = categoryRepository.findByNameIgnoreCase("SNEAKERS").orElse(null);
            Category running = categoryRepository.findByNameIgnoreCase("RUNNING").orElse(null);
            Category casual = categoryRepository.findByNameIgnoreCase("CASUAL").orElse(null);
            Category formal = categoryRepository.findByNameIgnoreCase("FORMAL").orElse(null);

            // ====================
            // 6 PNG SHOES (Hero Showcase)
            // ====================

            // 1. Nike - Air Jordan 12 Royalty (White/Gold)
            Product p1 = Product.builder()
                    .title("Air Jordan 12 Royalty")
                    .brand("Nike")
                    .description("Premium white and gold high-top sneakers, engineered with full-grain leather and iconic metallic accents.")
                    .gender("Unisex")
                    .color("White/Gold")
                    .price(16999.0)
                    .discountPrice(15499.0)
                    .stock(30)
                    .category(sneakers)
                    .build();
            p1.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/1st-shoe.png").product(p1).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10"}) {
                p1.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(12).product(p1).build());
            }
            productRepository.save(p1);

            // 2. Nike - Nike Revolution Grey
            Product p2 = Product.builder()
                    .title("Nike Revolution Grey")
                    .brand("Nike")
                    .description("High-performance running shoes featuring lightweight breathable mesh and flexible cushioning for daily jogs.")
                    .gender("Unisex")
                    .color("Grey/White")
                    .price(5499.0)
                    .discountPrice(4999.0)
                    .stock(50)
                    .category(running)
                    .build();
            p2.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/2nd-shoe.png").product(p2).build());
            for (String sizeStr : new String[]{"8", "9", "10", "11"}) {
                p2.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(8).product(p2).build());
            }
            productRepository.save(p2);

            // 3. Nike - Air Jordan 7 Retro Black
            Product p3 = Product.builder()
                    .title("Air Jordan 7 Retro Black")
                    .brand("Nike")
                    .description("Premium high-top basketball sneakers featuring black, grey, and red retro styling for streetwear comfort.")
                    .gender("Unisex")
                    .color("Black/Red/Grey")
                    .price(14999.0)
                    .discountPrice(13999.0)
                    .stock(20)
                    .category(sneakers)
                    .build();
            p3.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/3rd-shoe.png").product(p3).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10"}) {
                p3.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(10).product(p3).build());
            }
            productRepository.save(p3);

            // 4. Nike - Nike Air Max 1 Red
            Product p4 = Product.builder()
                    .title("Nike Air Max 1 Red")
                    .brand("Nike")
                    .description("The classic Nike Air Max 1 featuring a bold white and red color scheme with visible Air Max cushioning.")
                    .gender("Unisex")
                    .color("Red/White")
                    .price(9999.0)
                    .discountPrice(8999.0)
                    .stock(40)
                    .category(sneakers)
                    .build();
            p4.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/4rth-shoe.png").product(p4).build());
            for (String sizeStr : new String[]{"6", "7", "8", "9", "10"}) {
                p4.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(12).product(p4).build());
            }
            productRepository.save(p4);

            // 5. Bata - Bata Premium Derby
            Product p5 = Product.builder()
                    .title("Bata Premium Derby")
                    .brand("Bata")
                    .description("Classic high-shine formal derby dress shoes crafted with genuine premium Italian leather and double-stitched sole.")
                    .gender("Men")
                    .color("Stark Black")
                    .price(2999.0)
                    .discountPrice(2499.0)
                    .stock(60)
                    .category(formal)
                    .build();
            p5.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/5th-shoe.png").product(p5).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10", "11"}) {
                p5.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(5).product(p5).build());
            }
            productRepository.save(p5);

            // 6. Nike - Nike Vomero Neon
            Product p6 = Product.builder()
                    .title("Nike Vomero Neon")
                    .brand("Nike")
                    .description("Advanced training and cross-fit shoes featuring breathable mesh, neon accents, and lightweight cushioning.")
                    .gender("Unisex")
                    .color("Neon/White/Black")
                    .price(8999.0)
                    .discountPrice(7999.0)
                    .stock(30)
                    .category(running)
                    .build();
            p6.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/6th-shoe.png").product(p6).build());
            for (String sizeStr : new String[]{"8", "9", "10"}) {
                p6.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(10).product(p6).build());
            }
            productRepository.save(p6);

            // ====================
            // 6 ORIGINAL JPG SHOES (Catalog only)
            // ====================

            // 7. Nike - Air Max Premium (JPG)
            Product p7 = Product.builder()
                    .title("Air Max Premium")
                    .brand("Nike")
                    .description("Premium air-cushioned lifestyle sneakers. Engineered for supreme everyday comfort and style, featuring breathable mesh and sleek design lines.")
                    .gender("Unisex")
                    .color("Multicolor")
                    .price(8999.0)
                    .discountPrice(7999.0)
                    .stock(50)
                    .category(sneakers)
                    .build();
            p7.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/nike-airmax.jpg").product(p7).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10"}) {
                p7.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(12).product(p7).build());
            }
            productRepository.save(p7);

            // 8. Adidas - Ultraboost Running (JPG)
            Product p8 = Product.builder()
                    .title("Ultraboost Running")
                    .brand("Adidas")
                    .description("High-performance running shoes featuring signature Boost cushioning, primeknit upper, and responsive energy return for athletic workouts.")
                    .gender("Unisex")
                    .color("Core Black")
                    .price(12499.0)
                    .discountPrice(11249.0)
                    .stock(35)
                    .category(running)
                    .build();
            p8.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/adidas-ultraboost.jpg").product(p8).build());
            for (String sizeStr : new String[]{"8", "9", "10", "11"}) {
                p8.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(8).product(p8).build());
            }
            productRepository.save(p8);

            // 9. Woodland - Rugged Classic Boots (JPG)
            Product p9 = Product.builder()
                    .title("Rugged Classic Boots")
                    .brand("Woodland")
                    .description("Heavy-duty outdoor casual leather boots. Engineered with water-resistant full-grain leather and deep-tread rubber outsoles for superior durability.")
                    .gender("Men")
                    .color("Khaki")
                    .price(5499.0)
                    .discountPrice(4999.0)
                    .stock(40)
                    .category(casual)
                    .build();
            p9.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/woodland-boots.jpg").product(p9).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10"}) {
                p9.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(10).product(p9).build());
            }
            productRepository.save(p9);

            // 10. Bata - Classic Black Derby (JPG)
            Product p10 = Product.builder()
                    .title("Classic Black Derby")
                    .brand("Bata")
                    .description("Classic, high-shine formal derby shoes made with premium Italian leather. Complete with double-stitched sole for lasting elegance.")
                    .gender("Men")
                    .color("Stark Black")
                    .price(2499.0)
                    .discountPrice(2199.0)
                    .stock(60)
                    .category(formal)
                    .build();
            p10.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/bata-derby.jpg").product(p10).build());
            for (String sizeStr : new String[]{"6", "7", "8", "9", "10"}) {
                p10.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(12).product(p10).build());
            }
            productRepository.save(p10);

            // 11. Puma - Suede Heritage Classic (JPG)
            Product p11 = Product.builder()
                    .title("Suede Heritage Classic")
                    .brand("Puma")
                    .description("Timeless classic design constructed with plush suede and synthetic overlays. Features the iconic Formstrip design for retro street style.")
                    .gender("Unisex")
                    .color("Saffron Orange")
                    .price(4999.0)
                    .discountPrice(4299.0)
                    .stock(25)
                    .category(sneakers)
                    .build();
            p11.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/puma-suede.jpg").product(p11).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10", "11"}) {
                p11.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(5).product(p11).build());
            }
            productRepository.save(p11);

            // 12. Reebok - Nano X4 Trainer (JPG)
            Product p12 = Product.builder()
                    .title("Nano X4 Trainer")
                    .brand("Reebok")
                    .description("Advanced training and cross-fit shoes designed for stability, flexible support, and extreme durability. Features breathable Flexweave woven upper.")
                    .gender("Unisex")
                    .color("Stark White")
                    .price(7999.0)
                    .discountPrice(7299.0)
                    .stock(30)
                    .category(running)
                    .build();
            p12.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/reebok-nano.jpg").product(p12).build());
            for (String sizeStr : new String[]{"8", "9", "10"}) {
                p12.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(10).product(p12).build());
            }
            productRepository.save(p12);

            // 13. Nike - Nike Air Max Tailwind (New addition)
            Product p13 = Product.builder()
                    .title("Nike Air Max Tailwind")
                    .brand("Nike")
                    .description("High-performance retro trainer featuring light grey mesh, stark black overlays, and neon yellow accents.")
                    .gender("Unisex")
                    .color("Grey/Black/Neon")
                    .price(11999.0)
                    .discountPrice(10999.0)
                    .stock(25)
                    .category(sneakers)
                    .build();
            p13.getProductImages().add(ProductImage.builder().imageUrl("/images/shoes/nike-air-max-tailwind.png").product(p13).build());
            for (String sizeStr : new String[]{"7", "8", "9", "10", "11"}) {
                p13.getProductSizes().add(ProductSize.builder().size(sizeStr).quantity(10).product(p13).build());
            }
            productRepository.save(p13);

            System.out.println("Database Seeding: All 13 shoe products seeded successfully!");
        }
    }
}
