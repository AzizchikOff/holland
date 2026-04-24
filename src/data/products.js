const IMG_PLACEHOLDER = "/images/placeholder.svg";
import Free from "../img/free-classik.jpg";
import crispy from "../img/crispy.jpg";
import burger from "../img/burger.jpg";
import hotdog from "../img/hotdog.jpg";
import freeDog from "../img/free-dog.jpg";
import beefBox from "../img/bifbox.jpg";
import hotdogCanada from "../img/hotdog-canada.jpg";
import Loadedfries from "../img/Loaded fries.jpg";
import special from "../img/special.jpg";
import loaded from "../img/loaded.png";
import BrioshSteak from "../img/BrioshSteak.jpg";
import Chickencheese from "../img/Chickencheese.jpg";
import loadedcheese from "../img/loaded-cheese.jpg";
import berlin from "../img/berlin.jpg";
import Bonfile from "../img/Bonfile.jpg";
import Kapsalan from "../img/kapsalan.jpg";
import berlinSous from "../img/berlinSous.png";
import burgerSous from "../img/burgerSous.png";
import bbq from "../img/bbq.png";
import ketchup from "../img/ketchup.png";
import moxito from "../img/sprite-moxito.jpg";
import sprite from "../img/sprite.jpg";
import spriteBanochniy from "../img/sprite-banochniy.jpg";
import fanta from "../img/fanta.jpg";
import fantaP from "../img/fanta.png";
import fantaBanochniy from "../img/fanta-banochniy.jpg";
import cola from "../img/cola.jpg";
import colaBanochniy from "../img/cola-banochniy.jpg";
import fusetea from "../img/fusetea.jpg";
import fuseteaBanonchiy from "../img/fusetea-banochniy.jpg";
import bonaqua from "../img/bon-aqua.jpg";
import cappy from "../img/cappy.jpg";

export const categories = [
  { id: "free", label: "Holland Free" },
  { id: "sous", label: "Sous" },
  { id: "hotdog", label: "Hot-dog" },
  { id: "burger", label: "Burger" },
  { id: "drink", label: "Ichimliklar" },
];

export const products = [
  {
    id: "1",
    name: "Free Holland ",
    category: "free",
    price: 19000,
    image: Free,
    popular: false,
  },
  {
    id: "2",
    name: "Free Holland Big",
    category: "free",
    price: 23000,
    image: Free,
    popular: false,
  },
  {
    id: "3",
    name: "Free Holland Special",
    category: "free",
    price: 35000,
    image: special,
    popular: false,
  },
  {
    id: "4",
    name: " Loaded fries",
    category: "free",
    price: 32000,
    image: loaded,
    popular: false,
  },
  {
    id: "5",
    name: " Loaded fries & Sousage",
    category: "free",
    price: 28000,
    image: Loadedfries,
    popular: false,
  },
  {
    id: "6",
    name: " Loaded cheese",
    category: "free",
    price: 26000,
    image: loadedcheese,
    popular: false,
  },
  {
    id: "7",
    name: "Chicken cheese",
    category: "burger",
    price: 42000,
    image: Chickencheese,
    popular: false,
  },
  {
    id: "8",
    name: "Crispy Chicken",
    category: "free",
    price: 38000,
    image: crispy,
    popular: false,
  },
  {
    id: "9",
    name: "Beef Box",
    category: "free",
    price: 55000,
    image: beefBox,
    popular: false,
  },
  {
    id: "10",
    name: "Chicken Burger",
    category: "burger",
    price: 35000,
    image: burger,
    popular: false,
  },
  {
    id: "11",
    name: "Hot-Dog classic",
    category: "hotdog",
    price: 15000,
    image: hotdog,
    popular: false,
  },
  {
    id: "12",
    name: "Hot-Dog canada",
    category: "hotdog",
    price: 20000,
    image: hotdogCanada,
    popular: false,
  },
  {
    id: "13",
    name: "Kapsalan lahm",
    category: "free",
    price: 75000,
    image: Kapsalan,
    popular: false,
  },
  {
    id: "14",
    name: "Kapsalan qiyma",
    category: "free",
    price: 58000,
    image: Kapsalan,
    popular: false,
  },
  {
    id: "15",
    name: "Berlin Style lahm",
    category: "free",
    price: 58000,
    image: berlin,
    popular: true,
  },
  {
    id: "16",
    name: "Berlin Style qiyma",
    category: "free",
    price: 48000,
    image: berlin,
    popular: true,
  },
  {
    id: "17",
    name: "Briosh Steak Box",
    category: "free",
    price: 65000,
    image: BrioshSteak,
    popular: true,
  },
  {
    id: "18",
    name: "Free-Dog",
    category: "hotdog",
    price: 28000,
    image: freeDog,
    popular: true,
  },
  {
    id: "19",
    name: "Bon file in ciabatta bread lahm",
    category: "burger",
    price: 48000,
    image: Bonfile,
    popular: false,
  },
  {
    id: "20",
    name: "Bon file in ciabatta bread qiyma",
    category: "burger",
    price: 38000,
    image: Bonfile,
    popular: false,
  },

  {
    id: "21",
    name: "Berlin Sous",
    category: "sous",
    price: 4000,
    image: berlinSous,
    popular: false,
  },
  {
    id: "22",
    name: "Burger sous",
    category: "sous",
    price: 4000,
    image: burgerSous,
    popular: false,
  },
  {
    id: "23",
    name: "BBQ sous",
    category: "sous",
    price: 4000,
    image: bbq,
    popular: false,
  },
  {
    id: "24",
    name: "Ketchup-Mayonez",
    category: "sous",
    price: 4000,
    image: ketchup,
    popular: false,
  },
  {
    id: "25",
    name: "Sprite-moxito 0.5L",
    category: "drink",
    price: 8000,
    image: moxito,
    popular: false,
  },
  {
    id: "26",
    name: "Sprite 0.5L",
    category: "drink",
    price: 8000,
    image: sprite,
    popular: false,
  },
  {
    id: "27",
    name: "Sprite 0.25L",
    category: "drink",
    price: 7000,
    image: spriteBanochniy,
    popular: false,
  },
  {
    id: "28",
    name: "Fanta 0.25L",
    category: "drink",
    price: 7000,
    image: fantaBanochniy,
    popular: false,
  },
  {
    id: "29",
    name: "Fanta 0.5L",
    category: "drink",
    price: 10000,
    image: fantaBanochniy,
    popular: false,
  },
  {
    id: "30",
    name: "Fanta 0.25L",
    category: "drink",
    price: 10000,
    image: fanta,
    popular: false,
  },
  {
    id: "31",
    name: "Fanta 0.5L",
    category: "drink",
    price: 8000,
    image: fantaP,
    popular: false,
  },
  {
    id: "32",
    name: "Coca Cola 0.25L",
    category: "drink",
    price: 7000,
    image: colaBanochniy,
    popular: false,
  },
  {
    id: "33",
    name: "Coca Cola 0.5L",
    category: "drink",
    price: 10000,
    image: colaBanochniy,
    popular: false,
  },
  {
    id: "34",
    name: "Coca Cola 0.25L",
    category: "drink",
    price: 10000,
    image: cola,
    popular: false,
  },
  {
    id: "35",
    name: "Fuse Tea 0.5L",
    category: "drink",
    price: 10000,
    image: fuseteaBanonchiy,
    popular: false,
  },
  {
    id: "36",
    name: "Fuse Tea 0.5L",
    category: "drink",
    price: 8000,
    image: fusetea,
    popular: false,
  },
  {
    id: "37",
    name: "Bonaqua 0.5L",
    category: "drink",
    price: 3000,
    image: bonaqua,
    popular: false,
  },
  {
    id: "38",
    name: "Cappy Pulpy 0.5L",
    category: "drink",
    price: 8000,
    image: cappy,
    popular: false,
  },
];

export function getPopularProducts(limit = 5) {
  return products.filter((p) => p.popular).slice(0, limit);
}
