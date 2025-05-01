// Local database
const PRODUCT_TABLE = {
    "1": {
        top: true,
        image: "/assets/products/Product1.jpg",
        name: "Королівський бургер",
        description: "Соковита котлета, сир чеддер, свіже листя салату та соус барбекю.",
        price: 169,
        category: "burgers",
    },
    "2": {
        top: true,
        image: "/assets/products/Product2.jpg",
        name: "Філадельфія лайт",
        description: "Ніжний лосось, вершковий сир, авокадо та рис – ідеальне поєднання.",
        price: 219,
        category: "rolls",
    },
    "3": {
        top: true,
        image: "/assets/products/Product3.jpg",
        name: "Чікен Бургер",
        description: "Соковита куряча котлета, свіжі овочі та соус ранч.",
        price: 159,
        category: "burgers",
    },
    "4": {
        top: true,
        image: "/assets/products/Product4.jpg",
        name: "Дабл Чізбургер",
        description: "Подвійна котлета, сир та фірмовий соус для максимального смаку.",
        price: 189,
        category: "burgers",
    },
    "5": {
        top: true,
        image: "/assets/products/Product5.jpg",
        name: "Піца Пепероні",
        description: "Тонке тісто, томатний соус, моцарела та пікантна пепероні.",
        price: 219,
        category: "pizza",
    },
    "6": {
        top: true,
        image: "/assets/products/Product6.jpg",
        name: "Швидка Маргарита",
        description: "Тонке тісто, ароматний томатний соус, моцарела та базилік.",
        price: 189,
        category: "pizza",
    },
    "7": {
        top: true,
        image: "/assets/products/Product7.jpg",
        name: "Каліфорнія рол",
        description: "Крабове м'ясо, авокадо, огірок та ікра тобіко.",
        price: 199,
        category: "rolls",
    },
    "8": {
        top: true,
        image: "/assets/products/Product8.jpg",
        name: "Веган Бургер",
        description: "Рослинна котлета, свіжі овочі та веганський соус.",
        price: 149,
        category: "burgers",
    },
    "9": {
        top: false,
        image: "/assets/products/Product9.jpg",
        name: "Чотири сири",
        description: "Моцарела, горгонзола, пармезан і чеддер на хрусткому тісті.",
        price: 239,
        category: "pizza",
    },
    "10": {
        top: false,
        image: "/assets/products/Product10.jpg",
        name: "Дракон рол",
        description: "Рис, вугор, авокадо, огірок, унагі соус і кунжут.",
        price: 229,
        category: "rolls",
    },
    "11": {
        top: false,
        image: "/assets/products/Product11.jpg",
        name: "Гриль Бургер",
        description: "Яловичина на грилі, карамелізована цибуля та соус чилі.",
        price: 179,
        category: "burgers",
    },
    "12": {
        top: false,
        image: "/assets/products/Product12.jpg",
        name: "М'ясна феєрія",
        description: "Ковбаски, шинка, бекон, моцарела та гострий соус.",
        price: 249,
        category: "pizza",
    },
    "13": {
        top: false,
        image: "/assets/products/Product13.jpg",
        name: "BBQ Бургер",
        description: "Котлета, бекон, смажена цибуля, барбекю соус і розплавлений чеддер.",
        price: 189,
        category: "burgers",
    },
    "14": {
        top: false,
        image: "/assets/products/Product14.jpg",
        name: "Футомакі з тунцем",
        description: "Ніжний тунець, авокадо, крем-сир, рис і норі",
        price: 239,
        category: "rolls",
    },
    "15": {
        top: false,
        image: "/assets/products/Product15.jpg",
        name: "Гавайська піца",
        description: "Класичне поєднання шинки, ананасів і ніжного сиру.",
        price: 199,
        category: "pizza",
    },
    "16": {
        top: false,
        image: "/assets/products/Product16.jpg",
        name: "Сяке Макі",
        description: "Класичний рол із лососем, рисом та водоростями.",
        price: 179,
        category: "rolls",
    },
    "17": {
        top: false,
        image: "/assets/products/Product17.jpg",
        name: "Діабло",
        description: "Гостра салямі, перець халапеньйо, томатний соус, моцарела та соус чилі.",
        price: 229,
        category: "pizza",
    },
    "18": {
        top: false,
        image: "/assets/products/Product18.jpg",
        name: "Мексиканський Бургер",
        description: "Котлета з перцем халапеньйо, гуакамоле та пікантний соус.",
        price: 179,
        category: "burgers",
    },
    "19": {
        top: false,
        image: "/assets/products/Product19.jpg",
        name: "Овочева піца",
        description: "Перець, помідори, гриби, оливки та моцарела..",
        price: 189,
        category: "pizza",
    },
    "20": {
        top: false,
        image: "/assets/products/Product20.jpg",
        name: "Темпура рол",
        description: "Смажений у клярі рол із креветкою та сиром.",
        price: 199,
        category: "rolls",
    },
    "21": {
        top: false,
        image: "/assets/products/Product21.jpg",
        name: "Веган рол",
        description: "Авокадо, огірок, болгарський перець і крем-сир.",
        price: 189,
        category: "rolls",
    },
    "22": {
        top: false,
        image: "/assets/products/Product22.jpg",
        name: "Цезар Піца",
        description: "Куряче філе, пармезан, листя салату, соус Цезар і моцарела.",
        price: 219,
        category: "pizza",
    },
    "23": {
        top: false,
        image: "/assets/products/Product23.jpg",
        name: "Супер Чізбургер",
        description: "Потрійний чеддер, потрійна котлета та кремовий соус.",
        price: 229,
        category: "burgers",
    },
    "24": {
        top: false,
        image: "/assets/products/Product24.jpg",
        name: "Темпура рол",
        description: "Тигрова креветка, огірок, соус спайсі та ікра тобіко.",
        price: 219,
        category: "rolls",
    },
};
const REVIEWS = {
    "1": {
        name: "Олександр",
        avatar: "/assets/avatars/Oleksandr.jpg",
        rating: 5,
        comment: "Дуже задоволений сервісом! Замовлення прийшло швидко, їжа була гарячою та смачною"
    },
    "2": {
        name: "Марина",
        avatar: "/assets/avatars/Maryna.jpg",
        rating: 4,
        comment: "Хороший сервіс, ввічливий персонал, але було невелике запізнення. Проте їжа свіжа і смачна. Рекомендую!"
    },
    "3": {
        name: "Владислав",
        avatar: "/assets/avatars/Vladyslav.jpg",
        rating: 5,
        comment: "Сервіс приємно здивував! Їжа гаряча, доставка швидка. Користуватимусь й надалі та рекомендуватиму друзям"
    },
    "4": {
        name: "Андрій",
        avatar: "/assets/avatars/Andrii.jpg",
        rating: 5,
        comment: "Все привезли гарячим і акуратно запакованим, дуже задоволений сервісом"
    },
    "5": {
        name: "Ольга",
        avatar: "/assets/avatars/Olga.jpg",
        rating: 4,
        comment: "Королівський бургер – просто топ! Великий, соковитий, багато начинки, а соус просто ідеальний"
    },
    "6": {
        name: "Максим",
        avatar: "/assets/avatars/Maxym.jpg",
        rating: 4,
        comment: "Піца смачна, але хотілося б більше начинки. Проте тісто відмінне, і сир добре тягнеться"
    },
    "7": {
        name: "Ірина",
        avatar: "/assets/avatars/Iryna.jpg",
        rating: 5,
        comment: "Усе супер, замовлятиму ще! Дуже зручно, що можна оплатити онлайн, і кур’єр не запізнився"
    },
    "8": {
        name: "Катерина",
        avatar: "/assets/avatars/Kateryna.jpg",
        rating: 5,
        comment: "Улюблений сервіс, завжди якісно! Замовляла вже кілька разів, і кожного разу все чудово"
    },
    "9": {
        name: "Богдан",
        avatar: "/assets/avatars/Bohdan.jpg",
        rating: 4,
        comment: "Суші свіжі, але трохи довга доставка. Можливо, через погоду, але хотілося б швидше"
    },
    "10": {
        name: "Софія",
        avatar: "/assets/avatars/Sofia.jpg",
        rating: 5,
        comment: "Роли Філадельфія були дуже свіжі, а лосось просто танув у роті. Буду замовляти ще! Спробуйте й самі"
    },
    "11": {
        name: "Олег",
        avatar: "/assets/avatars/Oleg.jpg",
        rating: 4,
        comment: "Дуже зручно замовляти, все зрозуміло. Сайт приємний, оформлення просте, не потрібно довго шукати"
    }
};

// Pull data from the server
async function requestProducts(limit) {
    const response = await fetch(`/api/catalog?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}