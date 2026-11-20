const sequelize = require('./database/config');
const { User, Report, Comment, Vote } = require('./models');

// ========================================
// FAKE USERS (10 users)
// ========================================
const fakeUsers = [
  { name: 'Ahmed Hassan', email: 'ahmed.hassan@email.com', password: 'pass123', role: 'user' },
  { name: 'Fatima Ali', email: 'fatima.ali@email.com', password: 'pass123', role: 'user' },
  { name: 'Mohamed Saeed', email: 'mohamed.saeed@email.com', password: 'pass123', role: 'user' },
  { name: 'Nour Ibrahim', email: 'nour.ibrahim@email.com', password: 'pass123', role: 'user' },
  { name: 'Sara Mahmoud', email: 'sara.mahmoud@email.com', password: 'pass123', role: 'user' },
  { name: 'Omar Khaled', email: 'omar.khaled@email.com', password: 'pass123', role: 'user' },
  { name: 'Layla Ahmed', email: 'layla.ahmed@email.com', password: 'pass123', role: 'user' },
  { name: 'Youssef Mohamed', email: 'youssef.mohamed@email.com', password: 'pass123', role: 'user' },
  { name: 'Hana Nabil', email: 'hana.nabil@email.com', password: 'pass123', role: 'user' },
  { name: 'Karim Fathy', email: 'karim.fathy@email.com', password: 'pass123', role: 'user' }
];

// ========================================
// FAKE COMMENTS (various thoughtful comments)
// ========================================
const commentTemplates = [
  'هذه مشكلة خطيرة تحتاج إلى اهتمام فوري.',
  'أوافق تماماً على هذا البلاغ. لقد لاحظت نفس المشكلة.',
  'شكراً لك على لفت انتباهنا لهذا الأمر!',
  'هذا يؤثر على حينا منذ أسابيع الآن.',
  'اقتراح رائع! أتمنى أن تتخذ السلطات إجراء قريباً.',
  'أنا أعيش بالقرب وأؤكد أن هذه مشكلة حقيقية.',
  'يجب إعطاء الأولوية لهذا. إنه يؤثر على العديد من السكان.',
  'بلاغ موثق جيداً. الحل يبدو عملياً.',
  'لقد أبلغت عن هذا من قبل أيضاً. سعيد أن شخصاً آخر لاحظ.',
  'هذا يؤثر على جودة الحياة في منطقتنا.',
  'بلاغ ممتاز مع حل واضح.',
  'أدعم هذه المبادرة. دعونا نعمل معاً لإصلاحها.',
  'الحل المقترح معقول جداً.',
  'هذا يزداد سوءاً يوماً بعد يوم.',
  'أقدر الوصف التفصيلي والصور.',
  'نحتاج المزيد من البلاغات مثل هذه لتحسين مدينتنا.',
  'هل سمع أحد رداً من السلطات بشأن هذا؟',
  'أتمنى أن يتم حل هذا بسرعة.',
  'هذا يؤثر على الشركات في المنطقة أيضاً.',
  'شكراً لك على تخصيص الوقت لتوثيق هذا بشكل صحيح.'
];

// ========================================
// EDITABLE FAKE REPORTS - 30 Reports
// ========================================
// You can edit any field below:
// - title, description, suggested_solution
// - category (infrastructure/cleanliness/safety/utilities/other)
// - governorate, city, address
// - latitude, longitude (GPS coordinates)
// - status (open/in_progress/resolved)
// - image_url (link to image)

const fakeReports = [
  // CAIRO (4 reports)
  {
    title: 'تراكم القمامة في الزمالك',
    description: 'كميات كبيرة من القمامة تتراكم في زاوية شارع 26 يوليو منذ أيام.',
    suggested_solution: 'الرجاء جمع القمامة بشكل يومي وزيادة عدد الحاويات في المنطقة.',
    category: 'cleanliness',
    governorate: 'Cairo',
    city: 'Zamalek',
    address: 'شارع 26 يوليو',
    latitude: 30.0626,
    longitude: 31.2218,
    status: 'in_progress',
    image_url: 'https://img.youm7.com/ArticleImgs/2017/3/23/282567-%D8%A5%D8%AD%D8%AF%D9%89-%D8%A7%D9%84%D8%B5%D9%88%D8%B1-%D8%A7%D9%84%D8%AA%D9%89-%D8%A3%D8%B1%D8%B3%D9%84%D9%87%D8%A7-%D8%A7%D9%84%D9%82%D8%A7%D8%B1%D8%A6.jpg'
  },
  {
    title: 'تسرب مياه في المعادي',
    description: 'تسرب مياه كبير يغمر الشارع منذ الأسبوع الماضي.',
    suggested_solution: 'عمل صرف مناسب للمياه لمنع حدوث تجمعات كبيرة من المياه.',
    category: 'utilities',
    governorate: 'Cairo',
    city: 'Maadi',
    address: 'طريق 9، المعادي',
    latitude: 29.9602,
    longitude: 31.2569,
    status: 'resolved',
    image_url: 'https://egyptianstreets.com/wp-content/uploads/2018/04/Water.jpg'
  },
  {
    title: 'رصيف متضرر في مصر الجديدة',
    description: 'الرصيف مكسور ويشكل خطراً على المشاة.',
    suggested_solution: 'اصلاح الطريق وجعله مناسب للمشاه والسيارات.',
    category: 'infrastructure',
    governorate: 'Cairo',
    city: 'Heliopolis',
    address: 'شارع الحجاز',
    latitude: 30.0808,
    longitude: 31.3243,
    status: 'open',
    image_url: 'https://www.shutterstock.com/image-photo/old-cairo-giza-egypt-august-260nw-2676382095.jpg'
  },
  {
    title: 'إضاءة ضعيفة في مدينة نصر',
    description: 'الشوارع مظلمة ليلاً مما يخلق مخاوف أمنية للسكان.',
    suggested_solution: 'تركيب أعمدة إنارة قوية وبشكل كافي في كل المنطقة.',
    category: 'safety',
    governorate: 'Cairo',
    city: 'Nasr City',
    address: 'شارع مصطفى النحاس',
    latitude: 30.0444,
    longitude: 31.3488,
    status: 'open',
    image_url: 'https://static01.nyt.com/images/2024/07/22/multimedia/22egypt-blackouts-kfhl/22egypt-blackouts-kfhl-articleLarge.jpg?quality=75&auto=webp&disable=upscale'
  },
  
  // ALEXANDRIA (3 reports)
  {
    title: 'رصيف متضرر على الكورنيش',
    description: 'بلاط الرصيف مكسور مما يجعله خطيراً على المشاة.',
    suggested_solution: 'استبدال البلاط المكسور بمواد مضادة للانزلاق.',
    category: 'infrastructure',
    governorate: 'Alexandria',
    city: 'Stanley',
    address: 'طريق الكورنيش',
    latitude: 31.2156,
    longitude: 29.9467,
    status: 'open',
    image_url: 'https://img.youm7.com/large/20200106120546546.jpg'
  },
  {
    title: 'تلوث الشاطئ بالقرب من المنتزه',
    description: 'كمية كبيرة من القمامة على الشاطئ تلوث المنطقة والبيئة البحرية.',
    suggested_solution: 'وضع صناديق القمامة وتنظيم حملات تنظيف الشاطئ.',
    category: 'cleanliness',
    governorate: 'Alexandria',
    city: 'Montazah',
    address: 'شاطئ المنتزه',
    latitude: 31.2872,
    longitude: 30.0137,
    status: 'in_progress',
    image_url: 'https://images.dailynewsegypt.com/2018/09/6-1-photo-112.jpg'
  },
  {
    title: 'انقطاع الكهرباء في المنطقة السكنية',
    description: 'انقطاع متكرر للتيار الكهربائي يؤثر على الشركات والسكان.',
    suggested_solution: 'حل مشكلة انقطاع التيار الكهربائي بشكل دائم.',
    category: 'safety',
    governorate: 'Alexandria',
    city: 'Smouha',
    address: 'شارع سموحة الرئيسي',
    latitude: 31.2294,
    longitude: 29.9422,
    status: 'open',
    image_url: 'https://cdn.al-ain.com/lg/images/2024/6/25/140-003810-exception-places-from-power-outages_700x400.jpg'
  },
  
  // GIZA (3 reports)
  {
    title: 'ازدحام مروري في شارع فيصل',
    description: 'اختناقات مرورية شديدة خلال ساعات الذروة تؤثر على آلاف المتنقلين.',
    suggested_solution: 'إضافة حارات مخصصة للحافلات ومزامنة إشارات المرور وتوسيع الشوارع.',
    category: 'infrastructure',
    governorate: 'Giza',
    city: 'Faisal',
    address: 'شارع فيصل',
    latitude: 30.0170,
    longitude: 31.2088,
    status: 'open',
    image_url: 'https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2018/01/14/1074296-1611474214.jpg?itok=wbOKltKn'
  },
  {
    title: 'كلاب ضالة في مدينة 6 أكتوبر',
    description: 'أعداد متزايدة من الكلاب الضالة تشكل مخاطر أمنية على الأطفال.',
    suggested_solution: 'الشراكة مع ملاجئ الحيوانات لبرنامج إمساك إنساني.',
    category: 'safety',
    governorate: 'Giza',
    city: '6th October',
    address: 'مدينة 6 أكتوبر، الحي السابع',
    latitude: 29.9526,
    longitude: 30.9291,
    status: 'in_progress',
    image_url: 'https://winstore.s3.eu-west-1.amazonaws.com/uploads/public/66f/6ea/67b/thumb_246521_1200_1200_0_0_auto.jpg'
  },
  {
    title: 'انقطاع التيار الكهربائي في الدقي',
    description: 'انقطاع متكرر للتيار الكهربائي يؤثر على الشركات والسكان.',
    suggested_solution: 'ترقية محول الكهرباء.',
    category: 'utilities',
    governorate: 'Giza',
    city: 'Dokki',
    address: 'ميدان الدقي',
    latitude: 30.0388,
    longitude: 31.2125,
    status: 'open',
    image_url: 'https://www.middleeasteye.net/sites/default/files/main-images/cairo.jpg'
  },
  
  // OTHER GOVERNORATES (20 reports)

  {
    title: 'جسر متضرر في دمنهور',
    description: 'الجسر تدمر بشكل جزئي واصبح غير صالح للاستخدام.',
    suggested_solution: 'اصلاح الجسر بعد إجراء تقييم هيكلي وتعزيزه.',
    category: 'infrastructure',
    governorate: 'Beheira',
    city: 'Damanhur',
    address: 'الجسر الرئيسي',
    latitude: 31.0341,
    longitude: 30.4682,
    status: 'open',
    image_url: 'https://english.ahram.org.eg/Media/News/2014/2/11/2014-635277336188998570-899.jpg'
  },
  {
    title: 'وسائل النقل العام غير كافية في طنطا',
    description: 'أوقات انتظار طويلة للحافلات تسبب الازدحام.',
    suggested_solution: 'زيادة تكرار الحافلات خلال ساعات الذروة.',
    category: 'infrastructure',
    governorate: 'Gharbia',
    city: 'Tanta',
    address: 'ميدان محطة القطار',
    latitude: 30.7865,
    longitude: 31.0004,
    status: 'in_progress',
    image_url: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iqm75sP6dZZs/v0/-1x-1.webp'
  },
  {
    title: 'هذه المنطقة تحتاج إلى صرف صحي أفضل',
    description: 'المكان والرائحة غير صحية بسبب نقص الصرف الصحي.',
    suggested_solution: 'تحسين نظام الصرف الصحي وتوفير صيانة دورية.',
    category: 'cleanliness',
    governorate: 'Menofia',
    city: 'Shebin El Kom',
    address: 'السوق المركزي',
    latitude: 30.5600,
    longitude: 31.0110,
    status: 'open',
    image_url: 'https://cairofrombelow.org/wp-content/uploads/2014/04/pic1.jpg?w=584'
  },
  {
    title: 'مياه تغمر الشوارع والمناطق في الاسماعيله',
    description: 'تجمع مياه الأمطار يسبب فيضانات في الشوارع والمناطق السكنية.',
    suggested_solution: 'تصليح البنية التحتية للصرف الصحي.',
    category: 'infrastructure',
    governorate: 'Ismailia',
    city: 'Ismailia City',
    address: 'طريق القناة',
    latitude: 30.5833,
    longitude: 32.2667,
    status: 'open',
    image_url: 'https://static-cdn.toi-media.com/www/uploads/2019/08/AP19224374052596.jpg'
  },
  {
    title: 'التلوث الصناعي يؤثر على جودة الهواء',
    description: 'المصانع تنبعث منها الدخان دون ترشيح مناسب.',
    suggested_solution: 'تطبيق اللوائح البيئية.',
    category: 'other',
    governorate: 'Suez',
    city: 'Suez City',
    address: 'المنطقة الصناعية',
    latitude: 29.9668,
    longitude: 32.5498,
    status: 'open',
    image_url: 'https://res.cloudinary.com/djgesv2ry/image/upload/v1724347450/egypt-pollution-plan_qijenk.jpg'
  },
  {
    title: 'ميناء الصيد يحتاج إلى تحديث',
    description: 'عدم وجود مرافق للصيد في الميناء.',
    suggested_solution: 'وضع مرافق حديثة للصيد.',
    category: 'infrastructure',
    governorate: 'Port Said',
    city: 'Port Said',
    address: 'ميناء الصيد',
    latitude: 31.2653,
    longitude: 32.3019,
    status: 'in_progress',
    image_url: 'https://img.freepik.com/premium-photo/fishermen-boats-pier-alexandria-egypt_759575-10839.jpg'
  },
  {
    title: 'مبنى المدرسة يحتاج استكمال بنائه',
    description: 'مبنى مدرسة متضرر و قديم مع فصول دراسية متضررة.',
    suggested_solution: 'تخصيص ميزانية للتجديد الكامل.',
    category: 'infrastructure',
    governorate: 'Assiut',
    city: 'Assiut City',
    address: 'منطقة التعليم',
    latitude: 27.1809,
    longitude: 31.1837,
    status: 'open',
    image_url: 'https://www.vetogate.com/content/upload/editor/Image1_72021220443394037492.jpg'
  },
  {
    title: 'المستشفى يحتاج إلى معدات طبية واهتمام بالمرضى',
    description: 'المستشفى المركزي يفتقر إلى معدات تشخيص حديثة.',
    suggested_solution: 'شراء أجهزة أشعة سينية جديدة ومعدات مختبرية.',
    category: 'other',
    governorate: 'Sohag',
    city: 'Sohag City',
    address: 'المستشفى العام',
    latitude: 26.5569,
    longitude: 31.6948,
    status: 'open',
    image_url: 'https://www.dailynewsegypt.com/app/uploads/2012/08/rsz_al-munira_hospital_in_cairo_also_suffered_attacks_on_the_facilities_and_staff_in_recent_weeks_-_by_hassan_ibrahim.jpg'
  },
  {
    title: 'حديقة عامة تحتاج الي تجديد بالكامل',
    description: 'الحديقة العامة في حالة إهمال كبيرة.',
    suggested_solution: 'الاهتمام بالحديقة وجعلها افضل.',
    category: 'infrastructure',
    governorate: 'Luxor',
    city: 'Luxor City',
    address: 'الحديقة العامة',
    latitude: 25.6872,
    longitude: 32.6396,
    status: 'open',
    image_url: 'data:image/jpeg;base64,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'
  },
  {
    title: 'رصيف متدمر يحتاج إلى إعادة رصف',
    description: 'رصيف غير صالح ويحتاج للصيانة.',
    suggested_solution: 'صيانة الرصيف والاهتمام به.',
    category: 'infrastructure',
    governorate: 'Aswan',
    city: 'Aswan City',
    address: 'الطريق الرئيسي',
    latitude: 24.0889,
    longitude: 32.8998,
    status: 'in_progress',
    image_url: 'https://img.youm7.com/ArticleImgs/2018/10/17/57536-%D8%B1%D8%B5%D9%8A%D9%81-%D9%85%D9%87%D8%A7%D9%84%D9%83.jpg'
  },
  {
    title: 'نظام الصرف الصحي يحتاج إلى ترقية',
    description: 'نظام صرف صحي قديم يسبب فيضانات متكررة.',
    suggested_solution: 'تركيب نظام صرف صحي حديث.',
    category: 'utilities',
    governorate: 'Qaliubiya',
    city: 'Banha',
    address: 'شارع المحطة',
    latitude: 30.4597,
    longitude: 31.1847,
    status: 'open',
    image_url: 'https://mediaaws.almasryalyoum.com/news/large/2018/03/06/789367_0.jpg'
  },
  {
    title: 'مركز شباب يحتاج صيانة (الملعب غير صالح للعب)',
    description: 'مركز الشباب المحلي يفتقر إلى الصيانة والاهتمام.',
    suggested_solution: 'شراء معدات رياضية جديدة وتجديد المرافق.',
    category: 'other',
    governorate: 'Dakahlia',
    city: 'Mansoura',
    address: 'مركز الشباب',
    latitude: 31.0409,
    longitude: 31.3785,
    status: 'open',
    image_url: 'https://media.elbalad.news/2024/10/large/949/9/387.png'
  },
  {
    title: 'إشارات مرور معطلة في التقاطع الرئيسي',
    description: 'إشارات المرور لا تعمل مما يسبب فوضى مرورية.',
    suggested_solution: 'إصلاح أو استبدال نظام إشارات المرور.',
    category: 'infrastructure',
    governorate: 'Sharqia',
    city: 'Zagazig',
    address: 'التقاطع الرئيسي',
    latitude: 30.5877,
    longitude: 31.5021,
    status: 'in_progress',
    image_url: 'https://img.youm7.com/images/NewsPics/gallery/pics/82016515474175-%D8%A5%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%B1-%D9%88%D8%A7%D9%84%D9%83%D8%A7%D9%85%D9%8A%D8%B1%D8%A7%D8%AA-%D8%A8%D9%85%D8%AF%D9%8A%D9%86%D8%A9-%D9%86%D8%B5%D8%B1-(2).jpg'
  },
  {
    title: 'مكتبة عامة تحتاج إلى التوسيع وكتب جديدة',
    description: 'المكتبة العامة لديها مجموعة قديمة من الكتب.',
    suggested_solution: 'توسيع المكتبةوشراء كتب جديدة وموارد رقمية.',
    category: 'other',
    governorate: 'Kafr El Sheikh',
    city: 'Kafr El Sheikh City',
    address: 'المكتبة العامة',
    latitude: 31.1107,
    longitude: 30.9388,
    status: 'open',
    image_url: 'https://media.elwatannews.com/media/img/mediaarc/medium/3313321481584293673.jpg'
  },
  {
    title: 'سوق محلي يحتاج إلى مواقف سيارات',
    description: 'السوق المحلي يفتقر إلى مواقف سيارات كافية.',
    suggested_solution: 'بناء موقف سيارات متعدد الطوابق.',
    category: 'infrastructure',
    governorate: 'Damietta',
    city: 'Damietta City',
    address: 'السوق المحلي',
    latitude: 31.4165,
    longitude: 31.8133,
    status: 'open',
    image_url: 'https://www.altar7al.com/wp-content/uploads/2022/08/cairo-popular-markets-2-750x430.jpeg'
  },
  {
    title: 'منطقة ساحلية تحتاج إلى النظافة والاهتمام',
    description: 'المنطقة الساحلية تعاني عدم مراعاة.',
    suggested_solution: 'الحفاظ علي المنطقة وتنظيفها بانتظام.',
    category: 'infrastructure',
    governorate: 'Matrouh',
    city: 'Marsa Matrouh',
    address: 'المنطقة الساحلية',
    latitude: 31.3543,
    longitude: 27.2373,
    status: 'open',
    image_url: 'https://img.youm7.com/ArticleImgs/2021/12/6/203164-%D8%A5%D8%AE%D8%AA%D9%81%D8%A7%D8%A1-%D8%B4%D8%A7%D8%B7%D8%A6-%D8%B3%D9%8A%D8%AF%D9%89-%D8%A8%D8%B4%D8%B1-%D8%A8%D8%B3%D8%A8%D8%A8-%D8%A7%D9%84%D8%A3%D9%85%D9%88%D8%A7%D8%AC-%D8%A7%D9%84%D9%85%D8%B1%D8%AA%D9%81%D8%B9%D8%A9.jfif'
  },
  {
    title: 'محطة حافلات تحتاج إلى مظلات',
    description: 'محطة الحافلات تفتقر إلى المأوى من الشمس والمطر.',
    suggested_solution: 'تركيب مظلات ومقاعد في محطة الحافلات.',
    category: 'infrastructure',
    governorate: 'Fayoum',
    city: 'Fayoum City',
    address: 'محطة الحافلات الرئيسية',
    latitude: 29.3084,
    longitude: 30.8428,
    status: 'in_progress',
    image_url: 'https://mediaaws.almasryalyoum.com/news/large/2024/09/16/2487092_0.jpg'
  },
  {
    title: 'مركز صحي يحتاج إلى أطباء أكثر',
    description: 'المركز الصحي يعاني من نقص في الموظفين.',
    suggested_solution: 'توظيف المزيد من الأطباء والممرضين.',
    category: 'other',
    governorate: 'Beni Suef',
    city: 'Beni Suef City',
    address: 'المركز الصحي',
    latitude: 29.0661,
    longitude: 31.0994,
    status: 'open',
    image_url: 'https://media.egypttelegraph.com/2024/5/large/1753860901035202405140814111411.jpg'
  },
  {
    title: 'ملعب كرة قدم يحتاج إلى صيانة',
    description: 'ملعب كرة القدم المحلي في حالة سيئة.',
    suggested_solution: 'تجديد العشب وإصلاح المرافق.',
    category: 'infrastructure',
    governorate: 'Minya',
    city: 'Minya City',
    address: 'الملعب الرياضي',
    latitude: 28.0871,
    longitude: 30.7618,
    status: 'open',
    image_url: 'https://img.youm7.com/ArticleImgs/2017/1/28/173379-%D9%85%D9%84%D8%B9%D8%A8-%D8%A8%D9%88%D8%B1%D8%AA-%D8%AC%D9%86%D8%AA%D9%8A%D9%84.jpg'
  },
  {
    title: 'محطة وقود تحتاج إلى تحديث',
    description: 'محطة الوقود لديها معدات قديمة وخطيرة.',
    suggested_solution: 'تحديث المعدات وتطبيق معايير السلامة.',
    category: 'safety',
    governorate: 'Qena',
    city: 'Qena City',
    address: 'محطة الوقود الرئيسية',
    latitude: 26.1551,
    longitude: 32.7160,
    status: 'open',
    image_url: 'https://roayahnews.com/wp-content/uploads/2025/07/%D9%85%D8%AD%D8%B7%D8%A9-%D9%88%D9%82%D9%88%D8%AF-%D9%81%D9%8A-%D8%B1%D9%85%D8%B3%D9%8A%D8%B3.jpeg'
  }
  
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');
    
    // Create admin and default user
    const admin = await User.create({ 
      name: 'Admin', 
      email: 'admin@decidetogether.com', 
      password: 'admin123', 
      role: 'admin' 
    });
    
    const user = await User.create({ 
      name: 'Test User', 
      email: 'user@test.com', 
      password: 'user123', 
      role: 'user' 
    });
    
    console.log('Default users created');
    
    // Create fake users
    const createdUsers = [];
    for (const fakeUser of fakeUsers) {
      const newUser = await User.create(fakeUser);
      createdUsers.push(newUser);
    }
    console.log(`✅ Created ${createdUsers.length} fake users`);
    
    // Combine all users (admin, default user, and fake users)
    const allUsers = [admin, user, ...createdUsers];
    
    // Create reports
    const createdReports = [];
    for (const r of fakeReports) { 
      const report = await Report.create({ 
        ...r, 
        user_id: allUsers[Math.floor(Math.random() * allUsers.length)].id 
      });
      createdReports.push(report);
    }
    console.log(`✅ Successfully created ${fakeReports.length} fake reports!`);
    
    // Create comments (2-5 comments per report)
    let totalComments = 0;
    for (const report of createdReports) {
      const numComments = Math.floor(Math.random() * 4) + 2; // 2-5 comments
      const usedUserIds = new Set(); // Track users who already commented
      
      for (let i = 0; i < numComments; i++) {
        // Find a user who hasn't commented on this report yet
        let randomUser;
        let attempts = 0;
        do {
          randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
          attempts++;
        } while (usedUserIds.has(randomUser.id) && attempts < 20);
        
        // Only create comment if we found a unique user
        if (!usedUserIds.has(randomUser.id)) {
          usedUserIds.add(randomUser.id);
          await Comment.create({
            report_id: report.id,
            user_id: randomUser.id,
            content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)]
          });
          totalComments++;
        }
      }
    }
    console.log(`✅ Created ${totalComments} fake comments`);
    
    // Create votes (3-8 votes per report, mix of upvotes and downvotes)
    let totalVotes = 0;
    for (const report of createdReports) {
      const numVotes = Math.floor(Math.random() * 6) + 3; // 3-8 votes
      const usedUserIds = new Set(); // Track users who already voted
      
      for (let i = 0; i < numVotes; i++) {
        // Find a user who hasn't voted on this report yet
        let randomUser;
        let attempts = 0;
        do {
          randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
          attempts++;
        } while (usedUserIds.has(randomUser.id) && attempts < 20);
        
        // Only create vote if we found a unique user
        if (!usedUserIds.has(randomUser.id)) {
          usedUserIds.add(randomUser.id);
          // 70% upvotes, 30% downvotes
          const voteType = Math.random() < 0.7 ? 'upvote' : 'downvote';
          await Vote.create({
            report_id: report.id,
            user_id: randomUser.id,
            vote_type: voteType
          });
          totalVotes++;
        }
      }
    }
    console.log(`✅ Created ${totalVotes} fake votes`);
    
    console.log('All reports include image URLs and suggested solutions.');
    console.log('You can edit any report details in backend/seedReports.js');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
seed();
