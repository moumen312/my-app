export type Product = {
    id: number
    name: string
    price: number
    image: string
    available: boolean
    description: string
    discount: string
}

export const products: Product[] = [
{ id: 1, name: "Samsung Galaxy A54", price: 75.000, image: "/s-l1200 1.svg", available: true, description: "...", discount: "0" },
{ id: 2, name: "iPhone 13", price: 180.000, image: "/phone 2 .svg", available: false, description: "...", discount: "15" },
{ id: 3, name: "Asus VivoBook 15", price: 105.000, image: "/laptop 1.svg", available: true, description: "...", discount: "10" },
{ id: 4, name: "HP Laptop i5", price: 120.000, image: "/laptop 2.svg", available: true, description: "...", discount: "5" },
{ id: 5, name: "USB-C Fast Charging Cable", price: 1.200, image: "/usbcable.svg", available: false, description: "...", discount: "30" },
{ id: 6, name: "HDMI Cable 2m", price: 1.500, image: "/hdmicable.svg", available: false, description: "...", discount: "25" },
{ id: 7, name: "Samsung Galaxy S21", price: 140.000, image: "/s-l1200 1.svg", available: true, description: "...", discount: "20" },
{ id: 8, name: "iPhone 12", price: 150.000, image: "/phone 2 .svg", available: true, description: "...", discount: "10" },
{ id: 9, name: "Dell Inspiron 15", price: 110.000, image: "/laptop 1.svg", available: false, description: "...", discount: "15" },
{ id: 10, name: "Lenovo IdeaPad 3", price: 95.000, image: "/laptop 2.svg", available: true, description: "...", discount: "5" },
{ id: 11, name: "Wireless Mouse", price: 2.500, image: "/usbcable.svg", available: true, description: "...", discount: "20" },
{ id: 12, name: "Mechanical Keyboard", price: 8.000, image: "/hdmicable.svg", available: false, description: "...", discount: "10" },
{ id: 13, name: "Samsung Galaxy A34", price: 65.000, image: "/s-l1200 1.svg", available: true, description: "...", discount: "25" },
{ id: 14, name: "iPhone 11", price: 130.000, image: "/phone 2 .svg", available: true, description: "...", discount: "15" },
{ id: 15, name: "MacBook Air M1", price: 220.000, image: "/laptop 1.svg", available: true, description: "...", discount: "5" },
{ id: 16, name: "HP Pavilion 14", price: 115.000, image: "/laptop 2.svg", available: false, description: "...", discount: "10" },
{ id: 17, name: "USB Flash Drive 64GB", price: 1.800, image: "/usbcable.svg", available: true, description: "...", discount: "30" },
{ id: 18, name: "Ethernet Cable", price: 1.000, image: "/hdmicable.svg", available: true, description: "...", discount: "20" },
{ id: 19, name: "Samsung Galaxy Note 10", price: 90.000, image: "/s-l1200 1.svg", available: false, description: "...", discount: "15" },
{ id: 20, name: "iPhone XR", price: 100.000, image: "/phone 2 .svg", available: true, description: "...", discount: "10" },
{ id: 21, name: "Acer Aspire 5", price: 98.000, image: "/laptop 1.svg", available: true, description: "...", discount: "20" },
{ id: 22, name: "MSI Gaming Laptop", price: 250.000, image: "/laptop 2.svg", available: false, description: "...", discount: "5" },
{ id: 23, name: "Phone Charger 20W", price: 2.200, image: "/usbcable.svg", available: true, description: "...", discount: "25" },
{ id: 24, name: "DisplayPort Cable", price: 1.700, image: "/hdmicable.svg", available: true, description: "...", discount: "15" },
];