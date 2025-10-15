import { faker } from "@faker-js/faker"; // Used in generateProducts function

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description?: string;
  image?: string;
}

// Function to generate products using faker
function generateProducts(count: number): Product[] {
  const categories = [
    "electronics",
    "clothing",
    "books",
    "home",
    "sports",
    "beauty",
    "automotive",
    "toys",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: faker.number.int({ min: 10, max: 2000 }),
    inStock: faker.datatype.boolean(0.8), // 80% chance of being in stock
    description: faker.commerce.productDescription(),
    image: "/api/placeholder/technology",
  }));
}

// Generate 200 products
export const products: Product[] = generateProducts(200);
