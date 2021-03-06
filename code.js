figma.showUI(__html__);
figma.ui.resize(400, 530);
// ------------------
// Helpers
// ------------------
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
function groupArr(data, n) {
    var group = [];
    for (var i = 0, j = 0; i < data.length; i++) {
        if (i >= n && i % n === 0)
            j++;
        group[j] = group[j] || [];
        group[j].push(data[i]);
    }
    return group;
}
// ------------------
// Main Function
// ------------------
figma.ui.onmessage = (msg) => {
    const selection = figma.currentPage.selection;
    const nodes = [];
    const clonedSelection = [...selection];
    const sortedFrames = clonedSelection.sort((a, b) => {
        if (a.y == b.y)
            return a.x - b.x;
        return a.y - b.y;
    });
    // GET MOCKUP DATA MATCH WITH ID
    // TODO: generate front end using the json mockup and backend get information from front-end
    console.log(msg.checkedval);
    console.log(mockupData);
    const { images } = mockupData.find((m) => m.id == msg.checkedval);
    console.log(images);
    let ngroup = images.length;
    // GROUP
    const groupedFrames = groupArr(sortedFrames, ngroup);
    groupedFrames.forEach((screens, index) => {
        // SLIDE PROPRERTIES
        let x = sortedFrames[0].x + (1920 + 200) * index;
        let y = sortedFrames[0].y + 1500;
        const mockupImg = figma.createImage(msg.mockup).hash;
        const slide = createSlide(x, y);
        slide.name = "slide " + index;
        const mockup = createMockup(mockupImg);
        // GENERATE IMAGES
        screens.forEach((frame, i) => {
            let { x, y, width, height } = images[i];
            const screenImage = createScreenImage({
                x,
                y,
                width,
                height,
                frame,
            });
            slide.appendChild(screenImage);
        });
        figma.currentPage.appendChild(slide);
        slide.appendChild(mockup);
        nodes.push(slide);
    });
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.closePlugin();
};
// -------------------------------
// Reusable functions
// -------------------------------
function createSlide(x, y) {
    const slide = figma.createFrame();
    slide.x = x;
    slide.y = y;
    slide.fills = [
        {
            type: "SOLID",
            color: {
                r: 20 / 256,
                g: 20 / 256,
                b: 20 / 256,
            },
        },
    ];
    slide.resize(1920, 1080);
    return slide;
}
function createMockup(mockupImg) {
    const mockup = figma.createRectangle();
    mockup.x = 0;
    mockup.y = 0;
    mockup.name = "mockup";
    mockup.resize(1920, 1080);
    mockup.fills = [
        {
            type: "IMAGE",
            imageHash: mockupImg,
            scaleMode: "FIT",
        },
    ];
    mockup.locked = true;
    return mockup;
}
function createScreenImage({ x, y, width, height, frame }) {
    const screenImage = figma.createRectangle();
    screenImage.x = x;
    screenImage.y = y;
    screenImage.name = "screenImage";
    screenImage.resize(width, height);
    const screenImageFills = clone(screenImage.fills);
    // EXPORTING SELECTION
    const exportedImage = frame.exportAsync({
        format: "PNG",
        constraint: {
            type: "SCALE",
            value: 2,
        },
    });
    exportedImage.then((result) => {
        const img = figma.createImage(result);
        screenImageFills[0] = {
            type: "IMAGE",
            imageHash: img.hash,
            scaleMode: "FILL",
        };
        screenImage.fills = screenImageFills;
    });
    return screenImage;
}
// -------------------------------
// Data Structure
// TODO: Add webpack to load external files
// -------------------------------
const mockupData = [
    {
        id: "phone",
        name: "iPhone Zoom",
        category: "iphone",
        mockup: "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1588696507/Screeener/2x/mockup-black.png",
        images: [
            {
                x: 713,
                y: 101,
                width: 494,
                height: 878,
            },
        ],
    },
    {
        id: "3phones",
        name: "Three iPhones",
        category: "iphone",
        mockup: "https://res.cloudinary.com/dyw3e3f2c/image/upload/v1588696507/Screeener/2x/3-mockups-black.png",
        images: [
            {
                x: 205,
                y: 206,
                width: 375,
                height: 667,
            },
            {
                x: 772,
                y: 206,
                width: 375,
                height: 667,
            },
            {
                x: 1339,
                y: 206,
                width: 375,
                height: 667,
            },
        ],
    },
    //Android
    {
        id: "android",
        name: "Android Zoom",
        category: "android",
        mockup: "https://res.cloudinary.com/deeitm141/image/upload/v1597003927/android-zoom_mgork8.png",
        images: [
            {
                x: 723,
                y: 20,
                width: 478,
                height: 1037,
            },
        ],
    },
    {
        id: "3android",
        name: "Three Android",
        category: "android",
        mockup: "https://res.cloudinary.com/deeitm141/image/upload/v1597003927/android-triple_a7gk1u.png",
        images: [
            {
                x: 225,
                y: 150,
                width: 361,
                height: 782,
            },
            {
                x: 781,
                y: 150,
                width: 361,
                height: 782,
            },
            {
                x: 1337,
                y: 150,
                width: 361,
                height: 782,
            },
        ],
    },
];
